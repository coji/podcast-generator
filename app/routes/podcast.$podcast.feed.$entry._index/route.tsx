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
  TabsContent,
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
    <Tabs className="flex h-full" key={entry.id}>
      <Card className="flex flex-1 flex-col">
        <CardHeader>
          <HStack>
            <div className="flex-1">
              <CardTitle>{entry.title}</CardTitle>
              <CardDescription />
            </div>

            <TabsList>
              <TabsTrigger value="source">Source</TabsTrigger>
              <TabsTrigger value="manuscript">Manuscript</TabsTrigger>
            </TabsList>
          </HStack>
        </CardHeader>

        <CardContent className="flex-1">
          <TabsContent value="source" className="flex h-full">
            <Textarea defaultValue={entry.content} className="flex-1" />
          </TabsContent>
          <TabsContent value="manuscript">
            <div>{object?.manuscript}</div>
          </TabsContent>
        </CardContent>

        <CardFooter>
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
            hoge
          </Button>
        </CardFooter>
      </Card>
    </Tabs>
  )
}
