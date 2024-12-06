import { prisma } from '@podcast-generator/db/prisma'
import type { Config } from '@react-router/dev/config'

export default {
  ssr: true,
  prerender: async () => {
    const routes = ['/', '/chanmomo']
    const episodes = await prisma.episode.findMany({
      where: {
        Podcast: { slug: 'chanmomo' },
      },
      orderBy: { publishedAt: 'desc' },
    })
    for (const episode of episodes) {
      routes.push(`/chanmomo/${episode.id}`)
    }
    return routes
  },
} satisfies Config
