module Day05

open Util

let step (a:int[], i:int) = 
  let i' = i + a.[i]
  a.[i] <- a.[i] + 1
  i'

let step2 (a:int[], i:int) = 
  let i' = i + a.[i]
  a.[i] <- a.[i] + (if a.[i] > 2 then - 1 else 1)
  i'

let doSteps (a:int[]) stepper = 
  let mutable i = stepper (a, 0)
  let mutable steps = 1
  while i < Array.length a do
    i <- stepper (a, i)
    steps <- steps + 1
  steps

let run (instr:string) =
  printfn "Day 5-1 answer: %A" <| doSteps (instr |> mapSplitLine int) step
  printfn "Day 5-2 answer: %A" <| doSteps (instr |> mapSplitLine int) step2
