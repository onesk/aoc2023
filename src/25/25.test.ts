import { describe, it, expect } from '@jest/globals'
import { readFile } from '../utils'
import given from 'given2'

import { day1 } from './25'

describe('Day 25', () => {
  given('problem', () => readFile(__dirname, 'problem.txt'))
  given('example1', () => readFile(__dirname, 'example1.txt'))

  it('solves the only part on first example', () => {
    const total = day1(given.example1)
    expect(total).toBe(54)
  })

  it('solves the challenge', async () => {
    expect(day1(given.problem)).toBe(562772)
  })
})
