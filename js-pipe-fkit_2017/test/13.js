const should = require('should')
const { pathCost, delayNeeded } = require('../dist/day13')

// Test examples from instruction
const p1 = [
  { input:
`0: 3
1: 2
4: 4
6: 4`, expected: 24, p2expected: 10 },
]

describe('Day 13', () => {
  p1.map(d => {
    it(`"severity" of test is valid`, () => {
      pathCost(d.input).should.equal(d.expected)
    })
    it(`Delay cycles needed to not get caught is valid`, () => {
      delayNeeded(d.input).should.equal(d.p2expected)
    })
  })
})