open Util
/* Array: ~1000x Slower vs. Hashtbl, but faster vs. List */

let addNext = (cnts, i1, i2) => {
  let pts = cnts[i1] + cnts[i2]
  let ten = pts/10
  let one = pts mod 10
  cnts->Array.append(ten==0? [|one|] : [|ten, one|])
}

let geti' = (cnts, pvCnts, i) => {
  let pts = pvCnts[i]
  let steps = pts + 1
  let i' = i + (steps mod cnts->Array.length)
  i' >= cnts->Array.length? i' - cnts->Array.length : i'
}

let cntsRep = (cnts, i1, i2) =>
  cnts|>Array.mapi((i, c) => 
    i==i1? "(" ++ c->string_of_int ++ ")"
    : i==i2? "[" ++ c->string_of_int ++ "]"
    : " " ++ c->string_of_int ++ " "
  )|>AU.toStr

let rec step = (cnts, i1, i2, stop, dbg) => {
  if (cnts->Array.length mod 10000 == 0) Js.log(cnts->Array.length)
  if (cnts->Array.length >= stop)
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
  let n' = cnts'->Array.length - x
  cnts'->BA.slice(x, n' + n)->AU.toStr
}

let initCnts = [|3, 7|];
[|(9, "5158916779"), (5, "0124515891"), (18, "9251071085"), (2018, "5941429882")|]
|>Array.iter(((x, expected)) => {
  let dbg = x <= 99
  let result = stepNafterX(initCnts, 0, 1, x, expected->String.length, dbg)
  if (result == expected)
    Js.log({j|✔ Test "stop after $x" passed|j})
  else
    Js.log({j|✖ Test "stop after $x" failed, got $result|j})
})
stepNafterX(initCnts, 0, 1, 681901, 10, false)->Js.log