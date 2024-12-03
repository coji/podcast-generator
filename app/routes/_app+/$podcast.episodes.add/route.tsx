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
import { Form } from 'react-router'
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
import { SourceSelector } from '~/routes/_app+/$podcast.feed.selector/SourceSelector'
import { responseSchema } from '../../api.podcast-generate/route'
import type { Route } from './+types/route'
import { listBackgroundMusics, listSources } from './queries.server'

const schema = z.object({
  sources: z.array(z.string()).min(1, { message: '元記事を選択してください' }),
  title: z.string({ required_error: '必須' }),
  description: z.string({ required_error: '必須' }),
  manuscript: z.string({ required_error: '必須' }),
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
  const bgms = await listBackgroundMusics(params.podcast)

  const initialSources =
    source.length > 0 ? await listSources(params.podcast, source) : []
  return { bgms, initialSources }
}

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  console.log(submission)
  return { lastResult: submission.reply() }
}

export default function EpisodeNewPage({
  params: { podcast: podcastSlug },
  loaderData: { bgms, initialSources },
  actionData,
}: Route.ComponentProps) {
  const { isLoading, object, stop, submit, error } = useObject({
    api: '/api/podcast-generate',
    schema: responseSchema,
  })

  const [form, fields] = useForm({
    lastResult: actionData?.lastResult,
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
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
    <Card className="flex flex-1 flex-col">
      <CardHeader>
        <CardTitle>エピソード 新規作成</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <Form
          method="POST"
          {...getFormProps(form)}
          className="flex flex-1 flex-col"
        >
          <Stack className="flex-1">
            {/* episode sources */}
            <div>
              <Label htmlFor="source-selector">元記事</Label>
              <HStack className="items-start">
                <SourceSelector
                  id="source-selector"
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
                      {bgm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div id={fields.bgm.errorId} className="text-destructive">
                {fields.bgm.errors}
              </div>
            </div>

            <Button disabled={isLoading} type="submit">
              新規作成
            </Button>
          </Stack>
        </Form>
      </CardContent>
    </Card>
  )
}
