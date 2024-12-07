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
      routes.push(`/${podcast.slug}`)
      routes.push(`/${podcast.slug}/rss.xml`)
      for (const episode of podcast.Episode) {
        routes.push(`/${podcast.slug}/${episode.id}`)
      }
    }
    return routes
  },
} satisfies Config
