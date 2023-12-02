import { readFile } from '../utils'

function extractFirstAndLastDigits (regex: RegExp, names: Record<string, number>, line: string): [number, number] | null {
  const matches = [...line.matchAll(regex)]

  if (matches.length < 1) {
    return null
  }

  function parse (str: string): number {
    return names[str] ?? parseInt(str, 10)
  }

  const first: number = parse(matches[0][1])
  const last: number = parse(matches[matches.length - 1][1])

  return [first, last]
}

function sumLinesWith (input: string, eachLine: (line: string) => [number, number]): number {
  const lines = input.trim().split('\n')
  return lines.map(eachLine).reduce((sum, [first, last]) => sum + 10 * first + last, 0)
}

function explicitExtract (line: string): [number, number] {
  return extractFirstAndLastDigits(/(\d)/g, {}, line)
}

function spelledOutExtract (line: string): [number, number] {
  const realDigits = /(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g
  const names = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9
  }

  return extractFirstAndLastDigits(realDigits, names, line)
}

export function day1 (input: string): number {
  return sumLinesWith(input, explicitExtract)
}

export function day2 (input: string): number {
  return sumLinesWith(input, spelledOutExtract)
}

export const forTesting = { spelledOutExtract }

if (require.main === module) {
  const input = readFile(__dirname, 'problem.txt')
  console.log(`day1: ${day1(input)}`)
  console.log(`day2: ${day2(input)}`)
}
