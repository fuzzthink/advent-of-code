const should = require('should')
const { CirBuffer } = require('../dist/day17')

// Test examples from instruction
const d = {
  expected: [
[0, 1],
[0, 2, 1],
[0, 2, 3, 1],
[0, 2, 4, 3, 1],
[0, 5, 2, 4, 3, 1],
[0, 5, 2, 4, 3, 6, 1],
[0, 5, 7, 2, 4, 3, 6, 1],
[0, 5, 7, 2, 4, 3, 8, 6, 1],
[0, 9, 5, 7, 2, 4, 3, 8, 6, 1]],
  expectedAfter2017: 638,
}

describe('Day 17', async function() {
  this.timeout(0)
  const buf = new CirBuffer(3)

  it(`insert works`, () => {
    for (let i=1; i <= d.expected.length; i++) {
      buf.insert(i).should.deepEqual(d.expected[i-1])
    }
  })
  it(`insertNx, findAfter works`, () => {
    buf.reset().insertTo(2017).findAfter(2017).should.equal(d.expectedAfter2017)
  })
})