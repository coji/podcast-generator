import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router'
import { useActionData, useLoaderData, useSubmit } from 'react-router'
import { AudioPreview } from '~/components/AudioPreview'
import { RssEntryList } from '~/components/RssEntryList'
import { ScriptEditor } from '~/components/ScriptEditor'
import { Stack } from '~/components/ui'
import type { RssEntry } from '~/utils/rssUtils'
import { getPodcastChannelId, listRssEntries } from './queries'

export const loader = async (args: LoaderFunctionArgs) => {
  const podcastChannel = await getPodcastChannelId('testuser')
  const entries = await listRssEntries(podcastChannel.id)
  return { entries }
}

export const action = async ({ request }: ActionFunctionArgs) => {
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

  return { action: 'unknown' }
}

export default function PodcastManager() {
  const { entries } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const submit = useSubmit()

  const handleSelectEntry = (entry: RssEntry) => {
    submit(
      {
        url: entry.link,
        content: entry.content,
        _action: 'generateScript',
      },
      {
        method: 'POST',
      },
    )
  }

  const handleGenerateEpisode = (script: string) => {
    submit({ script, _action: 'generateAudio' }, { method: 'post' })
  }

  const handlePublishEpisode = () => {
    if (actionData?.audioUrl) {
      submit(
        {
          title: '',
          audioUrl: actionData.audioUrl,
          _action: 'publishEpisode',
        },
        { method: 'post' },
      )
    }
  }

  return (
    <div className="grid min-h-dvh grid-cols-1 grid-rows-[auto,1fr]">
      <header className="px-4 py-2">
        <h1 className="text-2xl font-bold">Podcast Manager</h1>
      </header>

      <main className="grid gap-4 overflow-hidden bg-gray-100 px-4 py-2 md:grid-cols-[minmax(0,300px),minmax(0,1fr)]">
        <Stack className="overflow-y-auto">
          <h2 className="text-xl font-semibold">RSS Entries</h2>
          <RssEntryList
            entries={entries.map((e) => {
              const { publishedAt, rssFeedId, createdAt, updatedAt, ...rest } =
                e
              return { ...rest, pubDate: publishedAt.toISOString() }
            })}
            onSelect={handleSelectEntry}
          />
        </Stack>

        <Stack className="overflow-auto">
          {actionData?.action === 'generateScript' && actionData.content && (
            <ScriptEditor
              key={actionData?.url}
              initialScript={actionData.content}
              onGenerate={handleGenerateEpisode}
            />
          )}

          {actionData?.audioUrl && (
            <AudioPreview
              audioUrl={actionData.audioUrl}
              onPublish={handlePublishEpisode}
            />
          )}
        </Stack>
      </main>
      {/* <PodcastList episodes={podcastEpisodes} /> */}
    </div>
  )
}
