import { TZDate } from '@date-fns/tz'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Badge, Card, CardContent, CardHeader, CardTitle, HStack } from './ui'

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
      <CardHeader>
        <HStack>
          <div className="flex-1 text-sm">
            {format(
              new TZDate(entry.publishedAt, 'Asia/Tokyo'),
              'yyyy-MM-dd(ccc) HH:mm',
              { locale: ja },
            )}
          </div>

          <div>{entry.isNew && <Badge variant="secondary">New</Badge>}</div>
        </HStack>
        <CardTitle className="line-clamp-1">{entry.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="font-light">{feedTitle}</div>
      </CardContent>
    </Card>
  )
}
