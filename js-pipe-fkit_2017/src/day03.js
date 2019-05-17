const sqrtFloor = x => ~~Math.sqrt(x)
const minus1IfEven = x => x%2 == 0? x - 1 : x

/// Part 1 Observation:
/// minDist is sr(x)/2 + 1 and maxDist (corners) is minDist*2
const distTo1 = n /*int*/ => {
  const sr = (n - 1) |> sqrtFloor |> minus1IfEven
  const minDist = ~~(sr/2) + 1
  const eps = Math.abs((n - sr*sr) % (minDist * 2) - minDist)
  return minDist + eps
}

/// Part 2 Observation:
/// Numbers to add can be determined via calculating index in inner square 
const nextSpiralNum = xs /*[int]*/ => {
  const cnt = xs.length
  const sr = cnt |> sqrtFloor |> minus1IfEven
  const edgeLen = sr + 1
  const len = cnt - sr*sr + 1
  const dToCnr = len % edgeLen
  const edges = (len + edgeLen - 1)/edgeLen |> Math.floor
  const isLast = dToCnr==0 && edges==4

  // i0 is index 0 of inner square. i is index of inner val adjacent to val to compute
  const i0 = sr==1? 0 : (sr - 2)**2 - 1
  const eps = isLast? (edgeLen - 1) : (dToCnr==0)? 0 : dToCnr - 1
  const i = i0 + (edgeLen - 2) * ((isLast || dToCnr > 0)? (edges - 1) : edges) + eps

  const v0is0 = (dToCnr==0 && !isLast) || (dToCnr==1) || (dToCnr==2 && edges==1)
  // v0 ; v1 = val at i ; v2 ; v3 = val at 2 index back from val to compute
  const v0 = v0is0? 0 : len==1? 0 : xs[i-1]
  const v1 = len==1? 0 : xs[i]
  const v2 = dToCnr==0 || ((dToCnr == edgeLen-1) && edges < 4)? 0 : xs[i+1]
  const v3 = ((dToCnr==1 && edges > 1) || (dToCnr==2 && edges==1))? xs[cnt - 2] : 0
  return v0 + v1 + v2 + v3 + xs[cnt - 1]
}

const spiralNumAfter = n /*int*/ => {
  const a = [1]
  let next = nextSpiralNum(a)
  while (next < n) {
    a.push(next)
    next = nextSpiralNum(a)
  }
  return next
}

const run = (inStr, log) => {
  const n = Number(inStr)
  log.p1(n |> distTo1)
  log.p2(n |> spiralNumAfter)
}
module.exports = { run }