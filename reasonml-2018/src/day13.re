open Util
open Printf

type direction = | N | E | S | W ;
type nextTurn = | Lf | Fw | Rt ; 
type cart = {
  mutable x: int,
  mutable y: int,
  mutable heading: direction,
  mutable turn: nextTurn,
}

let getDir = s =>
  switch (s) {
  | "^" => N
  | ">" => E
  | "v" => S
  | _ => W
  }

let stepCart = (cart, grid) => {
  let (x, y) = switch (cart.heading){
    | N => (cart.x  , cart.y-1)
    | E => (cart.x+1, cart.y  )
    | S => (cart.x  , cart.y+1)
    | W => (cart.x-1, cart.y  )
  }
  let heading = switch (grid[y][x]){
    | "+" => switch((cart.heading, cart.turn)){
      | (E, Lf) | (N, Fw) | (W, Rt) => N
      | (S, Lf) | (E, Fw) | (N, Rt) => E
      | (W, Lf) | (S, Fw) | (E, Rt) => S
      | (N, Lf) | (W, Fw) | (S, Rt) => W
      }
    | "\\"=> switch(cart.heading){ | E => S | S => E | N => W | W => N }
    | "/" => switch(cart.heading){ | E => N | N => E | S => W | W => S }
    | _ => cart.heading
  }
  cart.heading = heading
  cart.turn = switch ((grid[y][x], cart.turn)){
    | ("+", Lf) => Fw
    | ("+", Fw) => Rt
    | ("+", Rt) => Lf
    | (_, _) => cart.turn
  }
  cart.x = x
  cart.y = y
  cart
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
      acc->Array.append([|{x, y, heading: c->getDir, turn: Lf}|])
    }
    else acc
  )

let getCrashCart = carts => {
  let crashCarts = carts^
  |>Array.fold_left((acc, c') => switch(acc->Array.length){
    | 0 => [|c'|]
    | 2 => acc
    | _ => acc[0].x==c'.x && acc[0].y==c'.y? acc|>Array.append([|c'|]) : [|c'|]
  }, [||])
  crashCarts|>Array.length==2? crashCarts[0] : {x:-1, y:-1, heading:N, turn:Fw}
}

let removeCrashed = (carts, x, y) =>
  carts^ |>Array.to_list |>List.filter(c => c.x!=x && c.y!=y) |>Array.of_list

let cartRep = cart => switch (cart.heading) {
  | N => {js|▲|js}
  | E => {js|▶|js}
  | S => {js|▼|js}
  | _ => {js|◀|js}
}
let printMap = (carts, grid) => {
  grid|>Array.iteri((y, row) => {
    let row' = row|>Array.copy
    carts |>Array.iter(cart => {
      if (cart.y == y)
        row'->BA.setExn(cart.x, cart->cartRep)
    })
    row'|>JA.joinWith("") |> Js.log
  })
}

let step = (carts, grid, dbg) => {
  carts^ |>Array.sort((c1, c2) => compare((c1.y, c1.x), (c2.y, c2.x)))
  carts^ |>Array.map(cart => stepCart(cart, grid)) |> ignore
  if (dbg) printMap(carts^, grid)
  carts
}

let maxIters = 100000;
[|"13test", "13"|]|>Array.iteri((input, filename) => {
  let dbg = input == 0
  let grid = readLines(filename)->parseMap
  let xLen = grid[0]->Array.length
  let carts = readLine(filename)->parseCarts(xLen)->ref
  let break = false->ref
  let iters = 0->ref
  while (!break^) {
    let crash = carts->step(grid, dbg)->getCrashCart->ref
    if (crash^.x != -1){
      while (crash^.x != -1){
        let coord = sprintf("%d,%d", crash^.x, crash^.y)
        Js.log({j|Crashed at $coord|j})
        carts := removeCrashed(carts, crash^.x, crash^.y)
        crash := getCrashCart(carts)
      }
      if (dbg) printMap(carts^, grid)
    }
    iters := iters^ + 1
    break := carts^ |>Array.length <= 1 || iters^ >= maxIters
  }
  Js.log({j|After $iters steps|j})
  carts^ |>Array.iter(c => {
    let coord = sprintf("%d,%d", c.x, c.y)
    Js.log({j|Last coord(s) at $coord|j})
    if (input==0) Js.log("\nReal input:")
  })
})