import { readFile } from '../utils'

type DirIdx = 0 | 1 | 2 | 3
type Coord = [number, number]

const MaxStraight = 3
const MinStraightUltra = 4
const MaxStraightUltra = 10

const Dirs: [Coord, Coord, Coord, Coord] = [[0, 1], [-1, 0], [0, -1], [1, 0]]

class Heap<E extends { key: string, priority: number }> {
  binHeap: E[]
  xref: Map<string, number>

  constructor () {
    this.binHeap = []
    this.xref = new Map()
  }

  popMin (): E | undefined {
    if (this.binHeap.length === 0) {
      return undefined
    }

    const min = this.binHeap[0]

    this.binHeap[0] = this.binHeap[this.binHeap.length - 1]
    this.binHeap.pop()

    this.xref.delete(min.key)

    if (this.binHeap.length > 0) {
      this.xref.set(this.binHeap[0].key, 0)
      this.diveDown(0)
    }

    return min
  }

  tryImprove (elem: E): void {
    const key = elem.key
    const heapIdx = this.xref.get(key)

    if (heapIdx === undefined) {
      if (elem.priority !== Infinity) {
        this.binHeap.push(elem)
        this.xref.set(elem.key, this.binHeap.length - 1)
        this.floatUp(this.binHeap.length - 1)
      }
    } else if (elem.priority < this.binHeap[heapIdx].priority) {
      this.binHeap[heapIdx] = elem
      this.floatUp(heapIdx)
    }
  }

  floatUp (index: number): number {
    const cElem = this.binHeap[index]
    const cPrio = cElem.priority

    let floated = false

    while (index > 0) {
      const parent = ~~((index - 1) / 2)
      if (this.binHeap[parent].priority <= cPrio) {
        break
      }

      this.binHeap[index] = this.binHeap[parent]
      this.xref.set(this.binHeap[index].key, index)

      index = parent
      floated = true
    }

    if (floated) {
      this.binHeap[index] = cElem
      this.xref.set(cElem.key, index)
    }

    return index
  }

  diveDown (index: number): number {
    const cElem = this.binHeap[index]
    const cPrio = cElem.priority

    let dived = false

    while (true) {
      const leftPrio = this.binHeap[index * 2 + 1]?.priority ?? Infinity
      const rightPrio = this.binHeap[index * 2 + 2]?.priority ?? Infinity

      if (cPrio <= leftPrio && cPrio <= rightPrio) {
        break
      }

      const minIdx = index * 2 + (leftPrio < rightPrio ? 1 : 2)

      this.binHeap[index] = this.binHeap[minIdx]
      this.xref.set(this.binHeap[index].key, index)

      index = minIdx
      dived = true
    }

    if (dived) {
      this.binHeap[index] = cElem
      this.xref.set(cElem.key, index)
    }

    return index
  }
}

class Vertex {
  key: string

  constructor (private readonly isUltra: boolean, private readonly prevDirIdx: DirIdx | -1, private readonly prevDirSteps: number, private readonly coord: Coord, private readonly dest: Coord, readonly priority: number) {
    this.key = this.keyForSteps(this.prevDirSteps)
  }

  keyForSteps (prevDirSteps: number): string {
    return `${this.coord[0]}:${this.coord[1]}:${prevDirSteps}:${this.prevDirIdx}`
  }

  isDest (): boolean {
    const [ci, cj] = this.coord
    const [di, dj] = this.dest
    const arrived = ci === di && cj === dj
    const stopped = !this.isUltra || this.prevDirIdx === -1 || this.prevDirSteps >= MinStraightUltra
    return arrived && stopped
  }

  maxStraight (): number {
    return this.isUltra ? MaxStraightUltra : MaxStraight
  }

  markedKeys (): string[] {
    if (this.isUltra && this.prevDirSteps < MinStraightUltra) {
      return [this.keyForSteps(this.prevDirSteps)]
    }

    const ret: string[] = []
    for (let prevDirSteps = this.prevDirSteps; prevDirSteps <= this.maxStraight(); prevDirSteps++) {
      ret.push(this.keyForSteps(prevDirSteps))
    }

    return ret
  }

  adjacent (p: Problem): Vertex[] {
    const [ci, cj] = this.coord

    return Dirs.flatMap(([di, dj], dirIdx) => {
      let newDir = true

      if (this.prevDirIdx === dirIdx && this.prevDirSteps >= this.maxStraight()) {
        return []
      }

      if (this.prevDirIdx !== -1) {
        const diffDirIdx = (this.prevDirIdx + 4 - dirIdx) % 4

        // no pasaran
        if (diffDirIdx === 2) {
          return []
        }

        if (this.isUltra && (diffDirIdx === 1 || diffDirIdx === 3) && this.prevDirSteps < MinStraightUltra) {
          return []
        }

        newDir = diffDirIdx !== 0
      }

      const [ni, nj] = [ci + di, cj + dj]
      const priority = this.priority + (p.heatLoss[ni]?.[nj] ?? Infinity)
      return [new Vertex(this.isUltra, dirIdx as DirIdx, newDir ? 1 : this.prevDirSteps + 1, [ni, nj], this.dest, priority)]
    })
  }
}

class Problem {
  maxI: number
  maxJ: number

  heatLoss: number[][]

  constructor (input: string) {
    this.heatLoss = input.trim().split('\n').map((l) => Array.from(l.trim()).map(Number))

    this.maxI = this.heatLoss.length
    this.maxJ = this.heatLoss[0]?.length ?? 0
  }

  aStar (start: Coord, dest: Coord, isUltra: boolean): number {
    const heap = new Heap<Vertex>()
    const visited = new Set<string>()

    heap.tryImprove(new Vertex(isUltra, -1, 0, start, dest, 0))

    while (true) {
      const minVertex = heap.popMin()

      if (minVertex === undefined) {
        return Infinity
      }

      if (minVertex.isDest()) {
        return minVertex.priority
      }

      for (const markedKey of minVertex.markedKeys()) {
        visited.add(markedKey)
      }

      for (const adjVertex of minVertex.adjacent(this)) {
        if (!visited.has(adjVertex.key)) {
          heap.tryImprove(adjVertex)
        }
      }
    }
  }
}

function solveAstar (input: string, isUltra: boolean): number {
  const problem = new Problem(input)
  const minTotalHeatLoss = problem.aStar([0, 0], [problem.maxI - 1, problem.maxJ - 1], isUltra)
  return minTotalHeatLoss
}

export function day1 (input: string): number {
  return solveAstar(input, false)
}

export function day2 (input: string): number {
  return solveAstar(input, true)
}

if (require.main === module) {
  const input = readFile(__dirname, 'problem.txt')
  console.log(`day1: ${day1(input)}`)
  console.log(`day2: ${day2(input)}`)
}
