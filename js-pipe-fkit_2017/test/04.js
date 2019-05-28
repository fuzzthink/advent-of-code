const should = require('should')
const { strToWords2D } = require('../dist/helpers')
const { countValids, noDups, noAnagrams } = require('../dist/day04')

// Test examples from instruction
const p1 = [
  { input: 
`aa bb cc dd ee
aa bb cc dd aa
aa bb cc dd aaa`, expected: 2 },
]
const p2 = [
  { input: 
`abcde fghij
abcde xyz ecdab
a ab abc abd abf abj
iiii oiii ooii oooi oooo
oiii ioii iioi iiio`, expected: 3 },
  ]

describe('Day 04', () => {
  p1.map(d => {
    const aa = strToWords2D(d.input)
    it(`computation of example is correct`, () => {
      countValids(noDups, aa).should.equal(d.expected)
    })
  })
  p2.map(d => {
    const aa = strToWords2D(d.input)
    it(`computation of example is correct`, () => {
      countValids(noAnagrams, aa).should.equal(d.expected)
    })
  })
})