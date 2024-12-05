import { uploadFromFile } from '~/services/r2.server'
import { mixBgm } from './mix'
import { synthesizeSpeech } from './synthesize-speech'

export const generatePodcastAudio = async ({
  speaker,
  text,
  userId,
  podcastSlug,
  episodeId,
  isTest,
}: {
  speaker: string
  text: string
  userId: string
  podcastSlug: string
  episodeId: string
  isTest: boolean
}): Promise<string> => {
  // Synthesize speech
  console.log('Synthesizing speech...')
  const speechFile = await synthesizeSpeech(
    speaker,
    text,
    userId,
    podcastSlug,
    isTest,
  )

  // Mix speech with background music
  console.log('Mixing speech with background music...')
  const bgmFile = 'admel_theme_song.mp3'
  const mixedAudioFile = await mixBgm({
    inputAudioFile: speechFile,
    bgmAudioFile: bgmFile,
    userId,
    podcastSlug,
  })

  console.log('Mixed audio file:', mixedAudioFile)
  const fileName = `episode-${episodeId}.mp3`
  await uploadFromFile(podcastSlug, fileName, mixedAudioFile)
  const uploadFileUrl = new URL(
    `/${podcastSlug}/${fileName}`,
    process.env.R2_PUBLIC_BASE_URL,
  ).toString()

  console.log('Uploaded file URL:', uploadFileUrl)

  return uploadFileUrl
}
