import { experimental_useObject as useObject } from '@ai-sdk/react'
import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import React, { useEffect } from 'react'
import { Form } from 'react-router'
import { z } from 'zod'
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
import { SourceSelector } from '~/routes/$podcast.feed.selector/SourceSelector'
import { responseSchema } from '../api.podcast-generate/route'
import type { Route } from './+types/route'

const schema = z.object({
  episodeSources: z.array(z.string()),
  title: z.string(),
  description: z.string(),
  manuscript: z.string(),
  image: z.instanceof(File).optional(),
  bgm: z.string().optional(),
})

export const loader = ({ params }: Route.LoaderArgs) => {
  return {}
}

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  console.log(submission)
  return { lastResult: submission.reply() }
}

export default function EpisodeNewPage({
  params: { podcast: podcastSlug },
}: Route.ComponentProps) {
  const { isLoading, object, stop, submit, error } = useObject({
    api: '/api/podcast-generate',
    schema: responseSchema,
  })
  const [form, fields] = useForm({
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

  const [selected, setSelected] = React.useState<
    { value: string; label: string; publishedAt: Date }[]
  >([])

  return (
    <Card className="flex flex-1 flex-col">
      <CardHeader>
        <CardTitle>Add New Episode</CardTitle>
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
              <Label>エピソード元エントリ</Label>
              <HStack className="items-start">
                <SourceSelector
                  podcastSlug={podcastSlug}
                  selected={selected}
                  onChangeSelected={setSelected}
                />

                <Button
                  type="button"
                  disabled={selected.length === 0}
                  onClick={() => {
                    submit({
                      entryIds: selected.map((option) => option.value),
                    })
                  }}
                  isLoading={isLoading}
                  className="flex-shrink-0"
                >
                  原稿を生成
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
              </HStack>
            </div>

            {/* title */}
            <div>
              <Label>タイトル</Label>
              <Input
                {...getInputProps(fields.title, { type: 'text' })}
                key={fields.title.key}
                disabled={isLoading}
              />
            </div>

            {/* description */}
            <div>
              <Label>概要</Label>
              <Input
                {...getInputProps(fields.description, { type: 'text' })}
                key={fields.description.key}
                disabled={isLoading}
              />
            </div>

            {/* manuscript */}
            <div className="flex flex-1 flex-col">
              <Label>原稿</Label>
              <Textarea
                className="flex-1"
                {...getTextareaProps(fields.manuscript)}
                key={fields.manuscript.key}
                disabled={isLoading}
              />
            </div>

            {/* image */}
            <div>
              <Label>イメージ</Label>
              <Input {...getInputProps(fields.image, { type: 'file' })} />
            </div>

            {/* background music */}
            <div>
              <Label>BGM</Label>
              <Select
                name={fields.bgm.name}
                defaultValue={fields.bgm.initialValue}
              >
                <SelectTrigger id={fields.bgm.id}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hoge">hoge</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">新規作成</Button>

            <div>{JSON.stringify(form.allErrors)}a</div>
          </Stack>
        </Form>
      </CardContent>
    </Card>
  )
}
