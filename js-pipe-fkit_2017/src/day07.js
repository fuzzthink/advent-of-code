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
  const moreToMap = toMaps.filter(toMap => {
    const leafs = toMap.leafs.filter(leaf => {
      if (mapped[leaf] != null) {
        if (toMap.lv <= mapped[leaf])
          toMap.lv += 1
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
  return moreToMap.length
    ? mapNodes(moreToMap, mapped)
    : mapped
}

const getRootLabel = nodesMap =>
  Object.entries(nodesMap)
  |> maximumBy((a, b) => a[1] > b[1])
  |> get(0)

const getDesiredWt = (branches=[], wts={}, allWts={}) => {
  while (objLen(wts)) {
    for (let branch of branches) for (let leaf of branch.leafs) {
      if (wts[leaf] != null) {
        const wt = wts[leaf]
        if ( !branch.leafWts.length || branch.leafWts.includes(wt) ) {
          branch.leafWts.push( wt )
          branch.leafs = branch.leafs.filter(l => l != leaf)
          if (!branch.leafs.length) {
            wts[branch.label] = (branch.leafWts |> sum) + branch.wt
            branches = branches.filter(b => b.label != branch.label)
            break
          }
        }
        else if ( !branch.leafWts.includes(wt) ) {
          const leafWt = branch.leafWts[0]
          return allWts[leafWt] - wt - branch.leafWts[0]
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