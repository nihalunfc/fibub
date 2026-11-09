// #493 herd immunity: threshold, coverage and effective R against Python (formulas and the early growth rate of an
// SIR model solved with scipy solve_ivp, which gives R = 1 + r/γ independently of the formula).
import { threshold, coverageNeeded, effectiveR, maxR0, table, parseRows } from '../../src/lib/sci/herd.ts';
import { simulate } from '../../src/lib/sci/epidemic.ts';

export default async (check) => {
  const close = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const ref = [
    [1.5, 0.9, 0.5, 0.3333333333, 0.3703703704, 0.825],
    [3, 0.8, 0.7, 0.6666666667, 0.8333333333, 1.32],
    [6, 0.95, 0.9, 0.8333333333, 0.8771929825, 0.87],
    [15, 0.97, 0.95, 0.9333333333, 0.9621993127, 1.1775],
    [2.2, 0.6, 0.5, 0.5454545455, 0.9090909091, 1.54],
    [17.037648, 0.764413, 0.871635, 0.9413064526, 1.2314108376, 5.6856484177],
    [9.741436, 0.625892, 0.543941, 0.8973457301, 1.4337069816, 6.4249804758],
  ];
  for (const [R0, E, c, hit, vc, Re] of ref) {
    check(`herd: R0 ${R0}, E ${E}, coverage ${c} matches Python and the SIR growth rate`, close(threshold(R0), hit, 1e-9) && close(coverageNeeded(R0, E), vc, 1e-9) && close(effectiveR(R0, c, E), Re, 2e-6));
  }
  check('herd: no threshold at R0 ≤ 1', threshold(0.9) === 0 && threshold(1) === 0 && coverageNeeded(0.8, 0.9) === 0);
  check('herd: max R0 held below 1', close(maxR0(0.9, 0.9), 1 / 0.19, 1e-12) && maxR0(1, 1) === Infinity && close(effectiveR(maxR0(0.7, 0.8), 0.7, 0.8), 1, 1e-12));
  { const t = table([{ name: 'A', R0: 3 }, { name: 'B', R0: 15 }], 0.9, 0.9);
    check('herd: table flags', t[0].reachable && t[0].below && !t[1].reachable && !t[1].below && close(t[1].need, (1 - 1 / 15) / 0.9)); }
  // Consistency with the epidemic model: at exactly the needed coverage the outbreak cannot grow; just below it, it can.
  { const R0 = 4, E = 0.9, c = coverageNeeded(R0, E), base = { model: 'SIR', N: 1e6, R0, latent: 1, infectious: 5, I0: 1, days: 60 };
    const at = simulate({ ...base, vacc: c * E }), below = simulate({ ...base, vacc: (c - 0.05) * E });
    check('herd: epidemic model agrees (no growth at the coverage, growth below it)', at.I.every((v, i) => i === 0 || v <= at.I[i - 1] + 1e-9) && below.peakDay > 1); }
  { const a = parseRows('Example A, 1.5\nExample B 3\n# note\n6\nExample D: 15'), b = parseRows('Bad, -2'), c = parseRows('no number');
    check('herd: row parsing', !a.error && a.rows.length === 4 && a.rows[1].name === 'Example B' && a.rows[1].R0 === 3 && a.rows[2].name === 'Row 3' && a.rows[3].name === 'Example D' && a.rows[3].R0 === 15 && b.error && c.error); }
};
