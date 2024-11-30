import type { PodcastChannel, User } from '@prisma/client'
import { prisma } from '~/services/prisma.server'

export const getPodcastChannelId = async (userId: User['id']) => {
  return await prisma.podcastChannel.findFirstOrThrow()
}

export const listRssEntries = async (
  podcastChannelId: PodcastChannel['id'],
) => {
  return await prisma.rssEntry.findMany({
    where: { RssFeed: { podcastChannelId } },
    orderBy: { publishedAt: 'desc' },
  })
}
