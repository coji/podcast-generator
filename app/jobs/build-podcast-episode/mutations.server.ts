import type { Episode } from '@prisma/client'
import { prisma } from '~/services/prisma.server'

export const updateEpisodeAudioPublished = async ({
  episodeId,
  audioDuration,
  audioUrl,
}: {
  episodeId: Episode['id']
  audioDuration: Episode['audioDuration']
  audioUrl: Episode['audioUrl']
}) => {
  await prisma.episode.update({
    where: { id: episodeId },
    data: {
      audioDuration,
      audioUrl,
      state: 'published',
    },
  })
}
