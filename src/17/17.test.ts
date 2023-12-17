import { describe, it, expect } from '@jest/globals'
import { readFile } from '../utils'
import given from 'given2'

import { day1, day2 } from './17'

describe('Day 16', () => {
  given('problem', () => readFile(__dirname, 'problem.txt'))
  given('example1', () => readFile(__dirname, 'example1.txt'))
  given('example2', () => readFile(__dirname, 'example2.txt'))

  it('solves first part on first example', () => {
    const total = day1(given.example1)
    expect(total).toBe(102)
  })

  it('solves second part on first example', () => {
    const total = day2(given.example1)
    expect(total).toBe(94)
  })

  it('solves second part on second example', () => {
    const total = day2(given.example2)
    expect(total).toBe(71)
  })

  it('solves both challenges', () => {
    expect(day1(given.problem)).toBe(907)
    expect(day2(given.problem)).toBe(1057)
  })
})
