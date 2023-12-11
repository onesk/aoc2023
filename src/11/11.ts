import { readFile } from '../utils'

interface Coord {
  i: number
  j: number
}

function parse (input: string): Coord[] {
  const galaxies: Coord[] = []

  input.trim().split('\n').forEach((line, i) => {
    Array.from(line.trim()).forEach((char, j) => {
      if (char === '#') {
        galaxies.push({ i, j })
      }
    })
  })

  return galaxies
}

interface RqIndex {
  coordToIndex: Map<number, number>
  runningTotals: number[]
}

function rangeQueryPrepare (coords: number[]): RqIndex {
  const coordToIndex = new Map()
  const dedupSortedCoords = [...new Set(coords)].sort((a, b) => a - b)

  let sum = 0
  const runningTotals: number[] = []
  dedupSortedCoords.forEach((coord, index, dedups) => {
    coordToIndex.set(coord, index)

    const delta = coord - (dedups[index - 1] ?? -1) - 1

    sum += delta
    runningTotals.push(sum)
  })

  return { coordToIndex, runningTotals }
}

function rangeQuery (index: RqIndex, fromCoord: number, toCoord: number): number {
  const minCoord = Math.min(fromCoord, toCoord)
  const maxCoord = Math.max(fromCoord, toCoord)

  const rtMax = index.runningTotals[index.coordToIndex.get(maxCoord) ?? -1] ?? 0
  const rtMin = index.runningTotals[index.coordToIndex.get(minCoord) ?? -1] ?? 0

  return rtMax - rtMin
}

function solve (input: string, mult: number): number {
  const galaxies = parse(input)

  const iIndex = rangeQueryPrepare(galaxies.map(({ i }) => i))
  const jIndex = rangeQueryPrepare(galaxies.map(({ j }) => j))

  let sum = 0
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      const { i: i1, j: j1 } = galaxies[i]
      const { i: i2, j: j2 } = galaxies[j]

      const dist = Math.abs(i1 - i2) + Math.abs(j1 - j2) +
        rangeQuery(iIndex, i1, i2) * (mult - 1) +
        rangeQuery(jIndex, j1, j2) * (mult - 1)

      sum += dist
    }
  }

  return sum
}

export const forTesting = { solve }

export function day1 (input: string): number {
  return solve(input, 2)
}

export function day2 (input: string): number {
  return solve(input, 1000000)
}

if (require.main === module) {
  const input = readFile(__dirname, 'problem.txt')
  console.log(`day1: ${day1(input)}`)
  console.log(`day2: ${day2(input)}`)
}
