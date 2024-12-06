import { prisma } from '@podcast-generator/db/prisma'

export const listPodcasts = async () => {
  return await prisma.podcast.findMany()
}
