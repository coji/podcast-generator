import type { User } from '@prisma/client'
import { prisma } from '~/services/prisma.server'

export const listPodcastChannels = async (userId: User['id']) => {
  return await prisma.podcastChannel.findMany({})
}
