import 'package:args/args.dart';
import 'package:path/path.dart' as p;

ArgParser getArgParser(List<String> args, String curPath){
  var parser = ArgParser();
  parser.addOption('inpath', abbr: 'i', defaultsTo: p.join(curPath,'input.txt'));
  parser.addOption('dbg', abbr: 'v', defaultsTo: '0');
  return parser;
}