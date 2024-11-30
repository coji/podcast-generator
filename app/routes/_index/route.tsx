import { Link } from 'react-router'
import { Stack } from '~/components/ui'
import type { Route } from './+types/route'
import { listPodcastChannels } from './queries.server'

export const loader = async () => {
  const channels = await listPodcastChannels('testuser')
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
            {channel.title}
          </Link>
        ))}
      </Stack>
    </div>
  )
}
