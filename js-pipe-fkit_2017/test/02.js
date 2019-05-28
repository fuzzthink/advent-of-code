const should = require('should')
const { fold } = require('fkit')
const { strToInts2D } = require('../dist/helpers')
const { maxDiff, maxDiv } = require('../dist/day02')

// Test examples from instruction
const p1 = [
  { input: 
`5 1 9 5
7 5 3
2 4 6 8`, expected: 18 },
]
const p2 = [
  { input: 
`5 9 2 8
9 4 7 3
3 8 6 5`, expected: 9 },
]

describe('Day 02', () => {
  p1.map(d => {
    const xss = strToInts2D(d.input, ' ')
    it(`computation of example is correct`, () => {
      fold((a, xs) => a + maxDiff(xs), 0, xss).should.equal(d.expected)
    })
  })
  p2.map(d => {
    const xss = strToInts2D(d.input, ' ')
    it(`computation of example is correct`, () => {
      fold((a, xs) => a + maxDiv(xs), 0, xss).should.equal(d.expected)
    })
  })
})