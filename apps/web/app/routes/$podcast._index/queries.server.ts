import type { Podcast } from '@podcast-generator/db/prisma'
import { prisma } from '@podcast-generator/db/prisma'

export const getPodcast = async (slug: Podcast['slug']) => {
  return await prisma.podcast.findUnique({ where: { slug } })
}

export const listEpisodes = async (
  slug: Podcast['slug'],
  page: number,
  limit: number,
) => {
  const episodes = await prisma.episode.findMany({
    include: { EpisodeSources: { include: { RssEntry: true } } },
    where: { Podcast: { slug } },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    skip: (page - 1) * limit,
    take: limit,
  })

  const total = await prisma.episode.count({
    where: { Podcast: { slug } },
  })

  return { episodes, total }
}
