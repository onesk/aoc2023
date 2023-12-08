import { describe, it, expect } from '@jest/globals'
import { readFile } from '../utils'
import given from 'given2'

import { day1, day2 } from './8'

describe('Day 8', () => {
  given('problem', () => readFile(__dirname, 'problem.txt'))
  given('example1', () => readFile(__dirname, 'example1.txt'))
  given('example2', () => readFile(__dirname, 'example2.txt'))
  given('example3', () => readFile(__dirname, 'example3.txt'))

  it('solves first example', () => {
    const steps = day1(given.example1)
    expect(steps).toBe(2)
  })

  it('solves second example', () => {
    const steps = day1(given.example2)
    expect(steps).toBe(6)
  })

  it('solves third example', () => {
    const steps = day2(given.example3)
    expect(steps).toBe(6)
  })

  it('solves both challenges', () => {
    expect(day1(given.problem)).toBe(17263)
    expect(day2(given.problem)).toBe(14631604759649)
  })
})
