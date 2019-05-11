const { maximum } = require('fkit')
const { objLen, strToInts } = require('./helpers')

const zeroAt = idx => a /*int,[int]*/ => a.map((x, i) => i==idx? 0: x)
const mapAdd = n => a /*int,[int]*/ => a.map(x => x + n)

/// Add 1 to cnt elms in a, starting from elm __after__ idx 
const addOne = (idx, cnt) => a /*int,int,[int]*/ =>
  cnt == 0? a :
  a.map((x, i) => {
    const toEnd = a.length - idx - 1
    const _01 = (i > idx && i-idx <= cnt) || (i < idx && i+toEnd < cnt)? 1 : 0
    return x + _01
  })

const hash = a => `${a}`
const setHash = (hist, val, a) => {
  hist[hash(a)] = val
  return hist
}

const alloc = a /*[int]*/ => {
  const max = maximum(a)
  const i = a.findIndex(x => x == max)
  return a
  |> zeroAt(i)
  |> mapAdd(~~(max / a.length))
  |> addOne(i, max % a.length)
}

/// returns Number of allocations needed for array a
const cntAllocs = (a, hist) /*[int],{}*/ =>
  hist[hash(a)]? objLen(hist): cntAllocs(alloc(a), setHash(hist, true, a))

/// return Number of allocations between first time array a is repeated
const countPrvSeen = (a, hist) /*[int],{}*/ => {
  const i = hist[hash(a)]
  return i != null
    ? objLen(hist)-i
    : countPrvSeen(alloc(a), setHash(hist, objLen(hist), a))
}

module.exports = (inStr, log) => {
  const ints = strToInts(inStr, '\t')
  log.p1( cntAllocs(ints, {}) )
  log.p2( countPrvSeen(ints, {}) )
}