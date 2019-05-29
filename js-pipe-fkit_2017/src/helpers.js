const { map } = require('fkit')
const { performance } = require('perf_hooks')

const strToWords2D = s =>
  s.split('\n') |> map(s => s.split(' '))

const strToInts2D = (s, sep='\t') =>
  s.split('\n')
  |> map(s => s.split(sep) |> map(Number))

const charsStrToInts = s => s.split('') |> map(Number)
const strToInts = (s, sep='\n') => s.split(sep) |> map(Number)

const objLen = o => Object.keys(o).length

const printRuntime = (v, t0, suf='total runtime') => {
  t1 = performance.now()
  const secs = ~~((t1 - t0)/1000)
  const hh = (~~(secs/3600)).toString().padStart(2, '0')
  const mm = (~~(secs/60 % 60)).toString().padStart(2, '0')
  const ss = (~~(secs % 60)).toString().padStart(2, '0')
  console.log(`${v} - ${hh}:${mm}:${ss} ${suf}`)
}

module.exports = {
  strToInts2D,
  strToWords2D,
  charsStrToInts,
  strToInts,
  objLen,
  printRuntime,
  performance,
}