import type { User } from '@prisma/client'
import { prisma } from '~/services/prisma.server'

export const listPodcasts = async (userId: User['id']) => {
  return await prisma.podcast.findMany({})
}
