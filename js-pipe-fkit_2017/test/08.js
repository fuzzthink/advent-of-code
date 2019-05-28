const should = require('should')
const { maximum, map } = require('fkit')
const { initVars, runInst, parseInst } = require('../dist/day08')

// Test examples from instruction
const p1 = [
  { input: 
`b inc 5 if a > 1
a inc 1 if b < 5
c dec -10 if a >= 1
c inc -20 if c == 10`, expected: 1, p2expected: 10 },
]

describe('Day 08', () => {
  p1.map(d => {
    it(`computation of example is correct`, () => {
      const insts = map(parseInst, d.input.split('\n'))
      const vars = initVars(insts)
      const intermediaries = insts.map(inst => runInst(inst, vars))
      maximum(Object.values(vars)).should.equal(d.expected)
      maximum(intermediaries).should.equal(d.p2expected)
    })
  })
})