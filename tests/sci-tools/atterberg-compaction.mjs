// #659 Atterberg limits and compaction curve. Checked against numpy: polyfit of w on log10(N) for the flow curve,
// polyfit (degrees 2 and 3) with np.roots of the derivative for the compaction peak, and a random degree-3 fit;
// one-point LL, zero-air-voids and 5 % air-voids values against the same formulas in Python. Made-up data.
import { polyfit, ev, llFlow, llOnePoint, indices, dryDensity, airVoids, saturation, compaction } from '../../src/lib/sci/atterberg.ts';
export default async (check) => {
  const P = {"LL": 43.539897466105046, "If": 17.153855241627355, "rd": [1.715063520871143, 1.7882562277580067, 1.823734729493892, 1.7808219178082194, 1.7044500419815278], "d2": {"c": [0.6728767038208817, 0.15743330227249172, -0.005420731010734032], "rmax": 1.8159533762909996, "wopt": 14.521408824819492, "r2": 0.9878998264875161}, "d3": {"c": [0.4625512655194724, 0.20294187163095737, -0.00861019620993907, 7.256004176663974e-05], "rmax": 1.816167571339052, "wopt": 14.409715105698522, "r2": 0.9887834634392163}, "one": 41.57838511288698, "zav": [2.125984251968504, 1.7532467532467533, 1.4917127071823204], "av5": 1.6655844155844155, "rx": [15.236432494005134, 24.009273926518706, 7.883192254392675, 23.972988942744877, 11.23662904020971, 13.466528979451514, 21.554051876408835, 13.183982727383226, 15.99187375346119, 5.551182264861367, 20.070262173496133, 15.762866264385565], "ry": [1.790159333541489, 1.545944127888783, 1.7650489793534005, 1.5552295115656543, 1.809705008710734, 1.80770707595411, 1.6407292046150272, 1.8089924128510944, 1.7881950571849612, 1.7131718351146519, 1.7108228993930494, 1.8012746506345272], "rc": [1.510722732831168, 0.04578684854448364, -0.001636408462592924, -8.550511288537261e-06]};
  const close = (a, b, t = 1e-10) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const f = llFlow([34, 27, 21, 15], [41.2, 43.0, 44.9, 47.3]);
  check('atterberg-compaction: multipoint LL and flow index match numpy', close(f.LL, P.LL) && close(f.If, P.If));
  check('atterberg-compaction: one-point LL', close(llOnePoint(23, 42), P.one));
  const wc = [10.2, 12.4, 14.6, 16.8, 19.1], rho = [1.89, 2.01, 2.09, 2.08, 2.03], rd = rho.map((r, i) => dryDensity(r, wc[i]));
  check('atterberg-compaction: dry densities', rd.every((v, i) => close(v, P.rd[i], 1e-14)));
  for (const deg of [2, 3]) {
    const c = compaction(wc, rd, deg), p = P['d' + deg];
    check(`atterberg-compaction: degree ${deg} fit, peak and R² match numpy`, c.c.every((v, i) => close(v, p.c[i], 1e-8)) && close(c.rhoMax, p.rmax, 1e-10) && close(c.wOpt, p.wopt, 1e-8) && close(c.r2, p.r2, 1e-9) && c.interior);
  }
  { const r = polyfit(P.rx, P.ry, 3); check('atterberg-compaction: random cubic fit matches numpy', r.c.every((v, i) => close(v, P.rc[i], 1e-7))); }
  check('atterberg-compaction: zero-air-voids and 5 % air voids', [10, 20, 30].every((w, i) => close(airVoids(w, 2.7), P.zav[i], 1e-14)) && close(airVoids(20, 2.7, 0.05), P.av5, 1e-14));
  check('atterberg-compaction: saturation is 1 on the zero-air-voids line', close(saturation(18, airVoids(18, 2.65), 2.65), 1, 1e-12));
  { const x = indices(45, 20, 30, 25, 15); check('atterberg-compaction: indices by hand', x.PI === 25 && close(x.LI, 0.4) && close(x.CI, 0.6) && close(x.A, 1) && close(x.It, 25 / 15)); }
  check('atterberg-compaction: polynomial evaluation', ev([1, 2, 3], 2) === 17);
  { const c = compaction([10, 12, 14], [1.6, 1.7, 1.8]); check('atterberg-compaction: rising data has no interior peak', !c.interior && close(c.wOpt, 14)); }
  let threw = false; try { llFlow([25, 25], [40, 41]); } catch { threw = true; }
  check('atterberg-compaction: same blow counts refused', threw);
};
