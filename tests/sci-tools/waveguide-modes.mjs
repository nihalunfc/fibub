// #913 waveguide modes: Bessel functions and zeros against SciPy (jv, jn_zeros, jnp_zeros), wall loss against a
// numerical power-loss integration of the TE10 and TE11 fields (SciPy quad), and textbook propagation identities.
import * as W from '../../src/lib/sci/ph-waveguide.ts';

export default async (check) => {
  const rel = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.abs(b);
  check('waveguide: J0(2.5), J3(10.7), J7(30.2) match SciPy', rel(W.besselJ(0, 2.5), -0.04838377646819792, 1e-10) && rel(W.besselJ(3, 10.7), 0.19475992595636618, 1e-10) && rel(W.besselJ(7, 30.2), 0.13670637320765783, 1e-10));
  const jz = [[2.4048255576957724, 5.520078110286311, 8.653727912911013], [3.8317059702075125, 7.015586669815619, 10.173468135062722], [5.135622301840683, 8.417244140399866, 11.61984117214906]];
  const jpz = [[3.8317059702075125, 7.015586669815619, 10.173468135062722], [1.8411837813406595, 5.3314427735250325, 8.536316366346286], [3.0542369282271404, 6.706133194158459, 9.969467823087596]];
  for (let n = 0; n < 3; n++) {
    check(`waveguide: zeros of J${n} match SciPy jn_zeros`, W.jZeros(n, 3).every((z, i) => rel(z, jz[n][i], 1e-11)));
    check(`waveguide: zeros of J${n}' match SciPy jnp_zeros`, W.jpZeros(n, 3).every((z, i) => rel(z, jpz[n][i], 1e-11)));
  }
  // Rectangular 22.86 × 10.16 mm, air: TE10 at 6.557 GHz, then TE20 (13.11), TE01 (14.75).
  { const M = W.rectModes(22.86e-3, 10.16e-3, 1, 20e9);
    check('waveguide: rectangular TE10 cutoff c/2a', M[0].name === 'TE10' && rel(M[0].fc, 299792458 / (2 * 22.86e-3), 1e-12));
    check('waveguide: rectangular mode order TE10, TE20, TE01, TE11/TM11', M.slice(0, 5).map((m) => m.name).join(',') === 'TE10,TE20,TE01,TE11,TM11' && rel(M[3].fc, 299792458 / 2 * Math.hypot(1 / 22.86e-3, 1 / 10.16e-3), 1e-12)); }
  check('waveguide: dielectric filling lowers cutoffs by √εr', rel(W.rectModes(0.02, 0.01, 4, 1e11)[0].fc, 299792458 / (2 * 0.02) / 2, 1e-12));
  // Circular radius 10 mm: TE11 first (1.8412), then TM01 (2.4048), TE21, TE01 = TM11.
  { const M = W.circModes(0.01, 1, 30e9);
    check('waveguide: a guide just above TE11 lists only TE11', W.circModes(0.01, 1, 299792458 * 1.9 / (2 * Math.PI * 0.01)).map((m) => m.name).join(',') === 'TE11');
    check('waveguide: circular mode order TE11, TM01, TE21, TE01/TM11', M.slice(0, 5).map((m) => m.name).join(',').startsWith('TE11,TM01,TE21,') && M.slice(3, 5).map((m) => m.name).sort().join(',') === 'TE01,TM11');
    check('waveguide: circular TE11 cutoff 1.8412 c/(2πR) = 8.79 GHz', rel(M[0].fc, (299792458 * 1.8411837813406595) / (2 * Math.PI * 0.01), 1e-11)); }
  // Propagation identities: vp vg = v², λg = λ / √(1 − (fc/f)²), Z_TE Z_TM = η².
  { const md = W.rectModes(22.86e-3, 10.16e-3, 1, 20e9)[0], p = W.propagate(md, 10e9, 1);
    check('waveguide: vp × vg = c²', rel(p.vp * p.vg, 299792458 ** 2, 1e-12));
    check('waveguide: guide wavelength λ/√(1 − (fc/f)²)', rel(p.lg, (299792458 / 10e9) / Math.sqrt(1 - (md.fc / 10e9) ** 2), 1e-12));
    const tm = W.propagate({ ...md, kind: 'TM' }, 10e9, 1);
    check('waveguide: Z_TE × Z_TM = η²', rel(p.z * tm.z, p.eta * p.eta, 1e-12));
    const ev = W.propagate(W.rectModes(22.86e-3, 10.16e-3, 1, 20e9)[1], 10e9, 1);
    check('waveguide: evanescent mode decays at √(kc² − k²)', !ev.on && rel(ev.alpha, Math.sqrt((2 * Math.PI / 22.86e-3) ** 2 - (2 * Math.PI * 10e9 / 299792458) ** 2), 1e-6)); }
  // Wall loss, copper ρ = 1.72e-8 Ω m at 10 GHz.
  { const Rs = Math.sqrt((2 * Math.PI * 10e9 * 1.25663706127e-6 * 1.72e-8) / 2);
    check('waveguide: TE10 wall loss matches the numerical power-loss integral (0.1083 dB/m)', rel(W.rectTE10Loss(22.86e-3, 10.16e-3, 10e9, 1, Rs), 0.01246334003851325, 1e-6));
    const te11 = W.circModes(0.01, 1, 20e9)[0];
    check('waveguide: circular TE11 wall loss matches the numerical integral', rel(W.circLoss(te11, 0.01, 10e9, 1, Rs), 0.017231162953686225, 1e-6));
    const te01 = W.circModes(0.01, 1, 40e9).find((m) => m.name === 'TE01');
    check('waveguide: circular TE01 loss falls with frequency', W.circLoss(te01, 0.01, 40e9, 1, Rs * 2) < W.circLoss(te01, 0.01, 25e9, 1, Rs * Math.sqrt(2.5))); }
};
