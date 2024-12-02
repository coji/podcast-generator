import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  HStack,
  Textarea,
} from '~/components/ui'
import type { Route } from './+types/route'
import { getEntry } from './queries.server'

export const loader = async ({ params }: Route.LoaderArgs) => {
  const entry = await getEntry(params.entry)
  return { entry }
}

export default function EntryIndex({
  loaderData: { entry },
}: Route.ComponentProps) {
  return (
    <Card key={entry.id} className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>{entry.title}</CardTitle>
        <CardDescription>{entry.RssFeed.title}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1">
        <Textarea defaultValue={entry.content} className="flex-1" />
      </CardContent>

      <CardFooter>
        <HStack>
          <Button type="button">原稿を生成</Button>
        </HStack>
      </CardFooter>
    </Card>
  )
}
