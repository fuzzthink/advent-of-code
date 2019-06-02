const { splitAt, map } = require('fkit')

const spin = n => a => {
  const [h, t] = a |> splitAt(a.length - n) 
  return t.concat(h)
} 
const swapAt = (i, j) => a => {
  const x = a[i]
  const y = a[j]
  a[i] = y
  a[j] = x
  return a
}
const swapXY = (x, y) => a => {
  const i = a.findIndex(s => s==x)
  const j = a.findIndex(s => s==y)
  a[i] = y
  a[j] = x
  return a
}
const exe = (s, a) => {
  const [fStr, argStr] = s |> splitAt(1)
  const f = fStr=='s'? spin: fStr=='x'? swapAt: swapXY
  const args =
    fStr=='x'? argStr.split('/') |> map(Number):
    fStr=='p'? argStr.split('/'):
    [Number(argStr)]
  return a |> f.apply(null, args)
}

const run = (inStr, log) => {
  const moves = inStr.split(',')
  let a = 'abcdefghijklmnop'.split('')
  moves.forEach(move => {
    a = exe(move, a)
  })
  log.p1(a.join('')) // glnacbhedpfjkiom
}
module.exports = { 
  run,
  spin,
  swapAt,
  swapXY,
  exe,
}