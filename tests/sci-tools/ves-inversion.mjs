// #883 VES inversion: the linear-filter forward model against (a) the exact image series for two layers and (b) direct
// numerical integration with scipy.special.j0/j1 (Gauss-Legendre between Bessel zeros, ves_check.py) for a 3- and a
// 4-layer earth, for ideal Schlumberger, finite-MN Schlumberger and Wenner; the inversion against SciPy's
// least_squares on the same made-up sounding; geometric factors.
import { kernel, polePole, schlumbergerIdeal, schlumberger, wenner, kSchlumberger, kWenner, invert, startModel, forward } from '../../src/lib/sci/ves.ts';

const EXP = {"m3_schl": [119.9165869699901, 119.35406035989881, 115.436033643665, 83.93242115950267, 44.415457004817, 40.17775243003581, 81.64784059858356, 138.88457236587044, 214.81192447111556, 315.8997567979727, 366.06442882828014], "m3_wen": [119.75380145967493, 118.17908064545378, 108.92634043856603, 65.17346258060806, 39.12519176712111, 50.39829114196014, 105.17883978007801, 171.36468930522128, 250.4579541635528, 340.5791095858312, 378.15507784342384], "m3_fin": [119.38091372231537, 115.64174633688279, 97.23079065701292, 46.35234168243977, 39.94327249967762, 66.26670095751535, 135.85431289012126, 210.89269691144972, 289.8838992872321, 363.89095949404765, 388.3439535491337], "m4_schl": [40.30375696127133, 42.18285154145138, 52.22212718771165, 93.80495493096353, 127.90152323205143, 111.57756085855, 33.27415901923998, 38.33028459208197, 74.53843297272839, 174.59030310063508, 317.1462924585543], "m4_wen": [40.863447962485466, 45.46192403079644, 63.356489032921004, 110.57451362569861, 126.92023480432773, 82.43426611343686, 31.306070210676708, 52.38042803322456, 101.30585800908256, 231.7921449570771, 408.2336572213742], "m4_fin": [42.08593882157618, 51.63492065777104, 79.48033652225585, 126.22029867586822, 113.19541988355492, 49.46072098429971, 37.48793278749673, 72.5833496257205, 138.9682246844057, 309.5255615236728, 526.4282825710317], "S": [0.5, 1.0, 2.0, 5.0, 10.0, 20.0, 50.0, 100.0, 200.0, 500.0, 1000.0], "demo": [[1, 0.5, 4992.0, 100.0], [1.5, 0.5, 1832.0, 100.0], [2.2, 0.5, 789.9, 100.0], [3.2, 0.5, 339.4, 100.0], [4.6, 0.5, 138.9, 100.0], [6.8, 0.5, 45.0, 100.0], [10, 0.5, 14.05, 100.0], [15, 0.5, 5.162, 100.0], [22, 5.0, 29.47, 100.0], [32, 5.0, 18.3, 100.0], [46, 5.0, 11.59, 100.0], [68, 5.0, 7.024, 100.0], [100, 5.0, 4.342, 100.0], [150, 5.0, 2.656, 100.0], [220, 5.0, 1.493, 100.0], [300, 5.0, 0.8957, 100.0]], "inv": {"rho": [118.62904806975692, 22.632069972037325, 379.3338475548718], "h": [3.131936586677262, 10.511941280195074], "rms": 0.017569156876727852}, "obs": [117.62122895040186, 115.10795482753001, 113.90287130153952, 106.51902900817475, 91.2443856149354, 65.01683076236755, 44.029028340979245, 36.44748562192407, 42.495475595092664, 57.433654415132516, 76.13552406602601, 101.48404872774886, 136.06693313632164, 187.5329752263277, 226.89799511378754, 253.18286047033845]};
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const rel = (a, b, tol) => Math.abs(a / b - 1) <= tol;
// Exact two-layer image series (k = (ρ2 − ρ1)/(ρ2 + ρ1), top thickness h).
const img = (s, r1, k, h, kind) => { let t = 1; for (let n = 1; n < 5000; n++) { const kn = k ** n; if (Math.abs(kn) < 1e-16) break; t += 2 * kn * (kind === 'J0' ? s / Math.hypot(s, 2 * n * h) : s ** 3 / Math.hypot(s, 2 * n * h) ** 3); } return r1 * t; };

export default async (check) => {
  const S = EXP.S, m3 = { rho: [120, 25, 400], h: [3, 12] }, m4 = { rho: [40, 300, 8, 1500], h: [1.5, 6, 20] };
  for (const [nm, m] of [['m3', m3], ['m4', m4]]) {
    check(`ves: ${nm} ideal Schlumberger matches SciPy j1 integration (1e-6)`, S.every((s, i) => rel(schlumbergerIdeal(s, m), EXP[nm + '_schl'][i], 1e-6)));
    check(`ves: ${nm} Wenner matches SciPy j0 integration (1e-4)`, S.every((s, i) => rel(wenner(s, m), EXP[nm + '_wen'][i], 1e-4)));
    check(`ves: ${nm} finite-MN Schlumberger matches SciPy (1e-4)`, S.every((s, i) => rel(schlumberger(2 * s, 0.4 * s, m), EXP[nm + '_fin'][i], 1e-4)));
  }
  let worst = 0;
  for (const k of [0.99, 0.9, 0.5, -0.5, -0.9, -0.99]) {
    const r2 = (10 * (1 + k)) / (1 - k), m = { rho: [10, r2], h: [1] };
    for (const s of [0.1, 0.3, 1, 3, 10, 30, 100, 1000, 1e4]) { worst = Math.max(worst, Math.abs(schlumbergerIdeal(s, m) / img(s, 10, k, 1, 'J1') - 1), Math.abs(polePole(s, m) / img(s, 10, k, 1, 'J0') - 1)); }
  }
  check(`ves: two-layer curves match the exact image series (worst ${worst.toExponential(1)}, limit 2e-6)`, worst < 2e-6);
  check('ves: uniform ground reads its own resistivity on every array', [0.5, 7, 300].every((s) => rel(schlumbergerIdeal(s, { rho: [55], h: [] }), 55, 1e-9) && rel(wenner(s, { rho: [55], h: [] }), 55, 1e-8) && rel(schlumberger(s, s / 10, { rho: [55, 55], h: [4] }), 55, 1e-7)));
  check('ves: kernel limits (top layer at high λ, half-space at low λ)', rel(kernel(1e4, m3), 120, 1e-12) && rel(kernel(1e-7, m3), 400, 1e-4));
  check('ves: curve ends approach the top and bottom resistivities', rel(schlumbergerIdeal(0.01, m3), 120, 1e-4) && rel(schlumbergerIdeal(1e5, m3), 400, 2e-3));
  check('ves: geometric factors', near(kSchlumberger(10, 1), (Math.PI * 99) / 2, 1e-12) && near(kWenner(5), 10 * Math.PI, 1e-12));
  // Inversion against SciPy least_squares (3 layers, log parameters).
  const data = EXP.demo.map(([L, l, dv, I]) => ({ s: L, l, rhoa: (kSchlumberger(L, l) * dv) / I }));
  check('ves: apparent resistivities from ΔV and I match the SciPy script', data.every((d, i) => rel(d.rhoa, EXP.obs[i], 1e-12)));
  const r = invert('schlumberger', data, startModel(data, 3));
  check('ves: inversion matches SciPy least_squares (1e-4)', r.model.rho.every((v, i) => rel(v, EXP.inv.rho[i], 1e-4)) && r.model.h.every((v, i) => rel(v, EXP.inv.h[i], 1e-4)) && rel(r.rms, EXP.inv.rms, 1e-5));
  const r2 = invert('schlumberger', data, { rho: [100, 30, 300], h: [2, 10] });
  check('ves: same answer from another starting model', r2.model.rho.every((v, i) => rel(v, r.model.rho[i], 1e-4)));
  // Noise-free Wenner data are fitted exactly.
  const tw = { rho: [300, 50, 2000, 20], h: [2, 5, 15] }, wd = [1, 1.5, 2, 3, 4.5, 6, 9, 13, 20, 30, 45, 65, 100, 150, 200].map((a) => ({ s: a, rhoa: wenner(a, tw) }));
  const rw = invert('wenner', wd, startModel(wd, 4));
  check(`ves: noise-free 4-layer Wenner sounding fitted to 1e-5 (rms ${rw.rms.toExponential(1)})`, rw.rms < 1e-5 && forward('wenner', wd[3], rw.model) > 0);
  { let e = ''; try { invert('wenner', wd.slice(0, 5), startModel(wd, 3)); } catch (er) { e = er.message; } check('ves: too few readings for the layers refused', e.includes('Need at least 6 readings')); }
};
