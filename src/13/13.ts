import { readFile } from '../utils'

interface Problem {
  maxI: number
  maxJ: number
  matrix: string[]
}

function parseProblem (lines: string[]): Problem {
  const matrix = lines.map((s) => s.trim())
  const maxI = matrix.length
  const maxJ = matrix[0]?.length ?? 0
  return { maxI, maxJ, matrix }
}

function parse (input: string): Problem[] {
  const lines = input.trim().split('\n')

  const problems: Problem[] = []

  let last = 0
  for (let i = 1; i <= lines.length; i++) {
    if ((lines[i]?.trim() ?? '') === '') {
      if (last < i) {
        problems.push(parseProblem(lines.slice(last, i)))
      }

      last = i + 1
    }
  }

  return problems
}

function bestHorzLine ({ maxI, maxJ, matrix }: Problem, smudges: number): number {
  let best = 0

  for (let i = 1; i < maxI; i++) {
    let curSmudges = 0
    for (let k = 0; k < Math.min(i, maxI - i); k++) {
      for (let j = 0; j < maxJ; j++) {
        curSmudges += matrix[i + k]?.charAt(j) !== matrix[i - 1 - k]?.charAt(j) ? 1 : 0
      }

      if (curSmudges > smudges) {
        break
      }
    }

    if (curSmudges === smudges) {
      best = Math.max(best, i)
    }
  }

  return best
}

function transpose ({ maxI, maxJ, matrix }: Problem): Problem {
  return {
    maxI: maxJ,
    maxJ: maxI,
    matrix: [...Array(maxJ).keys()].map((j) => [...Array(maxI).keys()].map((i) => matrix[i]?.[j]).join(''))
  }
}

function reflections (problem: Problem, smudges: number): { rows: number, cols: number } {
  const rows = bestHorzLine(problem, smudges)
  const cols = bestHorzLine(transpose(problem), smudges)

  return { rows, cols }
}

function summarize (input: string, smudges: number): number {
  const problems = parse(input)

  let sum = 0
  for (const problem of problems) {
    const { rows, cols } = reflections(problem, smudges)
    sum += cols !== 0 ? cols : rows * 100
  }

  return sum
}

export function day1 (input: string): number {
  return summarize(input, 0)
}

export function day2 (input: string): number {
  return summarize(input, 1)
}

if (require.main === module) {
  const input = readFile(__dirname, 'problem.txt')
  console.log(`day1: ${day1(input)}`)
  console.log(`day2: ${day2(input)}`)
}
