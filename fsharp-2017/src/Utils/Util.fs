module Util

open System

let charToInt (c:char) = int c - int '0'

let splitInt (c:char) (str:string) = str.Split c |> Array.map int 

let splitLine (str:string) = str.Split '\n'

let mapSplitLine f (str:string) = str.Split '\n' |> Array.map f

/// split str into lines with '\n', then split with sep for each line
let splitLineAnd (sep:char) (str:string) = 
  str.Split '\n' |> Array.map (fun s -> s.Split sep)

/// Like splitLindAnd, but apply f to for all tokens in each line 
let mapSplitLineAnd (sep:char) f (str:string) = 
  str.Split '\n' |> Array.map (fun s ->
    s.Split sep |> Array.map f
  )

type NodeRec = {
  root: String 
  leafs: String list
}

/// Parse eg. "ugml (68) -> gyxo, ebii, jpt" to Branch
let parseNode (str:string) =  
  let getRootId (s:string) = s.Split(' ').[0]
  let getLeafIds(s:string) = s.Split([|", "|], StringSplitOptions.RemoveEmptyEntries)

  let strs = str.Split([|" -> "|], StringSplitOptions.RemoveEmptyEntries)
  let node = {
    root = getRootId strs.[0]
    leafs = List.empty
  }
  match strs.Length with
  | 1 -> node
  | _ -> { node with leafs = getLeafIds strs.[1] |> List.ofArray}
