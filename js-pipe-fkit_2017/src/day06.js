const { maximum } = require('fkit')
const { objLen, strToInts } = require('./helpers')

const zeroAt = i => a /*int,[int]*/ => a.map((x, j) => j==i? 0: x)
const mapAdd = n => a /*int,[int]*/ => a.map(x => x + n)

/// Add 1 to n elms in a, starting from elm __after__ i 
const addOne = (i, n) => a /*int,int,[int]*/ =>
  n == 0
  ? a
  : a.map((x, j) => {
    const tilEnd = a.length - i - 1
    const _01 = (j > i && j-i <= n) || (j < i && j+tilEnd < n)? 1 : 0
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
const countAllocs = (a, hist) /*[int],{}*/ =>
  hist[hash(a)]? objLen(hist): countAllocs(alloc(a), setHash(hist, true, a))

/// return Number of allocations between first time array a is repeated
const countPrvSeen = (a, hist) /*[int],{}*/ => {
  const i = hist[hash(a)]
  return i != null
    ? objLen(hist)-i
    : countPrvSeen(alloc(a), setHash(hist, objLen(hist), a))
}

const run = (inStr, log) => {
  const ints = strToInts(inStr, '\t')
  log.p1( countAllocs(ints, {}) )  // 3156
  log.p2( countPrvSeen(ints, {}) ) // 1610
}
module.exports = {
  run,
  countAllocs,
  countPrvSeen,
}