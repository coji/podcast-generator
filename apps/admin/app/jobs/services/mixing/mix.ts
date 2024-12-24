// src/mix/index.ts

import { exec } from 'node:child_process'
import path from 'node:path'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

export const getAudioDuration = async (
  inputAudioFile: string,
): Promise<number> => {
  const { stdout } = await execAsync(
    `ffprobe -i ${inputAudioFile} -hide_banner -show_format -v quiet`,
  )
  const durationMatch = stdout.match(/duration=([\d.]+)/)
  if (!durationMatch) {
    throw new Error('Could not determine the duration of the input audio')
  }
  return Number.parseFloat(durationMatch[1])
}

export const adjustBgmVolume = async (
  bgmFile: string,
  bgmDuration: number,
  tmpDir: string,
): Promise<string> => {
  const bgmAdjustedFile = path.join(tmpDir, 'adjusted_bgm.mp3')
  await execAsync(
    `ffmpeg -y -hide_banner -stream_loop -1 -i ${bgmFile} -t ${bgmDuration} -filter_complex "[0:a]volume='if(lt(t,15),1,if(lt(t,${bgmDuration - 15}),max(1-(t-15)/5,0.1),max((${bgmDuration}-t)/15*0.1,0)))':eval=frame [bgm]" -map "[bgm]" ${bgmAdjustedFile}`,
  )
  return bgmAdjustedFile
}

export const mixAudio = async (
  inputAudioFile: string,
  bgmAdjustedFile: string,
  outputAudioFile: string,
): Promise<void> => {
  await execAsync(
    `ffmpeg -y -hide_banner -i ${inputAudioFile} -i ${bgmAdjustedFile} -filter_complex "[0:a]adelay=15000|15000[delayed_main];[1:a][delayed_main]amix=inputs=2:duration=longest[a]" -map "[a]" ${outputAudioFile}`,
  )
}
