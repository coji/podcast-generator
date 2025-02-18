import { generatePodcastAudio } from '~/jobs'
import { createEpisode } from './mutations.server'
import { getPodcast } from './queries.server'

export const generatePodcastEpisode = async ({
  podcastSlug,
  sources,
  title,
  description,
  manuscript,
  publishedAt,
}: {
  podcastSlug: string
  sources: string[]
  title: string
  description: string
  manuscript: string
  publishedAt: Date
}) => {
  const podcast = await getPodcast(podcastSlug)

  const episode = await createEpisode(
    podcast.slug,
    {
      publishedAt,
      title,
      description,
      manuscript,
    },
    sources,
  )

  const { jobId, audioUrl, audioDuration } = await generatePodcastAudio({
    speaker: podcast.speaker, // Use the podcast speaker
    text: manuscript,
    organizationId: podcast.organizationId,
    podcastSlug,
    episodeId: episode.id,
  })

  return {
    audioUrl,
    audioDuration,
    episode,
    jobId,
  }
}
