import 'dart:io';

List<int> fileToInts(String path) {
  return File(path)
  .readAsStringSync()
  .trim()
  .split("\n")
  .map((it) => int.parse(it))
  .toList();
}