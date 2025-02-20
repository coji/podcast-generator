import { href, Link } from 'react-router'
import type { Route } from './+types/route'

export const handle = {
  breadcrumbs: ({ params }: { params: Route.LoaderArgs['params'] }) => (
    <Link to={href('/:podcast/episodes', { podcast: params.podcast })}>
      エピソード
    </Link>
  ),
}
