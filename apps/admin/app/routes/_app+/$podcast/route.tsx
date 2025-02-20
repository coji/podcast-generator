import { href, Link, Outlet } from 'react-router'
import type { Route } from './+types/route'

export const handle = {
  breadcrumbs: ({ params }: { params: Route.LoaderArgs['params'] }) => (
    <Link to={href('/:podcast', { podcast: params.podcast })}>
      {params.podcast}
    </Link>
  ),
}

export default function PodcastLayout() {
  return <Outlet />
}
