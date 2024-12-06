import { type BucketItem, Client } from 'minio'
import fs from 'node:fs/promises'
import path from 'node:path'
import { Readable } from 'node:stream'

const BUCKET_NAME = 'podcast-generator' as const

const client = new Client({
  endPoint: process.env.R2_ENDPOINT,
  accessKey: process.env.R2_ACCESS_KEY_ID,
  secretKey: process.env.R2_SECRET_ACCESS_KEY,
  useSSL: true,
  region: 'auto',
})

export const ImageEndpointUrl = process.env.IMAGE_ENDPOINT_URL

export const list = async (): Promise<BucketItem[]> => {
  const objectsList = await client
    .listObjectsV2(BUCKET_NAME, '', true, '')
    .toArray()
  return objectsList
}

export const upload = async (file: File) => {
  const { name, type } = file

  const stream = new Readable({ read: () => {} })
  stream.push(Buffer.from(await file.arrayBuffer()))
  stream.push(null)

  return await client.putObject(BUCKET_NAME, name, stream, file.size, {
    'Content-Type': type,
  })
}

export const uploadFromFile = async (
  bucketPath: string,
  fileName: string,
  sourceFilePath: string,
) => {
  const fileBuffer = await fs.readFile(sourceFilePath)
  const stream = new Readable()
  stream.push(fileBuffer)
  stream.push(null)
  const fileNameToUse = path.join(bucketPath, fileName)
  return await client.putObject(
    BUCKET_NAME,
    fileNameToUse,
    stream,
    fileBuffer.length,
    {
      'Content-Type': 'application/octet-stream',
    },
  )
}

export const createPresignedUrl = async (key: string) => {
  return await client.presignedUrl('GET', BUCKET_NAME, key, 60 * 60)
}
