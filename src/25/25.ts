import { readFile } from '../utils'

type Label = string

interface Graph {
  nodes: Set<Label>
  edges: Array<[Label, Label]>
}

function parse (input: string): Graph {
  const edges: Array<[Label, Label]> = []

  for (const line of input.trim().split('\n')) {
    const [src, dests] = line.split(': ')

    for (const dest of dests.split(' ')) {
      edges.push([src, dest])
    }
  }

  const nodes = new Set(edges.flatMap((edge) => edge))

  return { nodes, edges }
}

function karger ({ nodes, edges }: Graph, componentsLeft: number): [number, Label[][]] {
  const dts = new Map<Label, { rank: number, parent: Label }>(
    [...nodes].map((label) => [label, { rank: 1, parent: label }])
  )

  function dtsRoot (label: Label): Label | undefined {
    const dtsEntry = dts.get(label)

    if (dtsEntry === undefined) {
      return label
    }

    const { parent } = dtsEntry

    if (parent === label) {
      return label
    }

    const root = dtsRoot(parent)
    dtsEntry.parent = root ?? parent
    return root
  }

  function dtsJoin (label1: Label, label2: Label): void {
    if (label1 === label2) {
      return
    }

    const dtsEntry1 = dts.get(label1)
    const dtsEntry2 = dts.get(label2)

    if (dtsEntry1 === undefined || dtsEntry1.parent !== label1) {
      return
    }

    if (dtsEntry2 === undefined || dtsEntry2.parent !== label2) {
      return
    }

    if (dtsEntry1.rank < dtsEntry2.rank) {
      dtsEntry1.parent = label2
      dtsEntry2.rank += dtsEntry1.rank
    } else {
      dtsEntry2.parent = label1
      dtsEntry1.rank += dtsEntry2.rank
    }
  }

  const redges: Array<[Label, Label, number]> = edges.map(([l1, l2]) => [l1, l2, Math.random()])

  redges.sort((a, b) => a[2] - b[2])

  let components = nodes.size

  let used = 0
  for (let i = 0; i < redges.length && components > componentsLeft; i++) {
    const [l1, l2] = redges[used]

    const r1 = dtsRoot(l1) ?? l1
    const r2 = dtsRoot(l2) ?? l2

    used++

    if (r1 === r2) {
      continue
    }

    dtsJoin(r1, r2)
    components--
  }

  for (let i = used; i < redges.length; i++) {
    const [l1, l2] = redges[i]

    const r1 = dtsRoot(l1) ?? l1
    const r2 = dtsRoot(l2) ?? l2

    if (r1 === r2) {
      used++
    }
  }

  const group = new Map<Label, Set<Label>>()

  for (const label of nodes) {
    const root = dtsRoot(label) ?? label
    group.set(root, (group.get(root) ?? new Set()).add(label))
  }

  return [used, [...group.values()].map((s) => [...s])]
}

export function day1 (input: string): number {
  const graph = parse(input)

  let ans = -1
  while (true) {
    const [used, components] = karger(graph, 2)

    if (components?.length === 2 && used + 3 === graph.edges.length) {
      ans = (components ?? []).reduce((acc, m) => acc * m.length, 1)
      break
    }
  }

  return ans
}

if (require.main === module) {
  const input = readFile(__dirname, 'problem.txt')
  console.log(`day1: ${day1(input)}`)
}
