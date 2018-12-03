import 'package:aoc_2018/util.dart';
// import 'package:path/path.dart' as p; //p.join('01', infile);
import 'package:args/args.dart';

int sumInts(List<int> list) => list.reduce((a, b) => a + b);

List<int> runningIntsSum(List<int> list, [initVal=0]) =>
  list.fold([], (a, b) {
    return a.isEmpty? [b + initVal]: a + [a.last + b];
  });

Map<String, int> firstRepeatSum(List<int> list, [int maxIters=999]) {
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
  var parser = ArgParser();
  parser.addOption('inpath', abbr: 'i', defaultsTo: '01/input.txt');
  parser.addOption('dbg', abbr: 'v', defaultsTo: '1');
  final infile = parser.parse(args)['inpath'];
  final dbg = int.parse(parser.parse(args)['dbg']);

  List<int> frequencies = fileToInts(infile);
  final sum = sumInts(frequencies);
  final sums = runningIntsSum(frequencies);
  assert(sum == sums.last);

  final maxIters = 999;
  final r = firstRepeatSum(frequencies, maxIters);
  final iters = r['len'] ~/ frequencies.length;

  print('Sum of inputs: $sum');
  if (r['iters'] == maxIters)
    print('No repeat found in $maxIters iterations');
  else
    print('Frequency ${r['result']} repeated in $iters iterations of input');
  
  if (dbg > 0) print('Length of input: ${frequencies.length}');
  if (dbg > 1) print('Running Sums: $sums');
}