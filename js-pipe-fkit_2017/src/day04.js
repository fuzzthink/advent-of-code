const { filter, sort, id } = require('fkit')
const { strToWords2D } = require('./helpers')

const noDups = a => notInAry(id, a)
const noAnagrams = a => notInAry(sort, a)

const notInAry = (f, strs) => {
  let seen = {}
  for (let s of strs) {
    const hash = f(s)
    if (!seen[hash]) seen[hash] = true;
    else return false
  }
  return true
}

const countValids = (f, aa) => (aa |> filter(f)).length

module.exports = (inStr, log) => {
  const aa = strToWords2D(inStr)
  log.p1( countValids( noDups, aa))
  log.p2( countValids( noAnagrams, aa))
}