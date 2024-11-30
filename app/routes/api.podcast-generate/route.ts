import { openai } from '@ai-sdk/openai'
import { streamObject } from 'ai'
import { z } from 'zod'
import type { Route } from './+types/route'

export const requestSchema = z.object({
  title: z.string(),
  content: z.string(),
})

export const responseSchema = z.object({
  manuscript: z.string(),
})

export const action = async ({ request }: Route.ActionArgs) => {
  const { data, error } = requestSchema.safeParse(await request.json())
  if (error) {
    throw new Error('Invalid request')
  }

  const prompt = `
記事やブログを元に、以下のようなポッドキャスト原稿を作成：
1. 入力：変換したい記事やブログ記事を提供
2. 変換ルール
* 話し言葉で親しみやすく
* 音声合成用にクリーンなテキスト
* 冒頭は「はいはああい！ちゃんももです！」で始める
* 最後は「それでは、ちゃんももでした！またね」で締める
* 引用符やカギカッコは残す（例：『タイトル』）
* 話者名や発話記号（「」）は入れない
* 笑い声や感情表現も「あはは」とか「うわあ」など、文字にする
1. 構成
* 挨拶
* 本日のテーマ提示
* エピソード紹介
* 学びや気づき
* リスナーへの問いかけ
* 締めの挨拶
1. トーン
* カジュアルで親しみやすい
* 独り言のような自然な語り口
* ラジオDJのような親近感

記事タイトル: ${data.title}
記事本文: ${data.content}
`

  const result = await streamObject({
    model: openai('gpt-4o'),
    schema: responseSchema,
    prompt,
  })
  return result.toTextStreamResponse()
}
