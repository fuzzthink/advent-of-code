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

let rec evolvelTil = (str, iter, iters, prvPts, prvDiff, ~dbg=false) => {
  let pads = "..." 
  let strlen = str->String.length
  let chars = pads++str++pads|>Str.split("")
  let nextStr = BA.range(0, strlen+1)|>Array.map(i => {
    let ptn = chars->Array.sub(i, 5)|>JA.joinWith("");
    getNextChar(ptn)
  })|>JA.joinWith("");
  let pts = nextStr->calcPts(iters-iter+1)
  let diff = pts - prvPts
  let exit = iter <= 1 || diff == prvDiff

  Js.log(String.make(iter, ' ')++nextStr);
  if (dbg) Js.log(pts)

  exit
  ? (pts, diff, nextStr)
  : evolvelTil(nextStr, iter-1, iters, pts, diff, ~dbg)
};

let inputStr = 
  "#........#.#.#...###..###..###.#..#....###.###.#.#...####..##..##.#####..##...#.#.....#...###.#.####";

[|20, 100|]|>Array.iter(iters => {
  let part2 = iters==100;
  Js.log(String.make(iters+1, ' ')++inputStr)
  let (pts, diff, out) = evolvelTil(inputStr, iters, iters, 0, 0, ~dbg=part2)
  Js.log({j|In $iters generations, pots are worth $pts|j})
  if (part2) {
    let gen = (out->String.length - 100)/2
    let s = Int64.of_string
    let i = Int64.of_int
    let gen50bPts = sub("50000000000"->s, gen->i)->mul(diff->i)->add(pts->i)
    let ptstr = gen50bPts->to_string
    Js.log({j|After 50 billion generations, pots will be worth $ptstr|j})
  }
})