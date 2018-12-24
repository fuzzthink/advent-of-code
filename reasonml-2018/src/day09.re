open Belt
open Util
open Int64
open Array
open Printf
module JS = Js.String
module Q = MutableQueue

type gameStat = {
  playersCnt: int,
  mutable lastWorth: int,
  highScore: int64,
}
type dlNode = {
  value: int64,
  mutable next: dlNode,
  mutable prv: dlNode,
}

let insertNext2 = (cur, value) => {
  let newNode = {
    value: value,
    next: cur^.next.next,
    prv: cur^.next,
  }
  newNode.prv.next = newNode
  newNode.next.prv = newNode
  cur := newNode
}
let removePrv7 = (cur) => {
  let toRemove = cur^.prv.prv.prv.prv.prv.prv.prv
  toRemove.prv.next = toRemove.next
  toRemove.next.prv = toRemove.prv
  cur := toRemove.next
  toRemove.value
}

let gameScores = stat => {
  let rec firstNode = {value: zero, next: firstNode, prv: firstNode}
  let scores = Array.make(stat.playersCnt, zero)
  let player = ref(0)
  let cur = ref(firstNode)
  Range.forEach(1, stat.lastWorth-1, i => {
    if (i mod 23 == 0){
      let iPlayer = player^
      let removedPts = removePrv7(cur)
      let points = i->of_int->add(removedPts)
      scores->setExn(iPlayer, scores->getExn(iPlayer)->add(points))
    } else {
      cur->insertNext2(i->of_int)
    }
    player := (i+1) mod stat.playersCnt
  });
  scores
}

let statParser = (str, setScore) => {
  let ptsStr = setScore? " points: high score is": " points"
  let cnt = (str
  |> JS.replace(" players; last marble is worth", "")
  |> JS.replace(ptsStr, "")
  |> JS.split(" "))
  -> Array.map(int_of_string)
  -> Q.fromArray;
  {
    playersCnt: cnt->Q.popExn,
    lastWorth: cnt->Q.popExn,
    highScore: setScore? cnt->Q.popExn->of_int: zero,
  }
}

let testStr =
{|9 players; last marble is worth 25 points: high score is 32
10 players; last marble is worth 1618 points: high score is 8317
13 players; last marble is worth 7999 points: high score is 146373
17 players; last marble is worth 1104 points: high score is 2764
21 players; last marble is worth 6111 points: high score is 54718
30 players; last marble is worth 5807 points: high score is 37305|}

let stats = testStr
  ->JS.split("\n", _)
  ->Array.map(s => s->statParser(true))

let testScores = stats
  ->Array.map(stat => stat->gameScores)

Js.log("Test Expected Scores..")
testScores
  ->Array.map(scores => scores->AU.getMax)
  ->Array.forEachWithIndex((i, score) => {
  let expected = (stats->getExn(i)).highScore
  let passed = score == expected
  if (passed)
    Js.log({j|✔|j})
  else {
    Js.log(sprintf("Got %Ld, expected %Ld, scores were", score, expected))
    Js.log(testScores->getExn(i))
  }
})

let input = readFile("09")
let printHighScore = (stat, label) => {
  Js.log(label)
  stat
  ->gameScores
  ->AU.getMax
  ->Js.log
}

let stat = input->statParser(false)
stat->printHighScore("Real Input:")

stat.lastWorth = stat.lastWorth * 100
stat->printHighScore("Real Input x 100:")

/* 4th test does not match, who's error?
Got 2720, expected 2764, scores were
[ [ 0, 1582 ],
  [ 0, 1957 ],
  [ 0, 1945 ],
  [ 0, 2509 ],
  [ 0, 2347 ],
  [ 0, 1368 ],
  [ 0, 1671 ],
  [ 0, 1929 ],
  [ 0, 2036 ],
  [ 0, 2513 ],
  [ 0, 2720 ],
  [ 0, 1611 ],
  [ 0, 1581 ],
  [ 0, 2048 ],
  [ 0, 2422 ],
  [ 0, 2321 ],
  [ 0, 1185 ] ]
*/
