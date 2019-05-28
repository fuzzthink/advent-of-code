const should = require('should')
const { getGroupStr, countGroups, getScore, charsInComment } = require('../dist/day09')

// Test examples from instruction
const counts = {
  data: 
`<>
<random characters>
<<<<>
<{!>}>
<!!>
<!!!>>
<{o"i!a,<{i<a>
{}
{{{}}}
{{},{}}
{{{},{},{{}}}}
{<{},{},{{}}>}
{<a>,<a>,<a>,<a>}
{{<a>},{<a>},{<a>},{<a>}}
{{<!>},{<!>},{<!>},{<a>}}`.split('\n'),
  expected: [
    0, 0, 0, 0, 0, 0, 0,
    1, 3, 3, 6, 1, 1, 5, 2,
  ]
}

const scores = {
  data:
`{}
{{{}}}
{{},{}}
{{{},{},{{}}}}
{<a>,<a>,<a>,<a>}
{{<ab>},{<ab>},{<ab>},{<ab>}}
{{<!!>},{<!!>},{<!!>},{<!!>}}
{{<a!>},{<a!>},{<a!>},{<ab>}}`.split('\n'),
  expected: [ 1, 6, 5, 16, 1, 9, 9, 3 ] 
}

const charsRemoved = {
  data:
`<>
<random characters>
<<<<>
<{!>}>
<!!>
<!!!>>
<{o"i!a,<{i<a>`.split('\n'),
  expected: [0, 17, 3, 2, 0, 0, 10 ]
}

describe('Day 09: countGroups()', () => {
  counts.data.map((s, i) => {
    const expected = counts.expected[i]
    it(`of ${s} = ${expected}`, () => {
      countGroups(getGroupStr(s)).should.equal(expected)
    })
  })
})

describe('Day 09: getScore()', () => {
  scores.data.map((s, i) => {
    const expected = scores.expected[i]
    it(`of ${s} = ${expected}`, () => {
      getScore(getGroupStr(s)).should.equal(expected)
    })
  })
})

describe('Day 09: countGroups()', () => {
  charsRemoved.data.map((s, i) => {
    const expected = charsRemoved.expected[i]
    it(`of ${s} = ${expected}`, () => {
      charsInComment(s).should.equal(expected)
    })
  })
})