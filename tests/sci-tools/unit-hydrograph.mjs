// #T149 Unit hydrograph builder: the gamma (SCS-type) unit hydrograph and its peak rate factor, the Nash cascade,
// convolution, and the non-negative least-squares derivation of a unit hydrograph from a storm. Reference values are
// the textbook relations (645.33 / 1.33333 = 484 in US units; a one-reservoir Nash cascade decays as exp(-t/k)) and
// the volume identity that defines a unit hydrograph. The Sadia checks come from Hartawan et al. (2025), TEKNIK
// 46(3) (CC BY-SA), used in src/blog/discoveries/sadia-watershed-land-use-peak-discharge-lag-unit-hydrograph.md.
import { gammaShapeArea, prfOf, shapeFor, gammaUH, nashUH, convolve, baseflow, phiIndex, deriveUH, impliedArea } from '../../src/lib/sci/uh.ts';

const near = (a, b, tol) => Math.abs(a - b) <= tol;
const rel = (a, b, tol) => Math.abs(a - b) <= tol * Math.abs(b);

export default async (check) => {
  // Peak rate factor <-> shape.
  const m = shapeFor(484);
  check(`unit-hydrograph: a peak rate factor of 484 is shape m = 3.6969 (${m.toFixed(4)})`, near(m, 3.6969, 5e-5));
  check(`unit-hydrograph: the dimensionless area under that curve is 1.33333 (${gammaShapeArea(m).toFixed(6)})`, rel(gammaShapeArea(m), 4 / 3, 1e-5));
  check('unit-hydrograph: 645.33 / area = PRF, and shapeFor inverts prfOf', rel(prfOf(m), 484, 1e-12) && [300, 484, 600].every((p) => rel(prfOf(shapeFor(p)), p, 1e-9)));

  // The defining property: one millimetre of runoff over the catchment.
  for (const [name, u, A] of [['gamma', gammaUH(50, 4, m, 0.25), 50], ['nash', nashUH(80, 3, 1.2, 1, 0.1), 80]]) {
    const vol = u.q.reduce((s, x) => s + x, 0) * u.dt * 3600;
    check(`unit-hydrograph: the ${name} unit hydrograph holds exactly 1 mm over ${A} km2`, rel(vol, 1000 * A, 1e-9) && rel(impliedArea(u.q, u.dt), A, 1e-9));
  }
  // A one-reservoir Nash cascade is an exponential decay with time constant k.
  { const k = 2, u = nashUH(10, 1, k, 0.05, 0.05), i0 = 4, i1 = 24;
    check('unit-hydrograph: a one-reservoir Nash cascade decays as exp(-t/k)', rel(Math.log(u.q[i0] / u.q[i1]), ((i1 - i0) * 0.05) / k, 2e-3)); }

  // Convolution is linear and conserves volume.
  { const u = gammaUH(50, 4, m, 0.5), a = convolve([5, 12, 8], u.q), b = convolve([10, 24, 16], u.q);
    check('unit-hydrograph: doubling the excess rain doubles every ordinate', a.every((v, i) => rel(2 * v, b[i], 1e-12)));
    check('unit-hydrograph: the storm volume is the rain depth times the area', rel(a.reduce((s, x) => s + x, 0) * 0.5 * 3600, 25 * 1000 * 50, 1e-9)); }

  // Baseflow and the phi-index.
  { const P = [2, 8, 15, 10, 4, 1], { phi, excess } = phiIndex(P, 20);
    check(`unit-hydrograph: the phi-index leaving 20 mm of excess from 40 mm of rain is 4.33 mm/step (${phi.toFixed(2)})`, near(phi, 4.333, 0.01) && rel(excess.reduce((s, x) => s + x, 0), 20, 1e-9));
    const b = baseflow([3, 10, 40, 20, 6, 5], 'line');
    check('unit-hydrograph: the straight-line baseflow runs from the first flow to the last and never exceeds the flow', near(b[0], 3, 1e-12) && near(b[5], 5, 1e-12) && b.every((v, i) => v <= [3, 10, 40, 20, 6, 5][i] + 1e-12)); }

  // Non-negative least squares must recover a known unit hydrograph from noise-free data.
  { const u = gammaUH(60, 3, m, 1), Pe = [4, 11, 7, 2], Qd = convolve(Pe, u.q), d = deriveUH(Pe, Qd, u.q.length);
    check('unit-hydrograph: NNLS recovers a known unit hydrograph exactly from noise-free flow', u.q.every((v, i) => Math.abs(d.U[i] - v) <= 1e-6 * Math.max(1, v)) && d.nse > 1 - 1e-12); }

  // New with the Sadia article: the paper's three modelled time lags (445.15, 431.84, 429.88 minutes),
  // a one-hour rain step (Tp = D/2 + lag) and a 120 km2 catchment (our assumption, it only sets the scale).
  { const A = 120, D = 1, GA = gammaShapeArea(m);
    const lag = [445.15, 431.84, 429.88].map((v) => v / 60), Tp = lag.map((L) => D / 2 + L);
    const QP = [156.20, 164.80, 167.00], peaks = [3.1564, 3.2477, 3.2611], excess = [49.48, 50.74, 51.20];
    check('unit-hydrograph: Sadia unit hydrograph peaks are 3.1564, 3.2477 and 3.2611 m3/s per mm', Tp.every((tp, i) => near(gammaUH(A, tp, m, 0.25).peak, peaks[i], 5e-4)));
    check("unit-hydrograph: those peaks times the implied excess rain give back the paper's 156.2, 164.8 and 167.0 m3/s", Tp.every((tp, i) => near(Math.max(...convolve([excess[i]], gammaUH(A, tp, m, 0.25).q)), QP[i], 0.05)));
    check('unit-hydrograph: the implied direct runoff is 5937, 6089 and 6144 km2.mm', Tp.every((tp, i) => rel((QP[i] * 3600 * tp * GA) / 1000, [5937.4, 6088.9, 6144.0][i], 2e-4)));
    check('unit-hydrograph: with the 2015 runoff volume the shorter lags alone give 160.70 and 161.39 m3/s', [1, 2].every((i) => near((QP[0] * Tp[0]) / Tp[i], [0, 160.70, 161.39][i], 0.005))); }
};
