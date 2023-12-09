import { readFile } from '../utils'

function parse (input: string): number[][] {
  const lines = input.trim().split('\n')
  return lines.map((line) => line.trim().split(/\s+/).map(Number))
}

function extrapolate (row: number[], isForward: boolean): number {
  if (row.every((num) => num === 0)) {
    return 0
  }

  const diff = [...Array(row.length - 1).keys()].map((i) => row[i + 1] - row[i])
  const below = extrapolate(diff, isForward)

  return isForward ? (row.at(-1) ?? 0) + below : (row.at(0) ?? 0) - below
}

function solve (input: string, isForward: boolean): number {
  const problem = parse(input)

  let sum = 0
  for (const row of problem) {
    sum += extrapolate(row, isForward)
  }

  return sum
}

export function day1 (input: string): number {
  return solve(input, true)
}

export function day2 (input: string): number {
  return solve(input, false)
}

if (require.main === module) {
  const input = readFile(__dirname, 'problem.txt')
  console.log(`day1: ${day1(input)}`)
  console.log(`day2: ${day2(input)}`)
}
