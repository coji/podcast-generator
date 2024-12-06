interface PodcastEpisode {
  id: string
  title: string
  audioUrl: string
  publishDate: string
}

interface PodcastListProps {
  episodes: PodcastEpisode[]
}

export function PodcastList({ episodes }: PodcastListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Podcast Episodes</h2>
      <ul className="space-y-2">
        {episodes?.map((episode) => (
          <li key={episode.id} className="rounded border p-4">
            <h3 className="font-semibold">{episode.title}</h3>
            <p className="text-sm text-gray-500">
              {new Date(episode.publishDate).toLocaleString()}
            </p>
            <audio controls src={episode.audioUrl} className="mt-2 w-full" />
          </li>
        ))}
      </ul>
    </div>
  )
}
