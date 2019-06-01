const should = require('should')
const { take } = require('fkit')
const { multiKnotHash, count1s } = require('../dist/day14')

// Test examples from instruction
const p1 = {
  d: 'flqrgnkx',
  expectedSample: 
`d4
55
0a
ad
68
c9
44
d6`.split('\n'),
  expectedSample1s: 29, 
}

const getXcharsYlines = (a, x, y) => take(y, a).map(s => s.slice(0, x))

describe('Day 14', async function() {
  this.timeout(0)
  const sampleStrs = getXcharsYlines(multiKnotHash(p1.d), 2, 8)

  it(`Sample multiKnoxHash output of "${p1.d}" is valid`, () => {
    sampleStrs.should.deepEqual(p1.expectedSample)
  })
  it(`Sample multiKnoxHash output of "${p1.d}" 1's count is valid`, () => {
    count1s(sampleStrs).should.equal(p1.expectedSample1s)
  })
})