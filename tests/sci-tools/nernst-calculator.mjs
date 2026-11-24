// Nernst calculator: the slope per decade and its temperature dependence, copper electrode potentials and the
// apparent slope of a concentration calibration once activity coefficients are applied. Used in
// src/blog/discoveries/solid-contact-copper-ion-selective-electrode-nernstian-slope.md (paper: Eid et al. 2025,
// BMC Chemistry 20, doi:10.1186/s13065-025-01692-y, CC BY 4.0).
import { thermalV, halfE, half, convertRef, qFromE } from '../../src/lib/sci/nernst.ts';
import { logGamma } from '../../src/lib/sci/buffer.ts';

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const slope = (T, z = 2) => (thermalV(T) * Math.LN10 * 1000) / z;

  check('nernst: divalent slope is 29.5797 mV/decade at 25 °C', near(slope(298.15), 29.5797, 5e-4) && near(slope(298.15, 1), 59.159, 1e-3));
  check('nernst: the slope rises by 0.0992 mV/decade per °C', near((slope(303.15) - slope(293.15)) / 10, 0.0992, 5e-4));
  check('nernst: 28.05 mV/decade would need about 9.6 °C', near((298.15 * 28.05) / slope(298.15) - 273.15, 9.6, 0.05));

  const CU = half('Cu2');
  check('nernst: Cu²⁺/Cu electrode over six decades', near(halfE(CU, { 'Cu^2+': 1e-2 }), 0.2827, 5e-5) && near(halfE(CU, { 'Cu^2+': 1e-8 }), 0.1053, 5e-5));
  check('nernst: that span is 177.5 mV', near(1000 * (halfE(CU, { 'Cu^2+': 1e-2 }) - halfE(CU, { 'Cu^2+': 1e-8 })), 177.48, 0.05));
  check('nernst: +0.2827 V vs SHE is +0.0857 V vs Ag/AgCl', near(convertRef(0.2827, 'SHE', 'AgClsat'), 0.0857, 1e-9) && near(convertRef(0.2827, 'SHE', 'SCE'), 0.0417, 1e-9));
  check('nernst: ln Q from a measured potential gives back 10⁵', near(Math.exp(qFromE(CU.E, halfE(CU, { 'Cu^2+': 1e-5 }), 2)) / 1e5, 1, 1e-6));

  // A concentration calibration of a perfect electrode, with CuCl₂ activity coefficients (I = 3c).
  const lg = Array.from({ length: 61 }, (_, i) => -8 + (i * 6) / 60);
  const ys = lg.map((x) => 1000 * halfE(CU, { 'Cu^2+': 10 ** x * 10 ** logGamma(2, 3 * 10 ** x, 25) }));
  const n = lg.length, sx = lg.reduce((a, b) => a + b, 0), sy = ys.reduce((a, b) => a + b, 0);
  const sxy = lg.reduce((a, x, i) => a + x * ys[i], 0), sxx = lg.reduce((a, x) => a + x * x, 0);
  check('nernst: a concentration calibration looks like 28.62 mV/decade', near((n * sxy - sx * sy) / (n * sxx - sx * sx), 28.62, 0.01));
  check('nernst: Cu²⁺ activity coefficient is 0.522 at 10⁻² mol/L', near(10 ** logGamma(2, 3e-2, 25), 0.5224, 5e-4));
};
