import { readFile } from '../utils'

type Name = string
type Kind = 'nand' | 'ff' | 'bc'
type Pulse = 'low' | 'high'

interface Fanout {
  kind: Kind
  adj: Name[]
}

type Circuit = Map<Name, Fanout>

function parse (input: string): Circuit {
  const circuit: Circuit = new Map()

  for (const line of input.trim().split('\n')) {
    const [nameStr, fanoutStr] = line.split('->')

    let kind: Kind = 'bc'
    let name = (nameStr ?? '').trim()

    if (name.startsWith('%')) {
      name = name.slice(1)
      kind = 'ff'
    } else if (name.startsWith('&')) {
      name = name.slice(1)
      kind = 'nand'
    }

    const adj = (fanoutStr ?? '').split(',').map((f) => f.trim())

    circuit.set(name, { kind, adj })
  }

  return circuit
}

interface SimState {
  ff: Map<Name, boolean>
  conjIn: Map<Name, Map<Name, Pulse>>
}

function newSimState (circuit: Circuit): SimState {
  const ff = new Map()

  for (const [name, { kind }] of circuit.entries()) {
    if (kind === 'ff') {
      ff.set(name, false)
    }
  }

  const conjIn = new Map()

  for (const [name, { adj }] of circuit.entries()) {
    for (const dest of adj) {
      if (circuit.get(dest)?.kind === 'nand') {
        if (!conjIn.has(dest)) {
          conjIn.set(dest, new Map())
        }

        conjIn.get(dest).set(name, 'low')
      }
    }
  }

  return { ff, conjIn }
}

type EndPred = (pulseOut: Pulse, name: Name) => boolean

interface SimResult {
  low: number
  high: number
  ended: boolean
}

function simulate (circuit: Circuit, { ff, conjIn }: SimState, endPred: EndPred): SimResult {
  let [low, high, ended] = [0, 0, false]

  const queue: Array<[Name, Name, Pulse]> = [['button', 'broadcaster', 'low']]
  let qe = 0

  while (qe < queue.length) {
    const [src, name, pulse] = queue[qe++]
    const { kind, adj } = circuit.get(name) ?? { adj: [] }

    if (pulse === 'low') {
      low++
    } else {
      high++
    }

    if (endPred(pulse, src)) {
      ended = true
      break
    }

    // console.log(`src: ${src} name: ${name} pulse: ${pulse} kind: ${kind} adj: ${adj}`)

    if (kind === 'ff') {
      if (pulse === 'low') {
        ff.set(name, !(ff.get(name) === true))

        const pulseOut = ff.get(name) === true ? 'high' : 'low'
        for (const dest of adj) {
          queue.push([name, dest, pulseOut])
        }
      }
    }

    if (kind === 'nand') {
      const ins = conjIn.get(name) ?? new Map()
      ins.set(src, pulse)

      const allHigh = [...ins.values()].every((p) => p === 'high')
      const pulseOut = allHigh ? 'low' : 'high'

      for (const dest of adj) {
        queue.push([name, dest, pulseOut])
      }
    }

    if (kind === 'bc') {
      for (const dest of adj) {
        queue.push([name, dest, pulse])
      }
    }
  }

  return { low, high, ended }
}

export function day1 (input: string): number {
  const circuit = parse(input)

  let [lowSum, highSum] = [0, 0]
  const simState = newSimState(circuit)

  for (let run = 0; run < 1000; run++) {
    const { low, high } = simulate(circuit, simState, () => false)

    lowSum += low
    highSum += high
  }

  return lowSum * highSum
}

function gcd (a: number, b: number): number {
  while (b !== 0) {
    const rem = a % b
    a = b
    b = rem
  }

  return a
}

export function day2 (input: string): number {
  const circuit = parse(input)

  const final = 'rx'
  const finalConjs = [...circuit.entries()]
    .filter(([name, { kind, adj }]) => kind === 'nand' && adj.includes(final))
    .map(([name]) => name)

  const finalConjsIn = [...circuit.entries()]
    .filter(([name, { adj }]) => finalConjs.some((finalConj) => adj.includes(finalConj)))
    .map(([name]) => name)

  let lcm = 1

  for (const finalConjIn of finalConjsIn) {
    let buttons = 0
    const simState = newSimState(circuit)

    while (true && buttons < 20000) {
      buttons++

      const { ended } = simulate(circuit, simState, (pulseOut, name) => pulseOut === 'high' && name === finalConjIn)

      if (ended) {
        break
      }
    }

    lcm = lcm / gcd(lcm, buttons) * buttons
  }

  return lcm
}

if (require.main === module) {
  const input = readFile(__dirname, 'problem.txt')
  console.log(`day1: ${day1(input)}`)
  console.log(`day2: ${day2(input)}`)
}
