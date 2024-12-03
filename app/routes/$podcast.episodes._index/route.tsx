import { Link } from 'react-router'
import { Button, HStack, Stack } from '~/components/ui'

export default function EpisodesLayout() {
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
    </Stack>
  )
}
