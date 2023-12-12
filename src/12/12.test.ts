import { describe, it, expect } from '@jest/globals'
import { readFile } from '../utils'
import given from 'given2'

import { day1, day2 } from './12'

describe('Day 12', () => {
  given('problem', () => readFile(__dirname, 'problem.txt'))
  given('example1', () => readFile(__dirname, 'example1.txt'))

  it('solves first part on first example', () => {
    const total = day1(given.example1)
    expect(total).toBe(21)
  })

  it('solves second part on first example', () => {
    const total = day2(given.example1)
    expect(total).toBe(525152)
  })

  it('solves both challenges', () => {
    expect(day1(given.problem)).toBe(7922)
    expect(day2(given.problem)).toBe(18093821750095)
  })
})
