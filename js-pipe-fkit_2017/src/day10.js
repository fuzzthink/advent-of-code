const { reverse, concat, map } = require('fkit')

/**
 * @return {[int]} of a[frm..frm+cnt] reversed
 */
const reverseAt = (frm, cnt, a) /*int,int,[int]*/ => 
  (frm+cnt > a.length
    ? concat(a.slice(frm), a.slice(0, frm+cnt - a.length))
    : a.slice(frm, frm+cnt)
  ) |> reverse

/** See instructions/10.md
 */
const knotHash = (list, lens, iList=0, skip=0) => {
  if (lens.length == 0)
    return list
  else {
    const reversed = reverseAt(iList, lens[0], list)
    const wrapped = iList + lens[0] > list.length
    let _list
    if (wrapped) {
      const revLen0 = list.length - iList
      const revLen1 = reversed.length - revLen0
      _list = concat(
        reversed.slice(revLen0),
        list.slice(revLen1, revLen1 + list.length - reversed.length),
        reversed.slice(0, revLen0),
      )
    } else {
      _list = concat(
        list.slice(0, iList),
        reversed,
        list.slice(iList + reversed.length),
      )
    } 
    iList += lens[0] + skip
    return knotHash(_list, lens.slice(1), iList % list.length, skip + 1)
  }
}

const run = (inStr, log) => {
  const lens = inStr.split(',') |> map(Number)
  const hash = knotHash( Array.from({length: 256}, (v, i) => i), lens )
  log.p1( hash[0] * hash[1] )
}
module.exports = { 
  run,
  knotHash,
}