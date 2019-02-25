module Day03

let intSqrt = float >> sqrt >> int
let minus1IfEven x = if x % 2 = 0 then x - 1 else x

/// Part 1 Observation:
/// min-dist is sqrt(x)/2 + 1 and max-dist (corners) is min-dist*2
let distTo1 n =
  let sqrt = (n - 1) |> intSqrt |> minus1IfEven
  let minDist = sqrt/2 + 1
  let eps = abs <| (n - sqrt*sqrt) % (minDist * 2) - minDist
  minDist + eps

/// Part 2 Observation:
/// Numbers to add can be determined via calculating index in inner square 
let nextSpiralNum (xs:ResizeArray<int>) =
  let cnt = xs.Count
  let sqrt = cnt |> intSqrt |> minus1IfEven
  let edgeLen = sqrt + 1
  let len' = cnt - sqrt*sqrt + 1
  let dToCnr' = len' % edgeLen
  let edges = (len' + edgeLen - 1)/edgeLen |> int 
  let isLast = dToCnr' = 0 && edges = 4

  // i0 is index 0 of inner square. i is index of inner val adjacent to val to compute
  let i0 = if sqrt = 1 then 0 else (sqrt - 2) * (sqrt - 2) - 1
  let eps = if isLast then edgeLen - 1 else if dToCnr' = 0 then 0 else dToCnr' - 1
  let i = i0 + (edgeLen - 2)*(if isLast || dToCnr' > 0 then edges - 1 else edges) + eps

  let v0is0 = (dToCnr' = 0 && not isLast) || dToCnr' = 1 || (dToCnr' = 2 && edges = 1)
  // v0 | v1 = val at i | v2 | v3 = val at 2 index back from val to compute
  let v0 = if v0is0 then 0 else if len' = 1 then 0 else xs.[i-1]
  let v1 = if len' = 1 then 0 else xs.[i]
  let v2 = if dToCnr' = 0 || (dToCnr' = edgeLen - 1 && edges < 4) then 0 else xs.[i+1]
  let v3 = if ((dToCnr' = 1 && edges > 1) || (dToCnr' = 2 && edges = 1)) then xs.[cnt - 2] else 0
  v0 + v1 + v2 + v3 + xs.[cnt - 1]

let spiralNumAfter n =
  let a = ResizeArray()
  a.Add(1)
  let mutable next = nextSpiralNum a
  while next < n do
    a.Add(next)
    next <- nextSpiralNum a
  next

let run (s:string) =
  let n = int s
  printfn "Day 3-1 answer: %A" <| distTo1 n
  printfn "Day 3-2 answer: %A" <| spiralNumAfter n