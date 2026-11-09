// #405 Seriation and correspondence analysis. Reference values from an independent numpy implementation (SVD of the
// standardised residuals) and scipy.stats.chi2_contingency; the 2 × 2 case is checked against φ² worked by hand.
import { parseCounts, correspondence, orderBy, brainerdRobinson, robinsonViolations, rowPercent, EXAMPLE } from '../../src/lib/sci/seriation.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const all = (a, b, t) => a.length === b.length && a.every((x, i) => near(x, b[i], t));
  const d = parseCounts(EXAMPLE), c = correspondence(d.N);
  check('seriation: example 8 sites × 6 types, 531 finds', d.rows.length === 8 && d.cols.length === 6 && c.n === 531 && !d.errors.length);
  check('seriation: example principal inertias (numpy)', all(c.inertia, [0.785168, 0.445565, 0.166016, 0.038054, 0.008198], 1e-6));
  check('seriation: example χ² 766.2332 (scipy) and total inertia = Σ inertias', near(c.chi2, 766.2332, 1e-4) && near(c.total, c.inertia.reduce((a, b) => a + b, 0), 1e-12));
  check('seriation: example row scores on axis 1 (numpy)', all(c.F.map((f) => f[0]), [-0.081113, -1.028526, 1.036663, -0.753528, 0.494427, -1.207753, 1.465512, -0.439465], 1e-6));
  check('seriation: example column scores on axis 1 (numpy)', all(c.G.map((g) => g[0]), [-1.132601, -0.726909, -0.174492, 0.458923, 1.09943, 1.472173], 1e-6));
  const ro = orderBy(c.F.map((f) => f[0]));
  check('seriation: example order Long Meadow … Quarry Pit', ro.map((i) => d.rows[i]).join(',') === 'Long Meadow,Old Ford,Brook End,Ash Row,Hill Farm,Church Field,Mill Lane,Quarry Pit');
  check('seriation: reversed order', orderBy(c.F.map((f) => f[0]), true)[0] === d.rows.indexOf('Quarry Pit'));
  // Transition formula: row standard coords = profile-weighted average of column principal coords / ... (F = Dr⁻¹ P Gs).
  { const P = rowPercent(d.N); const ok = c.F.every((f, i) => near(f[0], P[i].reduce((s, p, j) => s + (p / 100) * c.Gs[j][0], 0), 1e-9)); check('seriation: transition formula F = row profiles × Gs', ok); }
  {
    const t = correspondence([[3, 7], [9, 2]]), phi2 = (3 * 2 - 7 * 9) ** 2 / (10 * 11 * 12 * 9);
    check('seriation: 2 × 2 inertia = φ² = 0.273485 (hand), χ² 5.7432', t.inertia.length === 1 && near(t.inertia[0], phi2, 1e-12) && near(t.chi2, 5.7432, 1e-4));
    const u = correspondence([[12, 5, 0, 3], [4, 9, 2, 1], [0, 3, 15, 7], [1, 0, 6, 11], [5, 5, 5, 5]]);
    check('seriation: 5 × 4 table inertias and χ² 61.92 (numpy, scipy)', all(u.inertia, [0.456263, 0.132171, 0.03702], 1e-6) && near(u.chi2, 61.92, 1e-2));
  }
  {
    // A perfect sequence (each type rising and falling once), rows shuffled: CA must put them back.
    const seq = [[10, 5, 0, 0, 0], [6, 10, 4, 0, 0], [1, 7, 10, 3, 0], [0, 2, 8, 10, 2], [0, 0, 3, 9, 10], [0, 0, 0, 4, 12]];
    const shuf = [3, 0, 5, 2, 4, 1], N = shuf.map((i) => seq[i]), o = orderBy(correspondence(N).F.map((f) => f[0])).map((k) => shuf[k]);
    check('seriation: shuffled perfect sequence recovered', o.join('') === '012345' || o.join('') === '543210');
    const BR = brainerdRobinson(N), oo = orderBy(correspondence(N).F.map((f) => f[0]));
    check('seriation: recovered order is a Robinson matrix', robinsonViolations(BR, oo) === 0 && robinsonViolations(BR, [0, 1, 2, 3, 4, 5]) > 0);
  }
  {
    const BR = brainerdRobinson(d.N), i = d.rows.indexOf('Long Meadow'), j = d.rows.indexOf('Old Ford'), k = d.rows.indexOf('Quarry Pit');
    // Long Meadow 84.6/15.4 %; Old Ford 30/54, 20/54, 4/54: 200 − (|84.6−55.6| + |15.4−37.0| + 7.4).
    check('seriation: Brainerd-Robinson 141.88, 0 for no shared types, 200 on the diagonal', near(BR[i][j], 200 - (Math.abs(4400 / 52 - 3000 / 54) + Math.abs(800 / 52 - 2000 / 54) + 400 / 54), 1e-9) && near(BR[i][j], 141.88, 0.01) && BR[i][k] === 0 && BR[i][i] === 200);
  }
  {
    const p = parseCounts('Site,A,B,C\nX,1,2,\nY,0,0,0\nZ,3,x,1');
    check('seriation: bad count reported, blank cells are 0', p.errors.length === 1 && p.errors[0].includes('"x" under B'));
    const q = parseCounts('Site,A,B,C\nX,1,2,0\nY,0,0,0\nZ,3,1,0');
    check('seriation: empty sites and types left out with a note', q.rows.join() === 'X,Z' && q.cols.join() === 'A,B' && q.notes.length === 2);
  }
};
