import { describe, it, expect } from '@jest/globals'
import { readFile } from '../utils'
import given from 'given2'

import { day1, day2, forTesting } from './15'

const { hash } = forTesting

describe('Day 15', () => {
  given('problem', () => readFile(__dirname, 'problem.txt'))
  given('example1', () => readFile(__dirname, 'example1.txt'))

  it('computes reference hash correctly', () => {
    expect(hash('HASH')).toBe(52)
  })

  it('solves first part on first example', () => {
    const total = day1(given.example1)
    expect(total).toBe(1320)
  })

  it('solves second part on first example', () => {
    const total = day2(given.example1)
    expect(total).toBe(145)
  })

  it('solves both challenges', () => {
    expect(day1(given.problem)).toBe(498538)
    expect(day2(given.problem)).toBe(286278)
  })
})
