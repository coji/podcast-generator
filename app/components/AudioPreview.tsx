import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui'

interface AudioPreviewProps {
  audioUrl: string
  onPublish: () => void
}

export function AudioPreview({ audioUrl, onPublish }: AudioPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audio Preview</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent>
        <audio controls src={audioUrl} className="w-full" />
      </CardContent>
      <CardFooter>
        <Button
          onClick={onPublish}
          className="rounded bg-green-500 px-4 py-2 text-white"
        >
          Publish Episode
        </Button>
      </CardFooter>
    </Card>
  )
}
