module BA = Belt.Array
module BL = Belt.List
module JS = Js.String

let readFile = name => Node.Fs.readFileAsUtf8Sync("data/"++name++".txt")
let readLines = name => readFile(name)->JS.split("\n", _)

module ListUtil = {
  let getMin = lst => lst->BL.reduce(max_int, (acc, e) => e < acc? e : acc);
  let getMax = lst => lst->BL.reduce(min_int, (acc, e) => e > acc? e : acc);
}
module LU = ListUtil

module ArrayUtil = {
  let sumFloat = arr => arr->BA.reduce(0.0, (acc, e) => acc +. e);
  let sumInt = arr => arr->BA.reduce(0, (acc, e) => acc + e);
  let getMin = arr => arr->BA.reduce(max_int, (acc, e) => e < acc? e: acc);
  let getMax = arr => arr->BA.reduce(min_int, (acc, e) => e > acc? e: acc);
  let getMax64 = arr => arr->BA.reduce(
    Int64.min_int, (acc, e) => e > acc? e: acc
  );
}
module AU = ArrayUtil
