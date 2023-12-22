import { readFile } from '../utils'

interface Coord {
  x: number
  y: number
  z: number
}

interface Brick {
  min: Coord
  max: Coord
}

function parse (input: string): Brick[] {
  const bricks: Brick[] = []
  for (const line of input.trim().split('\n')) {
    const [, x1, y1, z1, x2, y2, z2] = (/(\d+),(\d+),(\d+)~(\d+),(\d+),(\d+)/.exec(line) ?? []).map(Number)

    const min = { x: Math.min(x1, x2), y: Math.min(y1, y2), z: Math.min(z1, z2) }
    const max = { x: Math.max(x1, x2), y: Math.max(y1, y2), z: Math.max(z1, z2) }

    bricks.push({ min, max })
  }

  bricks.sort(({ min: minA }, { min: minB }) => minA.z - minB.z)
  return bricks
}

function fallAll (bs: Brick[]): Set<number> {
  const fallen = new Set<number>()
  const heightMap = new Map<number, number>()

  for (let i = 0; i < bs.length; i++) {
    let dist = bs[i].min.z - 1

    for (let x = bs[i].min.x; x <= bs[i].max.x; x++) {
      for (let y = bs[i].min.y; y <= bs[i].max.y; y++) {
        const key = x * 137000000 + y
        dist = Math.min(dist, bs[i].min.z - (heightMap.get(key) ?? 0) - 1)
      }
    }

    if (dist > 0) {
      bs[i].min.z -= dist
      bs[i].max.z -= dist

      fallen.add(i)
    }

    for (let x = bs[i].min.x; x <= bs[i].max.x; x++) {
      for (let y = bs[i].min.y; y <= bs[i].max.y; y++) {
        const key = x * 137000000 + y
        heightMap.set(key, bs[i].max.z)
      }
    }
  }

  return fallen
}

function deepCopy (bs: Brick[]): Brick[] {
  return bs.map(({ min, max }) => ({ min: { ...min }, max: { ...max } }))
}

function solve (input: string, ansDelta: (number) => number): number {
  const bricks = parse(input)
  fallAll(bricks)

  let ans = 0
  for (let i = 0; i < bricks.length; i++) {
    const copy = deepCopy(bricks)
    copy.splice(i, 1)

    ans += ansDelta(fallAll(copy).size)
  }

  return ans
}

export function day1 (input: string): number {
  return solve(input, (size) => size === 0 ? 1 : 0)
}

export function day2 (input: string): number {
  return solve(input, (size) => size)
}

if (require.main === module) {
  const input = readFile(__dirname, 'problem.txt')
  console.log(`day1: ${day1(input)}`)
  console.log(`day2: ${day2(input)}`)
}
