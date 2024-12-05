import fs from 'node:fs/promises'
import path from 'node:path'
import { $ } from 'zx'

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
  // Define background music file path (example path)
  const baseDir = path.join('./data', userId, podcastSlug)
  const outputDir = path.join(baseDir)
  await fs.mkdir(outputDir, { recursive: true })
  const tmpDir = path.join(baseDir, 'tmp')
  await fs.mkdir(tmpDir, { recursive: true })

  const outputZipFile = path.join(tmpDir, generateFilename('speech', 'zip'))
  const outputFile = path.join(tmpDir, generateFilename('speech', 'wav'))
  const accentPhrases: AccentPhrases[] = []

  // テキストを行ごとに分割
  const lines = text.split('\n').filter((line) => line.trim() !== '')
  for (const line of lines) {
    // Fetch audio query
    const queryParams = new URLSearchParams({ speaker, text: line })
    const queryResponse = await fetch(
      `http://localhost:10101/audio_query?${queryParams.toString()}`,
      {
        method: 'POST',
      },
    )
    if (!queryResponse.ok) {
      throw new Error(queryResponse.statusText)
    }

    const phrase: AccentPhrases = await queryResponse.json()
    accentPhrases.push(phrase)
  }

  await fs.writeFile(
    path.join(baseDir, 'accentPhrases.json'),
    JSON.stringify(accentPhrases),
  )

  // Synthesize speech
  const synthesisResponse = await fetch(
    `http://localhost:10101/multi_synthesis?speaker=${speaker}`,
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
  await fs.writeFile(outputZipFile, Buffer.from(audioBuffer))

  // unzip the file
  $.nothrow = true
  await $`unzip -o ${outputZipFile} -d ${tmpDir}`

  const wavFiles = accentPhrases.map(
    (_, index) => `${String(index + 1).padStart(3, '0')}.wav`,
  )
  const fileListPath = path.join(tmpDir, 'filelist.txt')
  const fileListContent = wavFiles.map((file) => `file '${file}'`).join('\n')
  await fs.writeFile(fileListPath, fileListContent)

  console.log('Concatenating audio files...')
  await $`ffmpeg -hide_banner -f concat -safe 0 -i ${fileListPath} -c copy ${outputFile}`

  // Optionally, clean up temporary directory
  // await fs.rm(tmpDir, { recursive: true, force: true })

  return outputFile
}
