import fs from 'node:fs/promises'
import path from 'node:path'
import { $ } from 'zx'

const tmpdir = './data/tmp'
await fs.mkdir(tmpdir, { recursive: true })

export const mixBgm = async (inputAudioFile: string, bgmAudioFile: string) => {
  // Get the duration of the input audio using ffprobe
  const { stdout } =
    await $`ffprobe -i ${inputAudioFile} -hide_banner -show_format -v quiet`
  const durationMatch = stdout.match(/duration=([\d.]+)/)
  if (!durationMatch) {
    throw new Error('Could not determine the duration of the input audio')
  }

  const length = Number.parseFloat(durationMatch[1])
  const bgmDuration = length + 30
  const bgmAdjustedFile = 'adjusted_bgm.mp3'
  const outputAudioFile = `${path.basename(inputAudioFile, '.wav')}_publish.mp3`

  await $`ffmpeg -y -stream_loop -1 -i admel_theme_song.mp3 -t ${bgmDuration} -filter_complex "[0:a]volume='if(lt(t,15),1,if(lt(t,${
    bgmDuration - 15
  }),max(1-(t-15)/5,0.1),max(((${bgmDuration}-t)/15*0.1),0)))':eval=frame [bgm]" -map "[bgm]" ${bgmAdjustedFile}`
  await $`ffmpeg -y -i ${inputAudioFile} -i adjusted_bgm.mp3 -filter_complex "[0:a]adelay=15000|15000[delayed_main];[1:a][delayed_main]amix=inputs=2:duration=longest[a]"  -map "[a]" ${outputAudioFile}`

  return outputAudioFile
}
