import 'package:aoc_2018/util.dart';

Map<String, int> getClaimsMap(List<String> strs) {
  var map = {};
  var xMax = 0;
  var yMax = 0;
  var claimed = {};
  var uniques = {};
  var res = {
    'overlapCnt': 0,
    'winner': 0
  };

  for (var str in strs){
    final tokens = str.split(' ');
    final id = tokens[0].substring(1);
    final p = tokens[2].split(',');
    final a = tokens[3].split('x');
    final x0 = int.parse(p[0]);
    final y0 = int.parse(p[1].split(':')[0]);
    final xCnt = int.parse(a[0]);
    final yCnt = int.parse(a[1]);
    uniques[id] = 0; 
    claimed[id] = xCnt * yCnt;

    for (int y = y0; y < y0 + yCnt; y++){
      for (int x = x0; x < x0 + xCnt; x++){
        if (map[y] == null)
          map[y] = {};
        if (map[y][x] == null)
          map[y][x] = [id]; 
        else
          map[y][x].add(id);
        if (x > xMax) xMax = x;
      }
      if (y > xMax) yMax = y;
    }
  }

  for (int y = 0; y <= yMax; y++)
    for (int x = 0; x <= xMax; x++)
      if (map[y][x] != null){
        if (map[y][x].length >= 2)
          res['overlapCnt'] += 1;
        if (map[y][x].length == 1){
          final uId = map[y][x][0];
          uniques[uId] += 1;
          if (uniques[uId] == claimed[uId])
            res['winner'] = int.parse(uId);
        }
      }
  
  return res;
}

main(List<String> args){
  final parser = getArgParser(args, '03');
  final infile = parser.parse(args)['inpath'];
  final strings = filepathToStrings(infile);
  final res = getClaimsMap(strings);

  print('Overlapped spots: ${res['overlapCnt']}');
  print('On Overlapped id: ${res['winner']}');
}