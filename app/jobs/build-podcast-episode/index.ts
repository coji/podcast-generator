import { mixBgm } from './mix'
import { synthesizeSpeech } from './synthesize-speech'

// ...existing code...

export const generatePodcastAudio = async ({
  speaker,
  text,
  userId,
  podcastSlug,
  isTest,
}: {
  speaker: string
  text: string
  userId: string
  podcastSlug: string
  isTest: boolean
}): Promise<string> => {
  // Synthesize speech
  const speechFile = await synthesizeSpeech(
    speaker,
    text,
    userId,
    podcastSlug,
    isTest,
  )

  const bgmFile = 'admel_theme_song.mp3'

  // Mix speech with background music
  const mixedAudioFile = await mixBgm({
    inputAudioFile: speechFile,
    bgmAudioFile: bgmFile,
    userId,
    podcastSlug,
  })

  return mixedAudioFile
}

// ...existing code...
