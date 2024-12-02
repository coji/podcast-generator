import { openai } from '@ai-sdk/openai'
import { streamObject } from 'ai'
import { z } from 'zod'
import { prisma } from '~/services/prisma.server'
import type { Route } from './+types/route'

export const requestSchema = z.object({
  entryIds: z.array(z.string()),
})

export const responseSchema = z.object({
  title: z.string(),
  description: z.string(),
  manuscript: z.string(),
})

export const action = async ({ request }: Route.ActionArgs) => {
  const { data, error } = requestSchema.safeParse(await request.json())
  if (error) {
    throw new Error('Invalid request')
  }

  const entries = await prisma.rssEntry.findMany({
    select: { title: true, content: true, publishedAt: true },
    where: { id: { in: data.entryIds } },
  })

  const prompt = `
# 指示

記事やブログの内容を元に、以下のようなポッドキャストのタイトル、説明文、トーク原稿をします。

1. 入力：変換したい記事やブログ記事を複数提供

2. 変換ルール
* 話し言葉で親しみやすく
* 音声合成用にクリーンなテキスト
* 冒頭は「はいはい！ちゃんももです！」で始める
* 最後は「それでは、ちゃんももでした！またね」で締める
* 引用符やカギカッコは残す（例：『タイトル』）
* 話者名や発話記号（「」）は入れない
* 笑い声や感情表現も音声合成で表現できるような文字にする

3. 構成
* 挨拶
* 本日のテーマ提示
* エピソード紹介
* 学びや気づき
* リスナーへの問いかけ
* 締めの挨拶

4. トーン
* カジュアルで親しみやすい
* 独り言のような自然な語り口
* ラジオDJのような親近感

# 入力

${entries
  .map(
    (entry) => `## 記事: ${entry.title}
- 公開日: ${entry.publishedAt}
- 内容: ${entry.content}
`,
  )
  .join('\n\n')}
`

  console.log('prompt', prompt)

  const result = await streamObject({
    model: openai('gpt-4o-mini'),
    schema: responseSchema,
    prompt,
    onFinish: (event) => {
      console.log(event.object)
    },
  })
  return result.toTextStreamResponse()
}
