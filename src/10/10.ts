import { readFile } from '../utils'

interface Coord {
  i: number
  j: number
}

type NodeLabel = string
type Adj = Map<NodeLabel, NodeLabel[]>
type Dist = Map<NodeLabel, number>

interface Problem {
  maxCoord: Coord
  start: Coord
  adj: Adj
}

const u = (i, j): string => `${i}:${j}:u`
const l = (i, j): string => `${i}:${j}:l`

function addEdge (adj: Adj, nodeFrom: NodeLabel, nodeTo: NodeLabel): void {
  if (!adj.has(nodeFrom)) {
    adj.set(nodeFrom, [])
  }

  if (!adj.has(nodeTo)) {
    adj.set(nodeTo, [])
  }

  adj.get(nodeFrom)?.push(nodeTo)
  adj.get(nodeTo)?.push(nodeFrom)
}

function parse (input: string): Problem {
  let start = { i: -1, j: -1 }

  const adj = new Map()

  const parsers = {
    '|': (i, j) => { addEdge(adj, u(i, j), u(i + 1, j)) },
    '-': (i, j) => { addEdge(adj, l(i, j), l(i, j + 1)) },
    L: (i, j) => { addEdge(adj, u(i, j), l(i, j + 1)) },
    J: (i, j) => { addEdge(adj, u(i, j), l(i, j)) },
    7: (i, j) => { addEdge(adj, l(i, j), u(i + 1, j)) },
    F: (i, j) => { addEdge(adj, l(i, j + 1), u(i + 1, j)) },
    '.': (i, j) => null,
    S: (i, j) => {
      start = { i, j }
    }
  }

  const maxCoord = { i: -1, j: -1 }

  input.trim().split('\n').forEach((line, i) => {
    Array.from(line.trim()).forEach((char, j) => {
      maxCoord.j = Math.max(maxCoord.j, j)
      parsers[char]?.(i, j)
    })

    maxCoord.i = Math.max(maxCoord.i, i)
  })

  return { maxCoord, start, adj }
}

function bfs (adj: Adj, roots: NodeLabel[]): Dist {
  const dist = new Map()

  let qe = 0
  const queue: Array<[string, number]> = []

  roots.forEach((node) => {
    queue.push([node, 0])
    dist.set(node, 0)
  })

  while (qe < queue.length) {
    const [node, curDist] = queue[qe++]

    for (const adjNode of adj.get(node) ?? []) {
      if (!dist.has(adjNode)) {
        queue.push([adjNode, curDist + 1])
        dist.set(adjNode, curDist + 1)
      }
    }
  }

  return dist
}

function roots ({ i, j }: Coord): NodeLabel[] {
  return [u(i, j), l(i, j), u(i + 1, j), l(i, j + 1)]
}

function solveCommon (input: string): { maxCoord: Coord, dist: Dist, adj: Adj } {
  const { maxCoord, start, adj } = parse(input)
  const loopRoots = roots(start).filter((node) => adj.has(node))
  const dist = bfs(adj, loopRoots)
  return { maxCoord, adj, dist }
}

export function day1 (input: string): number {
  const { dist } = solveCommon(input)
  const maxSteps = [...dist.values()].reduce((a, c) => Math.max(a, c), -1)
  return maxSteps + 1
}

export function day2 (input: string): number {
  const { maxCoord, dist } = solveCommon(input)

  let area = 0
  for (let i = 0; i <= maxCoord.i; i++) {
    let inside = false
    let upperRun = false
    let lowerRun = false

    for (let j = 0; j <= maxCoord.j; j++) {
      const [l1, l2] = [dist.has(l(i, j)), dist.has(l(i, j + 1))]
      const [u1, u2] = [dist.has(u(i, j)), dist.has(u(i + 1, j))]
      const cross = u1 && u2

      if (!upperRun && !lowerRun && !l1 && l2) {
        upperRun = u1
        lowerRun = u2
      }

      if (cross) {
        inside = !inside
      }

      if ((upperRun || lowerRun) && l1 && !l2) {
        if (upperRun !== u1 || lowerRun !== u2) {
          inside = !inside
        }

        upperRun = lowerRun = false
      }

      if (!l1 && !l2 && !cross && inside) {
        area++
      }
    }
  }

  return area
}

if (require.main === module) {
  const input = readFile(__dirname, 'problem.txt')
  console.log(`day1: ${day1(input)}`)
  console.log(`day2: ${day2(input)}`)
}
