import { data } from 'react-router'
import type { Route } from './+types/route'
import { listRssEntries } from './queries.server'

export const loader = async ({ params }: Route.LoaderArgs) => {
  const sources = await listRssEntries(params.podcast)
  return data({ sources })
}
