import { Outlet } from 'react-router'
import {
  HStack,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui'
import type { Route } from './+types/route'
import { getPodcast, listPodcasts } from './queries.server'

export const loader = async ({ params }: Route.LoaderArgs) => {
  const allPodcasts = await listPodcasts()
  const podcast = await getPodcast(params.podcast)
  return { allPodcasts, podcast }
}

export default function PodcastLayout({
  loaderData: { allPodcasts, podcast },
}: Route.ComponentProps) {
  return (
    <div className="grid h-dvh grid-cols-1 grid-rows-[auto,1fr]">
      <header className="px-4 py-2">
        <HStack>
          <h1 className="flex-1 text-2xl font-bold">Podcast Manager</h1>

          <div>
            <Select defaultValue={podcast.id}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allPodcasts.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </HStack>
      </header>

      <main className="grid overflow-hidden bg-gray-100 px-4 py-2 md:grid-cols-[minmax(0,300px),minmax(0,1fr)]">
        <Outlet />
      </main>
    </div>
  )
}
