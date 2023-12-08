import { describe, it, expect } from '@jest/globals'
import { readFile } from '../utils'
import given from 'given2'

import { day1, day2, forTesting } from './2'

const { parseGame } = forTesting

describe('Day 2', () => {
  given('problem', () => readFile(__dirname, 'problem.txt'))
  given('example1', () => readFile(__dirname, 'example1.txt'))

  it('game parser is correct', () => {
    expect(parseGame('Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red'))
      .toStrictEqual(
        {
          id: 3,
          rounds: [
            { red: 20, green: 8, blue: 6 },
            { red: 4, green: 13, blue: 5 },
            { red: 1, green: 5, blue: 0 }
          ]
        })
  })

  it('solves first part on example', () => {
    const sum = day1(given.example1)
    expect(sum).toBe(8)
  })

  it('solves second part on example', () => {
    const sumProduct = day2(given.example1)
    expect(sumProduct).toBe(2286)
  })

  it('solves both challenges', () => {
    expect(day1(given.problem)).toBe(2512)
    expect(day2(given.problem)).toBe(67335)
  })
})
