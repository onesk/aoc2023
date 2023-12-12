import { readFile } from '../utils'

interface Problem {
  row: string
  runs: number[]
}

function parse (input: string): Problem[] {
  return input.trim().split('\n').map((line) => {
    const [row, runStr] = line.split(/\s+/)
    const runs = runStr.split(',').map(Number)
    return { row, runs }
  })
}

function options ({ row, runs }: Problem): number {
  const memo = new Map<string, number>()

  function rec (charIdx: number, runIdx: number, gapBefore: boolean): number {
    if (charIdx === row.length) {
      return runIdx === runs.length ? 1 : 0
    }

    const memoKey = `${charIdx}:${runIdx}:${gapBefore}`
    const memoValue = memo.get(memoKey)
    if (memoValue !== undefined) {
      return memoValue
    }

    let sum = 0
    const char = row.charAt(charIdx)

    if (char === '.' || char === '?') {
      sum += rec(charIdx + 1, runIdx, true)
    }

    if (runIdx < runs.length && gapBefore) {
      const run = runs[runIdx]
      const fits = Array.from(row.slice(charIdx, charIdx + run)).every((c) => c === '#' || c === '?')
      if (charIdx + run <= row.length && fits) {
        sum += rec(charIdx + run, runIdx + 1, false)
      }
    }

    memo.set(memoKey, sum)
    return sum
  }

  return rec(0, 0, true)
}

function unfold (fold: number, problem: Problem): Problem {
  const row = Array(fold).fill(problem.row).join('?')
  const runs = Array(fold).fill(problem.runs).flat()
  return { row, runs }
}

function solve (input: string, fold: number): number {
  const problems = parse(input)
  const sum = problems.reduce((acc, p) => acc + options(unfold(fold, p)), 0)
  return sum
}

export function day1 (input: string): number {
  return solve(input, 1)
}

export function day2 (input: string): number {
  return solve(input, 5)
}

if (require.main === module) {
  const input = readFile(__dirname, 'problem.txt')
  console.log(`day1: ${day1(input)}`)
  console.log(`day2: ${day2(input)}`)
}
