import { describe, it, expect } from '@jest/globals'
import { readFile } from '../utils'
import given from 'given2'

import { day1, day2 } from './5'

describe('Day 5', () => {
  given('problem', () => readFile(__dirname, 'problem.txt'))
  given('example1', () => readFile(__dirname, 'example1.txt'))

  it('solves first part on example', () => {
    const lowestLocation = day1(given.example1)
    expect(lowestLocation).toBe(35n)
  })

  it('solves second part on example', () => {
    const lowestLocation = day2(given.example1)
    expect(lowestLocation).toBe(46n)
  })

  it('solves both challenges', () => {
    expect(day1(given.problem)).toBe(486613012n)
    expect(day2(given.problem)).toBe(56931769n)
  })
})
