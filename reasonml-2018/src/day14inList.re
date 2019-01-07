open Util
/* List: Slower vs. Array */

let at = (cnts, i) => cnts->List.nth(i)

let addNext = (cnts, i1, i2) => {
  let pts = cnts->at(i1) + cnts->at(i2)
  let ten = pts/10
  let one = pts mod 10
  ;switch (ten) {
  | 0 => [one, ...cnts]
  | _ => [one, ten, ...cnts]
  }
}

let geti' = (cnts, pvCnts, pvi) => {
  let diff = cnts->List.length - pvCnts->List.length
  let pts = pvCnts->at(pvi)
  let steps = pts + 1
  let i = pvi+diff
  let i' = i - (steps mod cnts->List.length)
  i' < 0 ? cnts->List.length + i' : i'
}

let cntsRep = (cnts, i1, i2) =>
  cnts|>List.mapi((i, c) => 
    i==i1? "(" ++ c->string_of_int ++ ")"
    : i==i2? "[" ++ c->string_of_int ++ "]"
    : " " ++ c->string_of_int ++ " "
  )|>List.rev|>LU.toStr

let rec step = (cnts, i1, i2, stop, dbg) => {
  if (cnts->List.length mod 10000 == 0) Js.log(cnts->List.length)
  if (cnts->List.length >= stop)
    cnts
  else {
    let cnts' = addNext(cnts, i1, i2)
    let i1' = geti'(cnts', cnts, i1)
    let i2' = geti'(cnts', cnts, i2)
    if (dbg) cntsRep(cnts', i1', i2')->Js.log
    step(cnts', i1', i2', stop, dbg)
  }
}

let stepNafterX = (cnts, i1, i2, x, n, dbg) => {
  let cnts' = step(cnts, i1, i2, x+n, dbg)
  let n' = cnts'->List.length - x 
  switch ( cnts'->BL.take(n') ){
  | Some(ns) => switch (ns->BL.drop(n' - n)){
    | Some(ns) => ns|>List.rev|>LU.toStr
    | None => ""
    }
  | None => ""
  }
}

let initCnts = [7, 3];
[(9, "5158916779"), (5, "0124515891"), (18, "9251071085"), (2018, "5941429882")]
|>List.iter(((x, expected)) => {
  let dbg = x <= 99
  let result = stepNafterX(initCnts, 1, 0, x, expected->String.length, dbg)
  if (result == expected)
    Js.log({j|✔ Test "stop after $x" passed|j})
  else
    Js.log({j|✖ Test "stop after $x" failed, got $result|j})
})
stepNafterX(initCnts, 1, 0, 681901, 10, false)->Js.log