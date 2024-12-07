import { list } from '~/services/r2.server'
import type { Route } from './+types/test'

export const loader = async (args: Route.LoaderArgs) => {
  const items = await list()

  return Response.json({ items })
}
