import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { XIcon } from 'lucide-react'
import * as React from 'react'
import { useFetcher } from 'react-router'
import {
  Button,
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  HStack,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '~/components/ui'
import type { loader } from './route'

type Option = { id: string; title: string; publishedAt: Date }

export function SourceSelector({
  id,
  podcastSlug,
  selected,
  placeholder,
  name,
  onChangeSelected,
}: {
  id?: string
  podcastSlug: string
  selected: Option[]
  placeholder?: string
  name?: string
  onChangeSelected?: (selected: Option[]) => void
}) {
  const [open, setOpen] = React.useState<boolean>(false)
  const fetcher = useFetcher<typeof loader>()

  const handleUnselect = React.useCallback(
    (option: Option) => {
      onChangeSelected?.([...selected].filter((s) => s.id !== option.id))
    },
    [onChangeSelected, selected],
  )

  const selectables =
    fetcher.data?.sources.filter(
      (source) => !selected.some((s) => s.id === source.id),
    ) ?? []

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    fetcher.load(`/${podcastSlug}/feed/selector`)
  }, [])

  return (
    <Stack className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger id={id} asChild>
          <Button
            type="button"
            variant="outline"
            className="text-sm"
            onClick={() => setOpen(true)}
          >
            {selected.length === 0
              ? (placeholder ?? 'エピソード元記事を選択')
              : `${selected.length} 記事選択済`}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="min-w-[350px]">
          <Command>
            <CommandList>
              {open && selectables.length > 0 && (
                <CommandGroup>
                  {selectables.map((option) => {
                    return (
                      <CommandItem
                        key={option.id}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onSelect={(value) => {
                          onChangeSelected?.([...selected, option])
                          setOpen(false)
                        }}
                        className={'grid cursor-pointer grid-cols-[100px_1fr]'}
                      >
                        <div className="text-muted-foreground mr-2 text-xs font-medium">
                          {format(option.publishedAt, 'yyyy-MM-dd(ccc)', {
                            locale: ja,
                          })}
                        </div>
                        <div>{option.title}</div>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableBody>
              {selected.map((option) => (
                <TableRow key={option.id}>
                  <TableCell>
                    <HStack>
                      <div className="flex-1">
                        <span className="text-muted-foreground mr-2 text-xs font-medium">
                          {format(option.publishedAt, 'yyyy-MM-dd(ccc)', {
                            locale: ja,
                          })}
                        </span>
                        {option.title}
                      </div>
                      <Button
                        type="button"
                        variant="link"
                        size="icon"
                        className="text-muted-foreground h-4 w-4 p-0"
                        onClick={() => {
                          handleUnselect(option)
                        }}
                      >
                        <XIcon size="12" />
                      </Button>
                    </HStack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Stack>
  )
}
