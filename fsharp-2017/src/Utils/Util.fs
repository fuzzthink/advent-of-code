module Util

let charToInt (c:char) = int c - int '0'

let splitInt (c:char) (str:string) = str.Split c |> Array.map int 

let splitLine (str:string) = str.Split '\n'

let mapSplitLine f (str:string) = str.Split '\n' |> Array.map f

/// split str with '\n' and then with c within each line
let splitLineAnd (c:char) (str:string) = 
  str.Split '\n' |> Array.map (fun s -> s.Split c)

/// Like splitLindAnd, but apply f to each item split with c 
let mapSplitLineAnd (c:char) f (str:string) = 
  str.Split '\n' |> Array.map (fun s ->
    s.Split c |> Array.map f
  )
