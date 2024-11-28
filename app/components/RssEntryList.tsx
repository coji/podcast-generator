import { Button } from './ui'

interface RssEntry {
  title: string
  link: string
  content: string
  pubDate: string
}

interface RssEntryListProps {
  entries: RssEntry[]
  onSelect: (entry: RssEntry) => void
}

export function RssEntryList({ entries, onSelect }: RssEntryListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">RSS Entries</h2>
      <ul className="space-y-2">
        {entries?.map((entry) => (
          <li key={entry.link} className="rounded border p-4">
            <h3 className="font-semibold">{entry.title}</h3>
            <a
              className="text-sm text-gray-500 underline"
              href={entry.link}
              target="_blank"
              rel="noreferrer"
            >
              {entry.link}
            </a>
            <p className="text-sm text-gray-500">
              {new Date(entry.pubDate).toLocaleString()}
            </p>
            <Button
              onClick={() => onSelect(entry)}
              className="mt-2 rounded bg-green-500 px-4 py-2 text-white"
            >
              Generate Script
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
