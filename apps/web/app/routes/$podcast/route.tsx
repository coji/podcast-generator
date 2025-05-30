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
      <header className={cn('text-center', isTopLevel ? 'pt-32 pb-8' : 'py-8')}>
        <Stack className="gap-8">
          <div
            className={cn(
              'grid place-items-center',
              podcast.image ? 'grid-cols-[1fr_auto]' : 'grid-cols-1',
            )}
          >
            <Link to={`/${podcast.slug}`} viewTransition>
              <h2
                className="px-8 text-2xl font-semibold hover:underline"
                style={{
                  viewTransitionName: 'title',
                }}
              >
                {podcast.title}
              </h2>
            </Link>

            {podcast.image && (
              <img
                src={podcast.image}
                alt={podcast.title}
                className="mx-auto h-32 w-32 rounded-md"
                style={{
                  viewTransitionName: 'cover',
                }}
              />
            )}
          </div>

          {podcast.spotifyUrl && (
            <div className="text-center">
              <a href={podcast.spotifyUrl} target="_blank" rel="noreferrer">
                <img
                  src="/listen-on-spotify-badge.png"
                  alt="Listen on Spotify"
                  className="mx-auto h-12"
                  style={{ viewTransitionName: 'spotify-badge' }}
                />
              </a>
            </div>
          )}
        </Stack>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="pt-32 pb-4 text-center text-sm">
        Copyright &copy; {new Date().getFullYear()} TechTalk
      </footer>
    </Stack>
  )
}
