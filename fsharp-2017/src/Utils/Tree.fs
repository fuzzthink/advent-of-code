module Tree

type Tree =
  | Node of string * Tree list
  | Leaf of string

let exists optree =
  match optree with
  | Some (Leaf _) -> true
  | Some (Node _) -> true
  | None -> false

let getVal tree = 
  match tree with
  | Leaf s | Node (s, _) -> s
// getVal Runtime Errored:
//   /src/bin/Utils/Tree.js:55
//   if (tree.tag === 0) {
//            ^
// TypeError: Cannot read property 'tag' of undefined

let getVals trees = trees |> List.map getVal

let hasMatch str tree = getVal tree = str

let findTreeMatchStr str trees =
  trees |> List.tryFind (hasMatch str)

/// Filter all trees in trees2 where str matches found in trees1
let matchedTrees trees1 trees2 =
  trees2
  |> List.filter (fun tree -> 
    findTreeMatchStr (getVal tree) trees1 |> exists
  )
  
/// Merge trees to dst if dst's leafs matches - 1 lv deep only
let mergeTo dst trees =
  match dst with
  | Leaf _ -> dst
  | Node (s, leafs) ->
    Node (s, (leafs |> List.map (fun leaf ->
      match leaf with
      | Node _ -> leaf // ignore
      | Leaf s -> Node (s, trees |> List.filter (hasMatch s))
    )))

let rec stackTrees processed (toProcess:Tree list) =
  match toProcess.Length with
  | 0 -> processed
  | _ ->
    let newRoots = toProcess |> List.filter (fun todo -> 
      match todo with
      | Leaf _ -> false // ignore, toProcess are all Branches
      | Node (_, leafs) -> matchedTrees processed leafs |> Seq.length > 0
    )      // same if reversed order of processed/leafs
    let toProcess' = toProcess |> List.except newRoots 
    let processed' = newRoots |> List.map (fun root -> 
      match root with
      | Leaf _ -> root // won't happen
      | Node (s, trees) -> 
        Node (s, trees |> List.map (fun tree -> mergeTo tree processed))
    )
    stackTrees processed' toProcess'

let tryMerge tree1 tree2 =
  let s1 = getVal tree1
  if hasMatch s1 tree2 then 
    Some (mergeTo tree2 [tree1]) else (
      let s2 = getVal tree2
      if hasMatch s2 tree1 then 
        Some (mergeTo tree1 [tree2]) else 
        None
  )

let rec mergeTrees (res':Tree[]) (trees':Tree[]) =
  let len = trees'.Length
  if len = 0 then res' else (
    let mutable i = 0
    let mutable j = 0
    let mutable res = res'
    let mutable trees = trees'
    while i+1 < len do
     j <- i + 1
     while j < len do
      res <- res |> Array.append (
        match tryMerge trees.[i] trees.[j] with
          | Some t ->
            printfn "found: %A" <| t
            trees <- Array.append trees.[0 .. i-1] trees.[i+2 .. len-1]
            j <- j + 1
            [|t|]
          | None ->
            printfn "%A not found" trees.[i]
            i <- i + 1
            Array.empty<Tree>
        )
    printfn "%A %A %A %A" (trees.Length = len) (trees.Length = 1) res trees
    if trees.Length = len || trees.Length = 1 then res |> Array.append trees else
      mergeTrees res trees
  )