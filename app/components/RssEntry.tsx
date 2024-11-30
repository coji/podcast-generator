import { TZDate } from '@date-fns/tz'
import { format } from 'date-fns'
import { Card, CardDescription, CardHeader, CardTitle, Stack } from './ui'

interface RssEntry {
  id: string
  title: string
  link: string
  content: string
  publishedAt: Date
}

interface RssEntryProps {
  entry: RssEntry
  feedTitle: string
}

export function RssEntry({ entry, feedTitle }: RssEntryProps) {
  return (
    <Card key={entry.id}>
      <CardHeader className="p-2">
        <CardDescription>
          {format(
            new TZDate(entry.publishedAt, 'Asia/Tokyo'),
            'yyyy-MM-dd HH:mm',
          )}
        </CardDescription>
        <CardTitle>
          <Stack>
            <div className="line-clamp-1">{entry.title}</div>
            <div className="font-light text-muted-foreground">{feedTitle}</div>
          </Stack>
        </CardTitle>
      </CardHeader>
    </Card>
  )
}
