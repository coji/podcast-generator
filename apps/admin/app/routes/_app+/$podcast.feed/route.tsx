import { href, Link } from 'react-router'
import type { Route } from './+types/route'

export const handle = {
  breadcrumbs: ({ params }: { params: Route.LoaderArgs['params'] }) => (
    <Link to={href('/:podcast/feed', { podcast: params.podcast })}>元記事</Link>
  ),
}
