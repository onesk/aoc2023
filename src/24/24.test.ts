import { describe, it, expect } from '@jest/globals'
import { readFile } from '../utils'
import given from 'given2'

import { day1, day2, forTesting } from './24'

const { parse, numberOfIntersections } = forTesting

describe('Day 24', () => {
  given('problem', () => readFile(__dirname, 'problem.txt'))
  given('example1', () => readFile(__dirname, 'example1.txt'))

  it('solves first part on first example', () => {
    const hails = parse(given.example1)
    const total = numberOfIntersections(7, 27, hails)
    expect(total).toBe(2)
  })

  it('solves second part on first example', async () => {
    const total = await day2(given.example1)
    expect(total).toBe(47)
  })

  it('solves both challenges', async () => {
    expect(day1(given.problem)).toBe(17867)
    expect(await day2(given.problem)).toBe(557743507346379)
  })
})
