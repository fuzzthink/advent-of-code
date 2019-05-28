const should = require('should')
const { sumIfEqNextI } = require('../dist/day01')
const { charsStrToInts } = require('../dist/helpers')

// Test examples from instruction
const p1 = [
  { input: '1122', expected: 3 },
  { input: '1111', expected: 4 },
  { input: '1234', expected: 0 },
  { input: '91212129', expected: 9 },
]
const p2 = [
  { input: '1212', expected: 6 },
  { input: '1221', expected: 0 },
  { input: '123425', expected: 4 },
  { input: '123123', expected: 12 },
  { input: '12131415', expected: 4 },
]

describe('Day 01', () => {
  p1.map(d => {
    const ints = charsStrToInts(d.input)
    it(`captcha sum of "${d.input}" is ${d.expected}`, () => {
      sumIfEqNextI(1, ints).should.equal(d.expected)
    })
  })
  p2.map(d => {
    const ints = charsStrToInts(d.input)
    it(`captcha sum of "${d.input}" is ${d.expected}`, () => {
      sumIfEqNextI(ints.length/2, ints).should.equal(d.expected)
    })
  })
})