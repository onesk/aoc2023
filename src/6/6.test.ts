import { describe, it, expect } from '@jest/globals'
import { readFile } from '../utils'
import given from 'given2'

import { day1, day2 } from './6'

describe('Day 6', () => {
  given('problem', () => readFile(__dirname, 'problem.txt'))
  given('example1', () => readFile(__dirname, 'example1.txt'))

  it('solves first example', () => {
    const lowestLocation = day1(given.example1)
    expect(lowestLocation).toBe(288)
  })

  it('solves second example', () => {
    const sum = day2(given.example1)
    expect(sum).toBe(71503)
  })

  it('solves both challenges', () => {
    expect(day1(given.problem)).toBe(393120)
    expect(day2(given.problem)).toBe(36872656)
  })
})
