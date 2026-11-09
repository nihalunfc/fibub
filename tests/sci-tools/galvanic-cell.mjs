// #1089 Galvanic cell builder. E°cell, ΔG° and Nernst values re-worked by hand (independent arithmetic below, with
// F = 96485.33 C/mol and RT/F at 298.15 K) for every pair of half-cells, and against textbook worked examples
// (Daniell cell 1.10 V; Mg | Mg²⁺(0.001 M) ‖ Cu²⁺(0.0001 M) | Cu about 2.68 V).
import * as G from '../../src/lib/sci/galvanic.ts';
const E = { Mg: -2.372, Al: -1.662, Zn: -0.7618, Fe: -0.447, Ni: -0.257, Sn: -0.1375, Pb: -0.1262, H2: 0, Cu2: 0.3419, Ag: 0.7996 };
const Z = { Mg: 2, Al: 3, Zn: 2, Fe: 2, Ni: 2, Sn: 2, Pb: 2, H2: 2, Cu2: 2, Ag: 1 }; // electrons per half-reaction (2H⁺ + 2e⁻ → H₂)
const IONS = { H2: 2 }; // ions in the half-reaction (2 H⁺), else 1
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
export default async (check) => {
  const RT_F = (8.314462618 * 298.15) / 96485.33212;
  let ok = true, n = 0;
  for (const a of G.CELL_IDS) for (const b of G.CELL_IDS) {
    if (a === b) continue;
    for (const [ca, cb] of [[1, 1], [0.01, 0.5], [2, 0.001]]) {
      const c = G.build(a, b, ca, cb); n++;
      const [an, cat, cAn, cCat] = E[a] < E[b] ? [a, b, ca, cb] : [b, a, cb, ca];
      const L = (Z[an] * Z[cat]) / gcd(Z[an], Z[cat]);
      // reaction: (L/Z[cat]) cathode half + (L/Z[an]) reversed anode half; ions raised to their coefficients
      const Q = cAn ** ((L / Z[an]) * (IONS[an] ?? 1)) / cCat ** ((L / Z[cat]) * (IONS[cat] ?? 1));
      const E0 = E[cat] - E[an], Ecell = E0 - (RT_F / L) * Math.log(Q);
      if (c.anode.id !== an || Math.abs(c.E0 - E0) > 1e-12 || c.n !== L || Math.abs(c.E - Ecell) > 1e-9 || Math.abs(c.dG0 - (-L * 96485.33212 * E0) / 1000) > 1e-9) { ok = false; console.log('  galvanic mismatch', a, b, ca, cb, c.E, Ecell, c.n, L); }
    }
  }
  check(`galvanic: every pair and concentration matches the hand formula (${n} cells)`, ok);
  { const c = G.build('Zn', 'Cu2', 1, 1); check('galvanic: Daniell cell 1.10 V, n = 2, ΔG° −213 kJ/mol, zinc anode', Math.abs(c.E0 - 1.10) < 0.005 && c.n === 2 && Math.round(c.dG0) === -213 && c.anode.id === 'Zn'); }
  { const c = G.build('Mg', 'Cu2', 0.001, 0.0001); check('galvanic: Mg/Cu at 0.001 and 0.0001 M is 2.68 V', Math.abs(c.E - 2.684) < 0.002); }
  { const c = G.build('Cu2', 'Ag', 1, 1); check('galvanic: Cu–Ag 0.46 V, copper anode, n = 2', Math.abs(c.E0 - 0.4577) < 1e-9 && c.anode.id === 'Cu2' && c.n === 2); }
  check('galvanic: swapping sides gives the same cell', Math.abs(G.build('Ag', 'Zn', 1, 1).E0 - G.build('Zn', 'Ag', 1, 1).E0) < 1e-12);
  check('galvanic: ions and electrodes', G.ionOf(G.halfCell('Zn')) === 'Zn^2+' && G.electrodeOf(G.halfCell('H2')) === 'Pt' && G.ionOf(G.halfCell('H2')) === 'H^+');
  let bad = 0; try { G.build('Zn', 'Zn', 1, 1); } catch { bad++; } try { G.build('Zn', 'Cu2', 0, 1); } catch { bad++; } try { G.build('Zn', 'Li', 1, 1); } catch { bad++; } check('galvanic: bad input refused', bad === 3);
};
