import { readFile } from '../utils'

type Category = string

class CategoryMapRange {
  src: bigint
  dest: bigint
  len: bigint

  constructor (line: string) {
    const [dest, src, len] = line.split(/\s+/).map(BigInt)
    this.src = src
    this.dest = dest
    this.len = len
  }

  applyMap (index: bigint): bigint | null {
    if (index >= this.src && index < this.src + this.len) {
      return index - this.src + this.dest
    }

    return null
  }

  contains (index: bigint): boolean {
    return this.src <= index && index < this.src + this.len
  }
}

class CategoryMap {
  srcCat: Category
  destCat: Category

  ranges: CategoryMapRange[]

  constructor (lines: string[]) {
    const { 1: srcCat, 2: destCat } = /([^-]+)-to-([^-]+) map/.exec(lines.at(0) ?? '') ?? [null, '', '']

    this.srcCat = srcCat
    this.destCat = destCat

    this.ranges = lines.slice(1).map((line) => new CategoryMapRange(line))
  }

  nextIndex (index: bigint): bigint | null {
    const remaining = this.ranges.map((range) => range.applyMap(index)).filter((nextIndex) => nextIndex !== null)

    return remaining.length === 1 ? remaining.at(0) ?? null : index
  }

  intersectApplyMap (fromIndex: bigint, uptoIndex: bigint): Array<[bigint, bigint]> {
    const allEnds = this.ranges.flatMap((r) => [r.src, r.src + r.len]).concat([fromIndex, uptoIndex])

    const dedup = [...new Set(allEnds.filter((e) => fromIndex <= e && e <= uptoIndex))]
    dedup.sort((a, b) => sgnBigInt(a - b))

    const maps: Array<[bigint, bigint]> = []
    for (let i = 0; i < dedup.length - 1; i++) {
      const curFrom = dedup[i]
      const curUpto = dedup[i + 1]

      const curRange = this.ranges.filter((r) => r.contains(curFrom)).at(0)

      const newFrom = curRange?.applyMap(curFrom) ?? curFrom
      maps.push([newFrom, curUpto - curFrom + newFrom])
    }

    return maps
  }
}

class Problem {
  seeds: bigint[]
  maps: Map<Category, CategoryMap>

  constructor (input: string) {
    const lines = input.trim().split('\n')

    const { 1: seedsStr } = lines.at(0)?.match(/seeds: (.+)$/) ?? [null, '']
    this.seeds = seedsStr.trim().split(/\s+/).map(BigInt)

    this.maps = new Map()

    let last = 1
    for (let i = 1; i <= lines.length; i++) {
      if (i === lines.length || lines.at(i)?.trim() === '') {
        if (last + 1 < i) {
          const catMap = new CategoryMap(lines.slice(last + 1, i))
          this.maps.set(catMap.srcCat, catMap)
        }

        last = i
      }
    }
  }

  traverse (src: Category, finalDest: Category, index: bigint): bigint | null {
    while (src !== finalDest) {
      const map = this.maps.get(src)
      const nextIndex = map?.nextIndex(index)

      if (nextIndex == null || map == null) {
        return null
      }

      index = nextIndex
      src = map.destCat
    }

    return index
  }

  traverseRange (src: Category, finalDest: Category, fromIndex: bigint, uptoIndex: bigint): bigint | null {
    if (src === finalDest) {
      return fromIndex
    }

    const map = this.maps.get(src)
    if (map == null) {
      return null
    }

    const minLocs: Array<bigint | null> = []
    for (const [curFrom, curUpto] of map.intersectApplyMap(fromIndex, uptoIndex)) {
      const minLoc = this.traverseRange(map.destCat, finalDest, curFrom, curUpto)
      minLocs.push(minLoc)
    }

    return minimum(minLocs)
  }
}

function sgnBigInt (a: bigint): number {
  if (a < 0n) {
    return -1
  }

  if (a > 0n) {
    return 1
  }

  return 0
}

function minimum<N> (arr: N[]): N | null {
  let min: N | null = null
  for (const cur of arr) {
    if (cur != null && (min == null || cur < min)) {
      min = cur
    }
  }

  return min
}

export function day1 (input: string): bigint {
  const problem = new Problem(input)
  const minLoc = minimum(problem.seeds.map((seed) => problem.traverse('seed', 'location', seed)))
  return minLoc ?? -1n
}

export function day2 (input: string): bigint {
  const problem = new Problem(input)

  const minLocs: Array<bigint | null> = []
  for (let i = 0; i < problem.seeds.length; i += 2) {
    const [startSeed, rangeLen] = problem.seeds.slice(i, i + 2)
    minLocs.push(problem.traverseRange('seed', 'location', startSeed, startSeed + rangeLen))
  }

  return minimum(minLocs) ?? -1n
}

if (require.main === module) {
  const input = readFile(__dirname, 'problem.txt')
  console.log(`day1: ${day1(input)}`)
  console.log(`day2: ${day2(input)}`)
}
