const { maximum, minimum, fold } = require('fkit')
const { strToInts2D } = require('./helpers')

const maxDiff = xs => maximum(xs) - minimum(xs)

/**
 * @returns {int} 1st result of division of ints in xs where reminder is 0
 */
const maxDiv = xs /*[int]*/ => {
  for (let a of xs)
    for (let b of xs)
      if (a != b && a%b == 0) return a / b
  throw Error(`No a/b == 0 in ${xs}`)
} 

const run = (inStr, log) => {
  const xss = strToInts2D(inStr)
  log.p1(xss |> fold((a, xs) => a + maxDiff(xs), 0)) // 44887
  log.p2(xss |> fold((a, xs) => a + maxDiv(xs), 0))  // 242
}
module.exports = {
  run,
  maxDiff,
  maxDiv,
}