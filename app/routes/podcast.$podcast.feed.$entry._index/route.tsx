import { Button, Stack, Textarea } from '~/components/ui'
import type { Route } from './+types/route'
import { getEntry } from './queries.server'

export const loader = async ({ params }: Route.LoaderArgs) => {
  const entry = await getEntry(params.entry)
  return { entry }
}

export default function EntryIndex({
  loaderData: { entry },
}: Route.ComponentProps) {
  return (
    <Stack className="h-full px-2" key={entry.id}>
      <div>{entry.title}</div>
      <Textarea defaultValue={entry.content} className="flex-1" />
      <div>
        <Button>hoge</Button>
      </div>
    </Stack>
  )
}
