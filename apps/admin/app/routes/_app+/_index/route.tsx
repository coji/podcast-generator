import { Link, redirect } from 'react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Stack,
} from '~/components/ui'
import { requireUser } from '~/services/auth.server'
import type { Route } from './+types/route'
import { listPodcasts } from './queries.server'

export const loader = async (args: Route.LoaderArgs) => {
  await requireUser(args.request)
  const podcasts = await listPodcasts('testuser')
  if (podcasts.length === 1) {
    throw redirect(`/podcast/${podcasts[0].id}/feed`)
  }
  return { podcasts }
}

export default function IndexPage({
  loaderData: { podcasts },
}: Route.ComponentProps) {
  return (
    <div>
      <Stack>
        {podcasts.map((podcast) => (
          <Link key={podcast.id} to={`/${podcast.slug}/episodes`}>
            <Card>
              <CardHeader>
                <CardTitle>{podcast.title}</CardTitle>
                <CardDescription>
                  {podcast.updatedAt.toISOString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{podcast.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </Stack>
    </div>
  )
}
