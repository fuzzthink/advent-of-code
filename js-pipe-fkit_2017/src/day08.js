const { map, maximum } = require('fkit')

/// Parse eg. "c dec -10 if a >= 1"
const parseInst = str => {
  const [_, x, op, x0, y, cmp, y0] = str.match(/^(\w+) (\w+) (-?\d+) if (\w+) ([\!\>\<\=]+) (-?\d+)$/)
  return { x, op: op=='inc'? '+': '-', x0: ~~x0, y, cmp, y0: ~~y0 }
}

const initVars = insts =>
  insts.reduce((acc, inst) => ({...acc, [inst.x]: 0 }), {})

const runInst = (inst, vars) => {
  const { x, x0, y, y0, op, cmp } = inst
  if (eval(`vars.${y} ${cmp} ${y0}`))
    vars[x] += eval(`${op}(${x0})`)
  return vars[x]
}  
  
const run = inStr => {
  const insts = inStr.split('\n') |> map(parseInst)
  const vars = initVars(insts)
  let maxs = insts.map(inst => runInst(inst, vars))
  return [
    Object.values(vars) |> maximum,
    maxs |> maximum
  ]
}

module.exports = (inStr, log) => {
  const [p1, p2] = run(inStr)
  log.p1( p1 )
  log.p2( p2 )
}