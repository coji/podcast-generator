import { Link, type Params } from 'react-router'

export const handle = {
  breadcrumbs: ({ params }: { params: Params }) => (
    <Link to={`${params.podcast}/feed`}>元記事</Link>
  ),
}
