import path from 'node:path'
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

  // Define background music file path (example path)
  const bgmDir = path.join('./data', userId, podcastSlug, 'bgm')

  const bgmFile = path.join(bgmDir, 'admel_theme_song.mp3')

  // Mix speech with background music
  const mixedAudioFile = await mixBgm(speechFile, bgmFile)

  return mixedAudioFile
}

// ...existing code...
