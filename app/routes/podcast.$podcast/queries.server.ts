import type { PodcastChannel } from '@prisma/client'
import { prisma } from '~/services/prisma.server'

export const getPodcast = async (id: PodcastChannel['id']) => {
  return await prisma.podcastChannel.findUniqueOrThrow({
    where: { id },
  })
}
