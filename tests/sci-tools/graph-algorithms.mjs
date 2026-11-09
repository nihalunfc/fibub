// #556 graph editor with algorithms: src/lib/sci/graph.ts against networkx 3.7.
// Reference numbers below were produced with networkx 3.7 (single_source_dijkstra, bfs_tree, dfs_preorder_nodes,
// minimum_spanning_tree, greedy_color largest_first and DSATUR, betweenness_centrality, closeness_centrality,
// degree_centrality, maximum_flow_value / minimum_cut, lexicographical_topological_sort). During the build the lib
// was also compared with networkx on 100 random graphs (1054 checks, all equal).
import * as G from '../../src/lib/sci/graph.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const g = G.parseGraph(G.EXAMPLE, false), N = g.names, ix = (s) => N.indexOf(s);
  check('graph: example has 7 nodes and 11 weighted edges', N.join('') === 'ABDCEFG' && g.edges.length === 11 && g.weighted);
  const dj = G.dijkstra(g, ix('A'));
  check('graph: Dijkstra distances from A as networkx (D 5, B 7, F 11, E 14, C 15, G 22)', [['A', 0], ['D', 5], ['B', 7], ['F', 11], ['E', 14], ['C', 15], ['G', 22]].every(([k, v]) => dj.dist[ix(k)] === v));
  check('graph: shortest path A-D-F-G', G.pathTo(dj, ix('A'), ix('G')).map((i) => N[i]).join('') === 'ADFG');
  check('graph: Bellman-Ford agrees with Dijkstra', G.bellmanFord(g, 0).dist.every((d, i) => d === dj.dist[i]));
  check('graph: BFS order ABDCEFG and DFS preorder ABCEDFG (networkx)', G.bfs(g, 0).order.map((i) => N[i]).join('') === 'ABDCEFG' && G.dfs(g, 0).order.map((i) => N[i]).join('') === 'ABCEDFG');
  { const k = G.kruskal(g), p = G.prim(g); const set = (t) => t.edges.map((e) => [N[e.u], N[e.v]].sort().join('')).sort().join(' ');
    check('graph: MST weight 39 with edges AB AD BE CE DF EG (Kruskal and Prim)', k.total === 39 && p.total === 39 && set(k) === 'AB AD BE CE DF EG' && set(p) === set(k)); }
  { const lf = G.colour(g, 'largest'), ds = G.colour(g, 'dsatur'), want = { E: 0, B: 1, D: 2, F: 1, A: 0, C: 2, G: 2 };
    check('graph: largest-first and DSatur colourings equal networkx (3 colours)', lf.count === 3 && ds.count === 3 && N.every((s) => lf.colour[ix(s)] === want[s] && ds.colour[ix(s)] === want[s])); }
  { const b = G.betweenness(g), want = { A: 0, B: 0.2, D: 0.1666666667, C: 0, E: 0.2333333333, F: 0.2, G: 0 };
    check('graph: weighted betweenness equals networkx', N.every((s) => near(b[ix(s)], want[s], 1e-9))); }
  { const c = G.closeness(g), want = { A: 0.0810810811, B: 0.0967741935, D: 0.0882352941, C: 0.0833333333, E: 0.1052631579, F: 0.09375, G: 0.0674157303 };
    check('graph: weighted closeness equals networkx', N.every((s) => near(c[ix(s)], want[s], 1e-9))); }
  check('graph: degree centrality E = 5/6', near(G.degreeCentrality(g)[ix('E')], 5 / 6, 1e-15));
  { const f = G.maxFlow(g, ix('A'), ix('G'));
    check('graph: max flow A to G is 12 = min cut capacity (undirected edges carry flow either way)', f.value === 12 && f.cutCapacity === 12); }

  const fg = G.parseGraph(G.EXAMPLE_FLOW, true), FN = fg.names, fi = (s) => FN.indexOf(s);
  { const f = G.maxFlow(fg, fi('S'), fi('T'));
    check('graph: flow example: max flow 19, source side {S, C} (networkx minimum_cut)', f.value === 19 && f.cutCapacity === 19 && FN.filter((_, i) => f.source[i]).sort().join() === 'C,S');
    const bal = FN.map((_, v) => fg.edges.reduce((s, e, k) => s + (e.v === v ? f.edgeFlow[k] : 0) - (e.u === v ? f.edgeFlow[k] : 0), 0));
    check('graph: flow is conserved and within capacity', bal.every((b, v) => (FN[v] === 'S' ? b === -19 : FN[v] === 'T' ? b === 19 : b === 0)) && f.edgeFlow.every((x, k) => x >= 0 && x <= fg.edges[k].w)); }

  const dag = G.parseGraph(G.EXAMPLE_DAG, true);
  check('graph: topological order Plan Design Budget Build Test Docs Release (networkx lexicographical_topological_sort)', G.topoSort(dag).order.map((i) => dag.names[i]).join(' ') === 'Plan Design Budget Build Test Docs Release');
  { const c = G.parseGraph('a b\nb c\nc a\nc d', true), t = G.topoSort(c);
    check('graph: a cycle is found instead of an order', t.cycle && t.cycle.length === 3 && t.cycle.every((u, i) => c.edges.some((e) => e.u === u && e.v === t.cycle[(i + 1) % 3]))); }
  { const c = G.parseGraph('s a 4\na b -6\nb a 1\nb t 2', true), r = G.bellmanFord(c, 0);
    check('graph: Bellman-Ford finds the negative cycle a-b', r.cycle && r.cycle.map((i) => c.names[i]).sort().join() === 'a,b'); }
  { const c = G.parseGraph('s a 4\ns b 2\nb a -3\na t 1', true), r = G.bellmanFord(c, 0);
    check('graph: Bellman-Ford with a negative edge and no cycle (s-b-a-t = 0)', !r.cycle && r.dist[c.names.indexOf('t')] === 0); }
  check('graph: Dijkstra refuses negative weights', (() => { try { G.dijkstra(G.parseGraph('a b -1', true), 0); return false; } catch (e) { return /Bellman-Ford/.test(e.message); } })());

  // A random 22-node undirected graph and an 11-node directed one (from the build's random set), against networkx.
  const R1 = 'n11 n65 4.811\nn7 n81 4.469\nn11 n33 1.728\nn2 n28 2.765\nn65 n63 2.988\nn63 n89 9.356\nn10 n35 5.545\nn89 n35 4.734\nn77 n63 3.07\nn51 n11 0.851\nn51 n8 5.304\nn89 n2 5.01\nn9 n65 6.754\nn10 n54 6.737\nn81 n23 9.718\nn35 n28 2.544\nn41 n7 2.387\nn28 n8 6.542\nn23 n88 9.828\nn73 n51 1.172\nn8 n11 4.592\nn19 n68 6.82\nn23 n2 6.87\nn35 n33 2.801\nn35 n19 4.865\nn63 n11 4.735\nn11 n88 9.637\nn41 n19 9.674\nn88 n63 0.51\nn23 n68 5.009\nn2 n10 2.409\nn2 n51 1.363\nn68 n73 4.295\nn19 n23 0.714\nn41 n68 6.063\nn2 n73 6.747\nn28 n33 4.2\nn7 n8 9.855\nn73 n35 7.379';
  { const r = G.parseGraph(R1, false), n = r.names.length;
    const bw = [0.347619047619, 0.095238095238, 0.02380952381, 0.0, 0.042857142857, 0.290476190476, 0.014285714286, 0.2, 0.0, 0.095238095238, 0.061904761905, 0.0, 0.380952380952, 0.038095238095, 0.0, 0.0, 0.128571428571, 0.057142857143, 0.057142857143, 0.152380952381, 0.061904761905, 0.109523809524];
    const cl = [0.14121444422, 0.097979293709, 0.064678072593, 0.058197377792, 0.125320761473, 0.137582221756, 0.111169931181, 0.105680582954, 0.090752336873, 0.108345156714, 0.114527546602, 0.080734452851, 0.143942094152, 0.098427964791, 0.060101141635, 0.063914293975, 0.099856396991, 0.072317037894, 0.102015039932, 0.131095143861, 0.097533788491, 0.103509463722];
    check('graph: random graph 1 betweenness and closeness equal networkx', G.betweenness(r).every((x, i) => near(x, bw[i], 1e-11)) && G.closeness(r).every((x, i) => near(x, cl[i], 1e-11)));
    check('graph: random graph 1 shortest path 6.318, max flow 17.27, MST 69.745, 3 colours', near(G.dijkstra(r, 0).dist[n - 1], 6.318) && near(G.maxFlow(r, 0, n - 1).value, 17.27) && near(G.kruskal(r).total, 69.745) && near(G.prim(r).total, 69.745) && G.colour(r, 'largest').count === 3 && G.colour(r, 'dsatur').count === 3); }
  const R2 = 'n47 n6 3.213\nn50 n49 9.725\nn46 n96 3.498\nn9 n46 8.901\nn6 n46 9.178\nn96 n13 2.433\nn8 n47 9.368\nn46 n54 6.342\nn50 n6 8.76\nn54 n47 9.163\nn96 n50 2.122\nn46 n9 3.177\nn75 n6 2.972\nn6 n49 3.358\nn96 n6 4.246\nn50 n8 2.475\nn54 n96 2.59\nn9 n54 4.561\nn96 n49 2.819';
  { const r = G.parseGraph(R2, true), n = r.names.length;
    const bw = [0.088888888889, 0.377777777778, 0.088888888889, 0.0, 0.355555555556, 0.322222222222, 0.0, 0.0, 0.022222222222, 0.111111111111, 0.0];
    const cl = [0.050831572761, 0.11082442986, 0.064202237047, 0.121918179355, 0.05726813118, 0.061452782179, 0.049894753255, 0.064264292855, 0.069485158404, 0.04712986487, 0.0];
    check('graph: random directed graph 2 betweenness and closeness (incoming distances) equal networkx', G.betweenness(r).every((x, i) => near(x, bw[i], 1e-11)) && G.closeness(r).every((x, i) => near(x, cl[i], 1e-11)));
    check('graph: random directed graph 2: last node unreachable, max flow 0', G.dijkstra(r, 0).dist[n - 1] === Infinity && G.maxFlow(r, 0, n - 1).value === 0); }

  // Reading edge lists.
  { const p = G.parseGraph('source,target,weight\nA,B,2\n"C";"D";3\nE -> F\nX\nA B 5\nQ Q 1', true);
    check('graph: header skipped, commas, semicolons, arrows, a lone node, a repeat (last weight) and a loop', p.names.join() === 'A,B,C,D,E,F,X,Q' && p.edges.length === 3 && p.edges[0].w === 5 && p.edges[2].w === 1 && p.notes.length === 2); }
  check('graph: undirected B A repeats A B', G.parseGraph('A B 1\nB A 4', false).edges.length === 1 && G.parseGraph('A B 1\nB A 4', true).edges.length === 2);
  check('graph: a bad weight names the line', (() => { try { G.parseGraph('A B 1\nA C x', false); return false; } catch (e) { return e.message.startsWith('Line 2:'); } })());
  check('graph: text round trip', G.toText(G.parseGraph('A B 2\nC D 1.5\nE', false)) === 'A B 2\nC D 1.5\nE');
  { const L = G.layout(7, g.edges), L2 = G.layout(7, g.edges);
    const minD = Math.min(...L.flatMap((p, i) => L.slice(i + 1).map((q) => Math.hypot(p[0] - q[0], p[1] - q[1]))));
    check('graph: layout is repeatable, inside the square and spreads the nodes', JSON.stringify(L) === JSON.stringify(L2) && L.every(([x, y]) => x >= 0 && x <= 1 && y >= 0 && y <= 1) && minD > 0.1); }
};
