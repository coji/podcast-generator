import { experimental_useObject as useObject } from '@ai-sdk/react'
import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { WandSparklesIcon } from 'lucide-react'
import React, { useEffect } from 'react'
import { useFetcher } from 'react-router'
import { z } from 'zod'
import { zx } from 'zodix'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  HStack,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Stack,
  Textarea,
} from '~/components/ui'
import { generatePodcastAudio } from '~/jobs/build-podcast-episode'
import { SourceSelector } from '~/routes/_app+/$podcast.feed.selector/SourceSelector'
import { responseSchema } from '~/routes/api.podcast-generate/schema'
import type { Route } from './+types/route'
import { createEpisode } from './mutations.server'
import {
  findExistingEpisode,
  getPodcast,
  listBackgroundMusics,
  listSources,
} from './queries.server'

const schema = z.object({
  sources: z.array(z.string()).min(1, { message: '元記事を選択してください' }),
  title: z.string({ required_error: '必須' }),
  description: z.string({ required_error: '必須' }),
  manuscript: z.string({ required_error: '必須' }),
  publishedAt: z.date(),
  bgm: z.string().optional(),
})

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { source } = zx.parseQuery(request, {
    source: z
      .union([z.string(), z.array(z.string())])
      .transform((v) => (Array.isArray(v) ? v : [v]))
      .optional()
      .default([]),
  })

  const episode = await findExistingEpisode(params.podcast, source)
  const bgms = await listBackgroundMusics(params.podcast)

  const initialSources =
    source.length > 0 ? await listSources(params.podcast, source) : []
  return { episode, bgms, initialSources }
}

export const action = async ({ request, params }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  const podcast = await getPodcast(params.podcast)

  const episode = await createEpisode(
    podcast.slug,
    {
      publishedAt: submission.value.publishedAt,
      title: submission.value.title,
      description: submission.value.description,
      manuscript: submission.value.manuscript,
    },
    submission.value.sources,
  )

  // Call the new audio generation function
  const { jobId, audioUrl, audioDuration } = await generatePodcastAudio({
    speaker: podcast.speaker, // Use the podcast speaker
    text: submission.value.manuscript,
    organizationId: podcast.organizationId,
    podcastSlug: params.podcast,
    episodeId: episode.id,
  })

  return {
    lastResult: submission.reply(),
    audioUrl,
    audioDuration,
    episode,
    jobId,
  } // Return the filename
}

// Helper function to format minutes
const formatMinutes = (seconds: number): string =>
  `${Math.floor(seconds / 60)}分`

// Helper function to format seconds
const formatSeconds = (seconds: number): string => `${seconds % 60}秒`

// Refactored formatDuration function
const formatDuration = (seconds: number): string =>
  seconds < 60
    ? formatSeconds(seconds)
    : `${formatMinutes(seconds)}${formatSeconds(seconds)}`

export default function EpisodeNewPage({
  params: { podcast: podcastSlug },
  loaderData: { episode, bgms, initialSources },
}: Route.ComponentProps) {
  const fetcher = useFetcher<typeof action>()
  const [form, fields] = useForm({
    lastResult: fetcher.data?.lastResult,
    defaultValue: {
      title: episode?.title,
      description: episode?.description,
      manuscript: episode?.manuscript,
      publishedAt: episode?.publishedAt,
    },
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })

  const { isLoading, object, stop, submit, error } = useObject({
    api: '/api/podcast-generate',
    schema: responseSchema,
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (object === undefined) {
      return
    }

    if (object?.publishedAt !== fields.publishedAt.value) {
      form.update({
        name: fields.publishedAt.name,
        value: object?.publishedAt ?? '',
      })
    }

    if (object?.title !== fields.title.value) {
      form.update({
        name: fields.title.name,
        value: object?.title ?? '',
      })
    }
    if (object?.description !== fields.description.value) {
      form.update({
        name: fields.description.name,
        value: object?.description ?? '',
      })
    }
    if (object?.manuscript !== fields.manuscript.value) {
      form.update({
        name: fields.manuscript.name,
        value: object?.manuscript ?? '',
      })
    }
  }, [object])

  const [selected, setSelected] =
    React.useState<{ id: string; title: string; publishedAt: Date }[]>(
      initialSources,
    )

  return (
    <Card>
      <CardHeader>
        <CardTitle>エピソード 新規作成</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent>
        <fetcher.Form method="POST" {...getFormProps(form)}>
          <Stack>
            {/* episode sources */}
            <div>
              <Label htmlFor={fields.sources.id}>元記事</Label>
              <HStack className="items-start">
                <SourceSelector
                  id={fields.sources.id}
                  podcastSlug={podcastSlug}
                  selected={selected}
                  onChangeSelected={setSelected}
                />

                {selected.map((option, idx) => {
                  return (
                    <input
                      key={option.id}
                      type="hidden"
                      name={`${fields.sources.name}[${idx}]`}
                      value={option.id}
                    />
                  )
                })}

                <Stack className="flex-shrink-0">
                  <Button
                    type="button"
                    disabled={selected.length === 0}
                    onClick={() => {
                      submit({ entryIds: selected.map((option) => option.id) })
                    }}
                    isLoading={isLoading}
                    className="flex-shrink-0"
                  >
                    AIで原稿生成 <WandSparklesIcon size="16" className="ml-2" />
                  </Button>

                  {isLoading && (
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => stop()}
                      className="flex-shrink-0"
                    >
                      キャンセル
                    </Button>
                  )}
                </Stack>
              </HStack>
              <div id={fields.sources.errorId} className="text-destructive">
                {fields.sources.errors}
              </div>
            </div>

            {/* publishedAt */}
            <div>
              <Label htmlFor={fields.publishedAt.id}>公開日時</Label>
              <Input
                {...getInputProps(fields.publishedAt, { type: 'text' })}
                readOnly
                key={fields.publishedAt.key}
                disabled={isLoading}
              />
              <div id={fields.publishedAt.errorId} className="text-destructive">
                {fields.publishedAt.errors}
              </div>
            </div>

            {/* title */}
            <div>
              <Label htmlFor={fields.title.id}>タイトル</Label>
              <Input
                {...getInputProps(fields.title, { type: 'text' })}
                key={fields.title.key}
                disabled={isLoading}
              />
              <div id={fields.title.errorId} className="text-destructive">
                {fields.title.errors}
              </div>
            </div>

            {/* description */}
            <div>
              <Label htmlFor={fields.description.id}>概要</Label>
              <Input
                {...getInputProps(fields.description, { type: 'text' })}
                key={fields.description.key}
                disabled={isLoading}
              />
              <div id={fields.description.errorId} className="text-destructive">
                {fields.description.errors}
              </div>
            </div>

            {/* manuscript */}
            <div>
              <Label>原稿</Label>
              <Textarea
                {...getTextareaProps(fields.manuscript)}
                key={fields.manuscript.key}
                disabled={isLoading}
              />
              <div id={fields.manuscript.errorId} className="text-destructive">
                {fields.manuscript.errors}
              </div>
            </div>

            {/* background music */}
            <div>
              <Label>BGM</Label>
              <Select
                name={fields.bgm.name}
                defaultValue={fields.bgm.initialValue}
              >
                <SelectTrigger id={fields.bgm.id}>
                  <SelectValue placeholder="BGMを選択" />
                </SelectTrigger>
                <SelectContent>
                  {bgms.map((bgm) => (
                    <SelectItem key={bgm.id} value={bgm.id}>
                      {bgm.name} ({formatDuration(bgm.duration)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div id={fields.bgm.errorId} className="text-destructive">
                {fields.bgm.errors}
              </div>
            </div>

            <Button
              disabled={isLoading || fetcher.state === 'submitting'}
              isLoading={fetcher.state === 'submitting'}
              type="submit"
            >
              新規作成
            </Button>
          </Stack>
        </fetcher.Form>

        {fetcher.data?.audioUrl && (
          <div>
            <audio controls autoPlay key={fetcher.data.jobId}>
              <source src={fetcher.data.audioUrl} type="audio/wav" />
            </audio>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
