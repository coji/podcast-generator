// src/services/upload.ts

import { uploadFromFile } from '~/services/r2.server'
import type { Podcast } from '../domain/podcast'

export const uploadAudio = async (
  podcast: Podcast,
  fileName: string,
  filePath: string,
): Promise<string> => {
  await uploadFromFile(podcast.podcastSlug, fileName, filePath)
  const audioUrl = new URL(
    `/${podcast.podcastSlug}/${fileName}`,
    process.env.R2_PUBLIC_BASE_URL,
  ).toString()
  return audioUrl
}
