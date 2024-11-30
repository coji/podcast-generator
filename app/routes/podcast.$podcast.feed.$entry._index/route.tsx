import type { Route } from './+types/route'

export default function EntryIndex({ params }: Route.ComponentProps) {
  return <div>Entry {params.entry}</div>
}
