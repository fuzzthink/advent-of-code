module Util

let charToInt (c:char) = int c - int '0'

let splitLine (c:char) (str:string) = 
  str.Split '\n' |> Array.map (fun s -> s.Split c)

let splitLineBy f (c:char) (str:string) = 
  str.Split '\n' |> Array.map (fun s ->
    s.Split c |> Array.map f
  )
