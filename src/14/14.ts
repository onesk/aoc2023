import { readFile } from '../utils'

interface Problem {
  maxI: number
  maxJ: number
  matrix: string[][]
}

function parse (input: string): Problem {
  const lines = input.trim().split('\n')
  const matrix = lines.map((line) => Array.from(line.trim()))
  const maxI = matrix.length
  const maxJ = matrix[0].length ?? 0
  return { maxI, maxJ, matrix }
}

function fall ({ maxI, maxJ, matrix }: Problem): Problem {
  const retMatrix: string[][] = Array(maxI).fill(0).map((_zero) => [])

  for (let j = 0; j < maxJ; j++) {
    for (let i = 0; i < maxI; i++) {
      retMatrix[i].push(matrix[i][j] === '#' ? '#' : '.')
    }

    let bedrock = 0

    for (let i = 0; i < maxI; i++) {
      switch (matrix[i][j]) {
        case '#':
          bedrock = i + 1
          break

        case 'O':
          retMatrix[bedrock++][j] = 'O'
          break
      }
    }
  }

  return { maxI, maxJ, matrix: retMatrix }
}

function transpose ({ maxI, maxJ, matrix }: Problem): Problem {
  const tMatrix: string[][] = Array(maxJ).fill(0).map((_zero) => [])

  for (let i = 0; i < maxI; i++) {
    for (let j = 0; j < maxJ; j++) {
      tMatrix[j].push(matrix[i][j])
    }
  }

  return { maxI: maxJ, maxJ: maxI, matrix: tMatrix }
}

function hflip ({ maxI, maxJ, matrix }: Problem): Problem {
  const hMatrix = Array(maxI)

  for (let i = 0; i < maxI; i++) {
    hMatrix[maxI - 1 - i] = matrix[i]
  }

  return { maxI, maxJ, matrix: hMatrix }
}

function cycle (problem: Problem): Problem {
  const north = fall(problem)
  const west = fall(transpose(north))
  const south = fall(hflip(transpose(west)))
  const east = fall(hflip(transpose(south)))

  return hflip(transpose(hflip(east)))
}

function score ({ maxI, maxJ, matrix }: Problem): number {
  let sum = 0
  for (let i = 0; i < maxI; i++) {
    for (let j = 0; j < maxJ; j++) {
      if (matrix[i][j] === 'O') {
        sum += maxI - i
      }
    }
  }

  return sum
}

function stringify ({ matrix }: Problem): string {
  return matrix.map((row) => row.join('')).join('\n')
}

function runCycles (problem: Problem, cycles: number): Problem {
  const memo = new Map<string, { problem: Problem, step: number }>()

  for (let step = 1; step <= cycles; step++) {
    problem = cycle(problem)

    const key = stringify(problem)

    const prevStep = memo.get(key)?.step
    if (prevStep !== undefined) {
      const cycle = step - prevStep
      const stepKey = (cycles - step) % cycle + prevStep

      for (const { step, problem } of memo.values()) {
        if (step === stepKey) {
          return problem
        }
      }
    }

    memo.set(key, { step, problem })
  }

  return problem
}

export function day1 (input: string): number {
  const problem = parse(input)
  const fallen = fall(problem)
  const sum = score(fallen)

  return sum
}

export function day2 (input: string): number {
  const problem = parse(input)
  const cycled = runCycles(problem, 1e9)
  const sum = score(cycled)

  return sum
}

if (require.main === module) {
  const input = readFile(__dirname, 'problem.txt')
  console.log(`day1: ${day1(input)}`)
  console.log(`day2: ${day2(input)}`)
}
