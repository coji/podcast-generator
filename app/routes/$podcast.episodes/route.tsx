import { Button, HStack } from '~/components/ui'

export default function EpisodesPage() {
  return (
    <div>
      <HStack>
        <h2 className="flex-1">Episodes</h2>
        <div>
          <Button size="sm" variant="default">
            Add
          </Button>
        </div>
      </HStack>
    </div>
  )
}
