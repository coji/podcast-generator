import fs from 'node:fs/promises'
import path from 'node:path'

export const createDirectory = async (dirPath: string): Promise<void> => {
  await fs.mkdir(dirPath, { recursive: true })
}

export const writeFile = async (
  filePath: string,
  data: Buffer | string,
): Promise<void> => {
  await fs.writeFile(filePath, data)
}

export const readFile = async (filePath: string): Promise<Buffer> => {
  return await fs.readFile(filePath)
}

export const getFileStats = async (filePath: string) => {
  return await fs.stat(filePath)
}

export const joinPath = (...segments: string[]): string => {
  return path.join(...segments)
}
