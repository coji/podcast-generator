import { TZDate } from '@date-fns/tz'
import { format } from 'date-fns'
import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  HStack,
  Stack,
} from './ui'

interface RssEntry {
  id: string
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
        <Card key={entry.id}>
          <CardHeader className="p-2">
            <HStack>
              <div className="flex-1">
                <CardDescription>
                  {format(
                    new TZDate(entry.pubDate, 'Asia/Tokyo'),
                    'yyyy-MM-dd HH:mm',
                  )}
                </CardDescription>
                <CardTitle className="line-clamp-1">{entry.title}</CardTitle>
              </div>
              <div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSelect(entry)}
                >
                  Details
                </Button>
              </div>
            </HStack>
          </CardHeader>
        </Card>
      ))}
    </Stack>
  )
}
