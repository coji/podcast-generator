import type { Podcast, Prisma, RssEntry } from '@podcast-generator/db/prisma'
import { prisma } from '@podcast-generator/db/prisma'

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

  //　既存のエピソードの中に、今回の sourceEntryIds と完全に重複するものがあるかどうかをチェック
  const existingEpisode = await prisma.episode.findFirst({
    where: {
      Podcast: { slug: podcastSlug },
      EpisodeSources: { every: { rssEntryId: { in: sourceEntryIds } } },
    },
  })

  // すでに存在する場合は udpate
  if (existingEpisode) {
    const episode = await prisma.episode.update({
      where: { id: existingEpisode.id },
      data,
    })
    return episode
  }

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
