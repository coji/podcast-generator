import type { Episode, Podcast } from '@podcast-generator/db/prisma'
import { prisma } from '@podcast-generator/db/prisma'

export const getPodcast = (slug: Podcast['slug']) => {
  return prisma.podcast.findUnique({ where: { slug } })
}

export const getEpisode = (episodeId: Episode['id']) => {
  return prisma.episode.findUnique({
    select: {
      id: true,
      publishedAt: true,
      updatedAt: true,
      episodeNumber: true,
      title: true,
      description: true,
      audioUrl: true,
      audioDuration: true,
      audioLength: true,
      EpisodeSources: {
        select: { RssEntry: { select: { id: true, title: true, link: true } } },
      },
    },
    where: { id: episodeId },
  })
}
