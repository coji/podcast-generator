import fs from 'node:fs/promises'
import path from 'node:path'

const __filename = new URL(import.meta.url).pathname
const __dirname = path.dirname(__filename)

export const getFontData = async () => {
  const data = await fs.readFile(
    path.join(process.cwd(), './app/services/fonts/NotoSansJP-Bold.ttf'),
  )
  const fontData = data.buffer.slice(
    data.byteOffset,
    data.byteOffset + data.byteLength,
  )
  return fontData
}
