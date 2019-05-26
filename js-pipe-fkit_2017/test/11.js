const should = require('should')
const { csvToSteps } = require('../dist/day11')

// Test examples from instruction
const p1 = [
  { input: 'ne,ne,ne', expected: 3 },
  { input: 'ne,ne,sw,sw', expected: 0 },
  { input: 'ne,ne,s,s', expected: 2 },
  { input: 'se,sw,se,sw,sw', expected: 3 },
  { input: 'ne,ne,ne,ne,ne,sw,sw,ne,ne,s,s,se,sw,se,sw,sw', expected: 4 },
  { input: 'ne,ne,ne,ne,ne,            s,s,se,sw,se,sw,sw', expected: 4 },
]

describe('Day 11', () => {
  p1.map(d => {
    it(`"${d.input}" takes ${d.expected} steps`, () => {
      csvToSteps(d.input).should.equal(d.expected)
    })
  })
})