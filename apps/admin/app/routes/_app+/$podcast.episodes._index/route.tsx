import { format } from 'date-fns/format'
import { ja } from 'date-fns/locale'
import { ChevronRightIcon } from 'lucide-react'
import { href, Link } from 'react-router'
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
  Separator,
  Stack,
} from '~/components/ui'
import type { Route } from './+types/route'
import { listEpisodes } from './queries.server'

export const loader = async ({ params }: Route.LoaderArgs) => {
  const episodes = await listEpisodes(params.podcast)
  const now = Date.now()
  return { podcast: params.podcast, episodes, now }
}

export default function EpisodesLayout({
  loaderData: { podcast, episodes, now },
}: Route.ComponentProps) {
  return (
    <Stack>
      <HStack className="pb-2">
        <h2 className="flex-1 text-xl font-semibold">エピソード</h2>
        <div>
          <Button type="button" size="sm" variant="link" asChild>
            <Link to={href('/:podcast/episodes/add', { podcast })}>追加</Link>
          </Button>
        </div>
      </HStack>

      {episodes.map((episode) => (
        <Card key={episode.id} className="mx-auto w-full">
          <CardHeader>
            <HStack className="gap-4">
              <div className="text-xl font-medium">
                # {episode.episodeNumber}
              </div>
              <Separator className="h-8" orientation="vertical" />
              <div className="flex-1">
                <CardDescription className="text-xs">
                  {episode.publishedAt &&
                    format(episode.publishedAt, 'yyyy年MM月dd日(ccc)', {
                      locale: ja,
                    })}
                </CardDescription>
                <CardTitle>{episode.title}</CardTitle>
              </div>
              <div className="text-right">
                <Badge
                  className="capitalize"
                  variant={
                    episode.state === 'published' ? 'outline' : 'secondary'
                  }
                >
                  {episode.state}
                </Badge>
                <Button type="button" size="sm" variant="link" asChild>
                  <Link
                    to={`${href('/:podcast/episodes/add', { podcast })}?source=${episode.EpisodeSources[0].rssEntryId}`}
                  >
                    編集
                  </Link>
                </Button>
              </div>
            </HStack>
          </CardHeader>
          <CardContent>
            <Stack>
              <div className="text-muted-foreground text-sm">
                {episode.description}
              </div>

              {episode.audioUrl && (
                <audio
                  controls
                  src={`${episode.audioUrl}?nocache=${now}`}
                  className="w-full"
                />
              )}

              <Collapsible>
                <CollapsibleTrigger asChild className="group">
                  <Button variant="link" size="sm">
                    ショーノート
                    <ChevronRightIcon
                      size="16"
                      className="transition-transform duration-200 group-data-[state=open]:rotate-90"
                    />
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
                          className="mr-auto ml-8 text-sm text-blue-500 hover:underline"
                        >
                          <h3>{entry.title}</h3>
                        </a>
                      )
                    })}
                  </Stack>
                </CollapsibleContent>
              </Collapsible>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}
