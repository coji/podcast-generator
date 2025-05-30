import { google } from '@ai-sdk/google'
import { TZDate } from '@date-fns/tz'
import { prisma } from '@podcast-generator/db/prisma'
import { streamObject } from 'ai'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { requireUser } from '~/services/auth.server'
import type { Route } from './+types/route'
import { requestSchema, responseSchema } from './schema'

export const action = async (args: Route.ActionArgs) => {
  requireUser(args)
  const { data, error } = requestSchema.safeParse(await args.request.json())
  if (error) {
    throw new Error('Invalid request')
  }

  const entry = await prisma.rssEntry.findFirstOrThrow({
    select: { title: true, content: true, publishedAt: true },
    where: { id: { in: data.entryIds } },
  })

  const mcName = 'ちゃんもも'
  const programName = 'アグレッシブちゃんももポッドキャスト'
  const todayJST = new TZDate(entry.publishedAt).withTimeZone('Asia/Tokyo')
  const prompt = `
## Instruction
あなたはプロの放送作家です。与えられる情報をもとに、ポッドキャストでホストが読み上げるカンペと、
発行日、エピソードタイトル、短い概要説明文（要約）を作成します。

ポッドキャストは楽しい雰囲気で、ホストは日本のFMラジオのような喋り方をします。
ポッドキャストホストは1人で、名前は「${mcName}」です。
${mcName}は気さくで陽気な人物です。口調は優しく丁寧で、フレンドリーです。
番組名は「${programName}」です。

## 構成

1. 最初に挨拶し、今日の日付（月、日、曜日）を添えながら、今日のエピソードを紹介することを伝えます。
2. 「今日紹介する内容」を紹介します。
3. 最後に締めの挨拶で、今日伝えた内容を駆け足でおさらいし、次回会えるのを楽しみにしていること、詳しい内容はショーノートに書いてあること、番組の感想を募集していることを伝えます。
4. ですます調で、でもフレンドリーに話すことを心がけてください。

## 制約

- セリフ部分だけを出力します
- 難しい漢字や、英単語は、読み手が間違えないようにひらがなで書きます。
- 読み上げ用の原稿なので、URLは含めないでください
- 「紹介する内容」は、一つの記事につき500文字でまとめます。
- 出力する文字数の上限は4000文字
 
### 今日の日付
${format(todayJST, 'yyyy-MM-dd(EEE)', { locale: ja })}

### 今日紹介する内容
タイトル: ${entry.title}
${entry.content}
`

  const result = await streamObject({
    model: google('gemini-2.5-flash-preview-05-20', {
      structuredOutputs: false,
    }),
    schema: responseSchema,
    prompt,
    mode: 'json',
    onFinish: (event) => {
      const priceInput = (event.usage.promptTokens * 0.00015) / 1000
      const priceOutput = (event.usage.completionTokens * 0.0006) / 1000
      const totalPrice = (priceInput + priceOutput) * 150

      console.log(event.object, totalPrice)
    },
  })
  return result.toTextStreamResponse()
}
