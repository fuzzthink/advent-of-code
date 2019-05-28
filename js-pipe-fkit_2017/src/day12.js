const { map } = require('fkit')

const emptyConn = { src: '', nodes: [] }
const parseConn = str => {
  const [src, nodesStr] = str.split(' <-> ')  
  const nodes = nodesStr.split(', ')  
  const isSelf = nodes.length==1 && (src == nodes[0])
  return isSelf? emptyConn : { src, nodes }
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

const run = (inStr, log) => {
  log.p1( inStr |> parseConns |> countConnsToNode0 )
}
module.exports = { 
  run,
  parseConns,
  countConnsToNode,
}