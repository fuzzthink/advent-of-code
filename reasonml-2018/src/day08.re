open Belt
open Util
module BA = Belt.Array
module JS = Js.String
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

let getInts = day =>
  readFile(day)
  -> JS.split(" ", _)
  -> BA.map(int_of_string)

let sumInts = ints => ints->BA.reduce(0, (acc, e) => acc+e)

let rec sumGraph = ({childs, items}) => {
  let sums = items->sumInts;
  let childSums = childs->BA.map(sumGraph)->sumInts;
  sums + childSums;
}

let rec sumChilds = ({childs, items}) =>
  if (childs->BA.length==0) items->sumInts 
  else items->BA.reduce(0, (acc, e) => 
    switch (childs[e-1]) {
    | Some(child) => acc + child->sumChilds
    | None => acc
    }
  )

let root = getInts("08")->Q.fromArray->toNode
Js.log("Sum of meta numbers:")
Js.log(sumGraph(root));
Js.log("Sum of meta numbers with restrictions:")
Js.log(sumChilds(root));