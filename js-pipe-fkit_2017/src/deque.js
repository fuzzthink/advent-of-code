/// Double Ended Que

const takeNFrom = (n, i) => a =>
  (i + n > a.length
    ? a.slice(i).concat( a.slice(0, i + n - a.length) )
    : a.slice(i, i + n)
  )

/// take n from back of a, rotate to front
const rotateR = n => a => [...a.slice(a.length - n), ...a.slice(0, a.length - n)]

module.exports = {
  takeNFrom,
  rotateR,
}
