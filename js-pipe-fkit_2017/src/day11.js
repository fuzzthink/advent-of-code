const { max, min } = require('fkit')

const getPathAgg = dirStrs => dirStrs.reduce((a, s) => {
  a[s] += 1
  return a
}, { n:0, ne:0, nw:0, s:0, sw:0, se:0 })

const getSteps = dir => {
  let ne = dir.ne - dir.sw
  let nw = dir.nw - dir.se
  let n = dir.n - dir.s
  if ((ne > 0 && nw > 0) || (ne < 0 && nw < 0)) {
    const delta = ne > 0 && nw > 0? min(ne, nw): max(ne, nw)
    n += delta
    ne -= delta
    nw -= delta
  }
  if ((n > 0 && ne < 0) || (n > 0 && nw < 0)) {
    const delta = min(n, ne < 0? -ne : -nw)
    n -= delta
    ne += delta
    nw += delta
  }
  else if ((n < 0 && ne > 0) || (n < 0 && nw > 0)) {
    const delta = min(-n, ne > 0? ne : nw)
    n += delta
    ne -= delta
    nw -= delta
  }
  return Math.abs(n) + Math.abs(ne) + Math.abs(nw) 
} 

const parseCSV = csv => csv.split(',').map(s => s.trim())
const csvToSteps = csv => parseCSV(csv) |> getPathAgg |> getSteps

const findMaxSteps = (minSteps, allPaths) => {
  let maxSteps = minSteps
  for (let i=minSteps; i < allPaths.length; i++) {
    let paths = allPaths.slice(0, i)
    let steps = paths |> getPathAgg |> getSteps
    if (steps > maxSteps) maxSteps = steps
  }
  return maxSteps
}  

const run = (inStr, log) => {
  const minSteps = inStr |> csvToSteps
  const paths = inStr |> parseCSV
  log.p1( minSteps ) // 824
  log.p2( findMaxSteps(minSteps, paths) ) // 1548
}
module.exports = { 
  run,
  csvToSteps,
}