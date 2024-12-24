// src/mutations/episodeMutations.ts

import { prisma } from '@podcast-generator/db/prisma'
import type { Episode } from '../domain/episode'

export const updateEpisodeAudioPublished = async ({
  episodeId,
  audioDuration,
  audioUrl,
  audioLength,
}: {
  episodeId: Episode['id']
  audioDuration: Episode['audioDuration']
  audioUrl: Episode['audioUrl']
  audioLength: Episode['audioLength']
}) => {
  await prisma.episode.update({
    where: { id: episodeId },
    data: {
      audioDuration,
      audioUrl,
      audioLength,
      state: 'published',
    },
  })
}
