import { z } from 'zod'

export const requestSchema = z.object({
  entryIds: z.array(z.string()),
})

export const responseSchema = z.object({
  publishedAt: z.date(),
  title: z.string(),
  description: z.string(),
  manuscript: z.string(),
})
