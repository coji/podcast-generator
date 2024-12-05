import type { Podcast, RssEntry } from '@prisma/client'
import { prisma } from '~/services/prisma.server'

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
