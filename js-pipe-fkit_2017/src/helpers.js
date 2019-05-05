const { map } = require('fkit')

const strToWords2D = s =>
  s.split('\n') |> map(s => s.split(' '))

const strToInts2D = s =>
  s.split('\n')
  |> map(s => s.split('\t') |> map(Number))

const charsStrToInts = s => s.split('') |> map(Number)

module.exports = {
  strToInts2D,
  strToWords2D,
  charsStrToInts,
}