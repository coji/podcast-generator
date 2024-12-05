import { format } from 'date-fns/format'
import { ja } from 'date-fns/locale'
import { Link } from 'react-router'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  HStack,
  Stack,
} from '~/components/ui'
import type { Route } from './+types/route'
import { listEpisodes } from './queries.server'

export const loader = async ({ params }: Route.LoaderArgs) => {
  const episodes = await listEpisodes(params.podcast)
  return { episodes }
}

export default function EpisodesLayout({
  loaderData: { episodes },
}: Route.ComponentProps) {
  return (
    <Stack>
      <HStack className="sticky top-0 bg-slate-200 pb-2">
        <h2 className="flex-1 text-xl font-semibold">エピソード</h2>
        <div>
          <Button type="button" size="sm" variant="link" asChild>
            <Link to="add">追加</Link>
          </Button>
        </div>
      </HStack>

      {episodes.map((episode) => (
        <Card key={episode.id}>
          <CardHeader>
            <HStack className="items-start">
              <div className="flex-1">
                <CardTitle>{episode.title}</CardTitle>
                <CardDescription>{episode.description}</CardDescription>
              </div>
              <div className="text-center">
                <Badge
                  className="capitalize"
                  variant={
                    episode.state === 'published' ? 'default' : 'outline'
                  }
                >
                  {episode.state}
                </Badge>
                <div className="text-xs">
                  {episode.publishedAt &&
                    format(episode.publishedAt, 'yyyy-MM-dd', { locale: ja })}
                </div>
              </div>
            </HStack>
          </CardHeader>
          <CardContent>
            {episode.audioUrl && (
              <audio
                controls
                src={episode.audioUrl}
                className="mx-auto text-center"
              />
            )}

            <Collapsible>
              <CollapsibleTrigger>
                <Button variant="link" size="sm">
                  ショーノート
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Stack>
                  {episode.EpisodeSources.map((source) => {
                    const entry = source.RssEntry
                    return (
                      <a
                        key={entry.id}
                        href={entry.link}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-8 mr-auto text-sm text-blue-500 hover:underline"
                      >
                        <h3>{entry.title}</h3>
                      </a>
                    )
                  })}
                </Stack>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}
