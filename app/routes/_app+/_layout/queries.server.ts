import { prisma } from '~/services/prisma.server'

export const listPodcasts = async () => {
  return await prisma.podcast.findMany()
}
