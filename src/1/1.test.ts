import { describe, it, expect } from '@jest/globals'
import { readFile } from '../utils'
import given from 'given2'

import { day1, day2, forTesting } from './1'

const { spelledOutExtract } = forTesting

describe('Day 1', () => {
  given('problem', () => readFile(__dirname, 'problem.txt'))
  given('example1', () => readFile(__dirname, 'example1.txt'))
  given('example2', () => readFile(__dirname, 'example2.txt'))

  it('solves first example', () => {
    const sum = day1(given.example1)
    expect(sum).toBe(142)
  })

  it('solves second example', () => {
    const sum = day2(given.example2)
    expect(sum).toBe(281)
  })

  it('solves both challenges', () => {
    expect(day1(given.problem)).toBe(54388)
    expect(day2(given.problem)).toBe(53515)
  })

  it('spelledOutExtract is correct for single digits', () => {
    expect(spelledOutExtract('one')).toStrictEqual([1, 1])
    expect(spelledOutExtract('two')).toStrictEqual([2, 2])
    expect(spelledOutExtract('three')).toStrictEqual([3, 3])
    expect(spelledOutExtract('four')).toStrictEqual([4, 4])
    expect(spelledOutExtract('five')).toStrictEqual([5, 5])
    expect(spelledOutExtract('six')).toStrictEqual([6, 6])
    expect(spelledOutExtract('seven')).toStrictEqual([7, 7])
    expect(spelledOutExtract('eight')).toStrictEqual([8, 8])
    expect(spelledOutExtract('nine')).toStrictEqual([9, 9])
  })
})
