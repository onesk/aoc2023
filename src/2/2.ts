import { readFile } from '../utils'

interface Round {
  red: number
  green: number
  blue: number
}

interface Game {
  id: number
  rounds: Round[]
}

const emptyRound: Round = {
  red: 0,
  green: 0,
  blue: 0
}

const upperBound: Round = {
  red: 12,
  green: 13,
  blue: 14
}

function addRounds (r1: Round, r2: Round): Round {
  const { red: red1, green: green1, blue: blue1 } = r1
  const { red: red2, green: green2, blue: blue2 } = r2

  return {
    red: red1 + red2,
    green: green1 + green2,
    blue: blue1 + blue2
  }
}

function roundsLte (r1: Round, r2: Round): boolean {
  return r1.red <= r2.red && r1.green <= r2.green && r1.blue <= r2.blue
}

function roundsMax (r1: Round, r2: Round): Round {
  return {
    red: Math.max(r1.red, r2.red),
    green: Math.max(r1.green, r2.green),
    blue: Math.max(r1.blue, r2.blue)
  }
}

function roundPower (r: Round): number {
  const { red, green, blue } = r
  return red * green * blue
}

function parseGame (line: string): Game {
  const [idStr, roundsStr] = line.split(':')
  const idMatch = idStr.match(/^Game (\d+)/) ?? [null, NaN]
  const id = Number(idMatch[1])

  const rounds = roundsStr.split(';').map((roundStr) => {
    const draws = roundStr.split(',').map((drawStr) => {
      const match = drawStr.match(/(\d+) (red|green|blue)/) ?? [null, NaN, 'red']
      const [count, kind] = [Number(match[1]), match[2]]

      const round = Object.assign({}, emptyRound)
      round[kind] = count
      return round
    })

    return draws.reduce((sum, round) => addRounds(sum, round), emptyRound)
  })

  return { id, rounds }
}

function parse (input: string): Game[] {
  return input.trim().split('\n').map(parseGame)
}

export function day1 (input: string): number {
  const games = parse(input)
  return games.filter(({ rounds }) => rounds.every((r) => roundsLte(r, upperBound))).reduce((sum, { id }) => id + sum, 0)
}

export function day2 (input: string): number {
  const games = parse(input)
  return games.map(({ rounds }) => rounds.reduce((max, round) => roundsMax(max, round), emptyRound))
    .map(roundPower)
    .reduce((sum, power) => sum + power, 0)
}

export const forTesting = { parseGame }

if (require.main === module) {
  const input = readFile(__dirname, 'problem.txt')
  console.log(`day1: ${day1(input)}`)
  console.log(`day2: ${day2(input)}`)
}
