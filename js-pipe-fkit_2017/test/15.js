const should = require('should')
const { genA, genB, lsb16Match, countLsbMatches } = require('../dist/day15')

// Test examples from instruction
const p1 = {
  a: 
`65
1092455
1181022009
245556042
1744312007
1352636452`.split('\n').map(s => Number(s)),
  b:
`8921
430625591
1233683848
1431495498
137874439
285222916`.split('\n').map(s => Number(s)),
  iters: 40000000,
  expected: 588,
}

describe('Day 15', async function() {
  this.timeout(0)

  it(`numGen on example is valid`, () => {
    for (let i=0; i < p1.a.length -1; i++) {
      const a = genA(p1.a[i])
      const b = genB(p1.b[i])
      a.should.equal(p1.a[i+1])
      b.should.equal(p1.b[i+1])
      if (i==2)
        lsb16Match(a, b).should.be.true()
      else
        lsb16Match(a, b).should.be.false()
    }
  })
  it(`matches count on example is valid`, () => {
    countLsbMatches(p1.a[0], p1.b[0], p1.iters).should.equal(p1.expected)
  })
})