import type { Podcast } from '@podcast-generator/db/prisma'
import { prisma } from '@podcast-generator/db/prisma'

export const getPodcast = (slug: Podcast['slug']) => {
  return prisma.podcast.findUnique({
    select: {
      id: true,
      slug: true,
      title: true,
      image: true,
      spotifyUrl: true,
      User: { select: { id: true, name: true } },
    },
    where: { slug },
  })
}
