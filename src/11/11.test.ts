import { describe, it, expect } from '@jest/globals'
import { readFile } from '../utils'
import given from 'given2'

import { day1, day2, forTesting } from './11'

const { solve } = forTesting

describe('Day 11', () => {
  given('problem', () => readFile(__dirname, 'problem.txt'))
  given('example1', () => readFile(__dirname, 'example1.txt'))

  it('solves first part on example', () => {
    const sum = day1(given.example1)
    expect(sum).toBe(374)
  })

  it('solves custom multiplier examples', () => {
    expect(solve(given.example1, 10)).toBe(1030)
    expect(solve(given.example1, 100)).toBe(8410)
  })

  it('solves both challenges', () => {
    expect(day1(given.problem)).toBe(9947476)
    expect(day2(given.problem)).toBe(519939907614)
  })
})
