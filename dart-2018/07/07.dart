import 'package:aoc_2018/util.dart';

class Task{
  String req;
  String then;
  Task(this.req, this.then);
  @override
  String toString() {
    return '$req->$then';
  }
}

Task parseTask(String s){
  final tokens = s.split(' ');
  return Task(tokens[1], tokens[7]);
}

List<Task> getNoReqTasks(List<Task> tasks){
  var reqSet = Set.from(tasks.map((d) => d.req));
  var thenSet = Set.from(tasks.map((d) => d.then));
  var _set = reqSet.difference(thenSet);
  return _set.map((s) => tasks.firstWhere((t) => t.req == s)).toList();
}

/// Part 1
/// Traversal where all nodes are "pending" if dependencies are visited.
/// All "pending" nodes are to be visited in abc order
List<String> getTraversal(List<Task> _tasks, [dbg=0]){
  List<String> result = [];
  final reqSet = Set.from(_tasks.map((d) => d.req));
  final thenSet = Set.from(_tasks.map((d) => d.then));
  var availSet = reqSet.difference(thenSet);
  var tasks = []..addAll(_tasks);

  while (availSet.length > 0){
    var avails = availSet.toList(); 
    if (dbg > 0) print('Can visit: $avails');
    avails.sort();
    var cur = avails[0];
    result.add(cur);
    avails = avails.sublist(1); 
    availSet = avails.toSet();
    tasks.where((t) => t.req == cur).forEach((d){
      if (!result.contains(d.then))
        availSet.add(d.then);
    });
    tasks.removeWhere((t) => t.req == cur);
  }
  return result;
}


/// Part 2
/// Maps 'A'->61, 'B'->62, etc. 
getEst(String s) => s.codeUnitAt(0)-3;

class History{
  List<List<String>> hist = [];
  int cols = 0;
  String newDone = '';

  History(int headCnt){
    cols = headCnt + 1;
    newRow();
  }

  newRow() => hist.add(List.filled(cols, ''));
  get cur => hist[hist.length-1];
  get prv => hist[hist.length-2];
  get length => hist.length;

  setDone([dbg=0]){
    var i = -1;
    final prvDone = hist.length <= 1? '': prv[cols-1];
    final done = hist.length <= 1? '': cur.sublist(0, cols-2).map((curReq){
      i += 1;
      return curReq == prv[i]? '': prv[i];
    }).join('');
    
    cur[cols-1] = prvDone + (newDone != ''? newDone: done);
    final secs = (hist.length-1).toString().padLeft(3);
    if (dbg > 1) print('$secs: $cur');
    else if (dbg > 0 && cur[cols-1] != prvDone) print('$secs: $cur');
    newRow();
  }

  setCur(List<Worker> availWorkers){
    availWorkers.forEach((worker){
      cur[worker.id] = worker.req;
    });
  }

  String tock(List<Worker> workers, [dbg=0]){
    workers.forEach((worker){
      cur[worker.id] = worker.req;
    });
    setDone(dbg);
    newDone = workers.where((w) => w.busyfor == 1).map((w) => w.req).join('');
    return newDone;
  }
}


class Worker{
  int id;
  int busyfor = 0;
  String req = '';
  Worker(this.id);

  get isFree => req == '';
  tock(){
    if (busyfor > 0) busyfor -= 1;
    if (busyfor == 0) req = '';
  }

  take(String req){
    this.req = req;
    busyfor = getEst(req);
  } 
}

class Workers{
  int headCnt;
  int curTick = 0;
  History hist;
  List<Worker> workers;

  Workers(this.headCnt){
    workers = List.generate(headCnt, (i) => Worker(i));
    hist = History(headCnt);
  }

  Iterable<Worker> get availWorkers => workers.where((w) => w.isFree);
  Iterable<Worker> get busyWorkers => workers.where((w) => !w.isFree);
  Iterable<Worker> get nextTickAvails => workers.where((w) => w.busyfor <= 1);
  bool inProgress(Task task) => busyWorkers.where((w) => w.req == task.req).isNotEmpty;
  get nextAvailCnt => nextTickAvails.length;

  get reqs => workers.map((w) => w.req);

  List<Worker> tock(){
    workers.forEach((worker) => worker.tock());
    return workers;
  }

  /// Can assume [reqs] to be same or less than # of next avail workers  
  List<Worker> assign(List<String> reqs, [dbg=0]){
    List<Worker> result = [];
    if (dbg > 2 && reqs.length > 0)
      print('reqs: $reqs, workers cnt: ${nextTickAvails.length}');
    var i = 0;
    nextTickAvails.forEach((worker){
      if (reqs.length > i){
        worker.take(reqs[i]);
        result.add(worker);
        i += 1;
      }
    });
    return result;
  }

  /// Can assume [reqs] to be same or less than # of next avail workers  
  String accept(List<String> reqs, [dbg=0]){
    var done;
    var prvNextAvailCnt;
    hist.setCur(this.assign(reqs, dbg));
    do {
      prvNextAvailCnt = nextAvailCnt;
      done = hist.tock(this.tock(), dbg);
    }
    while (nextAvailCnt <= prvNextAvailCnt);
    return done;
  }
}

/// Like getTraversal above, but worker version, see README
Map getWorkersTraversal(List<Task> _tasks, [numWorkers=5, dbg=0]){
  List<Task> tasks = List.from(_tasks);
  var availTasks = getNoReqTasks(tasks);
  var workers = Workers(numWorkers);
  var pending = [];
  var lockedbys = [];
  var traversal = '';
  var toBeAvail = [];
  var prv= '';

  while (tasks.length > 0){
    var reqs = availTasks.map((t) => t.req).toSet().toList();
    var workersCnt = workers.nextAvailCnt;
    if (workersCnt < reqs.length)
      print('More reqs than # of workers, may need graph sort to prioritize!!');
    var jobs = reqs.take(workersCnt).toList();

    var cur = workers.accept(jobs, dbg);
    workersCnt = workers.nextAvailCnt;
    availTasks = availTasks.where((t) => !jobs.contains(t.req)).toList();

    if (cur != prv){
      /// Move .then of completed tasks to [pending] and remove theses [tasks]
      pending = (List.from(pending)
        ..addAll(tasks.where((t) => cur.contains(t.req))
          .map((t) => t.then))).toSet().toList();
      tasks.removeWhere((t) => cur.contains(t.req));
      getNoReqTasks(tasks).forEach((t){
        if (!workers.inProgress(t))
          availTasks.add(t);
      });

      if (dbg > 2) print('pending to be unlock by $cur: $pending');
      /// [pending] contains .then pending by .req, but need to check if no
      ///  other requirements have them as .then before making them [toBeAvail].
      for (var s in pending){
        var locked = tasks.where((t) => t.then == s);
        if (locked.isEmpty)
          toBeAvail.addAll(tasks.where((t) => t.req == s));
        else
          lockedbys.addAll(locked);
      }
      if (dbg > 2) {
        if (toBeAvail.length > 0) print('tobeavail: $toBeAvail');
        if (lockedbys.length > 0){
          var lockSet = lockedbys.map((x)=>x.then).toSet();
          var unlockSet = Set.from(pending).difference(lockSet);
          print('unlocked: $unlockSet, still locked: $lockSet\nby: $lockedbys');
        }
      }
      toBeAvail.forEach((t){
        pending.remove(t.req);
        availTasks.add(t);
      });
      traversal += cur;
      prv = cur;
      toBeAvail = [];
      lockedbys = [];
    }
  }
  final result = workers.hist.length-1;
  final lastTicks = pending.map((s) => getEst(s)).fold(0, (a, b) => a+b)-1;
  final lastJob = pending.join('');
  return {'ticks': result+lastTicks, 'traversal': traversal + lastJob};
}

main(List<String> args) async {
  final parser = getArgParser(args, '07');
  final infile = parser.parse(args)['inpath'];
  final dbg = int.parse(parser.parse(args)['dbg']);
  final strings = filepathToStrings(infile);
  final tasks = strings.map((str) => parseTask(str)).toList();
  if (dbg > 0){
    print('Tasks:');
    tasks.forEach((t) => print(t));
  }
  final traversal = getTraversal(tasks, dbg);
  print('Traversal: '+traversal.join(''));
  print('length: ${traversal.length}');

  print('\nPart 2:');
  final numWorkers = 5;
  final r = getWorkersTraversal(tasks, numWorkers, dbg);
  print('${r['ticks']} secs finish ${r['traversal']} with $numWorkers workers');
}