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
      message: '元記事を最新に更新しました',
      description: `${added.length}記事追加, ${updated.length}記事更新`,
    },
  )
}

export default function PodcastManager({
  loaderData: { podcast, entries },
}: Route.ComponentProps) {
  const fetcher = useFetcher<typeof action>()

  return (
    <Stack>
      <HStack>
        <h2 className="text-xl font-semibold">元記事</h2>
        <fetcher.Form method="POST">
          <Button
            size="sm"
            variant="outline"
            isLoading={fetcher.state === 'submitting'}
          >
            更新
          </Button>
        </fetcher.Form>
      </HStack>

      {entries.map((entry) => (
        <Link key={entry.id} to={entry.id} preventScrollReset>
          <RssEntry entry={entry} feedTitle={entry.RssFeed.title} />
        </Link>
      ))}
    </Stack>
  )
}
