import type { Episode } from '@podcast-generator/db/prisma'
import { prisma } from '@podcast-generator/db/prisma'

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
