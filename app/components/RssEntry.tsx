import { TZDate } from '@date-fns/tz'
import { format } from 'date-fns'
import { Card, CardDescription, CardHeader, CardTitle } from './ui'

interface RssEntry {
  id: string
  title: string
  link: string
  content: string
  publishedAt: Date
}

interface RssEntryProps {
  entry: RssEntry
}

export function RssEntry({ entry }: RssEntryProps) {
  return (
    <Card key={entry.id}>
      <CardHeader className="p-2">
        <CardDescription>
          {format(
            new TZDate(entry.publishedAt, 'Asia/Tokyo'),
            'yyyy-MM-dd HH:mm',
          )}
        </CardDescription>
        <CardTitle className="line-clamp-1">{entry.title}</CardTitle>
      </CardHeader>
    </Card>
  )
}
