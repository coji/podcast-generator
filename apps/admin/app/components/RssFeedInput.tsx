import { Form } from 'react-router'
import { Button, Input } from './ui'

interface RssFeedInputProps {
  onFetch: (url: string) => void
}

export function RssFeedInput({ onFetch }: RssFeedInputProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const url = new FormData(form).get('url') as string
    onFetch(url)
  }

  return (
    <Form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="url"
        name="url"
        placeholder="Enter RSS feed URL"
        required
        className="grow rounded border px-3 py-2"
      />
      <Button
        type="submit"
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        Fetch
      </Button>
    </Form>
  )
}
