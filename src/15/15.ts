import { readFile } from '../utils'

function prepare (input: string): string {
  return input.trim().replace('\n', '')
}

function hash (step: string): number {
  return Array.from(step).reduce((acc, c) => (acc + c.charCodeAt(0)) * 17 % 256, 0)
}

export function day1 (input: string): number {
  let sum = 0

  for (const step of prepare(input).split(',')) {
    sum += hash(step)
  }

  return sum
}

interface Lens {
  label: string
  focal: number
}

export function day2 (input: string): number {
  const hashmap: Lens[][] = Array(256).fill(0).map((_zero) => [])

  for (const step of prepare(input).split(',')) {
    const { 1: rmLabel } = /^([^-]+)-$/.exec(step) ?? []
    const { 1: addLabel, 2: focalStr } = /^([^=]+)=(\d+)$/.exec(step) ?? []

    if (rmLabel !== undefined) {
      const bucket = hashmap[hash(rmLabel)]
      const index = bucket.findIndex(({ label }) => label === rmLabel)

      if (index !== -1) {
        bucket.splice(index, 1)
      }
    }

    if (addLabel !== undefined) {
      const focal = Number(focalStr ?? '0')
      const newLens = { label: addLabel, focal }

      const bucket = hashmap[hash(addLabel)]
      const index = bucket.findIndex(({ label }) => label === addLabel)

      if (index !== -1) {
        bucket.splice(index, 1, newLens)
      } else {
        bucket.push(newLens)
      }
    }
  }

  const powers = hashmap.flatMap((bucket, i) => bucket.map(({ focal }, j) => (i + 1) * (j + 1) * focal))
  const sum = powers.reduce((acc, c) => acc + c, 0)

  return sum
}

export const forTesting = { hash }

if (require.main === module) {
  const input = readFile(__dirname, 'problem.txt')
  console.log(`day1: ${day1(input)}`)
  console.log(`day2: ${day2(input)}`)
}
