open Util
open Belt.Array
module Q = Belt.MutableQueue

type node = {
  childs: array(node),
  items: array(int),
}

let rec toNode = item => {
  let childCnt = item->Q.popExn;
  let itemsCnt = item->Q.popExn;
  let childs = Q.make()
  for(_ in 1 to childCnt) childs->Q.add(toNode(item));
  let items = Q.make()
  for(_ in 1 to itemsCnt) items->Q.add(item->Q.popExn);
  {
    childs: childs->Q.toArray,
    items: items->Q.toArray,
  }
}

let splitToInts = str => str
  -> Str.split(" ", _)
  -> map(int_of_string)

let sumInts = ints => ints->reduce(0, (acc, e) => acc+e)

let rec sumGraph = ({childs, items}) => {
  let sums = items->sumInts;
  let childSums = childs->map(sumGraph)->sumInts;
  sums + childSums;
}

let rec sumChilds = ({childs, items}) =>
  if (childs->length==0)
    items->sumInts 
  else items->reduce(0, (acc, e) => 
    switch (childs->get(e-1)) {
    | Some(child) => acc + child->sumChilds
    | None => acc
    }
  )

let root = readFile("08")->splitToInts->Q.fromArray->toNode
Js.log("Sum of meta numbers:")
Js.log(sumGraph(root));
Js.log("Sum of meta numbers with restrictions:")
Js.log(sumChilds(root));