import type { RssEntry } from '@podcast-generator/db/prisma'
import { prisma } from '@podcast-generator/db/prisma'

export const getEntry = async (entryId: RssEntry['id']) => {
  return await prisma.rssEntry.findUniqueOrThrow({
    include: { RssFeed: true },
    where: { id: entryId },
  })
}
