import { readFile } from '../utils'

interface Problem {
  dirs: boolean[]
  network: Map<string, { left: string, right: string }>
}

function parse (input: string): Problem {
  const [dirStr,, ...networkLines] = input.trim().split('\n')
  const dirs = Array.from(dirStr.trim()).map((dir) => dir === 'R')

  const network = new Map()
  for (const line of networkLines) {
    const { 1: src, 2: left, 3: right } = line.match(/([A-Z0-9]+) = \(([A-Z0-9]+), ([A-Z0-9]+)\)/) ?? []

    network.set(src, { left, right })
  }

  return { dirs, network }
}

function getSteps (problem: Problem, src: string, isDest: (string) => boolean): number {
  let steps = 0
  let cur = src

  while (!isDest(cur)) {
    const key = problem.dirs[steps % problem.dirs.length] ? 'right' : 'left'
    cur = problem.network.get(cur)?.[key] ?? '?'
    steps += 1
  }

  return steps
}

function gcd (a: number, b: number): number {
  while (b !== 0) {
    const rem = a % b
    a = b
    b = rem
  }

  return a
}

export function day1 (input: string): number {
  const problem = parse(input)
  return getSteps(problem, 'AAA', (key) => key === 'ZZZ')
}

export function day2 (input: string): number {
  const problem = parse(input)

  let lcm = 1
  for (const key of problem.network.keys()) {
    if (key.endsWith('A')) {
      const loop = getSteps(problem, key, (key) => key.endsWith('Z'))
      const mult = loop / gcd(lcm, loop)
      lcm *= mult
    }
  }

  return lcm
}

if (require.main === module) {
  const input = readFile(__dirname, 'problem.txt')
  console.log(`day1: ${day1(input)}`)
  console.log(`day2: ${day2(input)}`)
}
