import { useState } from 'react'
import { Form } from 'react-router'
import { Button, Textarea } from './ui'

interface ScriptEditorProps {
  initialScript: string
  onGenerate: (script: string) => void
}

export function ScriptEditor({ initialScript, onGenerate }: ScriptEditorProps) {
  const [script, setScript] = useState(initialScript)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onGenerate(script)
  }

  return (
    <Form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold">Script Editor</h2>
      <Textarea
        name="script"
        value={script}
        onChange={(e) => setScript(e.target.value)}
        rows={10}
        className="w-full rounded border p-2"
      />
      <Button
        type="submit"
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        Generate Episode
      </Button>
    </Form>
  )
}
