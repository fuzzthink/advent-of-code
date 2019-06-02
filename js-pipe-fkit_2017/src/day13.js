const { maximum } = require('fkit')
const { printRuntime, performance, _0to } = require('./helpers')

const parseLv = line => {
  const kv = line.split(': ')
  return {[kv[0]]: ~~kv[1]}
}
const parseMaxes = str => {
  const lvMap = str.split('\n').reduce((a, line) => (
    {...a, ...parseLv(line)}
  ), {})
  const lvs = Object.keys(lvMap)
  const maxLv = lvs |> maximum |> Number
  return _0to(maxLv+1).reduce((a, lv) => {
    a[lv] = lvMap[lv]
    return a
  }, [])
}

/**
 * @return {Boolean} if ptr will be at pos 0 after n cycles in len-length segment
 * where ptr swings back and forth in the segment.
 */
const at0when = (len, cycles) => {
  const period = len * 2 -2
  const at = cycles % period
  return (at < len? at : len -(at % len) -2) == 0 
}

const pathCost = inStr => {
  const maxes = parseMaxes(inStr)
  let at = 0
  let cost = 0
  while (at < maxes.length) {
    if (at0when(maxes[at], at))
      cost += at * maxes[at]
    at += 1
  }
  return cost
}

const delayNeeded = inStr => {
  const maxes = parseMaxes(inStr)
  let delay = 0
  let canPass = false
  let at
  const t0 = performance.now()
  while (!canPass) {
    at = 0
    while (at < maxes.length) {
      if (at0when(maxes[at], at + delay))
        break
      at += 1
    }
    canPass = at == maxes.length
    delay += canPass? 0 : 1
  }
  printRuntime('part 2 runtime', t0, '')
  return delay
}

const run = (inStr, log) => {
  log.p1( pathCost(inStr)) // 1840
  log.p2( delayNeeded(inStr)) // 3850260
}

module.exports = {
  run,
  pathCost,
  delayNeeded,
}

/// ----------------------------------------------------------------------------
/** Notes on Part 2.
 *  Current version takes 560ms. 
 *  A previous version took 1:43:08 or 6188 secs (~11,000x) where initState is
 *   called 3850260 times, due to at0when was (then named scanPosition) returning
 *   index to be set to state.scan[at].
 *  This was actually already a great improvement over a version where all
 *   state changes are played out instead of setting state.scan[at].
 *  This worst version probably takes > 100x of 1:43:08 since it started 
 *   slower and each delay loop took longer due to memory/GC.
 */   
const initState = lvs => ({ /// ~1.6ms (6188 / 3850260)
  scan: lvs.reduce((a, lv) => ({...a, [lv]: 0}), {}),
  isUp: lvs.reduce((a, lv) => ({...a, [lv]: true}), {}),
})