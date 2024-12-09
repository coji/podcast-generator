import type { AccentPhrases } from './types'

// Utility function to fetch accent phrases
export const fetchAccentPhrases = async (
  speaker: string,
  lines: string[],
): Promise<AccentPhrases[]> => {
  const accentPhrases: AccentPhrases[] = []
  for (const line of lines) {
    const queryParams = new URLSearchParams({ speaker, text: line })
    const queryResponse = await fetch(
      `http://localhost:10101/audio_query?${queryParams.toString()}`,
      { method: 'POST' },
    )
    if (!queryResponse.ok) {
      throw new Error(queryResponse.statusText)
    }
    const phrase: AccentPhrases = await queryResponse.json()
    accentPhrases.push(phrase)
  }
  return accentPhrases
}

// Utility function to synthesize audio
export const synthesizeAudio = async (
  speaker: string,
  accentPhrases: AccentPhrases[],
): Promise<ArrayBuffer> => {
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
  return await synthesisResponse.arrayBuffer()
}
