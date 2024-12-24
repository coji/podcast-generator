// src/synthesize/api.ts

import { fetchArrayBuffer, postRequest } from '../../infrastructure/apiClient'
import type { AccentPhrases } from './types'

const AUDIO_QUERY_URL = 'http://localhost:10101/audio_query'
const SYNTHESIS_URL = 'http://localhost:10101/multi_synthesis'

export const fetchAccentPhrases = async (
  speaker: string,
  lines: string[],
): Promise<AccentPhrases[]> => {
  const accentPhrases: AccentPhrases[] = []
  for (const line of lines) {
    const queryParams = new URLSearchParams({ speaker, text: line })
    const phrase = await postRequest<AccentPhrases>(
      `${AUDIO_QUERY_URL}?${queryParams.toString()}`,
      {},
    )
    accentPhrases.push(phrase)
  }
  return accentPhrases
}

export const synthesizeAudio = async (
  speaker: string,
  accentPhrases: AccentPhrases[],
): Promise<ArrayBuffer> => {
  const synthesisResponse = await fetchArrayBuffer(
    `${SYNTHESIS_URL}?speaker=${speaker}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(accentPhrases),
    },
  )
  return synthesisResponse
}
