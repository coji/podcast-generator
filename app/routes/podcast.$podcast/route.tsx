import { Outlet } from 'react-router'
import { HStack } from '~/components/ui'
import type { Route } from './+types/route'
import { getPodcast } from './queries.server'

export const loader = async ({ params }: Route.LoaderArgs) => {
  const podcast = await getPodcast(params.podcast)
  return { podcast }
}

export default function PodcastLayout({
  loaderData: { podcast },
}: Route.ComponentProps) {
  return (
    <div className="grid h-dvh grid-cols-1 grid-rows-[auto,1fr]">
      <header className="px-4 py-2">
        <HStack>
          <h1 className="flex-1 text-2xl font-bold">Podcast Manager</h1>
          <div>{podcast.title}</div>
        </HStack>
      </header>

      <main className="grid gap-4 overflow-hidden bg-gray-100 px-4 py-2 md:grid-cols-[minmax(0,300px),minmax(0,1fr)]">
        <Outlet />
      </main>
    </div>
  )
}
