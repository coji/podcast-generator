import type { Podcast, Prisma, RssEntry } from '@prisma/client'
import { prisma } from '~/services/prisma.server'

export const createEpisode = async (
  podcastSlug: Podcast['slug'],
  data: Omit<Prisma.EpisodeCreateInput, 'Podcast'>,
  sourceEntryIds: RssEntry['id'][],
) => {
  // Create the episode
  const episode = await prisma.episode.create({
    data: {
      Podcast: { connect: { slug: podcastSlug } },
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
