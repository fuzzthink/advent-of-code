const numGen = mult => n => (n * mult) % 2147483647
const genA = numGen(16807)
const genB = numGen(48271)
const genA2 = n => {
  n = genA(n)
  return (n % 4)==0? n : genA2(n)
}
const genB2 = n => {
  n = genB(n)
  return (n % 8)==0? n : genB2(n)
}

const lsb16Match = (a, b) => (a & 0xffff) == (b & 0xffff)

const countLsbMatches = (aNum, bNum, aGen, bGen, iters) => {
  let a = aNum
  let b = bNum
  let res = 0
  for (let i=0; i < iters; i++) {
    a = aGen(a)
    b = bGen(b)
    res += lsb16Match(a, b)? 1 : 0
  }
  return res
}
const run = (inStr, log) => {
  const [aNum, bNum] = inStr.split('\n').map(s => s.split('with ')[1] |> Number)
  log.p1( countLsbMatches(aNum, bNum, genA, genB, 40000000)) // 573
  log.p2( countLsbMatches(aNum, bNum, genA2,genB2, 5000000)) // 294
}
module.exports = { 
  run,
  genA,
  genB,
  genA2,
  genB2,
  lsb16Match,
  countLsbMatches,
}