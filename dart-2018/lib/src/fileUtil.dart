import 'dart:io';

List<String> filepathToStrings(String path) {
  return File(path)
  .readAsStringSync()
  .trim()
  .split("\n");
}