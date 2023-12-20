import { describe, it, expect } from '@jest/globals'
import { readFile } from '../utils'
import given from 'given2'

import { day1, day2 } from './20'

describe('Day 20', () => {
  given('problem', () => readFile(__dirname, 'problem.txt'))
  given('example1', () => readFile(__dirname, 'example1.txt'))
  given('example2', () => readFile(__dirname, 'example2.txt'))

  it('solves first part on first example', () => {
    const total = day1(given.example1)
    expect(total).toBe(32000000)
  })

  it('solves first part on second example', () => {
    const total = day1(given.example2)
    expect(total).toBe(11687500)
  })

  it('solves both challenges', () => {
    expect(day1(given.problem)).toBe(825896364)
    expect(day2(given.problem)).toBe(243566897206981)
  })
})
