// #385 field trial designer: layouts are valid designs, reproducible from the seed, and match an independent
// Python implementation of the same generator and shuffle (5 layouts, cell for cell).
import { design, validate, toCsv, dfTable, mulberry32, shuffle, readTreatments } from '../../src/lib/sci/fieldtrial.ts';

export default async (check) => {
  const T = (n) => Array.from({ length: n }, (_, i) => 'T' + (i + 1));
  // Reference sequences from the Python implementation (scratch ft.py, same mulberry32 and Fisher-Yates).
  {
    const L = design({ design: 'rcbd', treatments: T(5), reps: 4, seed: 12345 });
    const got = L.plots.slice().sort((a, b) => a.row - b.row || a.col - b.col).map((p) => p.trt).join(' ');
    check('field trial: RCBD seed 12345 matches the Python layout', got === 'T1 T3 T4 T2 T5 T5 T4 T1 T2 T3 T1 T3 T2 T4 T5 T3 T1 T2 T4 T5');
    const S = design({ design: 'latin', treatments: T(5), reps: 0, seed: 42 });
    const gs = S.plots.slice().sort((a, b) => a.row - b.row || a.col - b.col).map((p) => p.trt).join(' ');
    check('field trial: Latin square seed 42 matches the Python layout', gs === 'T2 T4 T5 T1 T3 T1 T3 T2 T4 T5 T3 T2 T4 T5 T1 T5 T1 T3 T2 T4 T4 T5 T1 T3 T2');
  }
  // mulberry32 first values for seed 1 (the published reference: 0.6270739405881613, 0.002735721180215478).
  { const r = mulberry32(1); check('field trial: mulberry32 reference values', Math.abs(r() - 0.6270739405881613) < 1e-15 && Math.abs(r() - 0.002735721180215478) < 1e-15); }
  // Validity over many seeds and sizes.
  let bad = 0, n = 0;
  for (let s = 1; s <= 60; s++) for (const t of [2, 3, 5, 7, 12]) {
    for (const d of ['crd', 'rcbd', 'latin']) {
      const L = design({ design: d, treatments: T(t), reps: 2 + (s % 4), seed: s * 977, cols: 1 + (s % 9), numbering: s % 2 ? 'block' : 'serial', serpentine: s % 3 === 0 });
      n++; if (validate(L).length || L.plots.length !== (d === 'latin' ? t * t : t * L.reps)) bad++;
    }
  }
  check(`field trial: ${n} random layouts are all valid designs`, bad === 0);
  // validate() catches broken layouts.
  {
    const L = design({ design: 'rcbd', treatments: T(4), reps: 3, seed: 5 });
    const b1 = L.plots.filter((p) => p.block === 1); const tmp = b1[0].trt; b1[0].trt = b1[1].trt;
    check('field trial: a treatment twice in a block is caught', validate(L).some((m) => m.includes('block 1')));
    b1[0].trt = tmp;
    const S = design({ design: 'latin', treatments: T(4), reps: 0, seed: 9 });
    const c = S.plots.find((p) => p.row === 1 && p.col === 1), d = S.plots.find((p) => p.row === 1 && p.col === 2);
    [c.trt, d.trt] = [d.trt, c.trt];
    const v = validate(S);
    check('field trial: swapping two plots in a Latin square row breaks the column property', v.some((m) => m.includes('column')) && !v.some((m) => m.includes('in row')));
  }
  // Same seed, same layout; another seed, another layout.
  {
    const a = toCsv(design({ design: 'crd', treatments: T(6), reps: 4, seed: 777 })), b = toCsv(design({ design: 'crd', treatments: T(6), reps: 4, seed: 777 })), c = toCsv(design({ design: 'crd', treatments: T(6), reps: 4, seed: 778 }));
    check('field trial: same seed gives the same layout, another seed does not', a === b && a !== c && a.split('\n')[0] === 'plot,row,column,replicate,treatment' && a.trim().split('\n').length === 25);
  }
  // Randomisation is fair: each treatment equally likely in each position of a block (chi-square over 6000 blocks).
  {
    const t = 4, N = 6000, cnt = Array.from({ length: t }, () => Array(t).fill(0));
    for (let s = 1; s <= N / 4; s++) for (const p of design({ design: 'rcbd', treatments: T(t), reps: 4, seed: s }).plots) cnt[Number(p.trt.slice(1)) - 1][p.col - 1]++;
    const e = N / t; let chi = 0; for (const r of cnt) for (const x of r) chi += (x - e) ** 2 / e;
    check(`field trial: treatment positions uniform (chi-square ${chi.toFixed(1)} on 9 df, below 21.7 = 1 % point)`, chi < 21.67);
    // Every permutation of 3 equally likely from shuffle (6 cells, chi-square 5 df, 1 % point 15.1).
    const rng = mulberry32(8), m = new Map(); for (let i = 0; i < 12000; i++) { const k = shuffle([0, 1, 2], rng).join(''); m.set(k, (m.get(k) ?? 0) + 1); }
    let c2 = 0; for (const x of m.values()) c2 += (x - 2000) ** 2 / 2000;
    check(`field trial: all 6 orders of 3 equally likely (chi-square ${c2.toFixed(1)})`, m.size === 6 && c2 < 15.09);
  }
  // Numbering.
  {
    const L = design({ design: 'rcbd', treatments: T(3), reps: 2, seed: 1, numbering: 'block', serpentine: true });
    const at = (r, c) => L.plots.find((p) => p.row === r && p.col === c).plot;
    check('field trial: block numbering 101.. and serpentine rows', at(1, 1) === 101 && at(1, 3) === 103 && at(2, 3) === 201 && at(2, 1) === 203);
    const S = design({ design: 'crd', treatments: T(3), reps: 3, seed: 1, cols: 4 });
    check('field trial: CRD on 4 columns has 3 rows, last row part filled', S.rows === 3 && S.plots.length === 9 && Math.max(...S.plots.map((p) => p.plot)) === 9);
  }
  check('field trial: ANOVA degrees of freedom', JSON.stringify(dfTable(design({ design: 'latin', treatments: T(5), reps: 0, seed: 1 }))) === JSON.stringify([['Rows', 4], ['Columns', 4], ['Treatments', 4], ['Error', 12], ['Total', 24]]) && dfTable(design({ design: 'rcbd', treatments: T(5), reps: 4, seed: 1 }))[2][1] === 12);
  {
    let e1 = '', e2 = ''; try { design({ design: 'rcbd', treatments: ['A', 'A'], reps: 3, seed: 1 }); } catch (e) { e1 = e.message; }
    try { design({ design: 'rcbd', treatments: ['A'], reps: 3, seed: 1 }); } catch (e) { e2 = e.message; }
    check('field trial: duplicate and single treatments refused', e1.includes('different') && e2.includes('at least 2') && readTreatments('A, B\nC;;D').length === 4);
  }
};
