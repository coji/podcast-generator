import { href, Link, redirect } from 'react-router'
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
  const user = await requireUser(args)
  const podcasts = user.orgId ? await listPodcasts(user.orgId) : []
  if (podcasts.length === 1) {
    // Redirect to the only podcast if there is only one
    throw redirect(href('/:podcast/episodes', { podcast: podcasts[0].slug }))
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
