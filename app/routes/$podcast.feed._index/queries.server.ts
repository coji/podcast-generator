import type { Podcast } from '@prisma/client'
import { prisma } from '~/services/prisma.server'

export const getPodcast = async (slug: Podcast['slug']) => {
  return await prisma.podcast.findFirstOrThrow({
    where: { slug },
  })
}

export const listRssEntries = async (podcastId: Podcast['id']) => {
  return await prisma.rssEntry.findMany({
    include: {
      RssFeed: true,
    },
    where: { RssFeed: { podcastId } },
    orderBy: { publishedAt: 'desc' },
  })
}
