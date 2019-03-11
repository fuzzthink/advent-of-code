module Day06

open Util

let zeroAt (i:int) (a:int[]) =
  [| for j in 0 .. a.Length-1 -> if j=i then 0 else a.[j] |]

/// Allocate n to all elms in a
let allocAll (n:int) (a:int[]) = [| for x in a -> x + n |]

/// Allocate 1 to n elms in a, starting from elm after idx
let allocN (idx:int) (n:int) (a:int[]) = 
  if n = 0 then a else
  let zeroOrOne i = // 0 or 1, based on index i in the array
    let toEnd = a.Length - idx - 1
    if (i > idx && i - idx <= n) || (i < idx && i + toEnd < n) then 1 else 0
  [| for i in 0 .. a.Length-1 -> a.[i] + zeroOrOne i |]

let hash a = sprintf "%A" <| a

let alloc a:int[] =
  let max = Array.max a
  let i = a |> Array.findIndex (fun x -> x = max)
  a
  |> zeroAt i
  |> allocAll (max / a.Length |> int)
  |> allocN i (max % a.Length)

/// Number of allocations needed for array a
let rec cntAllocs (a:int[]) (hist:Set<string>) = 
  if hist.Contains(hash a) then hist.Count else cntAllocs (alloc a) (hist.Add(hash a))

/// Number of allocations between first time array a is repeated
let rec cntPrvSeen (a:int[]) (hist:Map<string, int>) = 
  let iSeen = hist.TryFind (hash a)
  match iSeen with
  | Some i' -> hist.Count - i'
  | None -> cntPrvSeen (alloc a) (hist.Add(hash a, hist.Count))

let run (instr:string) =
  printfn "Day 6-1 answer: %A" <| cntAllocs (instr |> splitInt '\t') Set.empty
  printfn "Day 6-2 answer: %A" <| cntPrvSeen (instr |> splitInt '\t') Map.empty