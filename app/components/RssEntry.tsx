import { TZDate } from '@date-fns/tz'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import {
  Badge,
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
  publishedAt: Date
  isNew: boolean
}

interface RssEntryProps extends React.ComponentPropsWithoutRef<typeof Card> {
  entry: RssEntry
  feedTitle: string
}

export function RssEntry({ entry, feedTitle, className }: RssEntryProps) {
  return (
    <Card key={entry.id} className={className}>
      <CardHeader className="p-2">
        <HStack>
          <CardDescription className="flex-1">
            {format(
              new TZDate(entry.publishedAt, 'Asia/Tokyo'),
              'yyyy-MM-dd(ccc) HH:mm',
              { locale: ja },
            )}
          </CardDescription>

          <div>{entry.isNew && <Badge variant="default">New</Badge>}</div>
        </HStack>
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
