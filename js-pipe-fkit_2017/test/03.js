const should = require('should')
const { distTo1 } = require('../dist/day03')

// Test examples from instruction
const p1 = [
  { input: 1, expected: 0 },
  { input: 12, expected: 3 },
  { input: 23, expected: 2 },
  { input: 1024, expected: 31 },
]

describe('Day 03', () => {
  p1.map(d => {
    it(`computation of example is correct`, () => {
      distTo1(d.input).should.equal(d.expected)
    })
  })
})