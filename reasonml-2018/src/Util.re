open Belt
let readFile = name => Node.Fs.readFileAsUtf8Sync("data/"++name++".txt");

let reduceSumF = (f, acc, el) => acc +. f(el);
let reduceSumI = (f, acc, el) => acc + f(el);

module ArrayUtil = {
  let sumF = (arr, f) => arr->Array.reduce(0.0, reduceSumF(f));
  let sumI = (arr, f) => arr->Array.reduce(0, reduceSumI(f));
};
module AU = ArrayUtil;
