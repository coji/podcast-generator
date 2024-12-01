import type { Podcast, User } from '@prisma/client'
import { prisma } from '~/services/prisma.server'

export const getPodcastChannelId = async (userId: User['id']) => {
  return await prisma.podcast.findFirstOrThrow()
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
