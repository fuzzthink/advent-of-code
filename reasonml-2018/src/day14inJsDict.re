open Util
module JD = Js.Dict
/* Failed Js.Dict solution: Slowest, ~100x slower vs. List,
   so probably days to produce Part 1.
   Also couldn't get Js.Dict.entries |> map to work..
*/

let len = cnts => cnts->JD.entries->Array.length
let get = cnts => cnts->JD.unsafeGet

let addNext = (cnts, i1, i2) => {
  let pts = cnts->get(i1) + cnts->get(i2)
  let ten = pts/10
  let one = pts mod 10
  if (ten==0)
    cnts->JD.set(cnts->len->string_of_int, one)
  else {
    cnts->JD.set(cnts->len->string_of_int, ten)
    cnts->JD.set(cnts->len->string_of_int, one)
  }
}

let geti' = (cnts, pvCnts, i) => {
  let pts = pvCnts->get(i)
  let steps = pts + 1
  let i' = i->int_of_string + (steps mod cnts->len);
  (i' >= cnts->len? i' - cnts->len : i')->string_of_int
}

let cntsRep = (cnts, i1, i2) =>
  (cnts->JD.keys)|>Array.map(i =>
    i==i1? "(" ++ cnts->get(i)->string_of_int ++ ")"
    : i==i2? "[" ++ cnts->get(i)->string_of_int ++ "]"
    : " " ++ cnts->get(i)->string_of_int ++ " "
  )|>AU.toStr

let rec step = (cnts, i1, i2, stop, dbg) => {
  if (cnts->len mod 10000 == 0) Js.log(cnts->len)
  if (cnts->len >= stop)
    cnts
  else {
    cnts->addNext(i1, i2)
    let i1' = geti'(cnts, cnts, i1)
    let i2' = geti'(cnts, cnts, i2)
    if (dbg) cntsRep(cnts, i1', i2')->Js.log
    step(cnts, i1', i2', stop, dbg)
  }
}

let stepNafterX = (cnts, i1, i2, x, n, dbg) => {
  step(cnts, i1, i2, x+n, dbg) |> ignore
  BA.range(x, x+n-1)|>Array.map(i =>
    cnts->JD.get(i->string_of_int)
  )|>AU.toStr
}

let init = cnts => {
  cnts
};
[|(9, "5158916779"), (5, "0124515891"), (18, "9251071085"), (2018, "5941429882")|]
|>Array.iter(((x, expected)) => {
  let dbg = x <= 99
  let cnts = JD.fromList([("0", 3), ("1", 7)]) 
  let result = stepNafterX(cnts, "0", "1", x, expected->String.length, dbg)
  if (result == expected)
    Js.log({j|✔ Test "stop after $x" passed|j})
  else
    Js.log({j|✖ Test "stop after $x" FAIL, expected $expected, got $result|j})
})
let input = 681901 
let cnts = JD.fromList([("0", 3), ("1", 7)]) 
stepNafterX(cnts, "0", "1", input, 10, false)->Js.log