// #T89 Equilibrium solver: the worked numbers from the blog article
// src/blog/discoveries/co2-to-methanol-membrane-microchannel-beating-equilibrium-conversion.md
// (CO2 hydrogenation to methanol at 220 C / 30 bar and 250 C / 50 bar with a 3:1 H2:CO2 feed; Ullah et al. 2026,
// Membranes 16(1): 45, CC BY 4.0). Kp from CRC formation data, moved in temperature by van 't Hoff.
import * as E from '../../src/lib/sci/equilibrium.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const dH = (-201.0 - 241.83 + 393.51) * 1000, dG = (-162.3 - 228.57 + 394.36) * 1000;
  const K298 = Math.exp(-dG / (8.314462618 * 298.15));
  check('equilibrium: methanol synthesis Kp = 0.2446687 bar^-2 at 25 C from dG = +3.49 kJ/mol', near(K298, 0.2446687, 1e-7));
  const K493 = E.kAtT(K298, 298.15, 493.15, dH), K523 = E.kAtT(K298, 298.15, 523.15, dH);
  check('equilibrium: van \'t Hoff with dH = -49.32 kJ/mol gives Kp = 9.375186e-5 at 220 C and 4.703446e-5 at 250 C', near(K493, 9.375186e-5, 1e-11) && near(K523, 4.703446e-5, 1e-11));

  const terms = E.parseReaction('CO2(g) + 3H2(g) ⇌ CH3OH(g) + H2O(g)');
  const closed = E.solveIce(terms, [7.5, 22.5, 0, 0], K493);
  check('equilibrium: a closed vessel started at 30 bar (3:1) converts 22.6035 % and falls to 26.6095 bar', near(closed.conversion, 22.60350, 1e-5) && near(closed.eq.reduce((a, b) => a + b, 0), 26.60947, 1e-5));
  // Constant total pressure: rescale the feed until the equilibrium total is the working pressure (the tool's volume control).
  const atP = (K, p) => { let s = 1, last; for (let i = 0; i < 60; i++) { const r = E.solveIce(terms, [(p / 4) * s, ((3 * p) / 4) * s, 0, 0], K); const tot = r.eq.reduce((a, b) => a + b, 0); last = { x: r.conversion, ratio: 1 / s, tot }; if (Math.abs(tot - p) < 1e-13) break; s *= p / tot; } return last; };
  const a30 = atP(K493, 30), a50 = atP(K523, 50);
  check('equilibrium: at constant pressure it converts 24.50799 % (220 C, 30 bar, squeeze 0.87746)', near(a30.x, 24.50799, 1e-5) && near(a30.ratio, 0.877460, 1e-6));
  check('equilibrium: and 27.27806 % at 250 C and 50 bar, the figure the paper quotes as 27 %', near(a50.x, 27.27806, 1e-5) && near(a50.ratio, 0.863610, 1e-6));

  const rwgs = E.parseReaction('CO2(g) + H2(g) ⇌ CO(g) + H2O(g)');
  const dHr = (-110.53 - 241.83 + 393.51) * 1000, dGr = (-137.17 - 228.57 + 394.36) * 1000;
  const Kr = E.kAtT(Math.exp(-dGr / (8.314462618 * 298.15)), 298.15, 493.15, dHr);
  check('equilibrium: the reverse water-gas shift at 220 C has Kp = 6.864709e-3 and converts 13.0839 % of a 3:1 feed', near(Kr, 6.864709e-3, 1e-9) && near(E.solveIce(rwgs, [1, 3, 0, 0], Kr).conversion, 13.08394, 1e-5));

  // Water removal: the water partial pressure that leaves 42.3 % conversion at equilibrium at 30 bar.
  const x = 0.423, q = (w) => { const n = [1 - x, 3 - 3 * x, x, w], tot = n.reduce((a, b) => a + b, 0); return E.quotient(terms, n.map((v) => (30 * v) / tot)) - K493; };
  let lo = 1e-12, hi = 20;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (q(m) < 0) lo = m; else hi = m; }
  const w = (lo + hi) / 2, n = [1 - x, 3 - 3 * x, x, w], tot = n.reduce((a, b) => a + b, 0);
  check('equilibrium: 42.3 % conversion at 30 bar needs the water down to 0.809929 bar, 82.086 % of it removed', near((30 * w) / tot, 0.8099289, 1e-6) && near(100 * (1 - w / x), 82.08598, 1e-5));
};
