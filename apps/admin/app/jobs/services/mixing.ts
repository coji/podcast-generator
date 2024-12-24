// src/services/mixing.ts

import fs from 'node:fs/promises'
import path from 'node:path'
import type { Podcast } from '../domain/podcast'
import { adjustBgmVolume, getAudioDuration, mixAudio } from './mixing/mix'

export interface MixedAudio {
  outputAudioFile: string
  audioDuration: number
  audioLength: number
}

export const mixBgm = async (
  inputAudioFile: string,
  bgmAudioFile: string,
  podcast: Podcast,
): Promise<MixedAudio> => {
  const baseDir = path.join(
    './data',
    podcast.organizationId,
    podcast.podcastSlug,
  )
  const tmpDir = path.join(baseDir, 'tmp')
  const bgmDir = path.join('./data', podcast.organizationId, 'bgm')
  const outputDir = path.join(baseDir, 'publish')

  const length = await getAudioDuration(inputAudioFile)
  const bgmDuration = length + 30
  const bgmFilePath = path.join(bgmDir, bgmAudioFile)
  const bgmAdjustedFile = await adjustBgmVolume(
    bgmFilePath,
    bgmDuration,
    tmpDir,
  )
  const outputAudioFile = path.join(
    outputDir,
    `${path.basename(inputAudioFile, path.extname(inputAudioFile))}_publish.mp3`,
  )

  // Perform mixing
  await mixAudio(inputAudioFile, bgmAdjustedFile, outputAudioFile)

  const stats = await fs.stat(outputAudioFile)
  const audioLength = stats.size

  return { outputAudioFile, audioDuration: bgmDuration, audioLength }
}
