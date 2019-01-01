open Util
open Int64

let getNextChar = ptn =>
  switch (ptn) {
  | "#..##" => "."
  | "##..#" => "#"
  | "..##." => "."
  | ".##.#" => "#"
  | "....." => "."
  | "..###" => "#"
  | "###.#" => "#"
  | "#...." => "."
  | "#.##." => "#"
  | ".#.##" => "#"
  | "#...#" => "."
  | "...##" => "."
  | "###.." => "#"
  | ".#..#" => "."
  | "####." => "."
  | "....#" => "."
  | "#####" => "#"
  | ".###." => "."
  | "#..#." => "."
  | "##..." => "#"
  | ".#..." => "#"
  | "#.#.#" => "."
  | "..#.." => "#"
  | "...#." => "#"
  | "##.#." => "."
  | ".##.." => "#"
  | ".#.#." => "."
  | "#.#.." => "."
  | "..#.#" => "#"
  | "#.###" => "."
  | "##.##" => "."
  | ".####" => "#"
  | _ => "."
  }

let calcPts = (str, numNegPtsChars) => 
  str
  |>Str.split("")
  |>Array.mapi((i, c) => c=="#"? i-numNegPtsChars: 0)
  |>AU.sumInt

let rec evolvelTil = (str, iter, initIters, ~dbg=false) => {
  let pads = "..." 
  let strlen = str->String.length
  let chars = pads++str++pads|>Str.split("")
  let nextStr = BA.range(0, strlen+1)|>Array.map(i => {
    let ptn = chars->Array.sub(i, 5)|>JA.joinWith("");
    getNextChar(ptn)
  })|>JA.joinWith("");

  Js.log(String.make(iter, ' ')++nextStr);
  if (dbg) nextStr->calcPts(initIters-iter+1)->Js.log;
  iter<=1? nextStr : nextStr->evolvelTil(iter-1, initIters, ~dbg)
};

let inputStr = 
  "#........#.#.#...###..###..###.#..#....###.###.#.#...####..##..##.#####..##...#.#.....#...###.#.####";
[|20, 100|]|>Array.iter(iters => {
  (String.make(iters+1, ' ')++inputStr)->Js.log
  let out = evolvelTil(inputStr, iters, iters, ~dbg=iters==100)
  let pts = out->calcPts(iters)
  Js.log({j|In $iters generations, pots are worth $pts|j})
})

/* Part 2:
Viz indicates pts increments by 80 after 92th gen */
let i = Int64.of_string
let ptsAt50bGen = sub("50000000000"->i, "100"->i)->mul("80"->i)->add("8866"->i)
let s = ptsAt50bGen->to_string
Js.log({j|After 50 billion generations, pots are worth $s|j})