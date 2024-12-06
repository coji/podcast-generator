import { data, Link, Outlet, useLocation } from 'react-router'
import { Stack } from '~/components/ui'
import { cn } from '~/lib/utils'
import type { Route } from './+types/route'
import { getPodcast } from './queries.server'

export const loader = async ({ params }: Route.LoaderArgs) => {
  const podcast = await getPodcast(params.podcast)
  if (!podcast) {
    throw data(null, { status: 404 })
  }
  return { podcast }
}

export default function PodcastLayout({
  loaderData: { podcast },
}: Route.ComponentProps) {
  const location = useLocation()
  const isTopLevel =
    location.pathname === `/${podcast.slug}` ||
    location.pathname === `/${podcast.slug}/`

  return (
    <Stack className="mx-auto max-w-lg px-2 py-2 md:px-4">
      <header className={cn('text-center', isTopLevel ? 'py-32' : 'py-8')}>
        <Link to={`/${podcast.slug}`} viewTransition>
          <h2
            className="text-2xl font-semibold"
            style={{
              viewTransitionName: 'title',
            }}
          >
            {podcast.title}
          </h2>
        </Link>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="pb-4 pt-32 text-center text-sm">
        Copyright &copy; {new Date().getFullYear()} {podcast.User.name}{' '}
      </footer>
    </Stack>
  )
}
