import 'package:aoc_2018/util.dart';
import 'package:strings/strings.dart';

bool canRm(String a, String b) =>
  (isUpperCase(a) && isLowerCase(b) && a.toLowerCase() == b) ||
  (isUpperCase(b) && isLowerCase(a) && b.toLowerCase() == a);

bool isEqChar(String a, String b) => a.toUpperCase() == b.toUpperCase();

String xjoin(String s1, String s2){
  if (s2 == '')
    return s1;
  else if (s1 == '' && s2.length > 0)
    return xjoin(s2[0], s2.substring(1));
  else if (canRm(s1[s1.length-1], s2[0]))
    return xjoin(s1.substring(0, s1.length - 1), s2.substring(1, s2.length));
  else
    return xjoin(s1+s2[0], s2.substring(1));
}

String xchar(String c, String s1, String s2){
  if (s2 == '')
    return s1;
  return xchar(c, (isEqChar(s2[0], c)? s1: s1+s2[0]), s2.substring(1));
}

main(List<String> args) async {
  final parser = getArgParser(args, '05');
  final infile = parser.parse(args)['inpath'];
  final dbg = int.parse(parser.parse(args)['dbg']);
  final string = filepathToStrings(infile)[0];

  // stack overflows if input string is too long, break it up
  final brkLen = 5000;
  var strs = [];
  var str;

  for (int i = 0; i < string.length; i += brkLen){
    str = string.substring(i, i+brkLen);
    strs.add(xjoin('', str));
  }
  str = xjoin('', strs.join(''));
  print('Length after removing pairs of similar chars: ${str.length}');

  var minLen = str.length;
  int minLenCode = 0;

  for (int c = 97; c < 97+26; c++){
    strs = [];
    for (int i = 0; i < string.length; i += brkLen){
      str = string.substring(i, i+brkLen);
      str = xchar(String.fromCharCode(c), '', str);
      strs.add(xjoin('', str));
    }
    str = xjoin('', strs.join(''));

    if (str.length < minLen){
      if (dbg > 0)
        print('${String.fromCharCode(c)}: ${str.length}');
      minLen = str.length;
      minLenCode = c;
    }
  }
  print('Min Length after first removing ${String.fromCharCode(minLenCode)} and'
  ' then removing pairs of similar chars: ${minLen}');
}