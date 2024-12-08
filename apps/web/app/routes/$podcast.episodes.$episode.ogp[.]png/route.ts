import { prisma } from '@podcast-generator/db/prisma'
import { data } from 'react-router'
import type { Route } from './+types/route'
import { getOgpImageResponse } from './ogp-image.server'

export const loader = async ({ params }: Route.LoaderArgs) => {
  const episode = await prisma.episode.findFirst({
    select: {
      id: true,
      title: true,
      episodeNumber: true,
      Podcast: {
        select: {
          title: true,
          image: true,
          slug: true,
        },
      },
    },
    where: {
      Podcast: { slug: params.podcast },
      id: params.episode,
    },
  })
  if (!episode) {
    return data(null, { status: 404 })
  }

  console.log(episode)

  return await getOgpImageResponse({
    episodeTitle: episode.title,
    episodeNumber: episode.episodeNumber,
    podcastTitle: episode.Podcast.title,
    podcastImageUrl: episode.Podcast.image,
  })
}
