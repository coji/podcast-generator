import { Button, Label, Textarea } from '~/components/ui';
import type { Route } from './+types/home';
import { getFormProps, getTextareaProps, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { z } from 'zod';
import { Form } from 'react-router';
import fs from 'node:fs/promises';

const schema = z.object({
  style: z.string({ required_error: '必須' }),
  text: z.string({ required_error: '必須' }),
});

interface Moras {
  text: string;
  consonant: string;
  consonant_length: number;
  vowel: string;
  vowel_length: number;
  pitch: number;
}

interface AccentPhrases {
  accent_phrases: {
    moras: Moras[];
    speedScale: number;
    intonationScale: number;
    tempoDynamicsScale: number;
    pitchScale: number;
    volumeScale: number;
    prePhonemeLength: number;
    postPhonemeLength: number;
    pauseLength: null;
    pauseLengthScale: number;
    outputSamplingRate: number;
    outputStereo: boolean;
    kana: string;
  };
}

export function meta(args: Route.MetaArgs) {
  return [
    { title: 'Podcat Generator' },
    { name: 'description', content: 'Generate podcast episodes from text.' },
  ];
}

export const loader = async (args: Route.LoaderArgs) => {
  const ret = await fetch('http://localhost:10101/speakers');
  const speakers: [
    {
      name: string;
      speaker_uuid: string;
      styles: {
        name: string;
        id: number;
        type: 'talk';
      }[];
      version: string;
      supported_features: Record<string, string>;
    }
  ] = await ret.json();
  return { speakers, style: speakers[0].styles[0] };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), { schema });
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() };
  }

  // query
  const queryParams = new URLSearchParams({
    speaker: submission.value.style,
    text: submission.value.text,
  });
  const queryResult = await fetch(
    `http://localhost:10101/audio_query?${queryParams.toString()}`,
    {
      method: 'POST',
    }
  );
  const queryResultJson: AccentPhrases = await queryResult.json();
  console.dir(queryResultJson, { depth: null });

  // generate
  const synthesisResult = await fetch(
    `http://localhost:10101/synthesis?speaker=${submission.value.style}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(queryResultJson),
    }
  );
  const wav = await synthesisResult.arrayBuffer();
  await fs.writeFile('output.wav', Buffer.from(wav));

  return { lastResult: submission.reply() };
};

export default function Home({
  loaderData: { style },
  actionData,
}: Route.ComponentProps) {
  const [form, { text }] = useForm({
    lastResult: actionData?.lastResult,
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  });

  return (
    <div className="grid grid-cols-1 grid-rows-[auto_1fr_auto] min-h-dvh">
      <header className="px-4 py-2 border-b">
        <h1 className="text-2xl font-bold">Podcast Generator</h1>
        <p className="text-muted-foreground">
          Generate podcast episodes from text.
        </p>
      </header>

      <main className="px-4 py-2">
        <Form
          method="POST"
          className="flex flex-col gap-4"
          {...getFormProps(form)}
        >
          <input type="hidden" name="style" value={style.id} />
          <div>
            <Label htmlFor={text.id}>原稿</Label>
            <Textarea {...getTextareaProps(text)} />
            <div className="text-destructive">{text.errors}</div>
          </div>

          <Button>Generate Audio</Button>
        </Form>
      </main>

      <footer className="px-4 py-2 border-t text-center">
        Copyright &copy; coji
      </footer>
    </div>
  );
}
