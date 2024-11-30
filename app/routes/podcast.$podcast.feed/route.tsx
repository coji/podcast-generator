import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router'
import { data, NavLink, Outlet, useFetcher, useLoaderData } from 'react-router'
import { dataWithSuccess } from 'remix-toast'
import { RssEntry } from '~/components/RssEntry'
import { Button, HStack, Stack } from '~/components/ui'
import { syncRssEntries } from './functions.server'
import { getPodcastChannelId, listRssEntries } from './queries.server'

export const loader = async (args: LoaderFunctionArgs) => {
  const podcastChannel = await getPodcastChannelId('testuser')
  const entries = await listRssEntries(podcastChannel.id)
  return { entries }
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  if (!params.podcast) {
    throw data('Not Found', { status: 404 })
  }
  const { added, updated } = await syncRssEntries(params.podcast)
  return dataWithSuccess(
    { success: true },
    {
      message: 'sync success',
      description: `added: ${added.length}, updated: ${updated.length}`,
    },
  )
}

export default function PodcastManager() {
  const { entries } = useLoaderData<typeof loader>()
  const fetcher = useFetcher<typeof action>()

  return (
    <>
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
          <NavLink key={entry.id} to={entry.id} preventScrollReset>
            <RssEntry entry={entry} />
          </NavLink>
        ))}
      </Stack>

      <Stack className="overflow-auto">
        <Outlet />
      </Stack>
    </>
  )
}
