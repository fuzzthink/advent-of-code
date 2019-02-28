module Day04

open Util
open System

let hasDup(a:string[]) : bool =
  let mutable tmp = set []
  a |> Array.exists (fun s ->
    if not (tmp.Contains s) then tmp <- tmp.Add s; false
    else true
  )

let hasAnagram(a:string[]) : bool =
  let mutable tmp = set []
  a |> Array.exists (fun s ->
    let hash = s |> Seq.sort |> String.Concat
    if not (tmp.Contains hash) then tmp <- tmp.Add hash; false
    else true
  )

let countValids f aa = 
  aa |> Array.filter f |> Array.length

let run (instr:string) =
  let aa = instr |> splitLineAnd ' '
  printfn "Day 4-1 answer: %A" <| countValids (not << hasDup) aa
  printfn "Day 4-2 answer: %A" <| countValids (not << hasAnagram) aa
