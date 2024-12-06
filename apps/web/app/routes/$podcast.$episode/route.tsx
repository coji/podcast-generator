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
import { getEpisode, getPodcast } from './queries.server'

export const meta = ({ data: { podcast, episode } }: Route.MetaArgs) => {
  return [
    {
      title: `${episode.title} - ${podcast.title}`,
    },
    {
      name: 'description',
      content: episode.description,
    },
    {
      name: 'og:title',
      content: `${episode.title} - ${podcast.title}`,
    },
    {
      name: 'og:description',
      content: episode.description,
    },
  ]
}

export const loader = async ({ params }: Route.LoaderArgs) => {
  const podcast = await getPodcast(params.podcast)
  if (!podcast) {
    throw data(null, { status: 404 })
  }
  const episode = await getEpisode(params.episode)
  if (!episode) {
    throw data(null, { status: 404 })
  }

  return { podcast, episode }
}

export default function PodcastIndex({
  loaderData: { podcast, episode },
}: Route.ComponentProps) {
  return (
    <Stack>
      <Link to={`/${podcast.slug}`} className="mx-auto max-w-lg py-32">
        <h2 className="text-2xl font-semibold">{podcast.title}</h2>
      </Link>

      <Stack className="mx-auto max-w-lg gap-8">
        <Card key={episode.id}>
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
                <audio controls src={episode.audioUrl} className="w-full" />
              )}

              <Collapsible defaultOpen>
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

        <div className="text-center">
          <Button type="button" variant="link" asChild>
            <Link to=".." relative="path">
              トップに戻る
            </Link>
          </Button>
        </div>
      </Stack>
    </Stack>
  )
}
