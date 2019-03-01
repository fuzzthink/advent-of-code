module Day02

open Util

/// returns difference of max vs. min in xs 
let maxDiff (xs:int[]) = Array.max xs - (Array.min xs)

/// returns first found division of a/b if reminder is 0 in xs
let maxDiv (xs:int[]) = 
  [for a in xs do
    for b in xs do
      if a <> b && a % b = 0 then yield a / b
  ] |> List.head
    
let run (instr:string) =
  let xss = instr |> mapSplitLineAnd '\t' int
  // +1 for compiler suggesting Array.sumBy instead of: let sumOf f xss = xss
  //   |> Array.map (fun xs -> f xs)
  //   |> Array.sum 
  printfn "Day 2-1 answer: %A" <| Array.sumBy maxDiff xss
  printfn "Day 2-1 answer: %A" <| Array.sumBy maxDiv xss