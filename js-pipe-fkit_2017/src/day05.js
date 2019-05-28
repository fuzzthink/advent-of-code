const { strToInts } = require('./helpers')

const step = (idx, a) /*int,[int]*/ => {
  const i = idx + a[idx]
  a[idx] += 1
  return i
}

const step2 = (idx, a) /*int,[int]*/ => {
  const i = idx + a[idx]
  a[idx] += (a[idx] > 2)? -1 : 1
  return i
}

const doSteps = (stepper, ints) /*fn,[int]*/ => {
  const a = [...ints]
  let i = stepper(0, a)
  let steps = 1
  while (i < a.length) {
    i = stepper(i, a)
    steps += 1
  }
  return steps
} 

const run = (inStr, log) => {
  const ints = strToInts(inStr)
  log.p1( doSteps(step, ints))  // 372139
  log.p2( doSteps(step2, ints)) // 29629538
}
module.exports = {
  run,
  doSteps,
  step,
  step2,
}