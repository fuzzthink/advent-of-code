open Belt.Array
module BA = Belt.Array
module BL = Belt.List
module JA = Js.Array
module Str = Js.String /* "wrong file naming jS.cmi" if named module JS */

let readFile = name => Node.Fs.readFileAsUtf8Sync("data/"++name++".txt")
let readLines = name => readFile(name)|>Str.split("\n")
let readLine = name => readFile(name)|>Str.split("\n")|>JA.joinWith("")
let parseInts = str => str |> Str.match([%re "/-?[\\d]+/g"])
let fori = Belt.Range.forEach

module ListUtil = {
  let getMin = lst => lst->BL.reduce(max_int, (acc, e) => e < acc? e : acc);
  let getMax = lst => lst->BL.reduce(min_int, (acc, e) => e > acc? e : acc);
}
module LU = ListUtil

module ArrayUtil = {
  let contains = (arr, v) => arr->reduce(false, (acc, e) => acc || v==e) /* break early.. */
  let sumFloat = arr => arr->reduce(0.0, (acc, e) => acc +. e);
  let sumInt = arr => arr->reduce(0, (acc, e) => acc + e);
  let getMin = arr => arr->reduce(max_int, (acc, e) => e < acc? e: acc);
  let getMax = arr => arr->reduce(min_int, (acc, e) => e > acc? e: acc);
  let getMax64 = arr => arr->reduce(Int64.min_int, (acc, e) => e > acc? e: acc);
  let filter = (arr, ~f) => arr
    |> ArrayLabels.to_list
    |> ListLabels.filter(~f)
    |> ArrayLabels.of_list;
}
module AU = ArrayUtil
