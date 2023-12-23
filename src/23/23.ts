import { readFile } from '../utils'

type Key = number

interface Problem {
  maxI: number
  maxJ: number
  matrix: string[]
}

function key (i: number, j: number): Key {
  return i * 100000000 + j
}

interface Edge {
  node: Key
  weight: number
  zone: number | undefined
}

interface Digraph {
  start: Key
  dest: Key
  adj: Map<Key, Edge[]>
}

function parse (input: string): Problem {
  const matrix = input.trim().split('\n')
  const maxI = matrix.length
  const maxJ = matrix[0]?.length ?? 0
  return { maxI, maxJ, matrix }
}

type Coord = [number, number]

const Dirs = {
  '<': [0, -1],
  '>': [0, +1],
  v: [+1, 0],
  '^': [-1, 0]
}

function compressPaths ({ maxI, maxJ, matrix }: Problem, downward: boolean): Digraph {
  const adj = new Map<Key, Edge[]>()

  const zones = new Map<Key, number>()

  let zoneId = 0

  function mark (i: number, j: number): void {
    const cchar = matrix[i]?.[j]
    const nkey = key(i, j)
    if (!zones.has(nkey) && cchar === '.') {
      zones.set(nkey, zoneId)
      for (const [di, dj] of Object.values(Dirs)) {
        mark(i + di, j + dj)
      }
    }
  }

  for (let i = 0; i < maxI; i++) {
    for (let j = 0; j < maxJ; j++) {
      const nodeKey = key(i, j)
      if (!zones.has(nodeKey) && matrix[i]?.[j] === '.') {
        mark(i, j)
        zoneId++
      }
    }
  }

  let [startJ, endJ] = [-1, -1]

  for (let j = 0; j < maxJ; j++) {
    if (matrix[0]?.charAt(j) === '.') {
      startJ = j
    }

    if (matrix[maxI - 1]?.charAt(j) === '.') {
      endJ = j
    }
  }

  function touch (key: Key): void {
    if (!adj.has(key)) {
      adj.set(key, [])
    }
  }

  function traverse (i: number, j: number, slope: string): void {
    const nodeKey = key(i, j)
    if (adj.has(nodeKey)) {
      return
    }

    touch(nodeKey)

    const [sdi, sdj] = Dirs[slope] ?? [0, 0]

    const stack: Array<{ cur: Coord, prev: Coord, length: number }> = [
      { cur: [i + sdi, j + sdj], prev: [i, j], length: 0 }
    ]

    if (!downward) {
      stack.push({ cur: [i - sdi, j - sdj], prev: [i, j], length: 0 })
    }

    const dummy = { cur: [0, 0], prev: [0, 0], length: 0 }

    while (stack.length > 0) {
      const { cur: [ci, cj], prev: [pi, pj], length: clength } = stack.pop() ?? dummy
      const cchar = matrix[ci]?.[cj]

      if (cchar === '#') {
        continue
      }

      if (cchar === '.') {
        for (const [di, dj] of Object.values(Dirs)) {
          const [ni, nj] = [ci + di, cj + dj]
          if (ni !== pi || nj !== pj) {
            stack.push({ cur: [ni, nj], prev: [ci, cj], length: clength + 1 })
          }
        }

        continue
      }

      const ckey = key(ci, cj)

      const [lsdi, lsdj] = Dirs[cchar] ?? [0, 0]
      const [lsni, lsnj] = [ci + lsdi, cj + lsdj]

      if (downward && lsni === pi && lsnj === pj) {
        continue
      }

      const zone = zones.get(key(pi, pj))
      adj.get(nodeKey)?.push({ zone, node: ckey, weight: clength + (cchar === undefined ? 0 : 1) })

      if (cchar !== undefined) {
        traverse(ci, cj, cchar)
      } else {
        touch(ckey)
      }
    }
  }

  const start = key(-1, startJ)
  const dest = key(maxI, endJ)

  traverse(-1, startJ, 'v')

  return { start, dest, adj }
}

function tsp ({ start, dest, adj }: Digraph): number {
  let best = -1

  const vis = new Set<Key>()
  const visNode = new Set<number>()

  function rec (cnode: Key, cweight: number): void {
    vis.add(cnode)

    if (cnode === dest && cweight > best) {
      best = cweight
    }

    for (const { node, weight, zone } of adj.get(cnode) ?? []) {
      if (!vis.has(node)) {
        if (zone !== undefined) {
          if (visNode.has(zone)) {
            continue
          } else {
            visNode.add(zone)
          }
        }

        rec(node, cweight + weight)

        if (zone !== undefined) {
          visNode.delete(zone)
        }
      }
    }

    vis.delete(cnode)
  }

  rec(start, 0)

  return best
}

function solve (input: string, downward: boolean): number {
  const problem = parse(input)
  const digraph = compressPaths(problem, downward)

  const steps = tsp(digraph) - 1
  return steps
}

export function day1 (input: string): number {
  return solve(input, true)
}

export function day2 (input: string): number {
  return solve(input, false)
}

if (require.main === module) {
  const input = readFile(__dirname, 'problem.txt')
  console.log(`day1: ${day1(input)}`)
  console.log(`day2: ${day2(input)}`)
}
