open Util
module BA = Belt.Array

type direction =
  | N
  | E
  | S
  | W
  | NW
  | NE
  | SE
  | SW
  ;
type cart = {
  x: int,
  y: int,
  heading: direction,
}

let getDir = s =>
  switch (s) {
  | "^" => N
  | ">" => E
  | "v" => S
  | _ => W
  }

let parseTile = s =>
  switch (s) {
  | "^" => "|"
  | "v" => "|"
  | ">" => "-"
  | "<" => "-"
  | _ => s
  }

let parseMap = strs => strs
  |>Array.map(str => str
    |>Str.split("")
    |>Array.map(s => s->parseTile)
  )

let parseCarts = (str, mapWidth) => str
  ->Str.split("", _)
  ->BA.reduceWithIndex([||], (acc, c, i) =>
    if ("^ v > < "->Str.split(" ", _)->AU.contains(c)){
      let y = i / mapWidth
      let x = i mod mapWidth
      acc->Array.append([|{x, y, heading: c->getDir}|])
    }
    else acc
  )

let map = readLines("13test")->parseMap
let xLen = map[0]->Array.length
let carts = readLine("13test")->parseCarts(xLen)
map->Js.log
carts->Js.log