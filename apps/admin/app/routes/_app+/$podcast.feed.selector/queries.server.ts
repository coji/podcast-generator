import type { Podcast } from '@podcast-generator/db/prisma'
import { prisma } from '@podcast-generator/db/prisma'

export const listRssEntries = async (slug: Podcast['slug']) => {
  return await prisma.rssEntry.findMany({
    select: { id: true, title: true, publishedAt: true },
    where: { RssFeed: { Podcast: { slug } }, isNew: true },
    orderBy: { publishedAt: 'desc' },
  })
}
