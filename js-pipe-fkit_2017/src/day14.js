const { sum, concat, map } = require('fkit')
const { _0to, _2DAry } = require('./helpers')
const { knotHash } = require('./day10')
const { countGroups } = require('./day12')

const multiKnotHash = n => inStr => _0to(n).map(i => knotHash(`${inStr}-${i}`))

const cnt1sMap = {
  '0': 0, '1': 1, '2': 1, '3': 2, '4': 1, '5': 2, '6': 2, '7': 3,
  '8': 1, '9': 2, 'a': 2, 'b': 3, 'c': 2, 'd': 3, 'e': 3, 'f': 4,
}
const count1s = a => a.map(s =>
  [...s].map(c => cnt1sMap[c]) |> sum 
) |> sum 

const hexToBinAry = s => parseInt(s, 16).toString(2).padStart(4, '0').split('')

/**
 * @param {Array} a of hex string
 * @return {Array} of { x, y, v:'0'|'1'}
 */
const toPtVals = a => a.map((s, y) =>
  [...s].map(c => c |> hexToBinAry) |> concat |> map ((s, x) => ({ x, y, v:s }))
) |> concat

const ptValsTo2D = (xLen, yLen=xLen) => a => { /* [][] of 0|1|undefined */
  const res = _2DAry(xLen, yLen)
  a.forEach(o => res[o.y][o.x] = Number(o.v))
  return res
}

/**
 * @param {Array} aa - [][] of 0|1|undefined
 * @return {object} of k:v where v is [] of own k or other k's
 */
const _2DToConnMap = (xLen, yLen=xLen) => aa => {
  const X = xLen-1
  const Y = yLen-1
  const res = {}
  for (let y=0; y < yLen; y++) {
    for (let x=0; x < xLen; x++) if (aa[y][x]) {
      const k = `${y},${x}`
      res[k] = []
      if (x > 0 && aa[y][x-1]) res[k].push(`${y},${x-1}`)
      if (x < X && aa[y][x+1]) res[k].push(`${y},${x+1}`)
      if (y > 0 && aa[y-1][x]) res[k].push(`${y-1},${x}`)
      if (y < Y && aa[y+1][x]) res[k].push(`${y+1},${x}`)
      if (!res[k].length) res[k].push(`${y},${x}`)
    }
  } 
  return res
}

const countGroupsOf1 = ptVals =>
  ptVals |> ptValsTo2D(128) |> _2DToConnMap(128) |> countGroups

const run = (inStr, log) => {
  const hash = inStr |> multiKnotHash(128)
  const ptVals = hash |> toPtVals
  log.p1(hash |> count1s ) // 8148
  log.p2(ptVals |> countGroupsOf1 ) // > 1180
}
module.exports = { 
  run,
  multiKnotHash,
  count1s,
}