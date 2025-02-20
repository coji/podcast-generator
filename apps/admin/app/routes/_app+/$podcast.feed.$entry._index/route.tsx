import { href, Link } from 'react-router'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  HStack,
  Textarea,
} from '~/components/ui'
import type { Route } from './+types/route'
import { getEntry } from './queries.server'

export const handle = {
  breadcrumbs: ({
    loaderData,
    params,
  }: {
    loaderData: Awaited<ReturnType<typeof loader>>
    params: Route.LoaderArgs['params']
  }) => (
    <Link
      to={href('/:podcast/feed/:entry', {
        podcast: params.podcast,
        entry: params.entry,
      })}
    >
      詳細
    </Link>
  ),
}

export const loader = async ({ params }: Route.LoaderArgs) => {
  const entry = await getEntry(params.entry)
  return { entry }
}

export default function EntryIndex({
  loaderData: { entry },
  params,
}: Route.ComponentProps) {
  return (
    <Card key={entry.id}>
      <CardHeader>
        <HStack>
          <div>
            <CardTitle>{entry.title}</CardTitle>
            <CardDescription>{entry.RssFeed.title}</CardDescription>
          </div>
          <div className="flex-1" />
          <Button type="button" asChild>
            <Link
              to={`${href('/:podcast/episodes/add', { podcast: params.podcast })}?source=${entry.id}`}
            >
              この記事を元にエピソードを生成
            </Link>
          </Button>
        </HStack>
      </CardHeader>

      <CardContent>
        <Textarea defaultValue={entry.content} />
      </CardContent>
    </Card>
  )
}
