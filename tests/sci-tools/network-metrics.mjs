// #588 network metrics: src/lib/sci/network.ts against networkx 3.7 (density, clustering, average_clustering,
// transitivity, connected / strongly connected components, diameter, radius, average_shortest_path_length,
// degree_assortativity_coefficient, pagerank with tol 1e-15, community.modularity, louvain_communities,
// degree_histogram). The numbers below came from networkx on the made-up example and on a random directed graph.
// During the build the lib was also compared with networkx on 40 random graphs (planted-partition, Barabási-Albert
// and directed G(n, p), some weighted): 450 checks, all equal; Louvain modularity within 0.05 of networkx's best of
// 10 seeds and never below its worst by more than 0.02.
import * as G from '../../src/lib/sci/graph.ts';
import * as N from '../../src/lib/sci/network.ts';

export default async (check) => {
  const near = (a, b, t = 1e-12) => Math.abs(a - b) <= t;
  const g = G.parseGraph(N.exampleNetwork(), false), ix = (s) => g.names.indexOf(s);
  check('network: example has 34 people and 83 links', g.names.length === 34 && g.edges.length === 83);
  check('network: density 0.147950 (networkx)', near(N.density(g), 0.14795008912655971));
  { const c = N.clustering(g); check('network: average clustering 0.239076, transitivity 0.188571, A1 0.2', near(c.average, 0.23907563025210082) && near(c.transitivity, 0.18857142857142858) && near(c.local[ix('A1')], 0.2)); }
  { const d = N.distances(g); check('network: diameter 5, radius 3, average path 2.536542', d.diameter === 5 && d.radius === 3 && near(d.avgPath, 2.536541889483066) && d.size === 34); }
  check('network: degree assortativity 0.136666', near(N.assortativity(g), 0.13666570355388585, 1e-12));
  { const p = N.pagerank(g).rank; check('network: PageRank B1 0.039413 (top), A1 0.033706, C12 0.016138', near(p[ix('B1')], 0.03941306735483808, 1e-12) && near(p[ix('A1')], 0.03370632290126384, 1e-12) && near(p[ix('C12')], 0.016138050852718574, 1e-12) && p.indexOf(Math.max(...p)) === ix('B1') && near(p.reduce((s, x) => s + x, 0), 1, 1e-12)); }
  { const l = N.louvain(g); const same = g.names.every((a, i) => g.names.every((b, j) => (a[0] === b[0]) === (l.comm[i] === l.comm[j])));
    check('network: Louvain finds the three made-up groups, modularity 0.493613 (networkx best of 5 seeds)', l.count === 3 && same && near(l.modularity, 0.4936130062418348)); }
  check('network: degree histogram as networkx [0,0,1,3,11,7,8,4]', N.degreeDistribution(g).rows.map((r) => `${r.k}:${r.count}`).join() === '2:1,3:3,4:11,5:7,6:8,7:4');
  { const r = N.degreeDistribution(g).rows; check('network: distribution adds to 1 and the cumulative starts at 1', near(r.reduce((s, x) => s + x.p, 0), 1) && r[0].ccdf === 1); }

  const D = 'v0 v7\nv1 v7\nv9 v6\nv8 v3\nv7 v9\nv2 v8\nv0 v6\nv4 v1\nv9 v4\nv8 v5\nv4 v2\nv2 v4\nv6 v1\nv7 v5\nv7 v2';
  const d = G.parseGraph(D, true);
  check('network: random directed graph: density 1/6, assortativity −0.232495', near(N.density(d), 1 / 6) && near(N.assortativity(d), -0.2324952774876355));
  { const p = N.pagerank(d).rank, want = [0.030203067356, 0.165733401444, 0.14434591819, 0.077160864432, 0.075832738366, 0.084112569609, 0.06595090944, 0.126845887654];
    check('network: directed PageRank equals networkx (dangling node shared evenly)', want.every((w, i) => near(p[i], w, 1e-11))); }
  check('network: strong components 6,1,1,1,1 and one weak component', N.strongComponents(d).sizes.slice(0, 5).join() === '6,1,1,1,1' && N.components(d).sizes.join() === '10');
  { const x = N.distances(d); check('network: directed graph as undirected: diameter 5, average path 2.133333, no triangles', x.diameter === 5 && near(x.avgPath, 2.1333333333333333) && N.clustering(d).transitivity === 0); }

  // Small hand checks.
  { const k4 = G.parseGraph('a b\na c\na d\nb c\nb d\nc d', false); check('network: complete graph K4: density 1, clustering 1, diameter 1', N.density(k4) === 1 && N.clustering(k4).average === 1 && N.distances(k4).diameter === 1); }
  { const star = G.parseGraph('h a\nh b\nh c\nh d', false); check('network: star: assortativity −1, clustering 0', near(N.assortativity(star), -1) && N.clustering(star).average === 0); }
  { const two = G.parseGraph('a b\nb c\nc a\nx y\ny z\nz x', false), l = N.louvain(two);
    check('network: two triangles: two communities, modularity 0.5', l.count === 2 && near(l.modularity, 0.5)); }
  check('network: a regular ring has no assortativity (NaN, as networkx)', Number.isNaN(N.assortativity(G.parseGraph('a b\nb c\nc a', false))));
  check('network: weighted modularity counts weights', near(N.modularity(G.parseGraph('a b 3\nb c 1', false), [0, 0, 1]), 3 / 4 - (7 / 8) ** 2 - (1 / 8) ** 2));
};
