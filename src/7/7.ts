import { readFile } from '../utils'

const RANKS_REGULAR = '23456789TJQKA'
const RANKS_JOKER = 'J23456789TQKA'

const TYPES = {
  5: [6, 'fiveOfAKind'],
  '4,1': [5, 'fourOfAKind'],
  '3,2': [4, 'fullHouse'],
  '3,1,1': [3, 'threeOfAKind'],
  '2,2,1': [2, 'twoPair'],
  '2,1,1,1': [1, 'onePair'],
  '1,1,1,1,1': [0, 'highCard']
}

class Hand {
  cards: string
  ranks: number
  kind: [number, string]

  constructor (input: string, hasJokers: boolean) {
    this.cards = input
    this.ranks = determineRanks(input, hasJokers)
    this.kind = determineType(input, hasJokers)
  }

  compare (other: Hand): number {
    if (this.kind[0] !== other.kind[0]) {
      return this.kind[0] - other.kind[0]
    }

    return this.ranks - other.ranks
  }
}

function determineRanks (cards: string, hasJokers: boolean): number {
  const grade = hasJokers ? RANKS_JOKER : RANKS_REGULAR
  const radix = grade.length
  return Array.from(cards).map((face) => grade.indexOf(face)).reduce((acc, rank) => acc * radix + rank, 0)
}

function determineType (cards: string, hasJokers: boolean): [number, string] {
  let max: [number, string] = [-1, 'unknown']
  const casts = hasJokers ? getCasts(cards) : [cards]

  for (const cast of casts) {
    const singleType = determineTypeSingle(cast)

    if (singleType[0] > max[0]) {
      max = singleType
    }
  }

  return max
}

function getCasts (cards: string): string[] {
  if (cards.length === 0) {
    return ['']
  }

  const subcasts = getCasts(cards.slice(1))
  const face = cards.charAt(0)

  return subcasts.flatMap((subcast) => Array.from(face === 'J' ? RANKS_JOKER : face).map((f) => f + subcast))
}

function determineTypeSingle (cards: string): [number, string] {
  const faceCounts = Object.values(Array.from(cards).reduce((acc: Record<string, number>, face) => {
    acc[face] = (acc[face] ?? 0) + 1
    return acc
  }, {}))

  faceCounts.sort((c1, c2) => c2 - c1)
  return TYPES[faceCounts.toString()] ?? [-1, 'unknown']
}

function parse (input: string, hasJokers: boolean): Array<[Hand, number]> {
  const hands: Array<[Hand, number]> = input.trim().split('\n').map((line) => {
    const [handStr, bidStr] = line.trim().split(/\s+/)
    return [new Hand(handStr, hasJokers), Number(bidStr)]
  })

  hands.sort(([a, _aBid], [b, _bBid]) => a.compare(b))
  return hands
}

function totalWinnings (hands: Array<[Hand, number]>): number {
  return hands.reduce((acc, [_, bid], index) => acc + (index + 1) * bid, 0)
}

export function day1 (input: string): number {
  return totalWinnings(parse(input, false))
}

export function day2 (input: string): number {
  return totalWinnings(parse(input, true))
}

export const forTesting = { determineType }

if (require.main === module) {
  const input = readFile(__dirname, 'problem.txt')
  console.log(`day1: ${day1(input)}`)
  console.log(`day2: ${day2(input)}`)
}
