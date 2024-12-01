import { data, NavLink, Outlet, useFetcher } from 'react-router'
import { dataWithSuccess } from 'remix-toast'
import { RssEntry } from '~/components/RssEntry'
import { Button, HStack, Stack } from '~/components/ui'
import type { Route } from './+types/route'
import { syncRssEntries } from './functions.server'
import { getPodcast, listRssEntries } from './queries.server'

export const loader = async ({ params }: Route.LoaderArgs) => {
  const podcast = await getPodcast(params.podcast)
  const entries = await listRssEntries(podcast.id)
  return { podcast, entries }
}

export const action = async ({ params }: Route.ActionArgs) => {
  if (!params.podcast) {
    throw data('Not Found', { status: 404 })
  }
  const { added, updated } = await syncRssEntries(params.podcast)
  return dataWithSuccess(
    { success: true },
    {
      message: 'sync succeded',
      description: `added: ${added.length}, updated: ${updated.length}`,
    },
  )
}

export default function PodcastManager({
  loaderData: { podcast, entries },
}: Route.ComponentProps) {
  const fetcher = useFetcher<typeof action>()

  return (
    <div className="grid overflow-hidden md:grid-cols-[300px,minmax(0,1fr)]">
      <Stack className="overflow-y-auto pr-4">
        <HStack>
          <h2 className="flex-1 text-xl font-semibold">Feed Entries</h2>
          <fetcher.Form method="POST">
            <Button
              size="sm"
              variant="outline"
              isLoading={fetcher.state === 'submitting'}
            >
              Sync
            </Button>
          </fetcher.Form>
        </HStack>

        {entries.map((entry) => (
          <NavLink
            key={entry.id}
            to={entry.id}
            preventScrollReset
            className="group"
          >
            <RssEntry
              entry={entry}
              feedTitle={entry.RssFeed.title}
              className="group-aria-[current]:bg-accent group-aria-[current]:text-accent-foreground"
            />
          </NavLink>
        ))}
      </Stack>

      <Stack className="overflow-auto">
        <Outlet />
      </Stack>
    </div>
  )
}
