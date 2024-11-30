import { Link } from 'react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Stack,
} from '~/components/ui'
import type { Route } from './+types/route'
import { listPodcastChannels } from './queries.server'

export const loader = async () => {
  const channels = await listPodcastChannels('testuser')
  if (channels.length === 1) {
    //    throw redirect(`/podcast/${channels[0].id}/feed`)
  }
  return { channels }
}

export default function IndexPage({
  loaderData: { channels },
}: Route.ComponentProps) {
  return (
    <div>
      <Stack>
        {channels.map((channel) => (
          <Link key={channel.id} to={`/podcast/${channel.id}/feed`}>
            <Card>
              <CardHeader>
                <CardTitle>{channel.title}</CardTitle>
                <CardDescription>
                  {channel.updatedAt.toISOString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{channel.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </Stack>
    </div>
  )
}
