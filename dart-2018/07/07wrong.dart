import 'package:aoc_2018/util.dart';

/// Much too complicated solution for a wrong intepretation of Day 7 part 1 
/// Lines 7 - 44 is a much simpler version (~5x less code) of the same wrong
///  interpretation in lines 34 - 233.

List<String> getTraversal(List<Dependency> _deps, [dbg=0]){
  List<String> result = [];
  final reqSet = Set.from(_deps.map((d) => d.req));
  final thenSet = Set.from(_deps.map((d) => d.then));
  var availSet = reqSet.difference(thenSet);
  var deps = []..addAll(_deps);
  var avails;
  var cur = '';

  while (availSet.length > 0){
    avails = availSet.toList(); 
    if (dbg > 0) print('Can visit: $avails');
    avails.sort();
    cur = avails[0];
    result.add(cur);
    avails = avails.sublist(1); 
    availSet = avails.toSet();
    deps.where((d) => d.req == cur).forEach((d){
      if (!result.contains(d.then))
        availSet.add(d.then);
    });
    deps.removeWhere((dep) => dep.req == cur);
  }
  return result;
}

class Dependency{
  String req;
  String then;
  Dependency(this.req, this.then, [dbg=0]){
    if (dbg > 0) print('$req->$then');
  }
}

Dependency parseDependency(String s, [dbg=0]){
  final tokens = s.split(' ');
  return Dependency(tokens[1], tokens[7], dbg);
}

class Node{
  String sym;
  int depth = 1;
  int maxDepth = 1;
  List<Node> childs = [];

  Node(this.sym, [Node child]){
    if (child != null) addChild(child);
  }
  Node.fromDep(Dependency dep){
    sym = dep.req;
    addNewChild(dep.then);
  }

  addChild(Node node){
    if (!hasChild(node.sym)){
      childs.add(node);
      return;
    }
    var child = getChild(node.sym);
    if (child.childsHash() != node.childsHash())
      child.addChilds(node.childs);
  }
  addNewChild(String sym){
    if (hasChild(sym))
      return null;
    final newnode = Node(sym);
    childs.add(newnode);
    return newnode;
  }
  addChilds(List<Node> nodes){
    for (var node in nodes) addChild(node);
  }

  childsHash(){
    final syms = childs.map((c) => c.sym).toList();
    syms.sort();
    return syms.join('');
  }

  Node getChild(String sym){
    return childs.firstWhere((chd) => chd.sym==sym, orElse:()=>null);
  }
  bool hasChild(String sym){
    return getChild(sym) != null;
  }
  bool hasChilds() => childs.isNotEmpty;

  List<Node> findAll(String sym){
    List<Node> result = [];
    if (sym == this.sym)
      result.add(this);
    for (var c in childs){
      result = result..addAll(c.findAll(sym));
    }
    return result;
  }

  printTree([str='']){
    final strs = toString().split('');
    var addNL = false;
    var lv = 0;
    for (var s in strs){
      if (s==','||s==':'||s==' ')
        continue;
      if (s=='['){ lv += 1; addNL = true; continue; }
      if (s==']'){ lv -= 1; addNL = true; continue; }
      str += addNL? '\n'+List.filled(lv*4, ' ').join('')+s: s;
      addNL = false;
    }
    print(str);
  }
  String toString() {
    return '$sym${childs.isEmpty? "": ": $childs"}';
  } 
}

class Graph{
  List<Node> tovisit = [];
  List<String> visited = [];

  Graph(List<Node> heads){
    heads.sort((a,b) => a.sym.compareTo(b.sym)); 
    tovisit = heads;
  }

  addToVisit(List<Node> nodes){
    for (var n in nodes){
      final len = tovisit.length;
      if (tovisit.any((x) => n.sym == x.sym) || visited.contains(n.sym))
        continue;
      for (var i=0; i < tovisit.length; i++){
        final lessVsI = n.sym.compareTo(tovisit[i].sym) < 0;
        if ((lessVsI && i == len-1)
         || (lessVsI && i < len-1 && n.sym != tovisit[i].sym)){
          tovisit = []
            ..addAll(tovisit.sublist(0, i))
            ..add(n)
            ..addAll(tovisit.sublist(i));
          break;
        }
      }
      if (tovisit.length == len){
        if (n.sym.compareTo(tovisit[len-1].sym) > 0)
          tovisit = []..addAll(tovisit)..add(n);
        else
          tovisit = []..addAll(tovisit.sublist(0, len-1))..add(n)..add(tovisit[len-1]);
      }
    }
  } 

  /// Traversal where all nodes are "unlocked" (visited) in abc order, only
  ///  exception is if a parent node is "locked" (unvisited)
  List<String> traversal([dbg=0]){
    if (dbg > 0) print('\nTraversal:\ntovis: ${tovisit.map((a)=> a.sym)}');
    while (tovisit.isNotEmpty){
      var cur = tovisit.removeAt(0);
      visited.add(cur.sym);
      if (dbg > 1) print('tovis: ${tovisit.map((a)=> a.sym)}, visited: $visited, add: ${cur.childs.map((c)=>c.sym)}');
      else if (dbg > 0) print('tovis: ${tovisit.map((a)=> a.sym)}');
      if (cur.childs.isNotEmpty)
        addToVisit(cur.childs);
    }
    return visited;
  }
}

Graph genGraph(List<Dependency> deps, [dbg=0]){
  List<Node> edges = [];
  List<Node> heads = [];
  List<Node> nodes;

  edges = deps.map((d) => Node.fromDep(d)).toList().sublist(1);
  heads = [Node.fromDep(deps[0])];
  var rmHeads = false;
  var toRemove = [];
  var toAdd = [];
  var eEnd;
  var iter = 0;

  do {
    eEnd = rmHeads? edges.length-1: edges.length;
    for (var e=0; e < eEnd; e++){
      var found = false;
      var hStart = rmHeads? e+1: 0;
      var hEnd = heads.length;
      for (var h=hStart; h < hEnd; h++){
        if (e > edges.length-1){
          found = true;
          break;
        }
        nodes = heads[h].findAll(edges[e].sym);
        if (nodes.isNotEmpty){
          for (var n in nodes)
            n.addChilds(edges[e].childs);
          rmHeads? toRemove.add(e): edges.removeAt(e);
          found = true;
          break;
        }
      }
      if (!found && heads.where((h)=>h.sym==edges[e].sym).isEmpty)
        toAdd.add(edges[e]);
    }
    toRemove.sort((a, b) => b.compareTo(a));
    for (var i in toRemove)
      heads.removeAt(i);
    for (var a in toAdd)
      heads.add(a);
    toAdd = [];
    heads.sort((a, b){
      return iter % 2 == 1
        ? b.sym.compareTo(a.sym)
        : a.sym.compareTo(b.sym);
    });
    edges = heads;
    rmHeads = true;
    toRemove = [];

    if (dbg > 0 && iter > 0 && edges.length < eEnd){
      print('----- iter $iter: ${heads.length} heads -----');
      heads.forEach((node)=> print(node));
      heads.forEach((node)=> node.printTree('${node.sym} Tree structure:\n'));
    }
    iter += 1;
  } while (edges.length < eEnd);
  return Graph(heads);
}

main(List<String> args) async {
  final parser = getArgParser(args, '07');
  final infile = parser.parse(args)['inpath'];
  final dbg = int.parse(parser.parse(args)['dbg']);
  final strings = filepathToStrings(infile);
  if (dbg > 0) print('Dependencies:');
  final deps = strings.map((str) => parseDependency(str, dbg)).toList();
  final graph = genGraph(deps, dbg);
  final traversal = graph.traversal(dbg);
  print('Traversal: '+traversal.join(''));
  print('Traversal length: ${traversal.length}');
  final simple = getTraversal(deps, dbg);
  final isEq = simple.join('')==traversal.join('');
  print('Simple version same result?  $isEq');
}

/** Output
Dependencies:
B->X
V->F
K->C
S->D
C->A
H->X
Q->W
X->F
J->R
D->O
F->P
M->Z
R->I
Y->O
G->Z
Z->P
O->L
A->P
U->L
L->W
P->W
I->W
E->N
W->N
T->N
G->E
K->T
I->T
V->H
W->T
M->A
C->W
B->Y
Y->N
L->N
M->R
L->I
J->N
K->M
O->U
P->N
Y->I
V->Q
H->R
M->P
K->L
J->A
D->F
Q->P
C->H
U->I
A->T
C->P
U->T
O->T
O->I
S->I
Z->E
Y->T
K->O
O->A
Z->T
Z->U
U->P
P->I
S->W
S->P
S->Q
C->E
G->U
D->L
K->S
R->O
C->G
V->G
A->W
Z->O
J->O
F->E
U->E
E->W
M->O
C->U
G->P
C->I
Z->A
C->J
Q->R
E->T
F->Y
Z->N
I->N
X->E
I->E
Q->O
R->L
K->W
Y->L
M->I
F->O
A->E
----- iter 1: 7 heads -----
Z: [P, N, A, O, T, U: [I, L, P, T], E]
Y: [O]
V: [F, G, H, Q]
S: [Q: [R: [L, I, O: [L: [W, N, I], U, A, I, T]], P, W], P, I, D: [O, F, L]]
M: [P, R]
K: [W, C: [P, I: [T], E, G: [U, E: [N], P, Z], W, J: [N, A, O], U, A: [P, W, T], H: [R, X]], S, T, M, L]
B: [X: [F: [P: [W: [N, T], N, I: [N, E]], E: [W, T], O]], Y: [T, L]]
Z Tree structure:
Z
    PNAOTU
        ILPT
    E
Y Tree structure:
Y
    O
V Tree structure:
V
    FGHQ
S Tree structure:
S
    Q
        R
            LIO
                L
                    WNI
                UAIT
        PW
    PID
        OFL
M Tree structure:
M
    PR
K Tree structure:
K
    WC
        PI
            T
        EG
            UE
                N
            PZ
        WJ
            NAO
        UA
            PWT
        H
            RX
    STML
B Tree structure:
B
    X
        F
            P
                W
                    NT
                NI
                    NE
            E
                WT
            O
    Y
        TL
----- iter 2: 3 heads -----
B: [X: [F: [P: [W: [N, T], N, I: [N, E]], E: [W, T], O]], Y: [T, L, O]]
K: [W, C: [P, I: [T], E, G: [U, E: [N], P, Z: [P, N, A, O, T, U: [I, L, P, T], E]], W, J: [N, A, O], U, A: [P, W, T], H: [R, X]], S: [Q: [R: [L, I, O: [L: [W, N, I], U, A, I, T]], P, W], P, I, D: [O, F, L]], T, M: [P, R], L]
V: [F, G, H, Q]
B Tree structure:
B
    X
        F
            P
                W
                    NT
                NI
                    NE
            E
                WT
            O
    Y
        TLO
K Tree structure:
K
    WC
        PI
            T
        EG
            UE
                N
            PZ
                PNAOTU
                    ILPT
                E
        WJ
            NAO
        UA
            PWT
        H
            RX
    S
        Q
            R
                LIO
                    L
                        WNI
                    UAIT
            PW
        PID
            OFL
    TM
        PR
    L
V Tree structure:
V
    FGHQ

Traversal:
tovis: (B, K, V)
tovis: (K, V)
tovis: (V, X, Y)
tovis: (L, M, S, T, V, W, X, Y)
tovis: (E, G, H, I, J, L, M, P, S, T, U, V, W, X, Y)
tovis: (G, H, I, J, L, M, P, S, T, U, V, W, X, Y)
tovis: (H, I, J, L, M, P, S, T, U, V, W, X, Y)
tovis: (I, J, L, M, P, S, T, U, V, W, X, Y, Z)
tovis: (J, L, M, P, R, S, T, U, V, W, X, Y, Z)
tovis: (L, M, P, R, S, T, U, V, W, X, Y, Z)
tovis: (M, N, O, P, R, S, T, U, V, W, X, Y, Z)
tovis: (N, O, P, R, S, T, U, V, W, X, Y, Z)
tovis: (O, P, R, S, T, U, V, W, X, Y, Z)
tovis: (P, R, S, T, U, V, W, X, Y, Z)
tovis: (R, S, T, U, V, W, X, Y, Z)
tovis: (S, T, U, V, W, X, Y, Z)
tovis: (T, U, V, W, X, Y, Z)
tovis: (Q, T, U, V, W, X, Y, Z)
tovis: (Q, T, U, V, W, X, Y, Z)
tovis: (T, U, V, W, X, Y, Z)
tovis: (U, V, W, X, Y, Z)
tovis: (V, W, X, Y, Z)
tovis: (W, X, Y, Z)
tovis: (X, Y, Z)
tovis: (Y, Z)
tovis: (Z)
tovis: ()
Traversal: BKCAEGHIJLMNOPRSDFQTUVWXYZ
Traversal length: 26
Simple version same result?  true
*/