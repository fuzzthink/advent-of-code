const should = require('should')
const {
  parseAndPartition, toObject, mapNodes, getDesiredWt, getRootLabel
} = require('../dist/day07')

// Test examples from instruction
const p1 = [
  { input: 
`pbga (66)
xhth (57)
ebii (61)
havc (66)
ktlj (57)
fwft (72) -> ktlj, cntj, xhth
qoyq (66)
padx (45) -> pbga, havc, qoyq
tknk (41) -> ugml, padx, fwft
jptl (61)
ugml (68) -> gyxo, ebii, jptl
gyxo (61)
cntj (57)`, expected: 'tknk', p2expected: 60 },
]

describe('Day 07', () => {
  p1.map(d => {
    it(`computation of example is correct`, () => {
      const [singles, branches, nodes] = parseAndPartition(d.input)
      const mapped = toObject(singles, 0)
      getRootLabel(mapNodes(branches, mapped)).should.equal(d.expected)
    })
    it(`computation of example is correct`, () => {
      const [singles, branches, nodes] = parseAndPartition(d.input)
      const singleWts = toObject(singles)
      const allWts = toObject(nodes)
      getDesiredWt(branches, singleWts, allWts).should.equal(d.p2expected)
    })
  })
})