int sumToZero(int start, [int skip=0]){
  final _01 = skip==1? (start.isOdd? 1: 0): 0;
  return (skip==1
    ? List.generate(start~/2, (i) => i*2 + _01)
    : List.generate(start, (i) => i)
  ).fold(0, (a, b) => a+b);
}