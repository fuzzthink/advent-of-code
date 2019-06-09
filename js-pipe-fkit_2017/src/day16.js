const { splitAt, map, fold, min } = require('fkit')
const { rotateR } = require('./deque')

const swapAt = (i, j) => ary => {
  const x = ary[i]
  ary[i] = ary[j]
  ary[j] = x
  return ary
}
const swapXY = (x, y) => ary => {
  const i = ary.findIndex(s => s==x)
  const j = ary.findIndex(s => s==y)
  ary[i] = y
  ary[j] = x
  return ary
}

const exeOne = (moveStr, ary) => {
  const [fnStr, argStr] = moveStr |> splitAt(1)
  const fn = fnStr=='s'? rotateR : fnStr=='x'? swapAt: swapXY
  const args =
    fnStr=='x'? argStr.split('/') |> map(Number) :
    fnStr=='p'? argStr.split('/') :
    [Number(argStr)]
  return ary |> fn.apply(null, args)
}

const exeMoves = (moves, str) => {
  let ary = str.split('')
  moves.forEach(move => {
    ary = exeOne(move, ary)
  })
  return ary.join('')
}

/**
 * @return {Object} of positional swaps from str1 to str2
 */
const getSeqMap = (str1, str2) => str1 |> fold((a, s, i) => ({
  ...a, [i]: str2.indexOf(s)
}), {})

/**
 * Apply @param {Array of objects} seqMaps to @param {Array of chars} ary.
 *  If @param {Integer} firstN < seqMaps.length, apply up to firstN only.
 * @returns {Array of chars} 
 */ 
const applySeqMaps = (seqMaps, firstN, ary) => {
  const n = min(seqMaps.length, firstN)
  for (let i=0; i < n; i++ ) {
    const copy = ary.slice()
    for (let j=0; j < ary.length; j++)
      ary[seqMaps[i][j]] = copy[j]
  }
  return ary
}

const SeqMapper = () => {
  const hashOf = o => JSON.stringify(o)
  let list = [] /// store seqMaps 
  return {
    has: o => list.find(e => hashOf(e) == hashOf(o)),
    add: o => list.push(o),
    /// Move list[0] to the end since that pattern has occured
    rearrange: () => {
      list = [...list.slice(1), list[0]]
    },
    /// apply seqMap n times. n is count of 1 apply, not count of all seq mappings
    run: (n, s) => {
      let res = s.split('')
      for (let i=n; i > 0; i -= list.length)
        res = applySeqMaps(list, i, res)
      return res.join('')
    }
  }
} 

/// execute moves n times
const exeMovesNx = (moves, n, str) => {
  const seqMapper = SeqMapper()
  let resStr = String(str)
  let prvStr = ''
  let seqMap = {}

  for (i=n; i > 0; i--) {
    prvStr = String(resStr)
    resStr = exeMoves(moves, prvStr)
    seqMap = getSeqMap(prvStr, resStr) 
    if (seqMapper.has(seqMap)) {
      seqMapper.rearrange()
      return seqMapper.run(i - 1, resStr)
    }
    else seqMapper.add(seqMap)
  }
  return resStr 
}

const run = (inStr, log) => {
  const moves = inStr.split(',')
  const ptnStr = 'abcdefghijklmnop'
  log.p1( exeMoves(moves, ptnStr)) // glnacbhedpfjkiom
  log.p2( exeMovesNx(moves, 1000000000, ptnStr)) // fmpanloehgkdcbji - 1.7 mins 
}
module.exports = { 
  run,
  exeMoves,
  exeMovesNx,
  rotateR,
  swapAt,
  swapXY,
}