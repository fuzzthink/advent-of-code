open Util
open Printf

type cfg = {
  sn: int,
  xlen: int,
  ylen: int,
}

let powerLv = (sn, x, y) => {
  let rackId = x + 10;
  (((((rackId * y) + sn) * rackId) / 100) mod 10) - 5
}

let calcPower = (mat, c) => {
  for (y in 0 to c.ylen-1) {
    for (x in 0 to c.xlen-1) {
      mat[y][x] = powerLv(c.sn, x, y)
    }
  };
  mat
}

let max3x3 = (m, c) => {
  let max = ref(-5 * 9)
  let maxX = ref(-1)
  let maxY = ref(-1)
  for (y in 1 to c.ylen-2) {
    for (x in 1 to c.xlen-2) {
      let v = m[y-1][x-1] + m[y-1][x] + m[y-1][x+1]
            + m[y  ][x-1] + m[y  ][x] + m[y  ][x+1]
            + m[y+1][x-1] + m[y+1][x] + m[y+1][x+1];
      if (v > max^) {
        max := v
        maxX := x
        maxY := y
      }
    }
  };
  (max^, maxX^, maxY^)
}

let summedAreaTable = (mat, c) => {
  let sums = Array.make_matrix(c.ylen, c.xlen, 0);
  for (y in 0 to c.ylen-1) {
    for (x in 0 to c.xlen-1) {
      let prvX = x==0? 0 : sums[y][x-1]
      let prvY = y==0? 0 : sums[y-1][x]
      let prvXY = (y==0 || x==0)? 0 : sums[y-1][x-1]
      sums[y][x] = mat[y][x] + prvY + prvX - prvXY
    }
  };
  sums
}

let maxSqr = (c, sums) => {
  let max = ref(-5 * c.ylen * c.xlen)
  let maxX = ref(-1)
  let maxY = ref(-1)
  let len = ref(0)
  for (y in 1 to c.ylen-2) {
    for (x in 1 to c.xlen-2) {
      let maxD = x < y? x : y
      for (d in 1 to maxD) {
        let v = sums[y][x] + sums[y-d][x-d] - sums[y-d][x] - sums[y][x-d]
        if (v > max^) {
          max := v
          maxX := x
          maxY := y
          len := d
        }
      }
    }
  };
  (max^, maxX^, maxY^, len^)
}

let print5x5 = (mat, maxX, maxY) => {
  let strs = Array.make_matrix(6, 6, "");
  let x0 = maxX > 1? maxX-2 : 0;
  let y0 = maxY > 1? maxY-2 : 0;
  for (y in y0 to y0+4) {
    strs[y-y0][0] = sprintf("%2d ", y-1) /* don't -1 if 1-base index labels */
    for (x in x0 to x0+4) {
      let v = mat[y][x]
      strs[y-y0+1][x-x0+1] = v > 0? sprintf("  %d", v): sprintf("%3d", v)
    }
  };
  strs[5][0] = sprintf("%2d ", maxY+3)
  fori(0, 5, x => strs[0][x] = sprintf("%3d", x0+x-1)) /* don't -1 if 1-base index */
  strs|>Array.iter(s => s->JA.joinWith("", _)->Js.log)
};

[|
  {sn: 18, xlen: 300, ylen: 300},
  {sn: 42, xlen: 300, ylen: 300},
  {sn: 9424, xlen: 300, ylen: 300},
|]
|>Array.iter(d => {
  let mat = Array.make_matrix(d.ylen, d.xlen, 0);
  let (max, maxX, maxY) = mat->calcPower(d)->max3x3(d)
  Js.log(sprintf(
    "\n------------------\nsn %d: max 3x3 power is %d at %d,%d", 
    d.sn, max, maxX-1, maxY-1
  ))
  mat->print5x5(maxX, maxY)
  let sums = mat->summedAreaTable(d)
  let (max, maxX, maxY, len) = maxSqr(d, sums)
  Js.log(sprintf(
    "max n*n power is %d at %d,%d,%d (%d is sqr's size)", 
    max, maxX-len+1, maxY-len+1, len, len
  ))
})