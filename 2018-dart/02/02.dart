import 'package:aoc_2018/util.dart';

int poormanChecksum(List<String> list) {
  var twos = 0; 
  var threes = 0; 

  for (var word in list){
    var count = {
      '2s': 0, 
      '3s': 0
    };
    for (var c in word.split('')){
      count[c] = count.containsKey(c)? count[c] + 1 : 1;
    }
    count.forEach((k, v) {
      if (v >= 3) count['3s'] = 1;
      else if (v >= 2) count['2s'] = 1;
    });
    threes += count['3s'];
    twos += count['2s'];
  }
  return twos * threes;
}

String commonString(String a, String b){//}, int byCnt) {
  var res = '';
  final maxLen = a.length < b.length? a.length: b.length;
  for (int i = 0; i < maxLen; i++){
    if (a[i]==b[i]) res += a[i];
  }
  return res;
} 

List<String> commonStrings(List<String> list){
  List<String> res = [];
  for (int a = 0; a < list.length; a++){
    for (int b = a+1; b < list.length; b++){
      res.add(commonString(list[a], list[b]));
    }
  }
  return res;
}

main(List<String> args){
  var parser = getArgParser(args, '02');
  final infile = parser.parse(args)['inpath'];

  final strings = filepathToStrings(infile);
  final checksum = poormanChecksum(strings);
  print('Checksum: $checksum');
  final commonStrs = commonStrings(strings);
  commonStrs.sort((a, b) => b.length.compareTo(a.length));
  print('${commonStrs[0]} <- longest common string');
  print('${commonStrs[1]} <- next longest common string');
}