module Day02

open System

/// returns difference of max vs. min in xs 
let maxDiff (xs:int[]) = Array.max xs - (Array.min xs)

/// returns first found division of a/b if reminder is 0 in xs
let maxDiv (xs:int[]) = 
  seq {
  for a in xs do
    for b in xs do
      if a <> b && a % b = 0 then yield a / b
  } |> Seq.head
    
let run (str:string) =
  let xss = 
    str.Split '\n' |> Array.map (fun s ->
      s.Split '\t' |> Array.map int)
  let sumOf f xss =
    xss
    |> Array.map (fun xs -> f xs)
    |> Array.sum 

  printfn "Day 2-1 answer: %A" <| sumOf maxDiff xss
  printfn "Day 2-1 answer: %A" <| sumOf maxDiv xss