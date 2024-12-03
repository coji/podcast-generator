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

type Option = { value: string; label: string; publishedAt: Date }

export function SourceSelector({
  podcastSlug,
  selected,
  placeholder,
  name,
  onChangeSelected,
}: {
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
      onChangeSelected?.([...selected].filter((s) => s.value !== option.value))
    },
    [onChangeSelected, selected],
  )

  const selectables =
    fetcher.data?.sources
      .filter((source) => !selected.some((s) => s.value === source.id))
      .map((option) => ({
        value: option.id,
        label: option.title,
        publishedAt: option.publishedAt,
      })) ?? []

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    fetcher.load(`/${podcastSlug}/feed/selector`)
  }, [])

  return (
    <Stack className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full flex-1 text-sm"
            onClick={() => setOpen(true)}
          >
            {selected.length === 0
              ? (placeholder ?? 'エピソード元エントリを選択')
              : `${selected.length} 件選択済`}
          </Button>
        </PopoverTrigger>

        <PopoverContent>
          <div>hoge</div>
          <Command>
            <CommandList>
              {open && selectables.length > 0 && (
                <CommandGroup>
                  {selectables.map((option) => {
                    return (
                      <CommandItem
                        key={option.value}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onSelect={(value) => {
                          onChangeSelected?.([...selected, option])
                        }}
                        className={'grid cursor-pointer grid-cols-[100px,1fr]'}
                      >
                        <div className="mr-2 text-xs font-medium text-muted-foreground">
                          {format(option.publishedAt, 'yyyy-MM-dd(ccc)', {
                            locale: ja,
                          })}
                        </div>
                        <div>{option.label}</div>
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
                <TableRow key={option.value}>
                  <TableCell>
                    <HStack>
                      <div className="flex-1">
                        <span className="mr-2 text-xs font-medium text-muted-foreground">
                          {format(option.publishedAt, 'yyyy-MM-dd(ccc)', {
                            locale: ja,
                          })}
                        </span>
                        {option.label}
                      </div>
                      <Button
                        type="button"
                        variant="link"
                        size="icon"
                        className="h-4 w-4 p-0 text-muted-foreground"
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

      {name &&
        selected.map((option, idx) => (
          <input
            key={option.value}
            type="hidden"
            name={`${name}[${idx}]`}
            value={option.value}
          />
        ))}
    </Stack>
  )
}
