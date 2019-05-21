const should = require('should')
const { knotHash } = require('../dist/day10')

// Test examples from instruction
const data = {
  list: [0, 1, 2, 3, 4], 
  lens: [3, 4, 1, 5],
  expected: [3, 4, 2, 1, 0]
}

describe('knotHash()', () => {
  it(`of ${data.list} = ${data.expected}`, () => {
    knotHash(data.list, data.lens, 0).should.deepEqual(data.expected)
  })
})