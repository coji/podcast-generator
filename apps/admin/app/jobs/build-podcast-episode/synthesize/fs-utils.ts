import fs from 'node:fs/promises'
import path from 'node:path'
import { $ } from 'zx'
import type { AccentPhrases } from './types'

// Helper function to generate a unique filename
export const generateFilename = (base: string, extension: string): string =>
  `${base}_${Date.now()}.${extension}`

// Utility function to create necessary directories
export const createDirectories = async (baseDir: string, tmpDir: string) => {
  await fs.mkdir(baseDir, { recursive: true })
  await fs.mkdir(tmpDir, { recursive: true })
}

// Utility function to save accent phrases to a file
export const saveAccentPhrases = async (
  baseDir: string,
  accentPhrases: AccentPhrases[],
) => {
  await fs.writeFile(
    path.join(baseDir, 'accentPhrases.json'),
    JSON.stringify(accentPhrases),
  )
}

// Utility function to save audio file
export const saveAudioFile = async (
  outputZipFile: string,
  audioBuffer: ArrayBuffer,
) => {
  await fs.writeFile(outputZipFile, Buffer.from(audioBuffer))
}

// Utility function to unzip audio file
export const unzipFile = async (outputZipFile: string, tmpDir: string) => {
  $.nothrow = true
  await $`unzip -o ${outputZipFile} -d ${tmpDir}`
}

// Utility function to create file list for concatenation
export const createFileList = async (
  accentPhrases: AccentPhrases[],
  fileListPath: string,
) => {
  const wavFiles = accentPhrases.map(
    (_, index) => `${String(index + 1).padStart(3, '0')}.wav`,
  )
  const fileListContent = wavFiles.map((file) => `file '${file}'`).join('\n')
  await fs.writeFile(fileListPath, fileListContent)
}

// Utility function to concatenate audio files
export const concatenateAudioFiles = async (
  fileListPath: string,
  outputFile: string,
) => {
  console.log('Concatenating audio files...')
  await $`ffmpeg -hide_banner -f concat -safe 0 -i ${fileListPath} -c copy ${outputFile}`
}
