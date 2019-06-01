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
/** p2 took .560 sec. It took 1:43:08 or 6188 secs (~11,000x) if initState is
 *   called 3850260 x. This was already a great improvement over a version where
 *   state change is played out instead of checking if ptr is at 0 in at0when.
 *  This worst version probably takes > 100x of 1:43:08 since it started 
 *   slower and each delay loop took longer due to memory/GC.
 */   
const initState = lvs => ({ /// ~1.6ms (6188 / 3850260)
  scan: lvs.reduce((a, lv) => ({...a, [lv]: 0}), {}),
  isUp: lvs.reduce((a, lv) => ({...a, [lv]: true}), {}),
})
const delayNeeded_poor_perf = inStr => {
  const maxes = parseMaxes(inStr)
  const lvs = Object.keys(maxes)
  const t0 = performance.now()
  const printTime = lvs.length > 12
  let delay = 0
  let canPass = false
  let state, at
  if (printTime)
    console.log('Calculating Part 2:\nDelay at')
  while (!canPass) {
    state = initState(lvs)
    at = 0
    while (at < maxes.length) {
      state.scan[at] = calcScanPosition(maxes[at], at + delay) 
      /// calcScanPosition same as at0when but returns index instead. Once it
      ///  no longer return index, state isn't used, so initState not used too 
      if (state.scan[at]==0)
        break
      at += 1
    }
    canPass = at == maxes.length
    delay += canPass? 0 : 1
    if (printTime && delay % 10000 == 0)
      printRuntime( delay.toString().padStart(7, ' '), t0)
  }
  return delay
}