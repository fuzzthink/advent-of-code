const { take, concat, drop, map, zipWith, sum } = require('fkit')

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

module.exports = (inStr, log) => {
  const data = strToInts(inStr)
  log.p1( sumIfEqNextI(1, data) )
  log.p2( sumIfEqNextI(data.length/2, data) )
}
  