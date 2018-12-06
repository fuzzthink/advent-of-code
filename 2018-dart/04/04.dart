import 'package:aoc_2018/util.dart';
import 'package:path/path.dart' as p;
import 'dart:io';
import './debug.dart';

saveSorted(List<String> strs, String wrpath) async {
  strs.sort();
  File file = new File(wrpath);
  var sink = file.openWrite(mode: FileMode.append);
  strs.forEach((s) => sink.write('$s\n'));
  await sink.flush();
  await sink.close();
}

Map getMaxGuyStats(List<String> strs){
  var logs = {};
  var maxGuyMinsCnt = 0;
  var maxId = '';

  for (var str in strs){
    final tokens = str.split(' ');
    final id = tokens[0];
    var i = 3;
    while (i+5 < tokens.length){
      final sleepTick = int.parse(tokens[i+1].substring(3, 5));
      final wakeTick = int.parse(tokens[i+5].substring(3, 5));
      final mins = wakeTick >= sleepTick? wakeTick - sleepTick: 60 + wakeTick - sleepTick;
      if (logs[id] == null) 
        logs[id] = {'tot': mins, 'starts': [sleepTick], 'mins': [mins]};
      else {
        logs[id]['tot'] += mins;
        logs[id]['starts'].add(sleepTick);
        logs[id]['mins'].add(mins);
      }
      if (logs[id]['tot'] > maxGuyMinsCnt){
        maxGuyMinsCnt = logs[id]['tot'];
        maxId = id;
      }
      i += 8;
    }
  }
  var maxGuyTicksBoolByDay = {};
  var maxGuyTickCnts = List<int>.filled(60, 0);
  logs[maxId]['starts'].asMap().forEach((i, start) {
    maxGuyTicksBoolByDay[i] = {};
    for (int x = start; x < start + logs[maxId]['mins'][i]; x++){
      maxGuyTicksBoolByDay[i][x] = true;
      maxGuyTickCnts[x] += 1;
    }
  });

  var maxGuyAtTick = -1;
  var maxZ = 0;
  maxGuyTickCnts.asMap().forEach((i, zz){
    if (zz > maxZ){
      maxZ = zz;
      maxGuyAtTick = i;
    }
  });

  return {
    'id': int.parse(maxId),
    'mins': maxGuyMinsCnt,
    'tick': maxGuyAtTick,
    'tickCnts': maxGuyTickCnts,
    'tickBoolByDay': maxGuyTicksBoolByDay,
    'logs': logs[maxId],
  };
}

Map getMaxSlept(List<String> strs){
  var logs = {};

  for (var str in strs){
    final tokens = str.split(' ');
    final id = int.parse(tokens[0]);
    var i = 3;
    while (i+5 < tokens.length){
      final sleepTick = int.parse(tokens[i+1].substring(3, 5));
      final wakeTick = int.parse(tokens[i+5].substring(3, 5));
      if (logs[id] == null) 
        logs[id] = List<int>.filled(60, 0);
      for (int j = sleepTick; j < wakeTick; j++){
        logs[id][j] += 1;
      }
      i += 8;
    }
  }
  var maxId = 0;
  var maxMins = 0;
  var maxTick = 0;
  var curMaxTick = 0;
  var curMaxMins = 0;
  var curMaxId = 0;
  logs.keys.forEach((id){
    for (int j = 0; j < 60; j++){
      if (logs[id][j] > curMaxMins){
        curMaxMins = logs[id][j];
        curMaxTick = j;
        curMaxId = id;
      }
    }
    if (curMaxMins > maxMins){
      maxMins = curMaxMins;
      maxTick = curMaxTick;
      maxId = curMaxId;
    }
  });

  return {
    'id': maxId,
    'mins': maxMins,
    'tick': maxTick,
    'logs': logs,
  };
}

main(List<String> args) async {
  final parser = getArgParser(args, '04');
  final infile = parser.parse(args)['inpath'];
  final dbg = int.parse(parser.parse(args)['dbg']);

  final strings = filepathToStrings(infile);
  final sortedpath = p.join('04','sorted.txt');
  if (FileSystemEntity.typeSync(sortedpath) == FileSystemEntityType.notFound)
    await saveSorted(strings, sortedpath);

  final sortedLines = filepathToStrings(sortedpath).map((s) => '$s ');
  final line = sortedLines.join('');
  final merged = line.split(' Guard #').sublist(1);
  final g = getMaxGuyStats(merged);
  final g2 = getMaxSlept(merged);

  if (dbg > 0) printDebugMaxGuy(g);
  print('Max slept id: ${g['id']}');
  print('minutes slept: ${g['mins']}');
  print('slept most at minute: ${g['tick']}');
  print('id * at minute: ${g['id'] * g['tick']}');

  print('Max slept id: ${g2['id']}');
  print('minutes slept: ${g2['mins']}');
  print('slept most at minute: ${g2['tick']}');
  print('id * at minute: ${g2['id'] * g2['tick']}');
}