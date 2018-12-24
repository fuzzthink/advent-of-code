open Belt
module JS = Js.String

let readFile = name => Node.Fs.readFileAsUtf8Sync("data/"++name++".txt")
let readLines = name => readFile(name)->JS.split("\n", _)

module ArrayUtil = {
  let sumFloat = arr => arr->Array.reduce(0.0, (acc, e) => acc +. e);
  let sumInt = arr => arr->Array.reduce(0, (acc, e) => acc + e);
  let getMax = arr => arr->Array.reduce(Int64.min_int, (acc, e) => e > acc? e: acc);
}
module AU = ArrayUtil
