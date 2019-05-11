const { map } = require('fkit')

const strToWords2D = s =>
  s.split('\n') |> map(s => s.split(' '))

const strToInts2D = (s, sep='\t') =>
  s.split('\n')
  |> map(s => s.split(sep) |> map(Number))

const charsStrToInts = s => s.split('') |> map(Number)
const strToInts = (s, sep='\n') => s.split(sep) |> map(Number)

const objLen = o => Object.keys(o).length

module.exports = {
  strToInts2D,
  strToWords2D,
  charsStrToInts,
  strToInts,
  objLen,
}