import { prisma } from '@podcast-generator/db/prisma'
import type { Config } from '@react-router/dev/config'

export default {
  ssr: true,
  prerender: async () => {
    const routes = ['/']
    const podcasts = await prisma.podcast.findMany({
      include: { Episode: true },
    })

    for (const podcast of podcasts) {
      routes.push(`/${podcast.slug}/rss.xml`)

      routes.push(`/${podcast.slug}`)
      const pageSize = 5
      const totalPage = Math.ceil(podcast.Episode.length / pageSize)
      for (let page = 1; page <= totalPage; page++) {
        routes.push(`/${podcast.slug}/page/${page}`)
      }

      for (const episode of podcast.Episode) {
        routes.push(`/${podcast.slug}/episodes/${episode.id}`)
        routes.push(`/${podcast.slug}/episodes/${episode.id}/ogp.png`)
      }
    }
    return routes
  },
} satisfies Config
