const { map, partition, maximumBy, get, sum } = require('fkit')
const { objLen } = require('./helpers')

/// Parse eg. "ugml (68) -> gyxo, ebii, jpt" to Branch
const parseNode = str => {
  const [hdStr, leafsStr] = str.split(' -> ')
  const [_, label, wt] = hdStr.match(/(\w+) \((\d+)\)/)
  const leafs = leafsStr? leafsStr.split(', ') : []
  return {
    label,
    leafs,
    wt: ~~wt,
    lv: 0,
    leafWts: [],
  }
}

const mapNodes = (toMaps=[], mapped={}) => {
  const toMaps_ = toMaps.filter(toMap => {
    const leafs = toMap.leafs.filter(leaf => {
      if (mapped[leaf] != null) {
        toMap.lv += (toMap.lv <= mapped[leaf])? 1: 0
        return false
      }
      return true
    })
    toMap.leafs = leafs
    if (!leafs.length) {
      mapped[toMap.label] = toMap.lv
      return false
    }
    return true
  })
  return toMaps_.length
    ? mapNodes(toMaps_, mapped)
    : mapped
}

const getRootLabel = nodesMap =>
  Object.entries(nodesMap)
  |> maximumBy((a, b) => a[1] > b[1])
  |> get(0)

const getDesiredWt = (branches=[], wts={}, orgWts={}) => {
  while (objLen(wts)) {
    for (let branch of branches) if (!wts[branch.label]) {
      const leafs = branch.leafs
      const leafWts = branch.leafWts
      if (leafs.length > leafWts.length) for (let leaf of branch.leafs) {
        if (wts[leaf] != null) {
          const wt = wts[leaf]
          if ( leafWts.length == 0 || leafWts[0] == wt ) {
            leafWts.push(wt)
            if (leafs.length == leafWts.length) {
              wts[branch.label] = sum(leafWts) + branch.wt
              break
            }
          }
          else if ( leafWts[0] != wt )
            return orgWts[leaf] - (wt - leafWts[0])
        }
      }
    }
  }
  throw Error('Offending branch not found')
}

const toObject = (nodes, init) => nodes.reduce((acc, n) => (
  { ...acc, [n.label]: init != null? init: n.wt }
), {})

const parseAndPartition = inStr => {
  const nodes = inStr.split('\n') |> map(parseNode)
  const [singles, branches] = nodes |> partition(n => n.leafs.length == 0)
  return [singles, branches, nodes]
}  
  
module.exports = (inStr, log) => {
  let singles, branches, nodes

  [singles, branches, nodes] = parseAndPartition(inStr)
  const mapped = toObject(singles, 0)
  log.p1( mapNodes(branches, mapped) |> getRootLabel );

  [singles, branches, nodes] = parseAndPartition(inStr)
  const singleWts = toObject(singles)
  const allWts = toObject(nodes)
  log.p2( getDesiredWt(branches, singleWts, allWts) )
}