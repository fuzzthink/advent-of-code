module Day04

open Util

let hasDup(l:string[]) : bool =
  let mutable tmp = set []
  l |> Array.exists (fun x ->
    if not (tmp.Contains x) then tmp <- tmp.Add x; false
    else true
  )

let run (str:string) =
  let xss = splitLine ' ' str
  printfn "Day 4-1 answer: %A" <| (
    xss
    |> Array.filter (not << hasDup)
    |> Array.length
  )
