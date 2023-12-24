import { readFile } from '../utils'
import { init } from 'z3-solver'

interface Vector {
  x: number
  y: number
  z: number
}

interface Hail {
  s: Vector
  v: Vector
}

function parse (input: string): Hail[] {
  const hail: Hail[] = []
  for (const line of input.trim().split('\n')) {
    const [sStr, vStr] = line.split('@')
    const [sx, sy, sz] = (sStr ?? '').split(',').map(Number)
    const [vx, vy, vz] = (vStr ?? '').split(',').map(Number)
    const s = { x: sx ?? NaN, y: sy ?? NaN, z: sz ?? NaN }
    const v = { x: vx ?? NaN, y: vy ?? NaN, z: vz ?? NaN }
    hail.push({ s, v })
  }

  return hail
}

interface Rational {
  num: bigint
  denom: bigint
}

interface RatPoint {
  x: Rational
  y: Rational
}

function intToRat (x: number): Rational {
  return { num: BigInt(x), denom: 1n }
}

function sgn (a: number): number {
  return a < 0 ? -1 : (a > 0 ? 1 : 0)
}

function sgnb (a: bigint): number {
  return a < 0n ? -1 : (a > 0n ? 1 : 0)
}

function sgnd (a: Rational, b: Rational): number {
  const diff = a.num * b.denom - a.denom * b.num
  return sgnb(diff) * sgnb(a.denom) * sgnb(b.denom)
}

function isectHails (h1: Hail, h2: Hail): RatPoint | null {
  const [n1x, n1y] = [BigInt(-h1.v.y), BigInt(h1.v.x)]
  const [n2x, n2y] = [BigInt(-h2.v.y), BigInt(h2.v.x)]

  const denom = n1x * n2y - n2x * n1y

  if (denom === 0n) {
    return null
  }

  const c1 = n1x * BigInt(h1.s.x) + n1y * BigInt(h1.s.y)
  const c2 = n2x * BigInt(h2.s.x) + n2y * BigInt(h2.s.y)

  const x = { num: c1 * n2y - c2 * n1y, denom }
  const y = { num: n1x * c2 - n2x * c1, denom }

  const posRay1x = sgn(h1.v.x) * sgnd(x, intToRat(h1.s.x)) >= 0
  const posRay1y = sgn(h1.v.y) * sgnd(y, intToRat(h1.s.y)) >= 0

  const posRay2x = sgn(h2.v.x) * sgnd(x, intToRat(h2.s.x)) >= 0
  const posRay2y = sgn(h2.v.y) * sgnd(y, intToRat(h2.s.y)) >= 0

  const posRayBoth = posRay1x && posRay1y && posRay2x && posRay2y

  return posRayBoth ? { x, y } : null
}

function numberOfIntersections (minCoord: number, maxCoord: number, hails: Hail[]): number {
  const minRat = intToRat(minCoord)
  const maxRat = intToRat(maxCoord)

  let ans = 0

  for (let i = 0; i < hails.length; i++) {
    for (let j = i + 1; j < hails.length; j++) {
      const ipoint = isectHails(hails[i], hails[j])
      if (ipoint === null) {
        continue
      }

      const { x, y } = ipoint

      if (sgnd(minRat, x) <= 0 && sgnd(maxRat, x) >= 0 && sgnd(minRat, y) <= 0 && sgnd(maxRat, y) >= 0) {
        ans++
      }
    }
  }

  return ans
}

export function day1 (input: string): number {
  const hails = parse(input)
  const ans = numberOfIntersections(200000000000000, 400000000000000, hails)
  return ans
}

// 159153037374407.0+228139153674672.0+170451316297300.0

export async function day2 (input: string): Promise<number> {
  const hails = parse(input)

  const { Context, em } = await init()

  const { Solver, Real, isReal } = Context('aoc2023')

  const solver = new Solver()

  const sx = Real.const('sx')
  const sy = Real.const('sy')
  const sz = Real.const('sz')

  const vx = Real.const('vx')
  const vy = Real.const('vy')
  const vz = Real.const('vz')

  hails.forEach(({ s, v }, i) => {
    const ti = Real.const(`t_${i}`)

    solver.add(ti.ge(0))
    solver.add(sx.add(vx.mul(ti)).eq(ti.mul(v.x).add(s.x)))
    solver.add(sy.add(vy.mul(ti)).eq(ti.mul(v.y).add(s.y)))
    solver.add(sz.add(vz.mul(ti)).eq(ti.mul(v.z).add(s.z)))
  })

  await solver.check()

  const model = solver.model()
  const sxv = model.get(sx)
  const syv = model.get(sy)
  const szv = model.get(sz)

  const ans = (sxv as any).asNumber() + (syv as any).asNumber() + (szv as any).asNumber()

  em.PThread.terminateAllThreads()

  return Number(ans)
}

export const forTesting = { parse, numberOfIntersections }

async function main (): Promise<void> {
  const input = readFile(__dirname, 'problem.txt')
  console.log(`day1: ${day1(input)}`)

  const day2result = await day2(input)
  console.log(`day2: ${day2result}`)
}

if (require.main === module) {
  main().catch((error) => { console.log(`error: ${error}`) })
}
