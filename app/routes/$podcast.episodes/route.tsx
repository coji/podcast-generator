import { Link, Outlet } from 'react-router'
import { Button, HStack } from '~/components/ui'

export default function EpisodesPage() {
  return (
    <div className="grid gap-2 md:grid-cols-[300px,1fr]">
      <div className="relative overflow-y-auto md:pr-4">
        <HStack className="sticky top-0 bg-slate-200 pb-2">
          <h2 className="flex-1 text-xl font-semibold">Episodes</h2>
          <div>
            <Button type="button" size="sm" variant="link" asChild>
              <Link to="add">Add</Link>
            </Button>
          </div>
        </HStack>
      </div>

      <div className="flex flex-col">
        <Outlet />
      </div>
    </div>
  )
}
