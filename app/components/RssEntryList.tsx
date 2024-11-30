import { TZDate } from '@date-fns/tz'
import { format } from 'date-fns'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Stack,
} from './ui'

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
    <Stack>
      {entries?.map((entry) => (
        <Card key={entry.link}>
          <CardHeader>
            <CardTitle>{entry.title}</CardTitle>
            <CardDescription>
              {format(
                new TZDate(entry.pubDate, 'Asia/Tokyo'),
                'yyyy-MM-dd HH:mm',
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => onSelect(entry)}>
              Generate Script
            </Button>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}
