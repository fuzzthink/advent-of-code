open Belt
open Util
module Str = Js.String
module Q = MutableQueue

type node = {
  childs: array(node),
  items: array(int),
}

let rec toNode = item => {
  let childCnt = item->Q.popExn;
  let itemsCnt = item->Q.popExn;
  let childs = Q.make()
  Range.forEach(1, childCnt, _ => childs->Q.add(toNode(item)));

  let items = Q.make()
  Range.forEach(1, itemsCnt, _ => items->Q.add(item->Q.popExn));
  {
    childs: childs->Q.toArray,
    items: items->Q.toArray,
  }
}

let getInts = day =>
  readFile(day)
  -> Str.split(" ", _)
  -> Array.map(int_of_string)

let sumInts = ints => ints->Array.reduce(0, (acc, e) => acc+e)

let rec sumGraph = ({childs, items}) => {
  let sums = items->sumInts;
  let childSums = childs->Array.map(sumGraph)->sumInts;
  sums + childSums;
}

let rec sumChilds = ({childs, items}) =>
  if (childs->Array.length==0) items->sumInts 
  else items->Array.reduce(0, (acc, e) => 
    switch (childs->Array.get(e-1)) {
    | Some(child) => acc + child->sumChilds
    | None => acc
    }
  )

let root = getInts("08")->Q.fromArray->toNode
Js.log("Sum of meta numbers:")
Js.log(sumGraph(root));
Js.log("Sum of meta numbers with restrictions:")
Js.log(sumChilds(root));