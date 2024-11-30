import { setTimeout } from 'node:timers/promises'
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router'
import { NavLink, Outlet, useFetcher, useLoaderData } from 'react-router'
import { dataWithSuccess } from 'remix-toast'
import { RssEntry } from '~/components/RssEntry'
import { Button, HStack, Stack } from '~/components/ui'
import { getPodcastChannelId, listRssEntries } from './queries'

export const loader = async (args: LoaderFunctionArgs) => {
  const podcastChannel = await getPodcastChannelId('testuser')
  const entries = await listRssEntries(podcastChannel.id)
  return { entries }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  await setTimeout(1000)
  const formData = await request.formData()
  const action = formData.get('_action')

  if (action === 'generateScript') {
    const url = formData.get('url') as string
    const content = formData.get('content') as string
    return { action: 'generateScript', url, content }
  }

  if (action === 'generateAudio') {
    const script = formData.get('script') as string
    // TODO: Implement text-to-speech API call
    const audioUrl = 'dummy_audio_url.mp3'
    return { action: 'generateAudio', audioUrl }
  }

  if (action === 'publishEpisode') {
    const title = formData.get('title') as string
    const audioUrl = formData.get('audioUrl') as string
    // TODO: Save episode to database
    return { action: 'publishEpisode', success: true }
  }

  return dataWithSuccess({ action: 'unknown' }, { message: 'success!' })
}

export default function PodcastManager() {
  const { entries } = useLoaderData<typeof loader>()
  const fetcher = useFetcher<typeof action>()

  return (
    <div className="grid h-dvh grid-cols-1 grid-rows-[auto,1fr]">
      <header className="px-4 py-2">
        <h1 className="text-2xl font-bold">Podcast Manager</h1>
      </header>

      <main className="grid gap-4 overflow-hidden bg-gray-100 px-4 py-2 md:grid-cols-[minmax(0,300px),minmax(0,1fr)]">
        <Stack className="overflow-y-auto pr-4">
          <HStack>
            <h2 className="flex-1 text-xl font-semibold">Entries</h2>
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
      </main>
    </div>
  )
}
