open Util

let addNext = (cnts, i1, i2) => {
  let pts = cnts[i1] + cnts[i2]
  let ten = pts/10
  let one = pts mod 10
  /* Performance Notes - Array.append w/
    cnts->Array.append(ten==0? [|one|] : [|ten, one|])
     instead of Js.Array.push below only slightly faster vs. List solution,
     so will GC error in Part 2, and probably take hrs to calculate Part 1.
  */
  ignore(ten==0 ?
    cnts|>JA.push(one) :
    cnts|>JA.pushMany([|ten, one|])
  )
  cnts
}

let geti' = (cnts, i) => {
  let pts = cnts[i]
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
  if (cnts->Array.length >= stop)
    cnts
  else {
    let cnts' = addNext(cnts, i1, i2)
    let i1' = geti'(cnts', i1)
    let i2' = geti'(cnts', i2)
    if (dbg) cntsRep(cnts', i1', i2')->Js.log
    step(cnts', i1', i2', stop, dbg)
  }
}

let stepXandN = (cnts, i1, i2, x, n, dbg) =>
  step(cnts, i1, i2, x+n, dbg)
  ->BA.slice(x, n)
  ->AU.toStr

/* Part 2 */
let getStr = (cnts, ptnLen, cntsLen, offset) => {
  ptnLen+offset <= cntsLen
  ? BA.range(cntsLen -ptnLen -offset, cntsLen -1 -offset)|>Array.map(i =>
      cnts[i]->string_of_int
    )|>AU.toStr
  : ""
}
let rec lenBeforePtn = (cnts, i1, i2, ptn, ptnLen) => {
  if (cnts->Array.length mod 1000000 == 0) Js.log(cnts->Array.length)
  let s = cnts->getStr(ptnLen, cnts->Array.length, 0)
  let t = cnts->getStr(ptnLen, cnts->Array.length, 1);
  let found = s == ptn || t == ptn 
  if (!found) {
    let cnts' = cnts->addNext(i1, i2)
    let i1' = geti'(cnts', i1)
    let i2' = geti'(cnts', i2)
    lenBeforePtn(cnts', i1', i2', ptn, ptnLen)
  } 
  else cnts->Array.length - ptnLen - (s==ptn? 0: 1)
};

let initCnts = () => Array.copy([|3, 7|]);
[|(9, "5158916779"), (5, "0124515891"), (18, "9251071085"), (2018, "5941429882")|]
|>Array.iter(((x, expected)) => {
  let dbg = x <= 99
  let result = stepXandN(initCnts(), 0, 1, x, expected->String.length, dbg)
  if (result == expected)
    Js.log({j|✔ Test "stop after $x" passed|j})
  else
    Js.log({j|✖ Test "stop after $x" FAIL, expect $expected, got $result|j})
})
let input = 681901
let result = stepXandN(initCnts(), 0, 1, input, 10, false)
Js.log({j|10 digits after first $input digits: $result|j})
Js.log("\n");

[|(9, "515891"), (5, "012451"), (18, "92510"), (2018, "59414")|]
|>Array.iter(((expected, ptn)) => {
  let result = lenBeforePtn(initCnts(), 0, 1, ptn, ptn->String.length)
  if (result == expected)
    Js.log({j|✔ Test "$expected digits before pattern $ptn" passed|j})
  else
    Js.log({j|✖ Test "$expected digits before pattern $ptn" FAILED, got $result|j})
});

let ptn = "681901"
let result = lenBeforePtn(initCnts(), 0, 1, ptn, ptn->String.length)
if (result < 1)
  Js.log({j|"digits before pattern" NOT found!|j})
else {
  Js.log({j|Number of digits before pattern "$ptn"|j})
  Js.log(result)
}