export interface Episode {
  id: string
  audioDuration: number
  audioUrl: string
  audioLength: number
  state: 'draft' | 'published'
}
