import { describe, it, expect } from '@jest/globals'
import { readFile } from '../utils'
import given from 'given2'

import { day1, day2, forTesting } from './7'

const { determineType } = forTesting

describe('Day 7', () => {
  given('problem', () => readFile(__dirname, 'problem.txt'))
  given('example1', () => readFile(__dirname, 'example1.txt'))

  it('determines type correctly without jokers', () => {
    expect(determineType('AAAAA', false)).toEqual([6, 'fiveOfAKind'])
    expect(determineType('AA8AA', false)).toEqual([5, 'fourOfAKind'])
    expect(determineType('23332', false)).toEqual([4, 'fullHouse'])
    expect(determineType('TTT98', false)).toEqual([3, 'threeOfAKind'])
    expect(determineType('23432', false)).toEqual([2, 'twoPair'])
    expect(determineType('A23A4', false)).toEqual([1, 'onePair'])
    expect(determineType('23456', false)).toEqual([0, 'highCard'])
  })

  it('determines best type correctly with jokers', () => {
    expect(determineType('QJJQ2', true)).toEqual([5, 'fourOfAKind'])
    expect(determineType('T55J5', true)).toEqual([5, 'fourOfAKind'])
    expect(determineType('KTJJT', true)).toEqual([5, 'fourOfAKind'])
    expect(determineType('QQQJA', true)).toEqual([5, 'fourOfAKind'])
  })

  it('solves first part on example', () => {
    const totalWinnings = day1(given.example1)
    expect(totalWinnings).toBe(6440)
  })

  it('solves second part on example', () => {
    const totalWinnings = day2(given.example1)
    expect(totalWinnings).toBe(5905)
  })

  it('solves both challenges', () => {
    expect(day1(given.problem)).toBe(251029473)
    expect(day2(given.problem)).toBe(251003917)
  })
})
