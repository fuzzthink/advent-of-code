String genIndexStr(int x, [int leftSp=0]){
  var s = List.filled(leftSp, ' ').join()+'01234567 ';
  for (var i=10; i<x; i+=10){
    s += i.toString() + (i < 90? ' 234567 ':' 23456 ');
  }
  return s;
}