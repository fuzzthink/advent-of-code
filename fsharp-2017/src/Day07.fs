module Day07

open Util
open Tree


let run (instr:string) =
  let nodes = instr |> mapSplitLine parseNode |> List.ofArray
  let singles, branches =
    nodes |> List.partition(fun t -> t.leafs.Length = 0)
  let processed = 
    singles |> List.map (fun o -> Leaf o.root)
  let toProcess = 
    branches |> List.map (fun o -> Node (o.root, o.leafs |> List.map Leaf))
  let list = stackTrees processed toProcess
  let merged = mergeTrees Array.empty<Tree> (list |> Array.ofList)
  printfn "Day 7-1 answer: %A" <| merged