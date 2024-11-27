import { getFormProps, getTextareaProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import fs from 'node:fs/promises'
import { useFetcher } from 'react-router'
import { z } from 'zod'
import { Button, Label, Stack, Textarea } from '~/components/ui'
import type { Route } from './+types/home'

const schema = z.object({
  style: z.string({ required_error: '必須' }),
  text: z.string({ required_error: '必須' }),
})

interface Moras {
  text: string
  consonant: string
  consonant_length: number
  vowel: string
  vowel_length: number
  pitch: number
}

interface AccentPhrases {
  accent_phrases: {
    moras: Moras[]
    speedScale: number
    intonationScale: number
    tempoDynamicsScale: number
    pitchScale: number
    volumeScale: number
    prePhonemeLength: number
    postPhonemeLength: number
    pauseLength: null
    pauseLengthScale: number
    outputSamplingRate: number
    outputStereo: boolean
    kana: string
  }
}

export function meta(args: Route.MetaArgs) {
  return [
    { title: 'Podcat Generator' },
    { name: 'description', content: 'Generate podcast episodes from text.' },
  ]
}

export const loader = async (args: Route.LoaderArgs) => {
  const ret = await fetch('http://localhost:10101/speakers')
  const speakers: [
    {
      name: string
      speaker_uuid: string
      styles: {
        name: string
        id: number
        type: 'talk'
      }[]
      version: string
      supported_features: Record<string, string>
    },
  ] = await ret.json()
  return { speakers, style: speakers[0].styles[0] }
}

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  // query
  const queryParams = new URLSearchParams({
    speaker: submission.value.style,
    text: submission.value.text,
  })
  const queryResult = await fetch(
    `http://localhost:10101/audio_query?${queryParams.toString()}`,
    {
      method: 'POST',
    },
  )
  const queryResultJson: AccentPhrases = await queryResult.json()
  console.dir(queryResultJson, { depth: null })

  // generate
  const synthesisResult = await fetch(
    `http://localhost:10101/synthesis?speaker=${submission.value.style}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(queryResultJson),
    },
  )

  const id = crypto.randomUUID()
  const wav = await synthesisResult.arrayBuffer()
  await fs.writeFile(`./data/${id}.wav`, Buffer.from(wav))

  return { lastResult: submission.reply(), id }
}

export default function Home({ loaderData: { style } }: Route.ComponentProps) {
  const fetcher = useFetcher<typeof action>()
  const [form, { text }] = useForm({
    lastResult: fetcher.data?.lastResult,
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })

  return (
    <div className="grid min-h-dvh grid-cols-1 grid-rows-[auto_1fr_auto]">
      <header className="border-b px-4 py-2">
        <h1 className="text-2xl font-bold">Podcast Generator</h1>
        <p className="text-muted-foreground">
          Generate podcast episodes from text.
        </p>
      </header>

      <main className="px-4 py-2">
        <Stack>
          <fetcher.Form
            method="POST"
            className="flex flex-col gap-4"
            {...getFormProps(form)}
          >
            <input type="hidden" name="style" value={style.id} />
            <div>
              <Label htmlFor={text.id}>原稿</Label>
              <Textarea {...getTextareaProps(text)} />
              <div className="text-destructive">{text.errors}</div>
            </div>

            <Button isLoading={fetcher.state === 'submitting'}>
              Generate Audio
            </Button>
          </fetcher.Form>

          {fetcher.data?.id && (
            <audio controls autoPlay key={fetcher.data.id}>
              <source src={`/data/${fetcher.data.id}.wav`} type="audio/wav" />
              <track
                kind="captions"
                srcLang="ja"
                src={`/data/${fetcher.data.id}.ja.vtt`}
                label="Japanese captions"
              />
            </audio>
          )}
        </Stack>
      </main>

      <footer className="border-t px-4 py-2 text-center">
        Copyright &copy; coji
      </footer>
    </div>
  )
}
