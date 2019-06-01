const { reverse, map } = require('fkit')
const { _0to } = require('./helpers')

/**
 * @return {[int]} of a[frm..frm+cnt] reversed
 */
const reverseAt = (frm, cnt, a) /*int,int,[int]*/ => 
  (frm+cnt > a.length
    ? a.slice(frm).concat( a.slice(0, frm+cnt - a.length) )
    : a.slice(frm, frm+cnt)
  ) |> reverse

const genSparseHash = (lens, list, iList=0, skip=0, returnMeta=false) => {
  list = list || _0to(256)
  if (lens.length == 0)
    return returnMeta? [list, iList, skip] : list
  else {
    const reversed = reverseAt(iList, lens[0], list)
    const revLen0 = list.length - iList
    const wrapped = iList + lens[0] > list.length
    list = wrapped? [
      ...reversed.slice(revLen0),
      ...list.slice(reversed.length - revLen0, list.length - revLen0),
      ...reversed.slice(0, revLen0),
    ] : [
      ...list.slice(0, iList),
      ...reversed,
      ...list.slice(iList + reversed.length),
    ] 
    iList = (iList + lens[0] + skip) % list.length
    return genSparseHash(lens.slice(1), list, iList, skip + 1, returnMeta)
  }
}

const mapASCII = s => [...s].map(s => s.charCodeAt())

/**
 * @param {String} inStr - string to hash
 * @return {String} of 32 chars
 */
const knotHash = (inStr, list=[], iList=0, skip=0, rounds=64) => {
  let lens = [...mapASCII(inStr), 17, 31, 73, 47, 23 ]
  list = list.length? list : _0to(256)
  for (let i=0; i <rounds; i++) {
    [list, iList, skip] = genSparseHash(lens, list, iList, skip, true)
  }
  return _0to(16)
    .map(i => list.slice(i*16, i*16 + 16)
      .reduce((a,c) => a^c , 0)
    )
    .map(n => n.toString(16).padStart(2, '0'))
    .join('')
}

const run = (inStr, log) => {
  const lens = inStr.split(',') |> map(Number)
  const shash = genSparseHash(lens)
  log.p1(shash[0] * shash[1]) // 7888
  log.p2(knotHash(inStr)) // decdf7d377879877173b7f2fb131cf1b
}
module.exports = { 
  run,
  genSparseHash,
  knotHash,
}