// #1124 Mendel's pea garden. Exact crosses were checked against a brute-force Python enumeration of every
// gamete pair with exact fractions (Tt × Tt, RrYy × RrYy, RrYy × rryy, RrYY × Rryy). Chi-square p-values were
// checked against the standard critical values (3.841 and 6.635 for 1 df, 5.991 for 2 df, 7.815 and 11.345 for
// 3 df) and Mendel's published seed counts (5474 round : 1850 wrinkled gives chi-square 0.263; 315 : 108 : 101 : 32
// gives 0.470).
import { GENES, cross, gametes, child, ratio, chiSquare, chiP, genotypesOf, normalise, phenoOf } from '../../src/lib/sci/peagarden.ts';

export default async (check) => {
  const near = (a, b, t = 1e-6) => Math.abs(a - b) <= t;
  const { height, shape, colour, flower, blood } = GENES;
  const asObj = (m) => Object.fromEntries([...m].sort().map(([k, v]) => [k, v]));
  const eq = (m, py) => Object.keys(py).length === m.size && Object.entries(py).every(([k, f]) => { const [a, b] = f.split('/').map(Number); return near(m.get(k), a / b, 1e-12); });
  check('mendel: Tt × Tt is 3 tall : 1 short', eq(cross([height], ['Tt'], ['Tt']).pheno, { short: '1/4', tall: '3/4' }));
  check('mendel: dihybrid 9:3:3:1', eq(cross([shape, colour], ['Rr', 'Yy'], ['Rr', 'Yy']).pheno, { 'round, green': '3/16', 'round, yellow': '9/16', 'wrinkled, green': '1/16', 'wrinkled, yellow': '3/16' }));
  check('mendel: dihybrid test cross 1:1:1:1', eq(cross([shape, colour], ['Rr', 'Yy'], ['rr', 'yy']).pheno, { 'round, green': '1/4', 'round, yellow': '1/4', 'wrinkled, green': '1/4', 'wrinkled, yellow': '1/4' }));
  check('mendel: RrYY × Rryy', eq(cross([shape, colour], ['Rr', 'YY'], ['Rr', 'yy']).pheno, { 'round, yellow': '3/4', 'wrinkled, yellow': '1/4' }));
  check('mendel: F2 genotypes 1:2:1', near(cross([height], ['Tt'], ['Tt']).geno.get('Tt'), 0.5) && near(cross([height], ['Tt'], ['Tt']).geno.get('TT'), 0.25));
  check('mendel: gametes of RrYy', gametes([shape, colour], ['Rr', 'Yy']).size === 4 && [...gametes([shape, colour], ['Rr', 'Yy']).values()].every((p) => near(p, 0.25)));
  check('mendel: incomplete dominance 1 red : 2 pink : 1 white', near(cross([flower], ['RW'], ['RW']).pheno.get('pink'), 0.5) && near(cross([flower], ['RW'], ['RW']).pheno.get('red'), 0.25));
  check('mendel: ABO AO × BO gives A, B, AB, O equally', ['A', 'B', 'AB', 'O'].every((b) => near(cross([blood], ['AO'], ['BO']).pheno.get(b), 0.25)));
  check('mendel: genotypes listed in order', genotypesOf(blood).join() === 'AA,AB,AO,BB,BO,OO' && normalise(height, 'tT') === 'Tt' && normalise(blood, 'OA') === 'AO');
  check('mendel: ratios', ratio([0.5625, 0.1875, 0.1875, 0.0625]).join(':') === '9:3:3:1' && ratio([0.75, 0.25]).join(':') === '3:1' && ratio([0.25, 0.5, 0.25]).join(':') === '1:2:1');
  check('mendel: chi-square critical values', near(chiP(3.841, 1), 0.05, 2e-4) && near(chiP(6.635, 1), 0.01, 1e-4) && near(chiP(5.991, 2), 0.05, 1e-4) && near(chiP(7.815, 3), 0.05, 1e-4) && near(chiP(11.345, 3), 0.01, 1e-4));
  const m1 = chiSquare([5474, 1850], [0.75, 0.25]);
  check('mendel: Mendel round/wrinkled chi-square 0.263', near(m1.chi2, 0.2629, 1e-3) && m1.df === 1 && m1.p > 0.6 && m1.p < 0.62);
  const m2 = chiSquare([315, 108, 101, 32], [9 / 16, 3 / 16, 3 / 16, 1 / 16]);
  check('mendel: Mendel dihybrid chi-square 0.470', near(m2.chi2, 0.470, 1e-3) && m2.df === 3 && m2.p > 0.92 && m2.p < 0.93);
  check('mendel: chi-square small-count flag', chiSquare([3, 1], [0.75, 0.25]).small === true);
  let s = 5; const r = () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
  let tall = 0; for (let i = 0; i < 40000; i++) if (phenoOf([height], child([height], ['Tt'], ['Tt'], r)) === 'tall') tall++;
  check('mendel: random children follow 3:1', near(tall / 40000, 0.75, 0.01));
};
