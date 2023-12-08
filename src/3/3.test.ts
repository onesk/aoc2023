import { describe, it, expect } from '@jest/globals'
import { readFile } from '../utils'
import given from 'given2'

import { day1, day2 } from './3'

describe('Day 3', () => {
  given('problem', () => readFile(__dirname, 'problem.txt'))
  given('example1', () => readFile(__dirname, 'example1.txt'))

  it('solves first part on example', () => {
    const sum = day1(given.example1)
    expect(sum).toBe(4361)
  })

  it('solves second part on example', () => {
    const sum = day2(given.example1)
    expect(sum).toBe(467835)
  })

  it('solves both challenges', () => {
    expect(day1(given.problem)).toBe(525911)
    expect(day2(given.problem)).toBe(75805607)
  })
})
