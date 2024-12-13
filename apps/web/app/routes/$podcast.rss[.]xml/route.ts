import { prisma } from '@podcast-generator/db/prisma'
import { data } from 'react-router'
import type { Route } from './+types/route'
import { generateRSSFeed } from './generate-rss-feed'

export const loader = async ({ params }: Route.LoaderArgs) => {
  const podcast = await prisma.podcast.findUnique({
    where: { slug: params.podcast },
  })
  if (!podcast) {
    throw data(null, { status: 404 })
  }
  const episodes = await prisma.episode.findMany({
    where: { podcastId: podcast.id },
    orderBy: { publishedAt: 'desc' },
  })

  return new Response(
    generateRSSFeed({
      podcast,
      episodes: episodes
        .filter((ep) => ep.state === 'published') // 公開済みのエピソードのみ
        .filter((ep) => ep.publishedAt) // 公開日が設定されているエピソードのみ
        .filter((ep) => ep.audioUrl) // 音声ファイルが設定されているエピソードのみ
        .filter((ep) => ep.audioLength) // 音声ファイルの長さが設定されているエピソードのみ
        .filter((ep) => ep.audioDuration) as Parameters<
        typeof generateRSSFeed
      >['0']['episodes'], // 音声の長さが設定されているエピソードのみ
    }),
    {
      headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
    },
  )
}
