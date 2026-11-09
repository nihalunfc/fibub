// #403 Harris matrix builder: parsing, same-as joins, loops, contemporary conflicts, transitive reduction and layout.
// The random graphs and their reductions / strongly connected components come from networkx 3 (transitive_reduction,
// strongly_connected_components); 300 such graphs were checked when the tool was built.
import { parseRelations, buildMatrix, nodeLabel, EXAMPLE } from '../../src/lib/sci/harris.ts';

export default async (check) => {
  const graph = (n, edges) => buildMatrix(parseRelations([...Array(n).keys()].map((i) => `C${i}`).concat(edges.map(([u, v]) => `C${u} above C${v}`)).join('\n')));
  const pairs = (m, es) => es.map((e) => [Number(nodeLabel(m, e.from).slice(1)), Number(nodeLabel(m, e.to).slice(1))]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const NX = [
    { n: 13, edges: [[12, 1], [10, 6], [10, 7], [8, 12], [3, 0], [11, 6], [11, 12], [11, 0], [11, 9], [11, 1], [2, 10], [1, 5], [7, 8], [7, 5]], red: [[1, 5], [2, 10], [3, 0], [7, 8], [8, 12], [10, 6], [10, 7], [11, 0], [11, 6], [11, 9], [11, 12], [12, 1]] },
    { n: 12, edges: [[0, 8], [0, 3], [0, 10], [11, 2], [11, 1], [9, 8], [9, 3], [3, 4], [4, 2], [4, 6], [5, 2], [2, 10], [6, 1]], red: [[0, 3], [0, 8], [2, 10], [3, 4], [4, 2], [4, 6], [5, 2], [6, 1], [9, 3], [9, 8], [11, 1], [11, 2]] },
  ];
  NX.forEach((c, i) => {
    const m = graph(c.n, c.edges);
    check(`harris: networkx transitive reduction, graph ${i + 1}`, m.cycles.length === 0 && JSON.stringify(pairs(m, m.kept)) === JSON.stringify(c.red));
    check(`harris: every kept edge points down, graph ${i + 1}`, m.kept.every((e) => m.layer[e.to] > m.layer[e.from]) && m.routes.every((r) => r.every((p, k) => !k || p[0] === r[k - 1][0] + 1)));
  });
  {
    // networkx: two strongly connected components, {0,2,4,6,8,9,10} and {5,7}.
    const m = graph(12, [[1, 5], [1, 4], [1, 9], [1, 3], [1, 11], [5, 7], [8, 4], [4, 5], [4, 6], [4, 9], [4, 0], [4, 7], [2, 5], [2, 10], [6, 8], [6, 9], [10, 4], [9, 4], [9, 6], [9, 7], [0, 5], [0, 2], [7, 5], [11, 0]]);
    const es = new Set([[1, 5], [1, 4], [1, 9], [1, 3], [1, 11], [5, 7], [8, 4], [4, 5], [4, 6], [4, 9], [4, 0], [4, 7], [2, 5], [2, 10], [6, 8], [6, 9], [10, 4], [9, 4], [9, 6], [9, 7], [0, 5], [0, 2], [7, 5], [11, 0]].map(([u, v]) => `${u}>${v}`));
    const real = m.cycles.every((cy) => cy.every((k, i) => es.has(`${nodeLabel(m, k).slice(1)}>${nodeLabel(m, cy[(i + 1) % cy.length]).slice(1)}`)));
    check('harris: networkx cyclic graph, one real loop per strongly connected component', m.cycles.length === 2 && real && m.layer.length === 0);
  }
  {
    const p = parseRelations(EXAMPLE), m = buildMatrix(p);
    check('harris: example parses 15 relations, 11 contexts', p.errors.length === 0 && p.relations.length === 15 && p.contexts.length === 11);
    check('harris: example 10 units in 6 levels, 11 kept, 1 redundant (5 above 7)', m.nodes.length === 10 && m.rows.length === 6 && m.kept.length === 11 && m.redundant.length === 1 && nodeLabel(m, m.redundant[0].from) === '5' && nodeLabel(m, m.redundant[0].to) === '7');
    check('harris: same-as joins 8 and 9', m.nodes.some((n) => n.join('=') === '8=9'));
    const L = (c) => m.layer[m.nodeOf.get(c)];
    check('harris: contemporaries share a level (3,4 and 6,11)', L('3') === L('4') && L('6') === L('11') && L('1') === 0 && L('7') === 5);
    const loop = buildMatrix(parseRelations(EXAMPLE + '\n7 above 1'));
    check('harris: loop 1 > 2 > 3 > 5 > 7 > 1 found', loop.cycles.length === 1 && loop.cycles[0].map((k) => nodeLabel(loop, k)).join(',') === '1,2,3,5,7');
  }
  {
    const p = parseRelations('105 cut by 102\n102, below, 99\n7 = 9\n9 over 7\n3 ~ 4\n3 > 8\n8 > 4\nF12 underlies F10\nlonely\nfoo bar\n6 above 6');
    check('harris: word forms (cut by, below in CSV cells, over, underlies, >, ~)', p.relations.some((r) => r.a === '102' && r.b === '105' && r.kind === 'above') && p.relations.some((r) => r.a === '99' && r.b === '102') && p.relations.some((r) => r.a === 'F10' && r.b === 'F12') && p.contexts.includes('lonely'));
    check('harris: bad lines reported with their line numbers', p.errors.length === 2 && p.errors[0].startsWith('Line 10') && p.errors[1].startsWith('Line 11'));
    const m = buildMatrix(p);
    check('harris: same-as unit put above itself is flagged', m.selfLoops.length === 1 && m.layer.length === 0);
    const m2 = buildMatrix(parseRelations('3 ~ 4\n3 > 8\n8 > 4\n5 ~ 6'));
    check('harris: contemporary pair contradicted by the sequence', m2.contemporary.find((c) => nodeLabel(m2, c.a) === '3').conflict === true && m2.contemporary.find((c) => nodeLabel(m2, c.a) === '5').conflict === false);
  }
};
