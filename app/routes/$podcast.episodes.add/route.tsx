import { experimental_useObject as useObject } from '@ai-sdk/react'
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

export default function EpisodeNewPage() {
  const { isLoading, object, stop, submit, error } = useObject({
    api: '/api/podcast-generate',
    schema: responseSchema,
  })

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Add New Episode</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent>
        <form>
          <Stack>
            {/* episode sources */}
            <div>
              <Label>エピソード元エントリ</Label>
              <HStack className="items-center">
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
              </HStack>
            </div>

            {/* title */}
            <div>
              <Label>タイトル</Label>
              <Input />
            </div>

            {/* description */}
            <div>
              <Label>概要</Label>
              <Input />
            </div>

            {/* manuscript */}
            <div>
              <Label>原稿</Label>
              <Textarea />
            </div>

            {/* image */}
            <div>
              <Label>イメージ</Label>
              <Input type="file" />
            </div>

            {/* background music */}
            <div>
              <Label>BGM</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hoge">hoge</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Stack>
        </form>
      </CardContent>
    </Card>
  )
}
