import { describe, it, expect } from '@jest/globals'
import { readFile } from '../utils'
import given from 'given2'

import { day1, day2 } from './10'

describe('Day 10', () => {
  given('problem', () => readFile(__dirname, 'problem.txt'))
  given('example1', () => readFile(__dirname, 'example1.txt'))
  given('example2', () => readFile(__dirname, 'example2.txt'))
  given('example3', () => readFile(__dirname, 'example3.txt'))
  given('example4', () => readFile(__dirname, 'example4.txt'))
  given('example5', () => readFile(__dirname, 'example5.txt'))

  it('solves first part on first example', () => {
    const steps = day1(given.example1)
    expect(steps).toBe(4)
  })

  it('solves first part on second example', () => {
    const steps = day1(given.example2)
    expect(steps).toBe(8)
  })

  it('solves second part on third example', () => {
    const area = day2(given.example3)
    expect(area).toBe(4)
  })

  it('solves second part on fourth example', () => {
    const area = day2(given.example4)
    expect(area).toBe(8)
  })

  it('solves second part on fifth example', () => {
    const area = day2(given.example5)
    expect(area).toBe(10)
  })

  it('solves both challenges', () => {
    expect(day1(given.problem)).toBe(6864)
    expect(day2(given.problem)).toBe(349)
  })
})
