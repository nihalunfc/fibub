// #206 Hardy-Weinberg tester. References: exact enumeration with Python fractions (two-sided and one-sided
// p-values), Yates-corrected chi-square by NumPy + scipy.stats.chi2.sf, and an independent NumPy calculation
// for three alleles. (Uncorrected chi-square and the two-sided exact test are also covered by #312's tests.)
import { hweExactSides, hweChiYates, hweMulti, popStats } from '../../src/lib/sci/hwefst.ts';

export default async (check) => {
  const rel = (name, got, want, tol = 1e-8) => check(`${name}: got ${got}, want ${want}`, Math.abs(got - want) <= tol * Math.max(Math.abs(want), 1e-300));
  const ref = [
    [[57, 14, 50], 5.562047311095335e-19, 5.181720563376787e-19, 1.0, 69.04195358262277, 9.639099972840784e-17, 0.7678179824561404],
    [[30, 5, 15], 2.156806415347185e-08, 2.156806415347185e-08, 0.9999999997841623, 27.851467214104577, 1.30994694566798e-07, 0.7802197802197802],
    [[10, 40, 50], 0.6367558662349988, 0.3816742248747254, 0.7801772666003272, 0.08645124716553287, 0.7687380898485677, 0.04761904761904756],
    [[12, 70, 18], 0.000108521166796415, 0.9999907424155985, 5.665977711338441e-05, 15.211422139372555, 9.612027553606245e-05, -0.40505820955439575],
  ];
  for (const [[a, b, c], two, lo, hi, y, py, F] of ref) {
    const e = hweExactSides(a, b, c), t = `${a}/${b}/${c}`;
    rel(`HWE two-sided ${t}`, e.p, two, 1e-7); rel(`HWE deficit ${t}`, e.deficit, lo, 1e-7); rel(`HWE excess ${t}`, e.excess, hi, 1e-7);
    const yy = hweChiYates(a, b, c); rel(`HWE Yates chi2 ${t}`, yy.chi2, y, 1e-10); rel(`HWE Yates p ${t}`, yy.p, py, 1e-5);
    rel(`HWE F ${t}`, popStats({ name: '', AA: a, AB: b, BB: c }).Fis, F, 1e-10);
  }
  const m = hweMulti(['A', 'B', 'C'], new Map([['A/A', 20], ['A/B', 25], ['A/C', 15], ['B/B', 12], ['B/C', 18], ['C/C', 10]]));
  rel('HWE 3 alleles chi2', m.chi2, 4.25379240786445, 1e-10); rel('HWE 3 alleles p', m.pChi, 0.23533112487532537, 1e-6);
  rel('HWE 3 alleles He', m.He, 0.65755, 1e-12); rel('HWE 3 alleles F', m.F, 0.1179377994068892, 1e-10);
  check('HWE 3 alleles df 3, six genotypes, allele frequencies', m.df === 3 && m.rows.length === 6 && Math.abs(m.p[1] - 0.335) < 1e-12);
  const two = hweMulti(['A', 'B'], new Map([['A/A', 30], ['A/B', 5], ['B/B', 15]]));
  rel('HWE multi with 2 alleles equals biallelic chi2', two.chi2, popStats({ name: '', AA: 30, AB: 5, BB: 15 }).chi2, 1e-12);
};
