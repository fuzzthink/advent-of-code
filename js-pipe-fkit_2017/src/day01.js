const { take, concat, drop, map, zipWith, sum } = require('fkit')
const { charsStrToInts } = require('./helpers')

/** 
 * Sum ints in l if cur int == int at cur + iCompare (wraps to begining)
 * @returns {int}
 */
const sumIfEqNextI = (iCompare, l)/*int,[int]*/ => {
  let l2 = concat(
    l |> drop(iCompare),
    l |> take(iCompare)
  )
  return zipWith((a, b) => a==b? a : 0, l, l2)
  |> sum
} 

const strToInts = s => s.split('') |> map(Number)

const run = (inStr, log) => {
  const ints = charsStrToInts(inStr)
  log.p1( sumIfEqNextI(1, ints))
  log.p2( sumIfEqNextI(ints.length/2, ints))
}
module.exports = { run }
  