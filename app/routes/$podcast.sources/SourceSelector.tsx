import { Command as CommandPrimitive } from 'cmdk'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { XIcon } from 'lucide-react'
import * as React from 'react'
import { useFetcher } from 'react-router'
import {
  Button,
  HStack,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '~/components/ui'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '~/components/ui/command'
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
  const fetcher = useFetcher<typeof loader>()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')

  const handleUnselect = React.useCallback(
    (option: Option) => {
      onChangeSelected?.([...selected].filter((s) => s.value !== option.value))
    },
    [onChangeSelected, selected],
  )

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (input) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (input.value === '') {
            const newSelected = [...selected]
            newSelected.pop()
            onChangeSelected?.(newSelected)
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === 'Escape') {
          input.blur()
        }
      }
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
    fetcher.load(`/${podcastSlug}/sources`)
  }, [])

  return (
    <div className="w-full">
      <Command
        onKeyDown={handleKeyDown}
        className="overflow-visible bg-transparent"
      >
        <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-0">
          <div className="flex flex-wrap gap-1">
            <CommandPrimitive.Input
              ref={inputRef}
              value={inputValue}
              onValueChange={setInputValue}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="relative mt-2">
          <CommandList>
            {open && selectables.length > 0 ? (
              <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                <CommandGroup className="h-full overflow-auto">
                  {selectables.map((option) => {
                    return (
                      <CommandItem
                        key={option.value}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onSelect={(value) => {
                          setInputValue('')
                          onChangeSelected?.([...selected, option])
                        }}
                        className={'cursor-pointer'}
                      >
                        <span className="mr-2 text-xs font-medium text-muted-foreground">
                          {format(option.publishedAt, 'yyyy-MM-dd(ccc)', {
                            locale: ja,
                          })}
                        </span>
                        {option.label}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </div>
            ) : null}
          </CommandList>
        </div>
      </Command>

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
    </div>
  )
}
