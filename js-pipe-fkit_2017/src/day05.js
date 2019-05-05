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

module.exports = (inStr, log) => {
  const ints = strToInts(inStr)
  log.p1( doSteps(step, ints))
  log.p2( doSteps(step2, ints))
}