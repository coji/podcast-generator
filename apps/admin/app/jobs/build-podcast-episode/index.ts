import fs from 'node:fs/promises'
import { uploadFromFile } from '~/services/r2.server'
import { mixBgm } from './mix'
import { updateEpisodeAudioPublished } from './mutations.server'
import { synthesizeSpeech } from './synthesize'

export const generatePodcastAudio = async ({
  speaker,
  text,
  organizationId,
  podcastSlug,
  episodeId,
}: {
  speaker: string
  text: string
  organizationId: string
  podcastSlug: string
  episodeId: string
}) => {
  const jobId = crypto.randomUUID()

  const tmpdir = './data/tmp'
  await fs.mkdir(tmpdir, { recursive: true })

  // Synthesize speech
  console.log('Synthesizing speech...')
  const speechFile = await synthesizeSpeech(
    speaker,
    text,
    organizationId,
    podcastSlug,
  )

  // Mix speech with background music
  console.log('Mixing speech with background music...', podcastSlug)
  const bgmFile = 'admel_theme_song.mp3'
  const { outputAudioFile, audioDuration, audioLength } = await mixBgm({
    inputAudioFile: speechFile,
    bgmAudioFile: bgmFile,
    organizationId,
    podcastSlug,
  })

  console.log('Mixed audio file:', outputAudioFile)
  const fileName = `episode-${episodeId}.mp3`
  await uploadFromFile(podcastSlug, fileName, outputAudioFile)
  const audioUrl = new URL(
    `/${podcastSlug}/${fileName}`,
    process.env.R2_PUBLIC_BASE_URL,
  ).toString()

  console.log('Uploaded file URL:', audioUrl)

  // episode の audio 関連のフィールドを更新し、published にする
  await updateEpisodeAudioPublished({
    episodeId,
    audioDuration: audioDuration,
    audioUrl,
    audioLength,
  })

  return { audioUrl, audioDuration, audioLength, jobId }
}
