printDebugMaxGuy(Map guy){
  var histo = '';
  for (int y = 0; y < guy['logs']['starts'].length; y++){
    for (int x = 0; x < 60; x++){
      final zz = guy['tickBoolByDay'][y][x];
      histo += (zz != null && zz)? 'x': ' ';
    }
    histo += '\n';
  }

  print('Minute:');
  print('0000000000''1111111111''2222222222''3333333333''4444444444''5555555555');
  print('0123456789''0123456789''0123456789''0123456789''0123456789''0123456789');
  var totsStr0 = '';
  var totsStr1 = '';
  for (int x = 0; x < 60; x++){
    if (guy['tickCnts'][x] > 9)
      totsStr1 += (guy['tickCnts'][x] ~/ 10).toString();
    else
      totsStr1 += ' ';
  }
  for (int x = 0; x < 60; x++){
    totsStr0 += (guy['tickCnts'][x] % 10).toString();
  }
  print('Counts:');
  print(totsStr1);
  print(totsStr0);
  print(histo);
}