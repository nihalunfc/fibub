// #911 capacitor and inductor calculator: formulas checked against SciPy numerical integration of the field
// (toroids), a Neumann-integral check of Nagaoka's coefficient, image-charge forms and textbook limits.
import * as K from '../../src/lib/sci/ph-capind.ts';

export default async (check) => {
  const rel = (a, b, t = 1e-10) => Math.abs(a - b) <= t * Math.abs(b);
  check('capind: ε0 CODATA 2022', K.EPS0 === 8.8541878188e-12);
  check('capind: 100 cm² plates 1 mm apart = 88.54 pF', rel(K.plates(0.01, [{ d: 1e-3, er: 1 }]), 8.8541878188e-11));
  check('capind: two dielectric layers in series (SciPy)', rel(K.plates(0.01, [{ d: 0.5e-3, er: 4.4 }, { d: 0.5e-3, er: 1 }]), 1.4429046815822224e-10));
  { const E = K.plateFields(0.01, [{ d: 0.5e-3, er: 4.4 }, { d: 0.5e-3, er: 1 }], 100);
    check('capind: layer fields add up to V and scale as 1/εr', rel(E[0] * 0.5e-3 + E[1] * 0.5e-3, 100, 1e-12) && rel(E[1] / E[0], 4.4, 1e-12)); }
  check('capind: coax C, L and Z0 match SciPy (47.32 Ω)', rel(K.coaxC(0.45e-3, 1.47e-3, 2.25), 1.0574108235969274e-10, 1e-12) && rel(K.coaxL(0.45e-3, 1.47e-3, 1), 2.3675401937042404e-07, 1e-12) && rel(K.line(K.coaxL(0.45e-3, 1.47e-3, 1), K.coaxC(0.45e-3, 1.47e-3, 2.25)).z0, 47.318046272264446, 1e-9));
  check('capind: TEM line speed c/√εr', rel(K.line(K.coaxL(1e-3, 3e-3, 1), K.coaxC(1e-3, 3e-3, 4)).v, 299792458 / 2, 1e-9));
  check('capind: twin-wire C equals the image line-charge form π ε / ln((D/2 + s)/a)', (() => { const a = 0.5e-3, D = 3e-3, s = Math.sqrt((D / 2) ** 2 - a * a); return rel(K.twinC(a, D, 1), (Math.PI * K.EPS0) / Math.log((D / 2 + s) / a), 1e-12); })());
  check('capind: wire over plane C equals the image form 2π ε / ln((h + √(h²−a²))/a)', (() => { const a = 0.5e-3, h = 2e-3; return rel(K.planeC(a, h, 2), (2 * Math.PI * K.EPS0 * 2) / Math.log((h + Math.sqrt(h * h - a * a)) / a), 1e-12); })());
  check('capind: twin wire L·C = μ0 ε0 εr', rel(K.twinL(1e-3, 1e-2, 1) * K.twinC(1e-3, 1e-2, 3), K.MU0 * K.EPS0 * 3, 1e-12));
  check('capind: isolated sphere of 10 cm is 11.1 pF', rel(K.spheres(0.1, Infinity, 1), 4 * Math.PI * K.EPS0 * 0.1, 1e-12) && Math.abs(K.spheres(0.1, Infinity, 1) - 11.13e-12) < 0.01e-12);
  check('capind: close spheres approach parallel plates', rel(K.spheres(0.1, 0.1001, 1), K.EPS0 * 4 * Math.PI * 0.1 * 0.1001 / 1e-4, 1e-12) && rel(K.spheres(1, 1.0001, 1), K.plates(4 * Math.PI, [{ d: 1e-4, er: 1 }]), 2e-4));
  // Nagaoka's coefficient: SciPy ellipk/ellipe values, and a Neumann double integral of loop mutual inductances (0.68839 for l = D).
  for (const [r, want] of [[0.1, 0.20332351752191274], [0.5, 0.5255100242519276], [1, 0.6884226073203766], [2, 0.8181357519347034], [10, 0.9588071242037182]]) check(`capind: Nagaoka coefficient for l/D = ${r}`, rel(K.nagaoka(1, r), want, 1e-12));
  check('capind: Nagaoka agrees with the Neumann integral (current sheet)', Math.abs(K.nagaoka(1, 1) - 0.6883886482914946) < 1e-4);
  check('capind: long solenoid μ0 N² A / l', rel(K.solenoid(1000, 0.01, 1, 1, false), K.MU0 * 1e6 * Math.PI * 2.5e-5, 1e-12) && K.solenoid(1000, 0.01, 1, 1, true) / K.solenoid(1000, 0.01, 1, 1, false) > 0.99);
  check('capind: round toroid matches SciPy flux integral (86.24 µH)', rel(K.toroidRound(200, 0.03, 0.01, 1), 8.624193350103598e-05, 1e-9));
  check('capind: rectangular toroid matches SciPy flux integral (55.45 µH)', rel(K.toroidRect(200, 0.02, 0.04, 0.01, 1), 5.545177443747417e-05, 1e-9));
  check('capind: thin round toroid approaches μ0 N² A / (2πR)', rel(K.toroidRound(100, 1, 0.001, 1), (K.MU0 * 1e4 * Math.PI * 1e-6) / (2 * Math.PI), 1e-6));
  check('capind: internal inductance μ0/8π = 50 nH/m', Math.abs(K.internalL - 5e-8) < 1e-15);
};
