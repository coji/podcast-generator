import { Button } from './ui'

interface AudioPreviewProps {
  audioUrl: string
  onPublish: () => void
}

export function AudioPreview({ audioUrl, onPublish }: AudioPreviewProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Audio Preview</h2>
      <audio controls src={audioUrl} className="w-full" />
      <Button
        onClick={onPublish}
        className="rounded bg-green-500 px-4 py-2 text-white"
      >
        Publish Episode
      </Button>
    </div>
  )
}
