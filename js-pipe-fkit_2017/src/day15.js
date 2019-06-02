const { } = require('fkit')
const { } = require('./helpers')

const numGen = mult => n => (n * mult) % 2147483647
const genA = numGen(16807)
const genB = numGen(48271)

const lsb16Match = (a, b) => (a & 0xffff) == (b & 0xffff)
  /// .5secs on 40mil * 2 calls vs. 100 secs if:
  /// a.toString(2).padStart(32, '0') == b.toString(2).padStart(32, '0')

const countLsbMatches = (aNum, bNum, iters) => {
  let a = aNum
  let b = bNum
  let res = 0
  for (let i=0; i < iters; i++) {
    a = genA(a)
    b = genB(b)
    res += lsb16Match(a, b)? 1 : 0
  }
  return res
}
const run = (inStr, log) => {
  const [aNum, bNum] = inStr.split('\n').map(s => s.split('with ')[1] |> Number)
  log.p1( countLsbMatches(aNum, bNum, 40000000)) // 573
  // log.p2() // 
}
module.exports = { 
  run,
  genA,
  genB,
  lsb16Match,
  countLsbMatches,
}