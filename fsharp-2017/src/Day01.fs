module Day01

open Util

/// Iterate str of chars, match each aginst the val at iCompare away.
/// If vals equal, add to the sum. iCompare wraps to the front if > l.length
let sumIfEqNextI str iCompare = 
  let l = str |> Seq.map charToInt |> Seq.toList
  let l' = (l |> Seq.skip iCompare |> Seq.toList)
          @ (l |> Seq.take iCompare |> Seq.toList)
  (l, l') ||> List.map2 (fun a b -> if a=b then a else 0) |> List.sum
    
let run (instr:string) =
  printfn "Day 1-1 answer: %A" <| sumIfEqNextI instr 1
  printfn "Day 1-2 answer: %A" <| sumIfEqNextI instr (instr.Length/2)