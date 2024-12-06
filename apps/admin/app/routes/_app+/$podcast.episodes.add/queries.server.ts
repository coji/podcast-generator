import type { Podcast, RssEntry } from '@podcast-generator/db/prisma'
import { prisma } from '@podcast-generator/db/prisma'

export const listSources = async (
  slug: Podcast['slug'],
  ids: RssEntry['id'][],
) => {
  return await prisma.rssEntry.findMany({
    select: { id: true, title: true, publishedAt: true },
    where: { RssFeed: { Podcast: { slug } }, id: { in: ids } },
    orderBy: { publishedAt: 'desc' },
  })
}

export const listBackgroundMusics = async (slug: Podcast['slug']) => {
  return await prisma.backgroundMusic.findMany({
    where: {
      Podcast: { slug },
    },
  })
}

export const getPodcast = async (slug: string) => {
  return await prisma.podcast.findUniqueOrThrow({
    where: { slug },
  })
}

//　既存のエピソードの中に、今回の sourceEntryIds と完全に重複するものを探す
export const findExistingEpisode = async (
  podcastSlug: Podcast['slug'],
  sourceEntryIds: RssEntry['id'][],
) => {
  return await prisma.episode.findFirst({
    where: {
      Podcast: { slug: podcastSlug },
      EpisodeSources: { every: { rssEntryId: { in: sourceEntryIds } } },
    },
  })
}
