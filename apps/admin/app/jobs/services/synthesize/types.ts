// src/synthesize/types.ts

export interface Moras {
  text: string
  consonant: string
  consonant_length: number
  vowel: string
  vowel_length: number
  pitch: number
}

export interface AccentPhraseDetail {
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

export interface AccentPhrases {
  accent_phrases: AccentPhraseDetail[]
}
