import path from 'node:path'
import { fetchAccentPhrases, synthesizeAudio } from './api'
import {
  concatenateAudioFiles,
  createDirectories,
  createFileList,
  generateFilename,
  saveAccentPhrases,
  saveAudioFile,
  unzipFile,
} from './fs-utils'
import { splitTextIntoLines } from './utils'

export const synthesizeSpeech = async (
  speaker: string,
  text: string,
  userId: string,
  podcastSlug: string,
): Promise<string> => {
  const baseDir = path.join('./data', userId, podcastSlug)
  const tmpDir = path.join(baseDir, 'tmp')

  // Create directories
  await createDirectories(baseDir, tmpDir)

  const outputZipFile = path.join(tmpDir, generateFilename('speech', 'zip'))
  const outputFile = path.join(tmpDir, generateFilename('speech', 'wav'))

  // Split text into lines
  const lines = splitTextIntoLines(text)

  // Fetch accent phrases
  const accentPhrases = await fetchAccentPhrases(speaker, lines)

  // Save accent phrases
  await saveAccentPhrases(baseDir, accentPhrases)

  // Synthesize audio
  const audioBuffer = await synthesizeAudio(speaker, accentPhrases)

  // Save audio file
  await saveAudioFile(outputZipFile, audioBuffer)

  // Unzip the file
  await unzipFile(outputZipFile, tmpDir)

  const fileListPath = path.join(tmpDir, 'filelist.txt')

  // Create file list
  await createFileList(accentPhrases, fileListPath)

  // Concatenate audio files
  await concatenateAudioFiles(fileListPath, outputFile)

  return outputFile
}
