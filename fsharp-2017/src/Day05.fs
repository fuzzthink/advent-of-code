module Day05

open Util

let step (a:int[], i:int) = 
  let i' = i + a.[i]
  a.[i] <- a.[i] + 1
  i'

let doSteps (a:int[]) = 
  let mutable i = step (a, 0)
  let mutable steps = 1
  while i < Array.length a do
    i <- step (a, i)
    steps <- steps + 1
  steps

let run (instr:string) =
  let a = instr |> mapSplitLine int
  printfn "Day 5-1 answer: %A" <| doSteps a
