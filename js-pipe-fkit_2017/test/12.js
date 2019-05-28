const should = require('should')
const { parseConns, countConnsToNode } = require('../dist/day12')

// Test examples from instruction
const p1 = { input: 
`0 <-> 2
1 <-> 1
2 <-> 0, 3, 4
3 <-> 2, 4
4 <-> 2, 3, 6
5 <-> 6
6 <-> 4, 5`,
  toNode: '0',
  expected: 6 } 

describe('Day 12', () => {
  it(`Number of connections to node "${p1.toNode}" is ${p1.expected}`, () => {
    const countConnsToNode0 = countConnsToNode(p1.toNode)
    countConnsToNode0(parseConns(p1.input)).should.equal(p1.expected)
  })
})