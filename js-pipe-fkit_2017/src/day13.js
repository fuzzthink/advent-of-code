const { maximum } = require('fkit')
const { printRuntime, performance } = require('./helpers')

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
  return [...Array(maxLv+1).keys()].reduce((a, lv) => {
    a[lv] = lvMap[lv]
    return a
  }, [])
}

const initState = lvs => ({
  scan: lvs.reduce((a, lv) => ({...a, [lv]: 0}), {}),
  isUp: lvs.reduce((a, lv) => ({...a, [lv]: true}), {}),
})

const calcScanPosition = (len, cycles) => {
  const period = len * 2 -2
  const at = cycles % period
  return at < len? at : len -(at % len) -2 
}

const pathCost = inStr => {
  const maxes = parseMaxes(inStr)
  const lvs = Object.keys(maxes)
  const state = initState(lvs)
  let at = 0
  let cost = 0
  while (at < maxes.length) {
    state.scan[at] = calcScanPosition(maxes[at], at)
    if (state.scan[at]==0)
      cost += at * maxes[at]
    at += 1
  }
  return cost
}

const delayNeeded = inStr => {
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

const run = (inStr, log) => {
  log.p1( pathCost(inStr)) // 1840
  log.p2( delayNeeded(inStr)) // 3850260 - 01:43:08 total runtime
}
module.exports = {
  run,
  pathCost,
  delayNeeded,
}