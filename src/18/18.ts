import { readFile } from '../utils'

type Dir = string
type Steps = number
type Color = string

type Row = [Dir, Steps, Color]
type DirSteps = [Dir, Steps]

function parse (input: string): Row[] {
  return input.trim().split('\n').map((line) => {
    const { 1: dirStr, 2: stepsStr, 3: colorStr } = /([UDLR]) (\d+) \(([^)]+)\)/.exec(line.trim()) ?? []
    return [dirStr ?? '', Number(stepsStr), colorStr ?? '']
  })
}

type Coord = [number, number]
interface CompCoord { ic: number, jc: number }
type Trench = Map<number, CompCoord>

const Dirs = {
  U: [-1, 0],
  D: [1, 0],
  L: [0, -1],
  R: [0, 1]
}

function shortSteps (rows: Row[]): DirSteps[] {
  return rows.map(([dir, stepsCnt]) => [dir, stepsCnt])
}

const DirByCode = {
  0: 'R',
  1: 'D',
  2: 'L',
  3: 'U'
}

function longSteps (rows: Row[]): DirSteps[] {
  return rows.map(([_dir, _stepsCnt, color]) => {
    const steps = parseInt(color.slice(1, 6), 16)
    const dirCode = parseInt(color.slice(6), 16)

    return [DirByCode[dirCode], steps]
  })
}

interface Rulers {
  is: number[]
  js: number[]
}

function compressCoords ([i, j]: Coord, dirSteps: DirSteps[]): Rulers {
  const iss = new Set<number>()
  const jss = new Set<number>()

  iss.add(i).add(i + 1).add(Infinity).add(-Infinity)
  jss.add(j).add(j + 1).add(Infinity).add(-Infinity)

  for (const [dir, stepsCnt] of dirSteps) {
    const [di, dj] = Dirs[dir] ?? [0, 0]

    i += di * stepsCnt
    j += dj * stepsCnt

    iss.add(i).add(i + 1)
    jss.add(j).add(j + 1)
  }

  const is = [...iss].sort((a, b) => a - b)
  const js = [...jss].sort((a, b) => a - b)

  return { is, js }
}

function compress (r: Rulers, [i, j]: Coord): CompCoord {
  const ic = r.is.indexOf(i)
  const jc = r.js.indexOf(j)
  return { ic, jc }
}

const rowMult = 137e6

function key (cc: CompCoord): number {
  return cc.ic * rowMult + cc.jc
}

function trenchSet (t: Trench, cc: CompCoord): void {
  t.set(key(cc), cc)
}

function digTrench (start: Coord, dirSteps: DirSteps[]): { trench: Trench, rulers: Rulers } {
  const r = compressCoords(start, dirSteps)

  const t: Trench = new Map()
  trenchSet(t, compress(r, start))

  let [i, j] = start
  for (const [dir, stepsCnt] of dirSteps) {
    const [di, dj] = Dirs[dir] ?? [0, 0]
    const [ei, ej] = [i + di * stepsCnt, j + dj * stepsCnt]

    const [ccs, cce] = [compress(r, [i, j]), compress(r, [ei, ej])]

    for (let iic = Math.min(ccs.ic, cce.ic); iic <= Math.max(ccs.ic, cce.ic); iic++) {
      for (let jjc = Math.min(ccs.jc, cce.jc); jjc <= Math.max(ccs.jc, cce.jc); jjc++) {
        trenchSet(t, { ic: iic, jc: jjc })
      }
    }

    i = ei
    j = ej
  }

  return { trench: t, rulers: r }
}

function trenchAABB (t: Trench): { min: CompCoord, max: CompCoord } {
  const min: CompCoord = { ic: Infinity, jc: Infinity }
  const max: CompCoord = { ic: -Infinity, jc: -Infinity }

  for (const { ic, jc } of t.values()) {
    min.ic = Math.min(min.ic, ic)
    max.ic = Math.max(max.ic, ic)

    min.jc = Math.min(min.jc, jc)
    max.jc = Math.max(max.jc, jc)
  }

  return { min, max }
}

function fillTrench (trench: Trench): void {
  const { min: { ic: minIc, jc: minJc }, max: { ic: maxIc, jc: maxJc } } = trenchAABB(trench)

  const outfill = new Set<number>()

  function floodFill (ic: number, jc: number): void {
    const queue: CompCoord[] = [{ ic, jc }]
    let qe = 0

    while (qe < queue.length) {
      const cc = queue[qe++] ?? { ic: Infinity, jc: Infinity }

      if (cc.ic < minIc - 1 || cc.ic > maxIc + 1 || cc.jc < minJc - 1 || cc.jc > maxJc + 1) {
        continue
      }

      const cckey = key(cc)
      if (outfill.has(cckey) || trench.has(cckey)) {
        continue
      }

      outfill.add(cckey)

      for (const [di, dj] of Object.values(Dirs)) {
        queue.push({ ic: cc.ic + di, jc: cc.jc + dj })
      }
    }
  }

  floodFill(minIc - 1, minJc - 1)

  for (let ic = minIc; ic <= maxIc; ic++) {
    for (let jc = minJc; jc <= maxJc; jc++) {
      if (!outfill.has(key({ ic, jc }))) {
        trenchSet(trench, { ic, jc })
      }
    }
  }
}

function totalArea (r: Rulers, t: Trench): number {
  let sum = 0

  for (const { ic, jc } of t.values()) {
    const di = r.is[ic + 1] - r.is[ic]
    const dj = r.js[jc + 1] - r.js[jc]
    sum += di * dj
  }

  return sum
}

function pitSize (dirSteps: DirSteps[]): number {
  const { trench, rulers } = digTrench([0, 0], dirSteps)
  fillTrench(trench)
  return totalArea(rulers, trench)
}

export function day1 (input: string): number {
  return pitSize(shortSteps(parse(input)))
}

export function day2 (input: string): number {
  return pitSize(longSteps(parse(input)))
}

if (require.main === module) {
  const input = readFile(__dirname, 'problem.txt')
  console.log(`day1: ${day1(input)}`)
  console.log(`day2: ${day2(input)}`)
}
