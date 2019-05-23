const should = require('should')
const { genSparseHash, knotHash } = require('../dist/day10')

// Test examples from instruction
const p1 = {
  list: [0, 1, 2, 3, 4], 
  lens: [3, 4, 1, 5],
  expected: [3, 4, 2, 1, 0]
}
const p2 = [
  { input: '', expected: 'a2582a3a0e66e6e86e3812dcb672a272' },
  { input: 'AoC 2017', expected: '33efeb34ea91902bb2f59c9920caa6cd' },
  { input: '1,2,3', expected: '3efbe78a8d82f29979031a4aa0b16a9d' },
  { input: '1,2,4', expected: '63960835bcdc130f0b66d7ff4f6a5a8e' },
]

describe('Day 10', () => {
  it(`sparseHash of [${p1.lens}] with list ${p1.list}`, () => {
    genSparseHash(p1.lens, p1.list).should.deepEqual(p1.expected)
  })
  p2.map(d => {
    it(`knoxHash of "${d.input}" with list 0..255`, () => {
      knotHash(d.input).should.equal(d.expected)
    })
  })
})