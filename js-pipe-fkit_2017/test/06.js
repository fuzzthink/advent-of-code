const should = require('should')
const { strToInts } = require('../dist/helpers')
const { countAllocs, countPrvSeen } = require('../dist/day06')

// Test examples from instruction
const p1 = [
  { input: '0 2 7 0', expected: 5, p2expected: 4 },
]

describe('Day 06', () => {
  p1.map(d => {
    const ints = strToInts(d.input, ' ')
    it(`computation of example is correct`, () => {
      countAllocs(ints, {}).should.equal(d.expected)
    })
    it(`computation of example is correct`, () => {
      countPrvSeen(ints, {}).should.equal(d.p2expected)
    })
  })
})