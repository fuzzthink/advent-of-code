module Day06

open Util

let zeroAt (i:int) (a:int[]) =
  [| for j in 0 .. a.Length-1 -> if j=i then 0 else a.[j] |]

let spreadAll (n:int) (a:int[]) = [| for x in a -> x + n |]

let spreadN (idx:int) (n:int) (a:int[]) = 
  if n = 0 then a else
  let zeroOne i x =
    let toEnd = a.Length - idx - 1
    if i = idx then 0 else 
      if (i > idx && i - idx <= n) || (i < idx && i + toEnd < n) then 1 else 0
  [| for i in 0 .. a.Length-1 -> a.[i] + zeroOne i n |]

let hash a = sprintf "%A" <| a

let spread a:int[] =
  let max = Array.max a
  let i = a |> Array.findIndex (fun x -> x = max)
  a
  |> zeroAt i
  |> spreadAll (max / a.Length |> int)
  |> spreadN i (max % a.Length)

let rec count (a:int[]) (hist:Set<string>) = 
  if hist.Contains(hash a) then hist.Count else count (spread a) (hist.Add(hash a))

let run (instr:string) =
  printfn "Day 6-1 answer: %A" <| count (instr |> splitInt '\t') Set.empty
