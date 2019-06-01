const { sum, map } = require('fkit')
const { knotHash } = require('./day10')

const multiKnotHash = cnt => inStr /*str,int*/ => 
  [...Array(cnt).keys()].map(i => knotHash(`${inStr}-${i}`))

const knot128Hash = multiKnotHash(128)
const _1sMap = {
  '0': 0,
  '1': 1,
  '2': 1,
  '3': 2,
  '4': 1,
  '5': 2,
  '6': 2,
  '7': 3,
  '8': 1,
  '9': 2,
  'a': 2,
  'b': 3,
  'c': 2,
  'd': 3,
  'e': 3,
  'f': 4,
}
const count1s = a => a.map(s =>
  [...s].map(c => _1sMap[c]) |> sum 
) |> sum 

const run = (inStr, log) => {
  log.p1(inStr |> knot128Hash |> count1s ) // 8148
}
module.exports = { 
  run,
  multiKnotHash,
  count1s,
}