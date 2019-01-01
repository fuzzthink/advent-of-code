open Util
open Int64
open Belt.Array

type gameStat = {
  playersCnt: int,
  mutable lastWorth: int,
  highScore: int64,
}
type dlNode = { /* doubly linked node */
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
  let scores = BA.make(stat.playersCnt, zero)
  let player = ref(0)
  let cur = ref(firstNode)
  for (i in 1 to stat.lastWorth) {
    if (i mod 23 == 0){
      let iPlayer = player^
      let removedPts = removePrv7(cur)
      let points = i->of_int->add(removedPts)
      scores->setExn(iPlayer, scores->getExn(iPlayer)->add(points))
    } else {
      cur->insertNext2(i->of_int)
    }
    player := (i+1) mod stat.playersCnt
  };
  scores
}

let statParser = (str, setScore) => [@warning "-8"] {
  let Some(intStrs) = str->parseInts
  let ints = intStrs|>Array.map(int_of_string);
  /* let ints = intStrs->map(int_of_string); */
  {
    playersCnt: ints->getExn(0),
    lastWorth: ints->getExn(1),
    highScore: setScore? ints->getExn(2)->Int64.of_int : zero,
  }
}

let printHighScore = (stat, label) => {
  Js.log(label)
  stat
  ->gameScores
  ->AU.getMax64
  ->Js.log
}


/* Sample inputs */
Js.log("Test expected scores in sample games:")
let stats = readLines("09test")->map(s => s->statParser(true))
let scores = stats->map(stat => stat->gameScores)
scores
|>Array.map(scores => scores->AU.getMax64)
|>Array.iteri((i, score) => {
  let expected = (stats->getExn(i)).highScore
  let passed = score == expected
  if (passed)
    Js.log({j|✔ Test case $i passed|j})
  else {
    Js.log({j|✖ Test case $i failed - Got $score, expected $expected, scores were|j})
    Js.log(scores->getExn(i))
  }
})

/* Real input */
let stat = readFile("09")->statParser(false)
stat->printHighScore("Score for 09.txt input:")

stat.lastWorth = stat.lastWorth * 100
stat->printHighScore("Score for 09.txt input with last marble worth 100x:")