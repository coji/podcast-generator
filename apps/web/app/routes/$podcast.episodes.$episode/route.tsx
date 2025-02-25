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
      property: 'og:url',
      content: `https://podcast.techtalk.jp/${podcast.slug}/episodes/${episode.id}`,
    },
    {
      property: 'og:type',
      content: 'article',
    },
    {
      property: 'og:site_name',
      content: podcast.title,
    },
    {
      property: 'og:locale',
      content: 'ja_JP',
    },
    {
      property: 'og:title',
      content: `${episode.title} - ${podcast.title}`,
    },
    {
      property: 'og:description',
      content: episode.description,
    },
    {
      property: 'og:image',
      content: `https://podcast.techtalk.jp/${podcast.slug}/episodes/${episode.id}/ogp.png`,
    },
    {
      property: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      property: 'twitter:title',
      content: `${episode.title} - ${podcast.title}`,
    },
    {
      property: 'twitter:description',
      content: episode.description,
    },
    {
      property: 'twitter:image',
      content: `https://podcast.techtalk.jp/${podcast.slug}/episodes/${episode.id}/ogp.png`,
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
  loaderData: { episode },
}: Route.ComponentProps) {
  return (
    <Stack className="gap-8">
      <Card
        key={episode.id}
        style={{ viewTransitionName: `episode-${episode.id}` }}
      >
        <CardHeader>
          <HStack className="gap-4">
            <div className="text-xl font-medium"># {episode.episodeNumber}</div>
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
              <audio
                controls
                src={`${episode.audioUrl}?u=${episode.updatedAt.getTime()}`}
                preload="auto"
                className="w-full"
              />
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

      <div className="text-center">
        <Button type="button" variant="ghost" size="sm" asChild>
          <Link to="../.." relative="path" viewTransition>
            トップに戻る
          </Link>
        </Button>
      </div>
    </Stack>
  )
}
