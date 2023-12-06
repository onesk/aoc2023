import { readFile } from '../utils'

interface Problem {
  time: number
  record: number
}

function parse (input: string): Problem[] {
  const [times, records] = input.trim().split('\n').map((l) => l.split(':')[1]?.trim()?.split(/\s+/)?.map(Number))
  return times.map((time, i) => ({ time, record: records[i] }))
}

function solveForSlow ({ time, record }: Problem): number {
  return [...Array(time).keys()].map((ct) => ct * (time - ct)).filter((d) => d > record).length
}

function findMaxCt (time: number, low: number, high: number): number {
  const mid1 = ~~((low * 2 + high) / 3)
  const mid2 = ~~((low + high * 2) / 3)

  const val1 = mid1 * (time - mid1)
  const val2 = mid2 * (time - mid2)

  if (mid1 >= mid2) {
    return mid1
  }

  return val1 < val2 ? findMaxCt(time, mid1 + 1, high) : findMaxCt(time, low, mid2)
}

function binSearch (low: number, high: number, lowerPred: (number) => boolean): number {
  let ans = low - 1
  while (low < high) {
    const mid = ~~((low + high) / 2)

    if (lowerPred(mid)) {
      low = mid + 1
      ans = mid
    } else {
      high = mid
    }
  }

  return ans
}

function solveForFast ({ time, record }: Problem): number {
  const bestCt = findMaxCt(time, 0, time)
  const beforeMax = binSearch(0, bestCt, (ct) => ct * (time - ct) <= record)
  const afterMax = binSearch(bestCt, time, (ct) => ct * (time - ct) > record)

  return afterMax - beforeMax
}

export function day1 (input: string): number {
  const problems = parse(input)

  let product = 1
  for (const problem of problems) {
    product *= solveForSlow(problem)
  }

  return product
}

export function day2 (input: string): number {
  const problems = parse(input)
  const { timeStr, recordStr } = problems.reduce(({ timeStr, recordStr }, { time, record }) => {
    return { timeStr: timeStr + time, recordStr: recordStr + record }
  }, { timeStr: '', recordStr: '' })
  return solveForFast({ time: Number(timeStr), record: Number(recordStr) })
}

if (require.main === module) {
  const input = readFile(__dirname, 'problem.txt')
  console.log(`day1: ${day1(input)}`)
  console.log(`day2: ${day2(input)}`)
}
