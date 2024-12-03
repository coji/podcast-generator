import { data, Link, useFetcher } from 'react-router'
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
    <div>
      <HStack className="sticky top-0 bg-slate-200 pb-2">
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

      <Stack>
        {entries.map((entry) => (
          <Link
            key={entry.id}
            to={entry.id}
            preventScrollReset
            className="group"
          >
            <RssEntry entry={entry} feedTitle={entry.RssFeed.title} />
          </Link>
        ))}
      </Stack>
    </div>
  )
}
