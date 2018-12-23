open Belt
let readFile = name => Node.Fs.readFileAsUtf8Sync("data/"++name++".txt");

let reduceSumF = (f, acc, el) => acc +. f(el);
let reduceSumI = (f, acc, el) => acc + f(el);

module ArrayUtil = {
  let sumF = (arr, f) => arr->Array.reduce(0.0, reduceSumF(f));
  let sumI = (arr, f) => arr->Array.reduce(0, reduceSumI(f));
};
module AU = ArrayUtil;

/* open Belt;

module FloatCmp =
  Id.MakeComparable({
    type t = float;
    let cmp = Pervasives.compare;
  });

let readFileAsLines = (filename, trim) => {
  let fileContents = Node.Fs.readFileAsUtf8Sync(filename);
  Js.String.split("\n", trim ? Js.String.trim(fileContents) : fileContents)
  ->List.fromArray;
};

let inputFilename = tag => "input/" ++ tag ++ ".txt";
let readInputLines = (~trim=true, tag) =>
  tag->inputFilename->readFileAsLines(trim);

let strToChars = str => Js.String.split("", str)->List.fromArray;
let charsToStr = charList => Js.Array.joinWith("", charList->List.toArray);

let intRegex = [%re "/-?[\\d]+/g"];

type coordinate = {
  x: int,
  y: int,
};

module CoordHash =
  Id.MakeHashable({
    type t = coordinate;
    let hash = Hashtbl.hash;
    let eq = (==);
  });

let identity = value => value; */