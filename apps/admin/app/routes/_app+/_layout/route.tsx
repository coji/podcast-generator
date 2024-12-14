import {
  ClerkLoaded,
  OrganizationSwitcher,
  UserButton,
} from '@clerk/react-router'
import { AudioLinesIcon, NewspaperIcon, PodcastIcon } from 'lucide-react'
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
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '~/components/ui'
import { requireUser } from '~/services/auth.server'
import type { Route } from './+types/route'
import { listPodcasts } from './queries.server'

export const loader = async (args: Route.LoaderArgs) => {
  const user = await requireUser(args)
  const { toast, headers } = await getToast(args.request)
  const allPodcasts = user.orgId ? await listPodcasts(user.orgId) : []
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
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <h1 className="text-lg font-medium">
            <Link to="/">Podcast Manager</Link>
          </h1>

          <div className="h-7">
            <ClerkLoaded>
              <OrganizationSwitcher
                afterSelectOrganizationUrl="/"
                hidePersonal={true}
                appearance={{
                  elements: {
                    rootBox: 'w-full',
                    organizationSwitcherTrigger: 'flex-1',
                    organizationPreview: 'flex-1',
                    organizationPreviewTextContainer: 'flex-1',
                  },
                }}
              />
            </ClerkLoaded>
          </div>

          <HStack className="w-full">
            <Label htmlFor="podcast-select">
              <PodcastIcon size="16" />
            </Label>
            <Select
              value={podcast?.slug ?? ''}
              onValueChange={(value) => {
                navigate(`/${value}/episodes`)
              }}
            >
              <SelectTrigger id="podcast-select" className="whitespace-normal">
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
          </HStack>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Contenet</SidebarGroupLabel>
            <SidebarGroupContent>
              {podcast && (
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={`${podcast.slug}/episodes`}
                        className="aria-[current=page]:bg-primary aria-[current=page]:text-white"
                      >
                        <AudioLinesIcon /> エピソード
                      </NavLink>
                    </SidebarMenuButton>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={`${podcast.slug}/feed`}
                        className="aria-[current=page]:bg-primary aria-[current=page]:text-white"
                      >
                        <NewspaperIcon />
                        元記事
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className="h-7">
            <ClerkLoaded>
              <UserButton
                showName
                appearance={{
                  elements: {
                    rootBox: 'w-full',
                    userButtonTrigger: 'flex-1',
                  },
                }}
              />
            </ClerkLoaded>
          </div>
        </SidebarFooter>
      </Sidebar>

      <main className="w-full px-2 py-1 md:px-4 md:py-2" key={podcast?.id}>
        <SidebarTrigger className="h-4 w-4" />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
