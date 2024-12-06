import type { Podcast } from '@podcast-generator/db/prisma'
import { prisma } from '@podcast-generator/db/prisma'

export const getPodcast = (slug: Podcast['slug']) => {
  return prisma.podcast.findUnique({ include: { User: true }, where: { slug } })
}
