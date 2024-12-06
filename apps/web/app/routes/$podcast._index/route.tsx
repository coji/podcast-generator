import { format } from 'date-fns/format'
import { ja } from 'date-fns/locale'
import { ChevronRightIcon } from 'lucide-react'
import { data, Link } from 'react-router'
import {
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
import { getPodcast, listEpisodes } from './queries.server'

export const meta = ({ data: { podcast } }: Route.MetaArgs) => {
  return [
    {
      title: podcast.title,
    },
    {
      name: 'description',
      content: podcast.description,
    },
    {
      name: 'og:title',
      content: podcast.title,
    },
    {
      name: 'og:description',
      content: podcast.description,
    },
  ]
}

export const loader = async ({ params }: Route.LoaderArgs) => {
  const podcast = await getPodcast(params.podcast)
  if (!podcast) {
    throw data(null, { status: 404 })
  }
  const episodes = await listEpisodes(params.podcast)
  return { podcast, episodes }
}

export default function PodcastIndex({
  loaderData: { podcast, episodes },
}: Route.ComponentProps) {
  return (
    <Stack>
      <Link to={`/${podcast.slug}`} className="mx-auto max-w-lg py-32">
        <h2 className="text-2xl font-semibold">{podcast.title}</h2>
      </Link>

      <Stack className="gap-8">
        {episodes.map((episode) => (
          <Link to={`${episode.id}`} key={episode.id}>
            <Card key={episode.id} className="mx-auto max-w-lg">
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
                </HStack>
              </CardHeader>
              <CardContent>
                <Stack>
                  <div className="text-muted-foreground text-sm">
                    {episode.description}
                  </div>

                  {episode.audioUrl && (
                    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                    <audio
                      controls
                      src={episode.audioUrl}
                      className="w-full"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}

                  <Collapsible>
                    <CollapsibleTrigger asChild className="group">
                      <Button
                        variant="link"
                        size="sm"
                        onClick={(e) => {
                          console.log('hogehoge')
                          e.stopPropagation()
                        }}
                      >
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
                              className="ml-8 mr-auto text-sm text-blue-500 hover:underline"
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
          </Link>
        ))}
      </Stack>
    </Stack>
  )
}
