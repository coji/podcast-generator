import type { Podcast } from '@prisma/client'
import { prisma } from '~/services/prisma.server'

export const listRssEntries = async (slug: Podcast['slug']) => {
  return await prisma.rssEntry.findMany({
    select: { id: true, title: true, publishedAt: true },
    where: { RssFeed: { Podcast: { slug } }, isNew: true },
    orderBy: { publishedAt: 'desc' },
  })
}
