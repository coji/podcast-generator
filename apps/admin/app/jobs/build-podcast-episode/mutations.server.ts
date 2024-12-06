import type { Episode } from '@podcast-generator/db/prisma'
import { prisma } from '@podcast-generator/db/prisma'

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
