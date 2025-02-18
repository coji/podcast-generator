import type { Podcast } from '@podcast-generator/db/prisma'
import { prisma } from '@podcast-generator/db/prisma'
import { defineCommand, runMain } from 'citty'
import consola from 'consola'
import { generatePodcastEpisode } from 'features/generate-podcast/index.server'

export const regeneratePodcastEpisodes = async (
  podcastSlug: Podcast['slug'],
) => {
  const episodes = await prisma.episode.findMany({
    include: { EpisodeSources: true },
    where: {
      AND: [
        {
          Podcast: {
            slug: podcastSlug,
          },
        },
        { manuscript: { not: null } },
        { publishedAt: { not: null } },
      ],
    },
    orderBy: { episodeNumber: 'asc' },
  })

  for (const episode of episodes) {
    if (!episode) {
      consola.info(`No episodes found for podcast ${podcastSlug}`)
      continue
    }

    if (episode.manuscript === null) {
      consola.info(`Episode ${episode.id} has no manuscript`)
      continue
    }

    if (episode.publishedAt === null) {
      consola.info(`Episode ${episode.id} has no publishedAt date`)
      continue
    }
    consola.info(
      `Regenerating episode ${episode.id}: #${episode.episodeNumber} ${episode.title}`,
    )

    await generatePodcastEpisode({
      podcastSlug,
      title: episode.title,
      description: episode.description,
      manuscript: episode.manuscript,
      publishedAt: episode.publishedAt,
      sources: episode.EpisodeSources.map((source) => source.rssEntryId),
    })
  }
}

const command = defineCommand({
  meta: {
    name: 'regenerate-podcast-episodes',
    description: 'Regenerate podcast episodes',
  },
  args: {
    podcast: {
      type: 'string',
      description: 'The slug of the podcast',
      required: true,
    },
  },
  run: async ({ args }) => {
    const podcast = await prisma.podcast.findUnique({
      where: { slug: args.podcast },
    })
    if (!podcast) {
      consola.error(`Podcast with slug ${args.podcastSlug} not found`)
      return
    }

    consola.info(`Regenerating episodes for podcast ${podcast.title}`)
    await regeneratePodcastEpisodes(podcast.slug)
  },
})

await runMain(command)
