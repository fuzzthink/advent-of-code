import 'package:aoc_2018/util.dart';

Map parseXY(List<String> list){
  int maxX = 0;
  int maxY = 0;
  var pts = [];
  list.forEach((s){
    final p = s.split(', ');
    final x = int.parse(p[0]); 
    final y = int.parse(p[1]); 
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
    pts.add([x, y]);
  });
  return {
    'lens': [maxX+1, maxY+1],
    'pts': pts,
  };
}

class ColorMap {
  List<List<int>> tm;
  List<List<int>> mp;
  Map<String,int> org = {};
  Map<int,int> counts = {};
  int xLen;
  int yLen;
  int dbg;
  int biggestCount = 0;
  int biggestColor = 0;
  int centerX = 0;
  int centerY = 0;
  int OOB = -2;
  int Empty = -1;
  int Neutral = 0;
  String EmptyChr = '.';
  String chrOf(i) => String.fromCharCode(i > 25? i+7+64: i+64);

  ColorMap(this.xLen, this.yLen, List pts, [this.dbg=0]){
    tm = List.generate(yLen, (i) => List.filled(xLen, Empty));
    mp = List.generate(yLen, (i) => List.filled(xLen, Empty));
    var xSum = 0;
    var ySum = 0;
    pts.asMap().forEach((i, p){
      final color = i+1;
      final x = p[0];
      final y = p[1];
      set(x, y, color);
      setOrg(x, y, color);
      counts[color] = 0;
      xSum += x;
      ySum += y;
    });
    centerX = xSum ~/ pts.length;
    centerY = ySum ~/ pts.length;
  }

  setOrg(int x, int y, int v){
    org['$x,$y'] = v;
  }
  getOrg(int x, int y) => org['$x,$y'];

  get(int x, int y) => mp[y][x];
  getTm(int x, int y) => tm[y][x];

  setTm(int x, int y, int v) => tm[y][x] = v;
  resetTm(){
    tm = List.generate(yLen, (i) => List.filled(xLen, Empty));
  }

  allMapped(){
    for (int y=0; y < yLen; y++)
      for (int x=0; x < xLen; x++)
        if (get(x, y) < Neutral)
          return false;
    return true;
  }

  set(int x, int y, int v) => mp[y][x] = v;
  setMp(){
    for (int y=0; y < yLen; y++){
      for (int x=0; x < xLen; x++){
        if (getTm(x,y) > Empty){
          if (get(x,y) > Empty){
            print('($x,$y) is ${get(x,y)}, can not set to already set value');
            Error();
          }
          set(x, y, getTm(x, y));
        }
      }
    }
  }

  assignColors(){
    var i = 1;
    while(!allMapped()){
      flood();
      setMp();
      if (dbg > 1) printMap(i);
      i += 1;
    }
  }

  flood(){
    resetTm();
    for (int y=0; y < yLen; y++){
      for (int x=0; x < xLen; x++){
        if (get(x,y) != Empty)
          continue;
        final top = y-1 >= 0? get(x, y-1): OOB;
        final btm = y+1 < yLen? get(x, y+1): OOB;
        final lft = x-1 >= 0? get(x-1, y): OOB;
        final rgt = x+1 < xLen? get(x+1, y): OOB;
        var vs = [top, btm, lft, rgt];
        vs.sort((a, b) => b - a);
        if (vs[0] > Neutral && vs[1] <= Neutral)      // only [0] mapped
          setTm(x, y, vs[0]);
        else if (vs[1] > Neutral && vs[2] <= Neutral) // only [0, 1] mapped
          setTm(x, y, vs[0]==vs[1]? vs[0]: Neutral);
        else if (vs[2] > Neutral && vs[3] <= Neutral) // [0, 1, 2] mapped
          setTm(x, y, vs[0]==vs[2]? vs[0]: Neutral);
        else if (vs[3] > Neutral)                     // all [0 - 3] mapped
          setTm(x, y, vs[0]==vs[3]? vs[0]: Neutral);
      }
    }
  }

  calcArea(){
    assignColors();
    setBorderCounts();
    for (int y=1; y < yLen-1; y++){
      for (int x=1; x < xLen-1; x++){
        final color = get(x, y);
        if (counts[color] >= 0)
          counts[color] += 1;
        if (counts[color] > biggestCount){
          biggestCount = counts[color];
          biggestColor = color;
        }
      }
    }
  }

  getBiggest() => {'count': biggestCount, 'color': chrOf(biggestColor)};
  
  getBorderCount(int curCnt, int prvCnt, int c, int tl, int tr, int bl, int br){
    final diff = curCnt - prvCnt; 
    if (diff >= 0 || c==tl || c==tr || c==bl || c==br)
      return -1;
    else {
      if (curCnt <= 1 || (curCnt==2 && prvCnt==4))
        return 0;
      if ((curCnt==2 && prvCnt==3) || (curCnt==3 && prvCnt==5)) 
        return 1;
      return diff==-1? sumToZero(curCnt-1): sumToZero(curCnt-2, 1);
    }
  }

  setBorderCounts(){
    final _cur = {
      'top': mp[0],
      'btm': mp[yLen-1],
      'lft': List.generate(yLen, (i)=>mp[i][0]),
      'rgt': List.generate(yLen, (i)=>mp[i][xLen-1]),
    };
    final _prv = {
      'top': mp[1],
      'btm': mp[yLen-2],
      'lft': List.generate(yLen, (i)=>mp[i][1]),
      'rgt': List.generate(yLen, (i)=>mp[i][xLen-2]),
    };
    final _colors = {
      'top': _cur['top'].toSet().toList(),
      'btm': _cur['btm'].toSet().toList(),
      'lft': _cur['lft'].toSet().toList(),
      'rgt': _cur['rgt'].toSet().toList(),
    };
    final tl = mp[0][0];
    final tr = mp[0][xLen-1];
    final bl = mp[yLen-1][0];
    final br = mp[yLen-1][xLen-1];

    _colors.forEach((dir, colors){
      for (var color in colors){
        final curCnt = _cur[dir].where((v) => v==color).length;
        final prvCnt = _prv[dir].where((v) => v==color).length;
        final count = getBorderCount(curCnt, prvCnt, color, tl, tr, bl, br);
        // print(count);
        counts[color] = count == -1? -1: counts[color] + count;
      }
    });
  }

  printMap([int iter]){
    final indices = 
    '   01234567 10 234567 20 234567 30 234567 40 234567 50 234567 60 234567 7'
      '0 234567 80 234567 90 23456 100 23456 110 23456 120 23456 130 23456 14'
      '0123456 150 23456 160 23456 170 23456 180 23456 190 23456 200 23456 21'
      '0123456 220 23456 230 23456 240 23456 250 23456 260 23456 270 23456 28'
      '0123456 290 23456 300 23456 310 23456 320 23456 330 23456 340 23456789'
    ;
    if (iter != null) print('Iteration $iter:');
    print(indices);
    for (int y = 0; y < yLen; y++){
      var s = y%10==0? '${y~/10} '.padLeft(3): '   '; 
      var more = '';
      var notOrigin = true;

      mp[y].asMap().forEach((x, c){
        notOrigin = getOrg(x,y)==null;
        s += c==Empty
          ? EmptyChr
          : (iter==0 || notOrigin? chrOf(c): '◼');
        more += iter==-1 && !notOrigin? ' ${chrOf(c)}:${counts[c]}':'';
      });
      print(s+more);
    }
  }

  getDistToOrgs(int x, int y){
    int xs = 0;
    int ys = 0;
    org.forEach((xyStr, c){
      final p = xyStr.split(',');
      xs += (int.parse(p[0]) - x).abs();
      ys += (int.parse(p[1]) - y).abs();
    });
    return xs + ys;
  }

  getCenterArea([int max=9999]){
    final offset = max~/50;
    var count = 0;
    for (int y=centerY-offset; y < centerY+offset; y++)
      for (int x=centerX-offset; x < centerX+offset; x++)
        if (x >= 0 || x < xLen || y >= 0 || y < yLen){
          final d = getDistToOrgs(x, y);
          if (d <= max) count += 1;
        }
    return count;
  }
}

main(List<String> args) async {
  final parser = getArgParser(args, '06');
  final infile = parser.parse(args)['inpath'];
  final dbg = int.parse(parser.parse(args)['dbg']);
  final strings = filepathToStrings(infile);
  final p = parseXY(strings);
  final colorMap = ColorMap(p['lens'][0], p['lens'][1], p['pts'], dbg);

  if (dbg > 1) colorMap.printMap(0);
  colorMap.calcArea();
  if (dbg > 0) colorMap.printMap(-1);
  final r = colorMap.getBiggest();
  print('Biggest area is ${r['color']} with area of ${r['count']}');

  const maxDists = 9999;
  final cnt = colorMap.getCenterArea(maxDists);
  print('Area of sum of dists <= $maxDists to points is $cnt');
}