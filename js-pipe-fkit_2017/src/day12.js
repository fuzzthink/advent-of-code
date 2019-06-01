const { map } = require('fkit')

const parseConn = str => {
  const [src, nodesStr] = str.split(' <-> ')  
  const nodes = nodesStr.split(', ')  
  return { src, nodes }
}

const parseConns = inStr => {
  const res = {}
  const conns = inStr.split('\n') |> map(parseConn)
  conns.forEach(conn => {
    conn.nodes.forEach(node => {
      if (!res[node])
        res[node] = [conn.src]
      else
        res[node].push(conn.src)
    })
  })
  return res 
}

/**
 * @param {object} connMap - k:v where v is [] of own k or other k's
 */
const countConnsToNode = x => connMap => {
  let toVisit = Object.keys(connMap)
  let prvMappedLen = 0
  const mapped = new Set([x])
  while (mapped.size > prvMappedLen) {
    prvMappedLen = mapped.size
    toVisit = toVisit.filter(node => {
      const canMap = connMap[node].find(src => mapped.has(src))
      if (canMap)
        mapped.add(node)
      return !canMap
    })
  }
  return mapped.size
}
const countConnsToNode0 = countConnsToNode('0')

const countGroups = connMap => {
  let toVisit = Object.keys(connMap)
  let groupsCnt = 0
  while (toVisit.length) {
    const x = toVisit[0]
    const mapped = new Set([x])
    let prvMappedLen = 0
    while (mapped.size > prvMappedLen) {
      prvMappedLen = mapped.size
      toVisit = toVisit.filter(node => {
        const canMap = connMap[node].find(src => mapped.has(src))
        if (canMap)
          mapped.add(node)
        return !canMap
      })
    }
    groupsCnt += 1
  }
  return groupsCnt
}

const run = (inStr, log) => {
  log.p1( inStr |> parseConns |> countConnsToNode0 ) // 306
  log.p2( inStr |> parseConns |> countGroups ) // 200
}
module.exports = { 
  run,
  parseConns,
  countConnsToNode,
  countGroups,
}