const should = require('should')
const { exeMoves, exeMovesNx, rotateR, swapAt, swapXY } = require('../dist/day16')

// Test examples from instruction
const d = {
  str: 'abcde',
  moves: 
`s1
x3/4
pe/b`.split('\n'),
  expected: 'baedc',
  expected2: 'ceadb',
}

describe('Day 16', async function() {
  this.timeout(0)

  const a = d.str.split('')
  it(`rotateR, swapAt, swapXY works`, () => {
    rotateR( 2)([...a]).should.deepEqual('deabc'.split(''))
    swapAt(0,2)([...a]).should.deepEqual('cbade'.split(''))
    swapXY('a','b')([...a]).should.deepEqual('bacde'.split(''))
  })
  it(`exeMoves on example is valid`, () => {
    exeMoves(d.moves, d.str).should.equal(d.expected)
  })
  it(`exeMovesNtimes on example is valid`, () => {
    exeMovesNx(d.moves, 2, d.str).should.equal(d.expected2)
  })
})