import type { Podcast } from '@podcast-generator/db/prisma'
import { prisma } from '@podcast-generator/db/prisma'

export const listEpisodes = (slug: Podcast['slug']) => {
  return prisma.episode.findMany({
    include: { EpisodeSources: { include: { RssEntry: true } } },
    where: { Podcast: { slug } },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
  })
}
