import { readFileSync } from 'fs'
import { resolve } from 'path'

export function readFile (directory: string, filename: string): string {
  return readFileSync(resolve(directory, filename), 'utf8')
}
