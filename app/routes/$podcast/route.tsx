import { Link, NavLink, Outlet } from 'react-router'
import {
  HStack,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui'
import type { Route } from './+types/route'
import { listPodcasts } from './queries.server'

export const loader = async ({ params }: Route.LoaderArgs) => {
  const allPodcasts = await listPodcasts()
  const podcast = allPodcasts.find((p) => p.slug === params.podcast)
  return { allPodcasts, podcast }
}

export default function PodcastLayout({
  loaderData: { allPodcasts, podcast },
}: Route.ComponentProps) {
  return (
    <div className="grid min-h-dvh grid-cols-1 grid-rows-[auto,1fr]">
      <header className="px-4 py-2">
        <HStack>
          <h1 className="flex-1 text-2xl font-bold">
            <Link to="/">Podcast Manager</Link>
          </h1>

          <div>
            <Select defaultValue={podcast?.id}>
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

          <HStack className="gap-2 rounded-md bg-slate-200 p-1 text-sm font-medium">
            <NavLink
              to="episodes"
              className="rounded-md px-3 py-1 ring-offset-background aria-[current]:bg-card aria-[current]:shadow"
            >
              エピソード
            </NavLink>
            <NavLink
              to="feed"
              className="rounded-md px-3 py-1 ring-offset-background aria-[current]:bg-card aria-[current]:shadow"
            >
              元記事
            </NavLink>
          </HStack>
        </HStack>
      </header>

      <main className="bg-slate-200 px-4 py-2">
        <Outlet />
      </main>
    </div>
  )
}
