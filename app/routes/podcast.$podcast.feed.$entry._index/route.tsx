import { experimental_useObject as useObject } from '@ai-sdk/react'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  HStack,
  Tabs,
  TabsList,
  TabsTrigger,
  Textarea,
} from '~/components/ui'
import { responseSchema } from '~/routes/api.podcast-generate/route'
import type { Route } from './+types/route'
import { getEntry } from './queries.server'

export const loader = async ({ params }: Route.LoaderArgs) => {
  const entry = await getEntry(params.entry)
  return { entry }
}

export default function EntryIndex({
  loaderData: { entry },
}: Route.ComponentProps) {
  const { isLoading, object, stop, submit, error } = useObject({
    api: '/api/podcast-generate',
    schema: responseSchema,
  })

  return (
    <Card key={entry.id} className="flex h-full flex-col">
      <CardHeader>
        <HStack>
          <div className="flex-1">
            <CardTitle>{entry.title}</CardTitle>
            <CardDescription />
          </div>

          <Tabs defaultValue="source">
            <TabsList>
              <TabsTrigger value="source">エントリ 原文</TabsTrigger>
              <TabsTrigger value="manuscript">Podcast 原稿</TabsTrigger>
            </TabsList>
          </Tabs>
        </HStack>
      </CardHeader>

      <CardContent className="flex flex-1">
        <Textarea defaultValue={entry.content} className="flex-1" />
        <div>{object?.manuscript}</div>
      </CardContent>

      <CardFooter>
        <HStack>
          <Button
            type="button"
            onClick={() => {
              submit({
                title: entry.title,
                content: entry.content,
              })
            }}
            isLoading={isLoading}
          >
            原稿を生成
          </Button>
        </HStack>
      </CardFooter>
    </Card>
  )
}
