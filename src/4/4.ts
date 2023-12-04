import { readFile } from '../utils'

class Card {
  id: number
  winning: number[]
  present: number[]

  constructor (line: string) {
    const [card, numbers] = line.trim().split(':')
    const [winning, present] = numbers.trim().split('|')

    const { 1: idStr } = /^Card (\d+)/.exec(card) ?? [null, '-1']

    this.id = Number(idStr ?? '-1')
    this.winning = parseNumbers(winning)
    this.present = parseNumbers(present)
  }

  matches (): number {
    let cnt = 0
    for (const have of this.present) {
      cnt += Number(this.winning.includes(have))
    }

    return cnt
  }

  points (): number {
    const cnt = this.matches()
    return cnt === 0 ? 0 : 1 << (cnt - 1)
  }
}

function parseNumbers (line: string): number[] {
  return line.trim().split(/\s+/).map(Number)
}

function parse (input: string): Card[] {
  return input.trim().split('\n').map((line) => new Card(line))
}

export function day1 (input: string): number {
  const cards = parse(input)
  const sum = cards.map((card) => card.points()).reduce((acc, cur) => acc + cur, 0)
  return sum
}

export function day2 (input: string): number {
  const cards = parse(input)

  const counts = Array(cards.length).fill(1)

  for (let i = 0; i < counts.length; i++) {
    const len = cards[i].matches()

    for (let j = 1; j <= len; j++) {
      counts[i + j] += counts[i]
    }
  }

  return counts.reduce((a, c) => a + c, 0)
}

if (require.main === module) {
  const input = readFile(__dirname, 'problem.txt')
  console.log(`day1: ${day1(input)}`)
  console.log(`day2: ${day2(input)}`)
}
