open Util
module Ht = Hashtbl

let lenToStr = cnts => cnts->Ht.length->string_of_int

let addNext = (cnts, i1, i2) => {
  let pts = cnts->Ht.find(i1) + cnts->Ht.find(i2)
  let ten = pts/10
  let one = pts mod 10
  if (ten==0)
    cnts->Ht.add(cnts->lenToStr, one)
  else {
    cnts->Ht.add(cnts->lenToStr, ten)
    cnts->Ht.add(cnts->lenToStr, one)
  }
}

let geti' = (cnts, pvCnts, i) => {
  let pts = pvCnts->Ht.find(i)
  let steps = pts + 1
  let i' = i->int_of_string + (steps mod cnts->Ht.length);
  (i' >= cnts->Ht.length? i' - cnts->Ht.length : i')->string_of_int
}

let cntsRep = (cnts, i1, i2) =>
  cnts->Ht.fold((i, c, acc) =>
    i==i1? acc ++ "(" ++ c->string_of_int ++ ")"
    : i==i2? acc ++ "[" ++ c->string_of_int ++ "]"
    : acc ++ " " ++ c->string_of_int ++ " "
  , _, "")

let rec step = (cnts, i1, i2, stop, dbg) => {
  if (cnts->Ht.length mod 10000 == 0) Js.log(cnts->Ht.length)
  if (cnts->Ht.length >= stop)
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
    cnts->Ht.find(i->string_of_int)
  )|>AU.toStr
}

let init = cnts => {
  cnts->Ht.add("0", 3) 
  cnts->Ht.add("1", 7) 
  cnts
};
[|(9, "5158916779"), (5, "0124515891"), (18, "9251071085"), (2018, "5941429882")|]
|>Array.iter(((x, expected)) => {
  let dbg = x <= 99
  let cnts = Ht.create(x + expected->String.length)->init
  let result = stepNafterX(cnts, "0", "1", x, expected->String.length, dbg)
  if (result == expected)
    Js.log({j|✔ Test "stop after $x" passed|j})
  else
    Js.log({j|✖ Test "stop after $x" failed, got $result|j})
})
let x = 681901 
let cnts = Ht.create(x + 10)->init
stepNafterX(cnts, "0", "1", x, 10, false)->Js.log