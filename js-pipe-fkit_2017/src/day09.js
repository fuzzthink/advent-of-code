/**
 * @return {String} of nested {}
 */
const getGroupStr = s => s
  .replace(/!./g, '')      // ignore ! and any char after
  .replace(/<[^>]*>/g, '') // < > are comments, ignore all chars in it but >
  .replace(/,/g, '')       // , is a separator of comments or groups
 
const countGroups = groupStr => groupStr.length / 2

const getScore = groupStr => { // See 09.md
  let lv = 0
  return groupStr.split('').reduce((acc, c) => {
    const delta = c=='{'? 1: -1
    lv += delta
    return delta==1? lv + acc: acc
  }, 0)
}

/**
 * @return {Number} of non-!x chars in <>
 */
const charsInComment = str => {
  const s = str.replace(/!./g, '')
  return s.length - s.replace(/<[^>]*>/g, '<>').length
}

const run = (inStr, log) => {
  log.p1( getGroupStr(inStr) |> getScore ) // 11898
  log.p2( charsInComment(inStr) ) // 5601
}

module.exports = {
  run,
  getGroupStr,
  countGroups,
  getScore,
  charsInComment,
}