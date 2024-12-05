import type { Podcast } from '@prisma/client'
import { prisma } from '~/services/prisma.server'

export const listEpisodes = (slug: Podcast['slug']) => {
  return prisma.episode.findMany({
    include: { EpisodeSources: { include: { RssEntry: true } } },
    where: { Podcast: { slug } },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
  })
}
