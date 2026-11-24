// NMR impurities checker: the solvent and impurity tables, the journal-list parser and the matcher.
// Reference positions are fibub's own table (src/lib/sci/nmr.ts), rounded to 0.05 ppm, so these checks pin the
// parser and the matching logic rather than the chemistry. The peak list used is the published one of
// Coste et al. (2026), Front. Chem. 14: 1804888 (CC BY 4.0), quoted as a fact in
// src/blog/discoveries/published-nmr-peak-lists-residual-solvent-overlap.md.
import { SOLVENTS, IMPURITIES, signals, parsePeaks, match } from '../../src/lib/sci/nmr.ts';

const BA01 = '7.78 (d, J = 2.0 Hz, 1H), 7.55–7.42 (m, 3H), 7.28 (dd, J = 8.7, 7.3 Hz, 2H), 7.09–6.98 (m, 1H), 6.93–6.84 (m, 2H), 5.30 (t, J = 5.7 Hz, 1H), 3.12 (q, J = 6.6 Hz, 2H), 2.45 (s, 3H), 1.49–1.33 (m, 2H), 1.21–1.05 (m, 2H), 0.79 (t, J = 7.3 Hz, 3H)';

export default async (check) => {
  const dmso = signals('DMSO', 'h'), cdcl3 = signals('CDCl3', 'h');
  check('nmr: 10 deuterated solvents, 45 impurities; DMSO-d₆ has 72 ¹H signals, residual at 2.50 and water at 3.35',
    SOLVENTS.length === 10 && IMPURITIES.length === 45 && dmso.length === 72
    && dmso.some((s) => s.solvent && s.delta === 2.5) && dmso.some((s) => s.name === 'water' && s.delta === 3.35));
  check('nmr: CDCl₃ residual at 7.25 with water at 1.55; the table is sorted by shift',
    cdcl3.some((s) => s.solvent && s.delta === 7.25) && cdcl3.some((s) => s.name === 'water' && s.delta === 1.55)
    && cdcl3.every((s, i) => i === 0 || s.delta >= cdcl3[i - 1].delta));
  check('nmr: a journal line parses to peaks only (integrals and J dropped)', JSON.stringify(parsePeaks('δ 7.26 (d, J = 8.0 Hz, 2H), 3.80 (s, 3H)\n1.26 3H\n2.17\t1.00')) === '[7.26,3.8,1.26,2.17]');
  { const p = parsePeaks(BA01);
    check('nmr: a published list with multiplet ranges gives both limits, all positive (16 values from BA-01)',
      p.length === 16 && p.every((x) => x > 0) && p.slice(0, 3).join() === '7.78,7.55,7.42' && p[p.length - 1] === 0.79);
    const m = match(p, 'DMSO', 'h', 0.03);
    check('nmr: at ±0.03 ppm, 9 of BA-01’s 16 values match something and no impurity is complete',
      m.perPeak.filter((x) => x.hits.length).length === 9 && !m.byImp.some((x) => !x.solvent && x.total > 1 && x.found === x.total)
      && m.byImp.find((x) => x.name === 'pyridine').found === 2);
    const near = (tol) => match([2.45], 'DMSO', 'h', tol).perPeak[0].hits.some((h) => h.solvent);
    check('nmr: the 2.45 methyl pairs with residual DMSO only from ±0.05 ppm (0.05 ppm away = 20 Hz at 400 MHz)', !near(0.03) && near(0.05));
    const m2 = match([...p, 4.03, 3.33, 2.5, 1.99, 1.17], 'DMSO', 'h', 0.03);
    check('nmr: add ethyl acetate’s three signals and it comes back 3 of 3, ranked first, with water and residual DMSO found',
      m2.byImp[0].name === 'ethyl acetate' && m2.byImp[0].found === 3 && m2.byImp[0].total === 3
      && m2.byImp.some((x) => x.name === 'water' && x.found === 1) && m2.byImp.some((x) => x.solvent && x.found === 1)); }
  { const m = match([7.25], 'CDCl3', 'h', 0.01);
    const sol = (p, tol) => match([p], 'CDCl3', 'h', tol).perPeak[0].hits.some((h) => h.solvent);
    check('nmr: the tolerance window is inclusive at its edge and nothing beyond it matches', m.perPeak[0].hits.length > 0 && sol(7.29, 0.04) && !sol(7.31, 0.04));
    check('nmr: a peak nowhere near anything gets no hit', match([13.7], 'DMSO', 'h', 0.03).perPeak[0].hits.length === 0 && match([13.7], 'DMSO', 'h', 0.03).byImp.length === 0); }
  check('nmr: ¹³C tables are separate (DMSO-d₆ at 39.5 ppm, CDCl₃ at 77)', signals('DMSO', 'c').some((s) => s.solvent && s.delta === 39.5) && signals('CDCl3', 'c').some((s) => s.solvent && s.delta === 77));
};
