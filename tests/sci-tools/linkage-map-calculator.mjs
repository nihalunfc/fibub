// #204 linkage map calculator: reference values from an independent Python implementation (math, itertools: every
// order of 5 loci scored by SARF and by summed Haldane distances; three-point classes recounted) and a made-up
// textbook-style testcross worked by hand (1,000 progeny, order a-c-b, RFs 0.16 and 0.138, CoC 20/22.08).
import * as L from '../../src/lib/sci/linkmap.ts';

const PAIRS = 'A D 0.12|A B 0.2|A E 0.31|A C 0.34|D B 0.08|D E 0.2|D C 0.26|B E 0.13|B C 0.2|E C 0.08'.split('|').map((l) => { const [a, b, r] = l.split(' '); return { a, b, r: +r }; });
const TP = [['+', '+', '+', 366], ['a', 'b', 'c', 356], ['a', '+', '+', 68], ['+', 'b', 'c', 72], ['+', 'b', '+', 61], ['a', '+', 'c', 57], ['+', '+', 'c', 9], ['a', 'b', '+', 11]];

export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  check('linkage: Haldane and Kosambi from RF = Python', near(L.rfToCm(0.2, 'haldane'), 25.541281188299525) && near(L.rfToCm(0.2, 'kosambi'), 21.18244650968009) && near(L.rfToCm(0.45, 'haldane'), 115.12925464970228) && near(L.rfToCm(0.45, 'kosambi'), 73.610974479161));
  check('linkage: RF from cM = Python', near(L.cmToRf(25, 'haldane'), 0.1967346701436833) && near(L.cmToRf(25, 'kosambi'), 0.23105857863000487) && L.cmToRf(30, 'none') === 0.3);
  check('linkage: round trips', [0.01, 0.1, 0.3, 0.49].every((r) => near(L.cmToRf(L.rfToCm(r, 'haldane'), 'haldane'), r) && near(L.cmToRf(L.rfToCm(r, 'kosambi'), 'kosambi'), r)));
  check('linkage: RF of 0.5 or more has no map distance', Number.isNaN(L.rfToCm(0.5, 'haldane')) && Number.isNaN(L.rfToCm(0.6, 'kosambi')));
  check('linkage: small RFs are about 100 × RF cM', Math.abs(L.rfToCm(0.01, 'haldane') - 1) < 0.02 && Math.abs(L.rfToCm(0.01, 'kosambi') - 1) < 0.001);
  const o = L.orderLoci(PAIRS, 'sarf', 'kosambi');
  check('linkage: SARF order A-D-B-E-C = all 60 orders tried in Python (0.41)', o.order.join('') === 'ADBEC' && near(o.score, 0.41) && o.exact && o.tried === 60 && o.ties === 1);
  check('linkage: Kosambi positions = Python', near(o.positions[4], 41.68279558980291) && near(o.positions[1], 12.238705632967644));
  const h = L.orderLoci(PAIRS, 'sad', 'haldane');
  check('linkage: summed Haldane distance order = Python (46.21 cM)', h.order.join('') === 'ADBEC' && near(h.score, 46.212435638761875));
  const g = L.orderLoci(PAIRS, 'sarf', 'kosambi', 2);
  check('linkage: nearest neighbour + 2-opt finds the same order', !g.exact && g.order.join('') === 'ADBEC');
  const m1 = L.orderLoci([{ a: 'A', b: 'B', r: 0.1 }, { a: 'A', b: 'C', r: 0.15 }], 'sarf', 'none');
  const m2 = L.orderLoci([{ a: 'A', b: 'B', r: 0.1 }, { a: 'C', b: 'D', r: 0.1 }], 'sarf', 'none');
  check('linkage: missing pairs are unlinked; a gap in the best order is reported', m1.order.join('') === 'BAC' && !m1.missing.length && m2.missing.length === 1);
  const t = L.threePoint(TP.map((r) => ({ alleles: r.slice(0, 3), n: r[3] })));
  check('linkage: three-point order a-c-b (c in the middle)', t.order.join('') === '021' && t.genes.join('') === 'abc');
  check('linkage: three-point RFs 0.16, 0.138, 0.258', near(t.rf.ab, 0.16) && near(t.rf.bc, 0.138) && near(t.rf.ac, 0.258));
  check('linkage: parental and double-crossover classes', t.parental.map((x) => x.join('')).join(',') === '+++,abc' && t.dco.map((x) => x.join('')).sort().join(',') === '++c,ab+');
  check('linkage: CoC 0.906 and interference 0.094 (hand)', t.counts.dco === 20 && near(t.expectedDco, 22.08) && near(t.coc, 20 / 22.08) && near(t.interference, 1 - 20 / 22.08));
  check('linkage: map 16 + 13.8 = 29.8 cM', near(t.cm.ab, 16) && near(t.cm.bc, 13.8) && near(t.cm.ac, 29.8));
  const perm = L.threePoint(TP.map((r) => ({ alleles: [r[2], r[0], r[1]], n: r[3] })));
  check('linkage: same answer with the genes listed in another order', perm.genes[perm.order[1]] === 'c' && near(perm.coc, t.coc));
  let err = ''; try { L.threePoint(TP.slice(0, 7).map((r) => ({ alleles: r.slice(0, 3), n: r[3] }))); } catch (e) { err = e.message; }
  check('linkage: 8 classes required', err.includes('8 progeny classes'));
};
