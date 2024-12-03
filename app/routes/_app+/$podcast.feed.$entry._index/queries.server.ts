import type { RssEntry } from '@prisma/client'
import { prisma } from '~/services/prisma.server'

export const getEntry = async (entryId: RssEntry['id']) => {
  return await prisma.rssEntry.findUniqueOrThrow({
    include: { RssFeed: true },
    where: { id: entryId },
  })
}
