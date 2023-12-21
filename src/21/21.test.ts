import { describe, it, expect } from '@jest/globals'
import { readFile } from '../utils'
import given from 'given2'

import { day1, day2, forTesting } from './21'

const { reachableBounded, reachableWrapped, parse } = forTesting

describe('Day 21', () => {
  given('problem', () => readFile(__dirname, 'problem.txt'))
  given('example1', () => readFile(__dirname, 'example1.txt'))

  it('solves the example for the first part', () => {
    const total = reachableBounded(parse(given.example1), 6)
    expect(total).toBe(16)
  })

  it('solves the examples for the second part', () => {
    const problem = parse(given.example1)
    expect(reachableWrapped(problem, 6)).toBe(16)
    expect(reachableWrapped(problem, 10)).toBe(50)
    expect(reachableWrapped(problem, 50)).toBe(1594)
    expect(reachableWrapped(problem, 100)).toBe(6536)
  })

  it('solves both challenges', () => {
    expect(day1(given.problem)).toBe(3751)
    expect(day2(given.problem)).toBe(619407349431167)
  })
})
