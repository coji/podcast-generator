import { Link } from 'react-router'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  HStack,
  Stack,
} from '~/components/ui'
import type { Route } from './+types/route'
import { listEpisodes } from './queries.server'

export const loader = async ({ params }: Route.LoaderArgs) => {
  const episodes = await listEpisodes(params.podcast)
  return { episodes }
}

export default function EpisodesLayout({
  loaderData: { episodes },
}: Route.ComponentProps) {
  return (
    <Stack>
      <HStack className="sticky top-0 bg-slate-200 pb-2">
        <h2 className="flex-1 text-xl font-semibold">エピソード</h2>
        <div>
          <Button type="button" size="sm" variant="link" asChild>
            <Link to="add">追加</Link>
          </Button>
        </div>
      </HStack>

      {episodes.map((episode) => (
        <Card key={episode.id}>
          <CardHeader>
            <HStack className="items-start">
              <div className="flex-1">
                <CardTitle>{episode.title}</CardTitle>
                <CardDescription>{episode.description}</CardDescription>
              </div>
              <div>
                <Badge
                  className="capitalize"
                  variant={
                    episode.state === 'published' ? 'default' : 'outline'
                  }
                >
                  {episode.state}
                </Badge>
              </div>
            </HStack>
          </CardHeader>
          <CardContent>
            {episode.audioUrl && (
              <audio
                controls
                src={episode.audioUrl}
                className="mx-auto text-center"
              />
            )}
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}
