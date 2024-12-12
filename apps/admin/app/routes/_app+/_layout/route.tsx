import { UserButton } from '@clerk/react-router'
import { useEffect } from 'react'
import {
  data,
  Link,
  NavLink,
  Outlet,
  useNavigate,
  useParams,
} from 'react-router'
import { getToast } from 'remix-toast'
import { toast } from 'sonner'
import {
  HStack,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui'
import { requireUser } from '~/services/auth.server'
import type { Route } from './+types/route'
import { listPodcasts } from './queries.server'

export const loader = async (args: Route.LoaderArgs) => {
  const user = await requireUser(args)
  const { toast, headers } = await getToast(args.request)
  const allPodcasts = await listPodcasts()
  return data({ user, toast, allPodcasts }, { headers })
}

export default function PodcastLayout({
  loaderData: { toast: toastData, allPodcasts },
}: Route.ComponentProps) {
  const params = useParams()
  const navigate = useNavigate()
  const podcast = allPodcasts.find((p) => p.slug === params.podcast)

  useEffect(() => {
    if (!toastData) {
      return
    }
    let toastFn = toast.info
    if (toastData.type === 'error') {
      toastFn = toast.error
    } else if (toastData.type === 'success') {
      toastFn = toast.success
    }
    toastFn(toastData.message, {
      description: toastData.description,
      position: 'top-right',
    })
  }, [toastData])

  return (
    <div className="grid min-h-dvh grid-cols-1 grid-rows-[auto,1fr]">
      <header className="px-2 py-1 md:px-4 md:py-2">
        <HStack className="flex-wrap">
          <h1 className="text-2xl font-bold">
            <Link to="/">Podcast Manager</Link>
          </h1>

          <div>
            <Select
              value={podcast?.slug ?? ''}
              onValueChange={(value) => {
                navigate(`/${value}/episodes`)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="ポッドキャスト選択" />
              </SelectTrigger>
              <SelectContent>
                {allPodcasts.map((p) => (
                  <SelectItem key={p.slug} value={p.slug}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1" />

          {podcast && (
            <HStack className="gap-2 rounded-md bg-slate-200 p-1 text-sm font-medium">
              <NavLink
                to={`${podcast.slug}/episodes`}
                className="rounded-md px-3 py-1 ring-offset-background aria-[current]:bg-card aria-[current]:shadow"
              >
                エピソード
              </NavLink>
              <NavLink
                to={`${podcast.slug}/feed`}
                className="rounded-md px-3 py-1 ring-offset-background aria-[current]:bg-card aria-[current]:shadow"
              >
                元記事
              </NavLink>
            </HStack>
          )}

          <UserButton />
        </HStack>
      </header>

      <main
        className="bg-slate-200 px-2 py-1 md:px-4 md:py-2"
        key={podcast?.id}
      >
        <Outlet />
      </main>
    </div>
  )
}
