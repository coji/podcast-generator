import { experimental_useObject as useObject } from '@ai-sdk/react'
import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { useEffect } from 'react'
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
import { MultiSelect } from '~/components/ui/multi-select'
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

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema })
  console.log(submission)
  return { lastResult: submission.reply() }
}

export default function EpisodeNewPage() {
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

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Add New Episode</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent>
        <Form method="POST" {...getFormProps(form)}>
          <Stack>
            {/* episode sources */}
            <div>
              <Label>エピソード元エントリ</Label>
              <HStack className="items-start">
                <MultiSelect
                  options={[
                    { label: 'hoge', value: 'hoge' },
                    { label: 'fuga', value: 'fuga' },
                  ]}
                />

                <Button
                  type="button"
                  onClick={() => {
                    submit({
                      entryIds: [
                        'ae7f86ca-f740-4fd3-80d9-54c032641443',
                        'ca561ff4-612e-46d2-be12-b3458ddaaa68',
                      ],
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
            <div>
              <Label>原稿</Label>
              <Textarea
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
