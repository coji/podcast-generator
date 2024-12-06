import { getFormProps, getTextareaProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import fs from 'node:fs/promises'
import { useFetcher } from 'react-router'
import { z } from 'zod'
import {
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Stack,
  Textarea,
} from '~/components/ui'
import type { Route } from './+types/test'

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

  const styles = speakers.flatMap((speaker) =>
    speaker.styles.map((style) => ({
      speaker: speaker.name,
      ...style,
    })),
  )

  return { speakers, styles }
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
    { method: 'POST' },
  )
  const queryResultJson: AccentPhrases = await queryResult.json()

  console.log(queryResultJson)
  // generate
  const synthesisResult = await fetch(
    `http://localhost:10101/multi_synthesis?speaker=${submission.value.style}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([queryResultJson]),
    },
  )
  if (synthesisResult.status >= 400) {
    console.log(await synthesisResult.json())
    throw new Error(synthesisResult.statusText)
  }

  const id = crypto.randomUUID()
  const wav = await synthesisResult.arrayBuffer()
  await fs.writeFile(`./data/${id}.zip`, Buffer.from(wav))

  return { lastResult: submission.reply(), id }
}

export default function Home({
  loaderData: { speakers, styles },
}: Route.ComponentProps) {
  const fetcher = useFetcher<typeof action>()
  const [form, fields] = useForm({
    defaultValue: {
      style: String(styles[0].id),
    },
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
            <Select
              defaultValue={fields.style.initialValue}
              name={fields.style.name}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {styles.map((st) => {
                  return (
                    <SelectItem key={st.id} value={String(st.id)}>
                      {st.id}: {st.speaker} - {st.name}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>

            <div>
              <Label htmlFor={fields.text.id}>原稿</Label>
              <Textarea {...getTextareaProps(fields.text)} />
              <div className="text-destructive">{fields.text.errors}</div>
            </div>

            <Button isLoading={fetcher.state === 'submitting'}>
              Generate Audio
            </Button>
          </fetcher.Form>

          {fetcher.data?.id && (
            <audio controls autoPlay key={fetcher.data.id}>
              <source src={`/data/${fetcher.data.id}.wav`} type="audio/wav" />
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
