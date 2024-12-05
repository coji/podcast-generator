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

  return mixedAudioFile
}

// ...existing code...
