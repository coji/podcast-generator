import fs from 'node:fs/promises'
import path from 'node:path'

interface Moras {
  text: string
  consonant: string
  consonant_length: number
  vowel: string
  vowel_length: number
  pitch: number
}

interface AccentPhrases {
  accent_phrases: {
    moras: Moras[]
    speedScale: number
    intonationScale: number
    tempoDynamicsScale: number
    pitchScale: number
    volumeScale: number
    prePhonemeLength: number
    postPhonemeLength: number
    pauseLength: null
    pauseLengthScale: number
    outputSamplingRate: number
    outputStereo: boolean
    kana: string
  }
}
// Helper function to generate a unique filename
const generateFilename = (base: string, extension: string): string =>
  `${base}_${Date.now()}.${extension}`

// Synthesizes speech from text and returns the audio file path
export const synthesizeSpeech = async (
  speaker: string,
  text: string,
  userId: string,
  podcastSlug: string,
  isTest: boolean, // Added isTest parameter
): Promise<string> => {
  const outputDir = isTest
    ? path.join('./data', userId, podcastSlug, 'test')
    : path.join('./data', userId, podcastSlug)
  await fs.mkdir(outputDir, { recursive: true })

  const outputFile = path.join(outputDir, generateFilename('speech', 'wav'))

  // Fetch audio query
  const queryParams = new URLSearchParams({ speaker, text })
  const queryResponse = await fetch(
    `http://localhost:10101/audio_query?${queryParams.toString()}`,
    {
      method: 'POST',
    },
  )
  if (!queryResponse.ok) {
    throw new Error(queryResponse.statusText)
  }
  const accentPhrases: AccentPhrases = await queryResponse.json()

  // Synthesize speech
  const synthesisResponse = await fetch(
    `http://localhost:10101/synthesis?speaker=${speaker}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(accentPhrases),
    },
  )
  if (!synthesisResponse.ok) {
    throw new Error(synthesisResponse.statusText)
  }
  const audioBuffer = await synthesisResponse.arrayBuffer()

  // Save audio file
  const id = crypto.randomUUID()
  await fs.writeFile(outputFile, Buffer.from(audioBuffer))

  return outputFile
}
