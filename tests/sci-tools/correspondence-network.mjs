// #417 Correspondence network. Reference values from networkx 3 (degree, strength, betweenness_centrality,
// greedy_modularity_communities, modularity). The wider run (31 networks) matched betweenness and modularity to
// 1e-15 and gave the same communities in 30; in the other, our greedy order found a higher modularity.
import * as L from '../../src/lib/sci/letters.ts';
export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const { letters, skipped, header } = L.readLetters(L.EXAMPLE);
  check('letters: example has 35 letters with a header row', letters.length === 35 && skipped === 0 && header);
  check('letters: quoted CSV cells with commas, semicolons and tabs', JSON.stringify(L.readRows('a,"Smith, John","say ""hi"""\nb,c')) === '[["a","Smith, John","say \\"hi\\""],["b","c"]]' && L.readRows('x;y;1,5').length === 1 && L.readRows('x;y;1,5')[0][2] === '1,5' && L.readRows('a\tb, c\n')[0][1] === 'b, c');
  { const r = L.readLetters('To,From,Year\nB,A,1800\nA,,1801\nC,C,1802\nA,B,x'); check('letters: header in any order; blank or self letters skipped', r.letters.length === 2 && r.letters[0].from === 'A' && r.letters[0].to === 'B' && r.letters[0].date === '1800' && r.skipped === 2); }
  check('letters: no header means sender, recipient, date, place', L.readLetters('Ann,Bob,1820,Paris').letters[0].place === 'Paris');
  check('letters: date keys', L.dateKey('1821-3-2') === '1821-03-02' && L.dateKey('1821') === '1821-00-00' && L.dateKey('c. 1820') === '' && L.dateKey('1821/07') === '1821-07-00');
  { const f = L.filterLetters(letters, '1822', '1823'); check('letters: date filter 1822 to 1823 keeps 18 letters', f.kept.length === 18 && f.undated === 0); }
  { const f = L.filterLetters([...letters, { from: 'A', to: 'B', date: '', place: '' }], '', '1821-06'); check('letters: filter up to June 1821, undated left out', f.kept.length === 3 && f.undated === 1); }
  const n = L.buildNetwork(letters);
  check('letters: 8 people, 12 pairs', n.names.length === 8 && n.edges.length === 12 && n.names[0] === 'Anna Price');
  const ac = n.edges.find((e) => e.a === 0 && e.b === 1);
  check('letters: Anna and Clara exchanged 7 letters (4 from Anna)', ac.w === 7 && ac.ab === 4 && ac.ba === 3);
  check('letters: degree and strength', JSON.stringify(L.degree(n)) === '[3,3,4,3,4,3,2,2]' && JSON.stringify(L.strength(n)) === '[12,10,11,4,15,8,7,3]' && n.sent[0] + n.received[0] === L.strength(n)[0]);
  const b = L.betweenness(n), py = [0, 0, 0.5714285714, 0, 0.5952380952, 0.0238095238, 0, 0];
  check('letters: betweenness matches networkx', b.every((x, i) => near(x, py[i], 1e-9)));
  const c = L.greedyCommunities(n);
  check('letters: two communities, family and naturalists, modularity 0.29551 (networkx)', JSON.stringify(c) === '[1,1,0,1,0,0,0,0]' && near(L.modularity(n, c), 0.2955102040816329, 1e-12));
  check('letters: modularity of everyone in one group is 0', near(L.modularity(n, n.names.map(() => 0)), 0, 1e-12));
  // Two triangles joined by one edge: the textbook split, Q = 5/14.
  const tri = L.buildNetwork(['a b', 'b c', 'c a', 'd e', 'e f', 'f d', 'c d'].map((s) => ({ from: s[0], to: s[2], date: '', place: '' })));
  const tc = L.greedyCommunities(tri);
  check('letters: two triangles split in two with Q = 5/14', JSON.stringify(tc) === '[0,0,0,1,1,1]' && near(L.modularity(tri, tc), 5 / 14, 1e-12));
  check('letters: bridge nodes have betweenness 0.6 (networkx)', L.betweenness(tri).map((x) => +x.toFixed(6)).join() === '0,0,0.6,0.6,0,0');
  const p = L.layout(n, 1), p2 = L.layout(n, 1);
  check('letters: layout is seeded and fills the unit square', JSON.stringify(p) === JSON.stringify(p2) && Math.min(...p.map((x) => x[0])) === 0 && Math.max(...p.map((x) => x[1])) === 1);
};
