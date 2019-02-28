module Util

let charToInt (c:char) = int c - int '0'

/// split str with '\n' and then with c within each line
let splitLineAnd (c:char) (str:string) = 
  str.Split '\n' |> Array.map (fun s -> s.Split c)

/// Like splitLindAnd, but apply f to each item split with c 
let splitLineAndBy (c:char) f (str:string) = 
  str.Split '\n' |> Array.map (fun s ->
    s.Split c |> Array.map f
  )
