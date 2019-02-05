module Day01

open Fable.Import.Node.Exports
open Util

/// Iterate the xs chars, match each aginst the val at iCompare away.
/// If vals equal, add to the sum. iCompare wraps to the front if > xs length.
let sumIfEqNextI xs iCompare = 
  let xi = xs |> Seq.map charToInt |> Seq.toList
  let xi' = (xi |> Seq.skip iCompare |> Seq.toList)
          @ (xi |> Seq.take iCompare |> Seq.toList)
  (xi, xi') ||> List.map2 (fun a b -> if a=b then a else 0) |> List.sum
    
let run () =
  let buf = fs.readFileSync "data/01.txt"
  let str = sprintf "%A" buf
  printfn "Day 1-1 answer: %A" <| sumIfEqNextI str 1
  printfn "Day 1-2 answer: %A" <| sumIfEqNextI str (str.Length/2)