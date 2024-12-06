import type { Podcast, Prisma, RssEntry } from '@prisma/client'
import { prisma } from '~/services/prisma.server'

export const createEpisode = async (
  podcastSlug: Podcast['slug'],
  data: Omit<Prisma.EpisodeCreateInput, 'Podcast' | 'episodeNumber'>,
  sourceEntryIds: RssEntry['id'][],
) => {
  // Assign episodeNumber
  const latestEpisode = await prisma.episode.findFirst({
    where: { Podcast: { slug: podcastSlug } },
    orderBy: { episodeNumber: 'desc' },
  })
  const nextEpisodeNumber = latestEpisode ? latestEpisode.episodeNumber + 1 : 1

  // Create the episode
  const episode = await prisma.episode.create({
    data: {
      Podcast: { connect: { slug: podcastSlug } },
      episodeNumber: nextEpisodeNumber,
      EpisodeSources: {
        create: sourceEntryIds.map((id) => ({ rssEntryId: id })),
      },
      ...data,
    },
  })

  // Mark the source entries as not new
  for (const entry of sourceEntryIds) {
    await prisma.rssEntry.update({
      where: { id: entry },
      data: { isNew: false },
    })
  }

  return episode
}
