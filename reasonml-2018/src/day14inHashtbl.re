open Util
module Ht = Hashtbl
/* Part 1: few 1000x faster vs. array w/ Array.append, result calculated in ~1 sec.
   Part 2: Hashtbls GC error when length is 10mil.
   Attempt to solve with array of Hashtbl - performed faster, but still errored
    when total length is ~17mil, so not able to produce result.
   Tried Hashtbl lengths of 1k, 10k, 100k.  1k and 10k had better performance
*/

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

let getNewi = (cnts, i) => {
  let pts = cnts->Ht.find(i)
  let steps = pts + 1
  let i' = i->int_of_string + (steps mod cnts->Ht.length);
  (i' >= cnts->Ht.length? i' - cnts->Ht.length : i')->string_of_int
}

let cntsRep = (cnts, i1, i2) =>
  BA.range(0, cnts->Ht.length-1)|>Array.map(i => {
    let s = i->string_of_int
    s==i1? "(" ++ cnts->Ht.find(s)->string_of_int ++ ")"
    : s==i2? "[" ++ cnts->Ht.find(s)->string_of_int ++ "]"
    : " " ++ cnts->Ht.find(s)->string_of_int ++ " "
  })|>AU.toStr

let rec step = (cnts, i1, i2, stop, dbg) => {
  if (cnts->Ht.length >= stop)
    cnts
  else {
    cnts->addNext(i1, i2)
    let i1' = getNewi(cnts, i1)
    let i2' = getNewi(cnts, i2)
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
}

/* Part 2 */
let htLen = 1000
let newHt = doInit => doInit? Ht.create(htLen)->init : Ht.create(htLen)
let newHtWith = (k, v) => {
  let res = Ht.create(htLen)
  res->Ht.add(k, v)
  res
}
let getCntsLen = cnts => {
  let iArrLast = cnts->Array.length - 1
  let prvLens = iArrLast*htLen
  let curLens = cnts[iArrLast]->Ht.length
  prvLens + curLens
}
let getV = (cnts, i) => {
  let iArr = i / htLen
  let iHt = i mod htLen
  cnts[iArr]->Ht.find(iHt->string_of_int)
};
let addV = (cnts, v, cntsLen) => {
  let iArr = cnts->Array.length -1
  if (cnts[iArr]->Ht.length < htLen) {
    let iHt = cntsLen mod htLen
    cnts[iArr]->Ht.add(iHt->string_of_int, v);
    cnts
  } else {
    cnts->Array.append([|newHtWith("0", v)|]);
  }
}
let getStr = (cnts, ptnLen, cntsLen, offset) => {
  ptnLen+offset <= cntsLen
  ? BA.range(cntsLen -ptnLen -offset, cntsLen -1 -offset)|>Array.map(i =>
      cnts->getV(i)->string_of_int
    )|>AU.toStr
  : ""
}
let addNext' = (cnts, i1, i2, cntsLen) => {
  let pts = cnts->getV(i1) + cnts->getV(i2)
  let ten = pts/10
  let one = pts mod 10
  if (ten==0)
    cnts->addV(one, cntsLen)
  else
    cnts->addV(ten, cntsLen)->addV(one, cntsLen+1)
}
let getNewi' = (cnts, i, cntsLen) => {
  let pts = cnts->getV(i)
  let steps = pts + 1
  let i' = i + (steps mod cntsLen)
  let res = i' >= cntsLen? i' - cntsLen: i'
  res
};

let rec lenBeforePtn = (cnts, i1, i2, ptn, ptnLen) => {
  let cntsLen = cnts->getCntsLen
  let s = cnts->getStr(ptnLen, cntsLen, 0)
  let t = cnts->getStr(ptnLen, cntsLen, 1);
  let found = s == ptn || t == ptn 
  if (!found) {
    let cnts' = cnts->addNext'(i1, i2, cntsLen)
    let cntsLen' = cnts'->getCntsLen
    let i1' = getNewi'(cnts', i1, cntsLen')
    let i2' = getNewi'(cnts', i2, cntsLen')
    lenBeforePtn(cnts', i1', i2', ptn, ptnLen)
  } 
  else
    cntsLen - ptnLen - (s==ptn? 0: 1)
};

[|(9, "5158916779"), (5, "0124515891"), (18, "9251071085"), (2018, "5941429882")|]
|>Array.iter(((x, expected)) => {
  let dbg = x <= 99
  let cnts = Ht.create(x + expected->String.length)->init
  let result = stepNafterX(cnts, "0", "1", x, expected->String.length, dbg)
  if (result == expected)
    Js.log({j|✔ Test "stop after $x" passed|j})
  else
    Js.log({j|✖ Test "stop after $x" FAILED, got $result|j})
});

let x = 681901
let cnts = Ht.create(x + 10)->init
let result = stepNafterX(cnts, "0", "1", x, 10, false)
Js.log({j|$result is the 10 digits after first $x digits|j});

[|(9, "515891"), (5, "012451"), (18, "92510"), (2018, "59414")|]
|>Array.iter(((expected, ptn)) => {
  let cnts = [|newHt(true)|]
  let result = lenBeforePtn(cnts, 0, 1, ptn, ptn->String.length)
  if (result == expected)
    Js.log({j|✔ Test "$expected digits before pattern $ptn" passed|j})
  else
    Js.log({j|✖ Test "$expected digits before pattern $ptn" FAILED, got $result|j})
});

let ptn = "681901"
let cnts = [|newHt(true)|]
let result = lenBeforePtn(cnts, 0, 1, ptn, ptn->String.length)
if (result < 1)
  Js.log({j|"digits before pattern" NOT found!|j})
else
  Js.log({j|$result is the digits before pattern "$ptn"|j})