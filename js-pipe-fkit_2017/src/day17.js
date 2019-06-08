class CirBuffer {
  constructor(steps) {
    this.steps = steps
    this.reset()
  }
  reset() {
    this.a = [0]
    this.p = 0
    return this
  }
  insert(x) {
    this.p = (this.p + this.steps) % x + 1
    this.a.splice(this.p, 0, x)
    return this.a
  }
  insertTo(n, from=1) {
    for (let x=from; x <=n; x++)
      this.insert(x)
    return this
  }
  findAfter(v) {
    return this.a[this.a.indexOf(v) + 1]
  }
  findAfterPosAfterInsertTo(n, pos) {
    let v = 0
    let p = 0
    for (let x=1; x <=n; x++) {
      p = (p + this.steps) % x + 1
      if (p == pos+1)
        v = x
    }
    return v
  }
}

const run = (inStr, log) => {
  const buf = new CirBuffer(~~inStr)
  log.p1( buf.insertTo(2017).findAfter(2017) ) // 725
  log.p1( buf.reset().findAfterPosAfterInsertTo(50000000, 0) ) // 27361412 
}
module.exports = { 
  run,
  CirBuffer,
}