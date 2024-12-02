import * as React from 'react'

import { Command as CommandPrimitive } from 'cmdk'
import { XIcon } from 'lucide-react'
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

type Option = Record<'value' | 'label', string>

export function MultiSelect({
  defaultValues = [],
  options,
  placeholder,
  name,
}: {
  defaultValues?: Option[]
  options: Option[]
  placeholder?: string
  name?: string
  onChangeSelected?: (selected: Option[]) => void
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<Option[]>(defaultValues)
  const [inputValue, setInputValue] = React.useState('')

  const handleUnselect = React.useCallback((option: Option) => {
    setSelected((prev) => prev.filter((s) => s.value !== option.value))
  }, [])

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (input) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (input.value === '') {
            setSelected((prev) => {
              const newSelected = [...prev]
              newSelected.pop()
              return newSelected
            })
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === 'Escape') {
          input.blur()
        }
      }
    },
    [],
  )

  const selectables = options.filter((option) => !selected.includes(option))

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
                          setSelected((prev) => [...prev, option])
                        }}
                        className={'cursor-pointer'}
                      >
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
                      <div className="flex-1">{option.label}</div>
                      <Button
                        type="button"
                        variant="link"
                        size="icon"
                        className="h-4 w-4 p-0"
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
