import { readFile } from '../utils'

type FlowId = string

interface Branch {
  condition?: (part: Part) => boolean
  abstractInterp?: (range: PartRange) => AiResult
  target: FlowId
}

interface Part {
  x: number
  m: number
  a: number
  s: number
}

interface Range {
  low: number
  high: number
}

interface PartRange {
  x: Range
  m: Range
  a: Range
  s: Range
}

interface AiResult {
  cont: PartRange[]
  branch: PartRange[]
}

interface Problem {
  workflows: Map<FlowId, Branch[]>
  parts: Part[]
}

function parse (input: string): Problem {
  const lines = input.trim().split('\n').map((line) => line.trim())
  const emptyIdx = lines.findIndex((line) => line === '')

  const workflows = new Map<FlowId, Branch[]>()
  for (let i = 0; i < emptyIdx; i++) {
    const { 1: flowNameStr, 2: branchesStr } = /(\w+){([^}]*)}/.exec(lines[i]) ?? []

    const branches = branchesStr.split(',').map((branchStr) => {
      const [first, second] = branchStr.split(':')

      if (second === undefined) {
        return { target: first }
      }

      const { 1: testParamStr, 2: opStr, 3: boundaryStr } = /(\w+)([<>])(\d+)/.exec(first) ?? []
      const isLt = opStr === '<'

      function condition (part: Part): boolean {
        const num = part[testParamStr] ?? NaN
        const bdr = Number(boundaryStr)

        return isLt ? num < bdr : num > bdr
      }

      function abstractInterp (partRange: PartRange): AiResult {
        const sr: Range = partRange[testParamStr] ?? { low: NaN, high: NaN }
        const bdr = Number(boundaryStr)
        const tStr = testParamStr

        const rbdr = isLt ? bdr : bdr + 1

        function valid ({ low, high }: Range): boolean {
          return low <= high
        }

        function replaceRange (range: Range): PartRange {
          return Object.assign({}, partRange, { [tStr]: range })
        }

        const lower: Range[] = [{ ...sr, high: Math.min(sr.high, rbdr - 1) }].filter(valid)
        const upper: Range[] = [{ ...sr, low: Math.max(sr.low, rbdr) }].filter(valid)

        const cont: PartRange[] = (isLt ? upper : lower).map(replaceRange)
        const branch: PartRange[] = (isLt ? lower : upper).map(replaceRange)

        return { cont, branch }
      }

      return { condition, abstractInterp, target: second }
    })

    workflows.set(flowNameStr, branches)
  }

  const parts: Part[] = []

  for (let i = emptyIdx + 1; i < lines.length; i++) {
    const { 1: xStr, 2: mStr, 3: aStr, 4: sStr } = /{x=(\d+),m=(\d+),a=(\d+),s=(\d+)}/.exec(lines[i]) ?? []
    parts.push({ x: Number(xStr), m: Number(mStr), a: Number(aStr), s: Number(sStr) })
  }

  return { workflows, parts }
}

export function day1 (input: string): number {
  const problem = parse(input)

  let sum = 0
  for (const part of problem.parts) {
    let workflow = 'in'

    while (workflow !== 'R' && workflow !== 'A') {
      for (const { condition, target } of problem.workflows.get(workflow) ?? []) {
        if (condition === undefined || condition(part)) {
          workflow = target
          break
        }
      }
    }

    if (workflow === 'A') {
      sum += Object.values(part).reduce((acc, c) => acc + c, 0)
    }
  }

  return sum
}

export function day2 (input: string): number {
  const problem = parse(input)

  const fullRange: Range = { low: 1, high: 4000 }
  const fullPartRange: PartRange = { x: fullRange, m: fullRange, a: fullRange, s: fullRange }

  const wfStack: Array<[PartRange, FlowId]> = [[fullPartRange, 'in']]

  let total = 0

  while (true) {
    const [partRange, workflow] = wfStack.pop() ?? []

    if (partRange === undefined || workflow === undefined) {
      break
    }

    if (workflow === 'R') {
      continue
    }

    if (workflow === 'A') {
      total += Object.values(partRange)
        .map(({ low, high }) => high - low + 1)
        .reduce((acc, c) => acc * c, 1)

      continue
    }

    let threads = [partRange]
    for (const { abstractInterp, target } of problem.workflows.get(workflow) ?? []) {
      if (abstractInterp === undefined) {
        for (const cThread of threads) {
          wfStack.push([cThread, target])
        }

        break
      }

      const abstractInterpNotNull = abstractInterp
      threads = threads.flatMap((partRangeThread) => {
        const { cont, branch } = abstractInterpNotNull(partRangeThread)

        for (const cBranch of branch) {
          wfStack.push([cBranch, target])
        }

        return cont
      })
    }
  }

  return total
}

if (require.main === module) {
  const input = readFile(__dirname, 'problem.txt')
  console.log(`day1: ${day1(input)}`)
  console.log(`day2: ${day2(input)}`)
}
