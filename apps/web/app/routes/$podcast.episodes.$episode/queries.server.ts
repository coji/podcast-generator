import type { Episode, Podcast } from '@podcast-generator/db/prisma'
import { prisma } from '@podcast-generator/db/prisma'

export const getPodcast = (slug: Podcast['slug']) => {
  return prisma.podcast.findUnique({ where: { slug } })
}

export const getEpisode = (episodeId: Episode['id']) => {
  return prisma.episode.findUnique({
    include: { EpisodeSources: { include: { RssEntry: true } } },
    where: { id: episodeId },
  })
}
