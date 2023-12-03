import { readFile } from '../utils'

class Schematic {
  w: number
  h: number
  rows: string[]

  constructor (input: string) {
    this.rows = input.trim().split('\n')
    this.w = this.rows.at(0)?.length ?? 0
    this.h = this.rows.length
  }

  charAt (i: number, j: number): string {
    return this.rows[i]?.charAt(j) ?? '.'
  }

  mapRect<R> (iMin: number, jMin: number, iMax: number, jMax: number, f: (i: number, j: number) => R): R[] {
    const ret: R[] = []

    for (let i = iMin; i <= iMax; i++) {
      for (let j = jMin; j <= jMax; j++) {
        ret.push(f(i, j))
      }
    }

    return ret
  }

  mapRowMatches (re: RegExp, cb: (i: number, j: number, label: string) => void): void {
    for (let i = 0; i < this.h; i++) {
      for (const { 0: label, index: indexUndefined } of this.rows[i].matchAll(re)) {
        const index = indexUndefined ?? this.w + 1
        cb(i, index, label)
      }
    }
  }
}

export function day1 (input: string): number {
  const sch = new Schematic(input)

  const isSymbol = (i: number, j: number): boolean => Boolean(sch.charAt(i, j).match(/[^\d.]/))

  let sum = 0
  sch.mapRowMatches(/\d+/g, (i, j, label) => {
    if (sch.mapRect(i - 1, j - 1, i + 1, j + label.length, isSymbol).some(Boolean)) {
      sum += Number(label)
    }
  })

  return sum
}

export function day2 (input: string): number {
  const sch = new Schematic(input)

  const map = new Array(sch.h).fill(0).map((row) => new Array(sch.w))
  sch.mapRowMatches(/\d+/g, (i, j, label) => {
    const gear = Number(label)
    for (let k = 0; k < label.length; k++) {
      map[i][j + k] = gear
    }
  })

  let sum = 0
  sch.mapRowMatches(/\*/g, (i, j, _label) => {
    const valueSet = new Set(sch.mapRect(i - 1, j - 1, i + 1, j + 1, (i, j) => map[i][j]).filter(Boolean))
    if (valueSet.size === 2) {
      sum += [...valueSet].reduce((acc, value) => acc * value, 1)
    }
  })

  return sum
}

if (require.main === module) {
  const input = readFile(__dirname, 'problem.txt')
  console.log(`day1: ${day1(input)}`)
  console.log(`day2: ${day2(input)}`)
}
