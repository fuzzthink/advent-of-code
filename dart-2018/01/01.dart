import 'package:aoc_2018/util.dart';

int sumInts(List<int> list) => list.reduce((a, b) => a + b);

List<int> runningIntsSum(List<int> list, [initVal=0]) =>
  list.fold([], (a, b) {
    return a.isEmpty? [b + initVal]: a + [a.last + b];
  });

Map<String, int> firstRepeatSum(List<int> list, [int maxIters=9999]) {
  var mem = {};
  var iters = 0;
  var sum = 0;
  while (iters < maxIters) {
    var sums = runningIntsSum(list, sum);
    for (var i in sums) {
      if (mem.containsKey(i)) return {'result': i, 'len': mem.length};
      mem[i] = i;
    }
    sum = sums.last;
    iters += 1;
  }
  return {'result': 0, 'len': mem.length};
}    

main(List<String> args){
  final parser = getArgParser(args, '01');
  final infile = parser.parse(args)['inpath'];
  final dbg = int.parse(parser.parse(args)['dbg']);

  final frequencies = filepathToStrings(infile)
    .map((_) => int.parse(_))
    .toList();
  final sum = sumInts(frequencies);
  final sums = runningIntsSum(frequencies);
  assert(sum == sums.last);

  final maxIters = 999;
  final r = firstRepeatSum(frequencies, maxIters);
  final iters = r['len'] ~/ frequencies.length;

  print('Result frequency (sum of inputs): $sum');
  if (r['iters'] == maxIters)
    print('No repeat found in $maxIters iterations');
  else
    print('Frequency ${r['result']} repeated in $iters iterations of input');
  
  if (dbg > 0) print('Length of input: ${frequencies.length}');
  if (dbg > 1) print('Running Sums: $sums');
}