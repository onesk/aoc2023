import { describe, it, expect } from '@jest/globals'
import { readFile } from '../utils'
import given from 'given2'

import { day1, day2 } from './4'

describe('Day 4', () => {
  given('problem', () => readFile(__dirname, 'problem.txt'))
  given('example1', () => readFile(__dirname, 'example1.txt'))

  it('solves first part on example', () => {
    const sum = day1(given.example1)
    expect(sum).toBe(13)
  })

  it('solves second part on example', () => {
    const sum = day2(given.example1)
    expect(sum).toBe(30)
  })

  it('solves both challenges', () => {
    expect(day1(given.problem)).toBe(23441)
    expect(day2(given.problem)).toBe(5923918)
  })
})
