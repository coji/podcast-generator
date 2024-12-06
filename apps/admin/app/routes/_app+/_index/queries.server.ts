import type { User } from '@podcast-generator/db/prisma'
import { prisma } from '@podcast-generator/db/prisma'

export const listPodcasts = async (userId: User['id']) => {
  return await prisma.podcast.findMany({})
}
