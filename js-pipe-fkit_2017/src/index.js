const fs = require('fs')

const day = process.env.day

if (!day || day.length != 2 || !(Number(day) < 26)) {
  console.log("`day=XX npm start` to run. Eg. `day=01 npm start`")
  process.exit()
}

const log = {
  p1: s => console.log(`Part 1: ${s}`),
  p2: s => console.log(`Part 2: ${s}`),
}

const data = fs.readFileSync(`data/${day}.txt`, 'utf8')
require(`./day${day}`)(data, log)
