import 'package:test/test.dart';

import '02.dart';

main() {
  final data = ['abc', 'bcd', 'cde', 'def'];
  test('commonString()', () {
    expect(commonString('abc', 'adc'), 'ac');
  });
  test('commonStrings()', () {
    final commonStrs = commonStrings(data);
    expect(commonStrs.length, 6);
  });
}
