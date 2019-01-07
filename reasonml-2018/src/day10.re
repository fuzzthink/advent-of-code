open Util

type ptVel = {
  mutable x: int,
  mutable y: int,
  vx: int,
  vy: int,
}

let ptVelParser = str => [@warning "-8"] {
  let Some(intStrs) = str->parseInts
  let [|x, y, vx, vy|] = intStrs|>Array.map(int_of_string)
  ;{x, y, vx, vy}
}

let getMinMaxDiff = ptVels => {
  let ys = ptVels|>Array.map(d => d.y)
  let minY = ys->AU.getMin
  let maxY = ys->AU.getMax
  ;(minY, maxY, maxY - minY)
}

let iters = ref(0);
let rec findMinYDiff = (ptVels, minY, maxY, diff) => {
  let next = ptVels|>Array.map(d => {
    x: d.x + d.vx,
    y: d.y + d.vy,
    vx: d.vx,
    vy: d.vy,
  })
  let (newMin, newMax, newDiff) = getMinMaxDiff(next)
  if (newDiff >= diff){
    let xs = ptVels|>Array.map(d => d.x)
    let minX = xs->AU.getMin
    let maxX = xs->AU.getMax
    ;(ptVels, minY, maxY, minX, maxX)
  }
  else{
    iters := iters^ + 1
    findMinYDiff(next, newMin, newMax, newDiff)
  }
}

let printPts = (ptVels, y0, y1, x0, x1) => {
  let mat = Array.make_matrix(y1-y0+1, x1-x0+1, ".")
  ptVels |> Array.iter(({x, y}) => mat[y-y0][x-x0] = "#")
  let mapStr = mat
    |>Array.map(row => row|>JA.joinWith(""))
    |>JA.joinWith("\n")
  Js.log(mapStr)
}

let parsed = readLines("10")|>Array.map(s => s->ptVelParser)
let (minY, maxY, diff) = getMinMaxDiff(parsed)
let (found, y0, y1, x0, x1) = findMinYDiff(parsed, minY, maxY, diff)
printPts(found, y0, y1, x0, x1)
Js.log({j|will be shown in $iters seconds|j})