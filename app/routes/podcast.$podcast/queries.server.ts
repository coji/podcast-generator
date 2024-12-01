import type { Podcast } from '@prisma/client'
import { prisma } from '~/services/prisma.server'

export const getPodcast = async (id: Podcast['id']) => {
  return await prisma.podcast.findUniqueOrThrow({
    where: { id },
  })
}

export const listPodcasts = async () => {
  return await prisma.podcast.findMany()
}
