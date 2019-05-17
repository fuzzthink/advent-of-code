const { map, maximum } = require('fkit')

/// Parse eg. "c dec -10 if a >= 1"
const parseInst = str => {
  const [_, x, op, x0, y, cmp, y0] = str.match(/^(\w+) (\w+) (-?\d+) if (\w+) ([\!\>\<\=]+) (-?\d+)$/)
  return { x, op: op=='inc'? '+': '-', x0: ~~x0, y, cmp, y0: ~~y0 }
}

const initVars = insts => insts.reduce((acc, o) => ({...acc, [o.x]: 0 }), {})

/**
 * Run inst, __modifies__ var in vars specified in insts
 * @param {Array} inst - instruction to be run 
 * @param {Object} vars - variables
 */
const runInst = (inst, vars) => {
  const { x, x0, y, y0, op, cmp } = inst
  if (eval(`vars.${y} ${cmp} ${y0}`))
    vars[x] += eval(`${op}(${x0})`)
  return vars[x]
}  
  
const run = (inStr, log) => {
  const insts = inStr.split('\n') |> map(parseInst)
  const vars = initVars(insts)
  const intermediaries = insts.map(inst => runInst(inst, vars))
  log.p1( Object.values(vars) |> maximum )
  log.p2( intermediaries |> maximum )
}
module.exports = { run }