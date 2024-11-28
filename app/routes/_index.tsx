import { useState } from 'react'
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router'
import { useActionData, useLoaderData, useSubmit } from 'react-router'
import { AudioPreview } from '~/components/AudioPreview'
import { PodcastList } from '~/components/PodcastList'
import { RssEntryList } from '~/components/RssEntryList'
import { RssFeedInput } from '~/components/RssFeedInput'
import { ScriptEditor } from '~/components/ScriptEditor'
import { fetchRssFeed, type RssEntry } from '~/utils/rssUtils'

export const loader = async (args: LoaderFunctionArgs) => {
  const url = 'https://momo19nam.hatenablog.jp/rss'
  const entries = await fetchRssFeed(url)

  return { action: 'fetchRss', entries }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const action = formData.get('_action')

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
}

export default function PodcastManager() {
  const { podcastEpisodes, entries } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const submit = useSubmit()

  const [selectedEntry, setSelectedEntry] = useState<RssEntry | null>(null)
  const [generatedScript, setGeneratedScript] = useState('')

  const handleFetchRss = (url: string) => {
    submit({ url, _action: 'fetchRss' }, { method: 'post' })
  }

  const handleSelectEntry = (entry: RssEntry) => {
    setSelectedEntry(entry)
    setGeneratedScript(entry.content)
  }

  const handleGenerateEpisode = (script: string) => {
    submit({ script, _action: 'generateAudio' }, { method: 'post' })
  }

  const handlePublishEpisode = () => {
    if (selectedEntry && actionData?.audioUrl) {
      submit(
        {
          title: selectedEntry.title,
          audioUrl: actionData.audioUrl,
          _action: 'publishEpisode',
        },
        { method: 'post' },
      )
    }
  }

  return (
    <div className="container mx-auto space-y-8 p-4">
      <h1 className="text-3xl font-bold">Podcast Manager</h1>
      <RssFeedInput onFetch={handleFetchRss} />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <RssEntryList entries={entries} onSelect={handleSelectEntry} />

        {selectedEntry && (
          <ScriptEditor
            initialScript={generatedScript}
            onGenerate={handleGenerateEpisode}
          />
        )}
        {actionData?.audioUrl && (
          <AudioPreview
            audioUrl={actionData.audioUrl}
            onPublish={handlePublishEpisode}
          />
        )}
      </div>
      <PodcastList episodes={podcastEpisodes} />
    </div>
  )
}
