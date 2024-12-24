// src/index.ts

import crypto from 'node:crypto'
import type { Podcast } from './domain/podcast'
import { createDirectory } from './infrastructure/fileSystem'
import { updateEpisodeAudioPublished } from './mutations/episodeMutations'
import { mixBgm, type MixedAudio } from './services/mixing'
import { synthesizeSpeech } from './services/synthesis'
import { uploadAudio } from './services/upload'

interface GeneratePodcastAudioInput {
  speaker: string
  text: string
  organizationId: string
  podcastSlug: string
  episodeId: string
}

interface GeneratePodcastAudioOutput {
  audioUrl: string
  audioDuration: number
  audioLength: number
  jobId: string
}

export const generatePodcastAudio = async ({
  speaker,
  text,
  organizationId,
  podcastSlug,
  episodeId,
}: GeneratePodcastAudioInput): Promise<GeneratePodcastAudioOutput> => {
  const jobId = crypto.randomUUID()

  const podcast: Podcast = { organizationId, podcastSlug }
  const tmpDir = './data/tmp'

  // Create temporary directory
  await createDirectory(tmpDir)

  // Synthesize speech
  console.log('Synthesizing speech...')
  const speechFile = await synthesizeSpeech(speaker, text, podcast)

  // Mix speech with background music
  console.log('Mixing speech with background music...', podcastSlug)
  const bgmFile = 'admel_theme_song.mp3'
  const { outputAudioFile, audioDuration, audioLength }: MixedAudio =
    await mixBgm(speechFile, bgmFile, podcast)

  console.log('Mixed audio file:', outputAudioFile)

  // Upload the mixed audio file
  const fileName = `episode-${episodeId}.mp3`
  const audioUrl = await uploadAudio(podcast, fileName, outputAudioFile)

  console.log('Uploaded file URL:', audioUrl)

  // Update episode status to published
  await updateEpisodeAudioPublished({
    episodeId,
    audioDuration,
    audioUrl,
    audioLength,
  })

  return { audioUrl, audioDuration, audioLength, jobId }
}
