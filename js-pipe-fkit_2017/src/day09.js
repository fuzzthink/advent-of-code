const { filter, sort, id } = require('fkit')
const { strToWords2D } = require('./helpers')

const parse = s => s
  .replace(/!./g, '')      // ignore ! and any char after
  .replace(/<[^>]*>/g, '') // < > are comments, ignore all chars in it but >
  .replace(/,/g, '')       // , is a separator of comments or groups
  
const countGroups = parsed /*str*/ => parsed.length / 2

const getScore = parsed /*str*/ => {
  let lv = 0
  return parsed.split('').reduce((acc, c) => {
    const delta = c=='{'? 1: -1
    lv += delta
    return delta==1? lv + acc: acc
  }, 0)
}

const run = (inStr, log) => {
  log.p1( parse(inStr) |> getScore )
}
module.exports = {
  run,
  parse,
  countGroups,
  getScore,
}