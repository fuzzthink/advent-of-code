const should = require('should')
const { exe } = require('../dist/day16')

// Test examples from instruction
const p1 = {
  d: 'abcde'.split(''),
  moves: 
`s1
x3/4
pe/b`.split('\n'),
  expected: 'baedc'.split(''),
}

describe('Day 16', async function() {
  this.timeout(0)

  it(`exe moves on example is valid`, () => {
    let d = [...p1.d]
    p1.moves.forEach(move => {
      d = exe(move, d)
    })
    d.should.deepEqual(p1.expected)
  })
})