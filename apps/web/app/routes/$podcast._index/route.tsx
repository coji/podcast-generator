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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
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

  const pageSize = 5
  const currentPage = params.page ? Number.parseInt(params.page, 10) : 1
  const { episodes, total } = await listEpisodes(
    params.podcast,
    currentPage,
    pageSize,
  )
  const totalPage = Math.ceil(total / pageSize)
  return { podcast, episodes, currentPage, totalPage, pageSize }
}

export default function PodcastIndex({
  loaderData: { podcast, episodes, currentPage, totalPage, pageSize },
}: Route.ComponentProps) {
  return (
    <Stack className="gap-8">
      {episodes.map((episode) => (
        <Card
          key={episode.id}
          style={{ viewTransitionName: `episode-${episode.id}` }}
        >
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
                <CardTitle>
                  <Link
                    to={`/${podcast.slug}/episodes/${episode.id}`}
                    key={episode.id}
                    className="hover:underline"
                    viewTransition
                  >
                    {episode.title}
                  </Link>
                </CardTitle>
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
                  src={`${episode.audioUrl}?u=${episode.updatedAt.getTime()}}`}
                  preload="auto"
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

      {totalPage !== 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                to={
                  currentPage === 1
                    ? `/${podcast.slug}`
                    : `/${podcast.slug}/page/${currentPage - 1}`
                }
                viewTransition
              />
            </PaginationItem>
            {Array.from({ length: totalPage }).map((_, index) => (
              <PaginationItem
                key={`page-${
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  index
                }`}
              >
                <PaginationLink
                  to={
                    index + 1 === 1
                      ? `/${podcast.slug}`
                      : `/${podcast.slug}/page/${index + 1}`
                  }
                  isActive={index + 1 === currentPage}
                  viewTransition
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {totalPage > 5 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                to={
                  currentPage === totalPage
                    ? `/${podcast.slug}/page/${totalPage}`
                    : `/${podcast.slug}/page/${currentPage + 1}`
                }
                viewTransition
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </Stack>
  )
}
