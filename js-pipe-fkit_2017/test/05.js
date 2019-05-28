const should = require('should')
const { strToInts } = require('../dist/helpers')
const { doSteps, step, step2 } = require('../dist/day05')

// Test examples from instruction
const p1 = [
  { input: 
`0
3
0
1
-3`, expected: 5, p2expected: 10 },
]
const p2 = [
  { input: 
`abcde fghij
abcde xyz ecdab
a ab abc abd abf abj
iiii oiii ooii oooi oooo
oiii ioii iioi iiio`, expected: 3 },
  ]

describe('Day 05', () => {
  p1.map(d => {
    const ints = strToInts(d.input)
    it(`computation of example is correct`, () => {
      doSteps(step, ints).should.equal(d.expected)
    })
    it(`computation of example is correct`, () => {
      doSteps(step2, ints).should.equal(d.p2expected)
    })
  })
})