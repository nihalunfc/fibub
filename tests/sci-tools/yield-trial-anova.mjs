// #386 yield trial ANOVA and LSD: sums of squares, F, p, CV and LSD checked against statsmodels anova_lm (type I)
// and scipy's t quantile on the example (RCBD and CRD), a made-up 4 × 4 Latin square and an unbalanced CRD.
import { analyse, readObs, letterGroups, EXAMPLE } from '../../src/lib/sci/trialanova.ts';
import { parseTable, num } from '../../src/lib/sci/num.ts';

export default async (check) => {
  const near = (a, b, tol) => Number.isFinite(a) && Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const rel = (a, b, tol) => Math.abs(a / b - 1) <= tol;
  const { obs, dropped } = readObs(parseTable(EXAMPLE).slice(1), { trt: 0, block: 1, y: 2 }, num);
  check('yield anova: example read (20 plots)', obs.length === 20 && dropped === 0);
  {
    const r = analyse(obs, 'rcbd'), [B, T, E, Tot] = r.rows;
    check('yield anova: RCBD sums of squares = statsmodels', near(B.ss, 1.4735, 1e-12) && near(T.ss, 5.177, 1e-12) && near(E.ss, 0.179, 1e-12) && near(Tot.ss, 6.8295, 1e-12) && E.df === 12);
    check('yield anova: RCBD F and p = statsmodels', near(T.f, 86.7653631284913, 1e-9) && rel(T.p, 9.474369083000399e-9, 1e-6) && near(B.f, 32.92737430167586, 1e-9) && rel(B.p, 4.511837431793371e-6, 1e-6));
    check('yield anova: RCBD CV and LSD 5 % = statsmodels/scipy', near(r.cv, 2.7476671856859833, 1e-9) && near(r.lsd, 0.18816585514993295, 1e-9));
    check('yield anova: RCBD LSD 1 % = scipy', near(analyse(obs, 'rcbd', 0.01).lsd, 0.26379505669388953, 1e-9));
    check('yield anova: RCBD letters', r.means.map((m) => m.letters).join(' ') === 'c a d b c');
  }
  {
    const r = analyse(obs, 'crd'), [T, E] = r.rows;
    check('yield anova: CRD = statsmodels', near(T.ss, 5.177, 1e-12) && near(E.ss, 1.6525, 1e-12) && near(T.f, 11.748108925869902, 1e-9) && rel(T.p, 0.00015968445976225024, 1e-6) && E.df === 15);
    check('yield anova: CRD LSD and CV', near(r.lsd, 0.5002477724622629, 1e-9) && near(analyse(obs, 'crd', 0.01).lsd, 0.6915887636726604, 1e-9) && near(r.cv, 7.467123585767214, 1e-9));
    check('yield anova: CRD letters (overlapping groups)', r.means.map((m) => m.letters).join(' ') === 'bc a d ab cd');
  }
  {
    const L = [['1', '1', 'A', 10.1], ['1', '2', 'B', 12.0], ['1', '3', 'C', 9.2], ['1', '4', 'D', 11.5], ['2', '1', 'B', 12.6], ['2', '2', 'C', 9.9], ['2', '3', 'D', 11.1], ['2', '4', 'A', 10.4],
      ['3', '1', 'C', 8.8], ['3', '2', 'D', 12.2], ['3', '3', 'A', 10.0], ['3', '4', 'B', 13.1], ['4', '1', 'D', 11.9], ['4', '2', 'A', 9.7], ['4', '3', 'B', 12.4], ['4', '4', 'C', 9.5]].map(([b, c, trt, y]) => ({ block: b, col: c, trt, y }));
    const r = analyse(L, 'latin'), [R, C, T, E] = r.rows;
    check('yield anova: Latin square = statsmodels', near(R.ss, 0.265, 1e-10) && near(C.ss, 0.425, 1e-10) && near(T.ss, 25.465, 1e-10) && near(E.ss, 1.525, 1e-10) && E.df === 6 && near(T.f, 33.39672131147542, 1e-8) && rel(T.p, 0.0003861350402607143, 1e-6) && rel(R.p, 0.7927213211312276, 1e-6) && near(r.lsd, 0.8722934736989064, 1e-9));
    let e = ''; try { analyse(L.slice(0, 15), 'latin'); } catch (x) { e = x.message; }
    check('yield anova: incomplete Latin square refused', e.includes('16 plots'));
    const bad = L.map((o) => ({ ...o })); bad[0].trt = 'B'; bad[1].trt = 'A'; e = ''; try { analyse(bad, 'latin'); } catch (x) { e = x.message; }
    check('yield anova: treatment twice in a Latin column refused', e.includes('every row and every column'));
  }
  {
    const U = [['P', 5.1], ['P', 5.5], ['P', 4.9], ['Q', 6.2], ['Q', 6.8], ['R', 5.0], ['R', 5.3], ['R', 5.6], ['R', 4.8]].map(([trt, y]) => ({ trt, y }));
    const r = analyse(U, 'crd');
    check('yield anova: unbalanced CRD = statsmodels', near(r.rows[0].ss, 2.7458333333333327, 1e-10) && near(r.rows[1].ss, 0.7341666666666661, 1e-10) && rel(r.rows[0].p, 0.009389581918459745, 1e-6) && r.lsd === null);
    // P vs Q: difference 1.3 > per-pair LSD 0.78136 (scipy), so they differ; P vs R do not.
    check('yield anova: unbalanced CRD per-pair LSD letters', r.sig[0][1] && !r.sig[0][2] && r.means.map((m) => m.letters).join(' ') === 'b a b' && near(r.tq * Math.sqrt(r.mse * (1 / 3 + 1 / 2)), 0.7813568202533979, 1e-9));
  }
  // Protected LSD: no separation when F is not significant.
  {
    const flat = ['A', 'B', 'C'].flatMap((t, i) => [1, 2, 3].map((b) => ({ trt: t, block: String(b), y: 5 + 0.05 * i + [0.3, -0.2, 0.1][(b + i) % 3] })));
    const r = analyse(flat, 'rcbd'), u = analyse(flat, 'rcbd', 0.05, false);
    check('yield anova: protected LSD gives one group when F is not significant', r.rows[1].p > 0.05 && !r.separated && r.means.every((m) => m.letters === 'a') && u.separated);
  }
  // Letters are a valid display: two means share a letter exactly when they are not significantly different.
  {
    let bad = 0;
    let s = 7; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let k = 0; k < 300; k++) {
      const n = 2 + (k % 9), m = Array.from({ length: n }, () => rnd() * 10);
      const sig = m.map((a) => m.map((b) => Math.abs(a - b) > 1.5 + (k % 4)));
      const L = letterGroups(m, sig);
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j && ([...L[i]].some((c) => L[j].includes(c))) === sig[i][j]) bad++;
      if (L[m.indexOf(Math.max(...m))][0] !== 'a') bad++;
    }
    check('yield anova: letters match the pairwise tests in 300 random cases', bad === 0);
  }
  // Errors for RCBD gaps and duplicates.
  {
    let e1 = '', e2 = '';
    try { analyse(obs.slice(1), 'rcbd'); } catch (x) { e1 = x.message; }
    const dup = obs.map((o) => ({ ...o })); dup[1].trt = 'Variety A'; try { analyse(dup, 'rcbd'); } catch (x) { e2 = x.message; }
    check('yield anova: missing plot and duplicate in a block are refused', e1.includes('Variety A is missing from block 1') && e2.includes('2 times in block 1'));
  }
};
