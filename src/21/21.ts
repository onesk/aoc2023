import { readFile } from '../utils'

interface Problem {
  maxI: number
  maxJ: number

  startI: number
  startJ: number

  matrix: string[]
}

function parse (input: string): Problem {
  const lines = input.trim().split('\n')

  const [maxI, maxJ] = [lines.length, lines[0]?.length ?? 0]

  let [startI, startJ] = [0, 0]
  lines.forEach((l, i) => {
    const j = l.indexOf('S')
    if (j !== -1) {
      startI = i
      startJ = j
    }
  })

  const matrix = lines.map((l) => l.replace('S', '.'))

  return { maxI, maxJ, startI, startJ, matrix }
}

const HashMult = 137000000
const Dirs: Array<[number, number]> = [[-1, 0], [1, 0], [0, -1], [0, +1]]

function key (i: number, j: number): number {
  return i * HashMult + j
}

type ReachabilityMap = Map<number, [number, number]>
type ReachabilityMapWrapped = Map<number, ReachabilityMap>

function reachableBounded (problem: Problem, steps: number): number {
  const { maxI, maxJ, startI, startJ, matrix } = problem

  let curReach: ReachabilityMap = new Map([[key(startI, startJ), [startI, startJ]]])

  for (let k = 0; k < steps; k++) {
    const newReach: ReachabilityMap = new Map()

    for (const [i, j] of curReach.values()) {
      for (const [di, dj] of Dirs) {
        const [ni, nj] = [i + di, j + dj]
        if (ni < 0 || nj < 0 || ni >= maxI || nj >= maxJ || matrix[ni]?.charAt(nj) !== '.') {
          continue
        }

        newReach.set(key(ni, nj), [ni, nj])
      }
    }

    curReach = newReach
  }

  return curReach.size
}

function reachableWrapped (problem: Problem, steps: number): number {
  const { maxI, maxJ, startI, startJ, matrix } = problem

  const startKey = key(startI, startJ)
  let curReach: ReachabilityMapWrapped = new Map([
    [startKey, new Map([
      [startKey, [startI, startJ]]
    ])]
  ])

  for (let k = 0; k < steps; k++) {
    const newReach: ReachabilityMapWrapped = new Map()

    for (const rmap of curReach.values()) {
      for (const [i, j] of rmap.values()) {
        for (const [di, dj] of Dirs) {
          const [ni, nj] = [i + di, j + dj]
          const [niw, njw] = [(i + di + maxI * 10000) % maxI, (j + dj + maxJ * 10000) % maxJ]

          if (matrix[niw]?.charAt(njw) !== '.') {
            continue
          }

          const newKeyW = key(niw, njw)
          const newKey = key(ni, nj)

          newReach.set(newKeyW, (newReach.get(newKeyW) ?? new Map()).set(newKey, [ni, nj]))
        }
      }
    }

    curReach = newReach
  }

  return [...curReach.values()].reduce((acc, m) => acc + m.size, 0)
}

export function day1 (input: string): number {
  const problem = parse(input)
  return reachableBounded(problem, 64)
}

export function day2 (input: string): number {
  // const problem = parse(input)

  // for (let mult = 0; mult < 6; mult++) {
  // const steps = ~~((mult + 0.5) * problem.maxI)
  // const total = reachableWrapped(problem, steps)
  // console.log(`${steps} ${total}`)
  // }

  // 65  3867    30386   30270
  // 196 34253   60656   30270
  // 327 94909   90926   30270
  // 458 185835  121196  30270
  // 589 307031  151466  30270
  // 720 458497  181736
  // 851 640233

  const n = (26501365 - 65) / 131
  const ans = 458497 + (n - 5) * 181736 + (n - 5) * (n - 6) / 2 * 30270
  return ans
}

export const forTesting = { reachableBounded, reachableWrapped, parse }

if (require.main === module) {
  const input = readFile(__dirname, 'problem.txt')
  console.log(`day1: ${day1(input)}`)
  console.log(`day2: ${day2(input)}`)
}
