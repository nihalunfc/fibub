// Figures for src/blog/discoveries/asteroid-4337-arecibo-binary-gaia-astrometry-kepler-mass-two-body-orbit.md, made with
// the maths of the Two-body orbit sandbox (src/lib/sci/phtwobody.ts: system, positionsAt, integrate).
// Run: node scripts/blog-figures/asteroid-4337-arecibo-binary-gaia-astrometry-kepler-mass-two-body-orbit.mjs
import fs from 'node:fs';
import { system, positionsAt, integrate, G_SI } from '../../src/lib/sci/phtwobody.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/asteroid-4337-arecibo-binary-gaia-astrometry-kepler-mass-two-body-orbit.md', import.meta.url);

// Inputs from the paper: Liu, Hestroffer, Desmars and David (2024), A&A 688: L23, doi:10.1051/0004-6361/202450586 (CC BY 4.0), Table 1:
// semi-major axis 46.8 km (+1.8, -2.0), eccentricity 0.06 +/- 0.04, period 32.9741 +/- 0.0004 h, total mass 4.3 +/- 0.5 x 10^15 kg,
// primary 4.1 and secondary 0.2 x 10^15 kg, mass ratio 0.05, diameters 18.7 and 6.2 km, densities 1200 and 1600 kg/m3.
const A_KM = 46.8, A_LO = 46.8 - 2.0, A_HI = 46.8 + 1.8, E = 0.06, T_H = 32.9741, T_ERR = 0.0004;
const M_PAPER = 4.3e15, M1 = 4.1e15, M2 = 0.2e15, D1 = 18.7e3, D2 = 6.2e3;
const T_S = T_H * 3600;

// Kepler's third law inverted for the system mass (the relation the tool's period output obeys).
const massFrom = (aKm, tS) => (4 * Math.PI ** 2 * (aKm * 1e3) ** 3) / (G_SI * tS * tS);
const M_KEPLER = massFrom(A_KM, T_S);

// Put the paper's two masses (OUR split: 4.1 and 0.2) at periapsis of an ellipse with the paper's a and e, then let the
// tool read back the period, semi-major axis and eccentricity. Body 1 is the primary.
const mk = (m1, m2, aKm, e) => {
  const mu = G_SI * (m1 + m2), a = aKm * 1e3, rp = a * (1 - e), vp = Math.sqrt(mu * (1 + e) / rp);
  return [{ m: m1, p: [0, 0], v: [0, 0] }, { m: m2, p: [rp, 0], v: [0, vp] }];
};
const [b1, b2] = mk(M1, M2, A_KM, E);
const sys = system(b1, b2);
const sysK = (() => { const m = M_KEPLER, [x, y] = mk(m * 4.1 / 4.3, m * 0.2 / 4.3, A_KM, E); return system(x, y); })();

// Wobble: how far each body sits from the centre of mass.
const aM = A_KM * 1e3, rPrim = aM * M2 / (M1 + M2) / 1e3, rSec = aM * M1 / (M1 + M2) / 1e3;
const tt = Array.from({ length: 97 }, (_, i) => (i / 96) * T_S);
const pos = tt.map((t) => positionsAt(b1, b2, t));
const sepKm = pos.map((p) => Math.hypot(p.r[0], p.r[1]) / 1e3);
const x1 = pos.map((p) => p.p1[0] / 1e3), y1 = pos.map((p) => p.p1[1] / 1e3);
const hrs = tt.map((t) => t / 3600);
const dist1 = pos.map((p) => Math.hypot(p.p1[0], p.p1[1]) / 1e3);
const dist2 = pos.map((p) => Math.hypot(p.p2[0], p.p2[1]) / 1e3);

// One full period: back to the start; direct RK4 of both bodies agrees and conserves E and L.
const back = positionsAt(b1, b2, sys.el.T);
const num = integrate(b1, b2, sys.el.T, 4000);
const closure = Math.hypot(back.r[0] - sys.r[0], back.r[1] - sys.r[1]) / Math.hypot(sys.r[0], sys.r[1]);

// Sensitivity: mass against the semi-major axis at the paper's period (M goes as a^3), and against the period (M goes as T^-2).
const aa = Array.from({ length: 41 }, (_, i) => 44 + i * 0.125);
const MA = aa.map((a) => +(massFrom(a, T_S) / 1e15).toFixed(3));
const mLo = massFrom(A_LO, T_S) / 1e15, mHi = massFrom(A_HI, T_S) / 1e15;
const mT = [massFrom(A_KM, (T_H + T_ERR) * 3600) / 1e15, massFrom(A_KM, (T_H - T_ERR) * 3600) / 1e15];

// Densities from masses and the paper's diameters (spheres).
const rho = (m, D) => m / ((Math.PI / 6) * D ** 3);
// Escape speed from the primary's surface and orbital speed of the secondary.
const vesc = Math.sqrt(2 * G_SI * M1 / (D1 / 2));
const vorb = 2 * Math.PI * aM / T_S;
const vsec = vorb * M1 / (M1 + M2); // speed of the secondary about the centre of mass
const vprim = vorb * M2 / (M1 + M2);

const out = {
  Mkepler: M_KEPLER, mLo, mHi, mT, tool: { T_h: sys.el.T / 3600, a_km: sys.el.a / 1e3, e: sys.el.e, rp: sys.el.rp / 1e3, ra: sys.el.ra / 1e3, M: sys.M, mu: sys.mu, vesc: sys.el.vesc },
  toolK: { T_h: sysK.el.T / 3600, a_km: sysK.el.a / 1e3 },
  rPrim, rSec, sepMin: Math.min(...sepKm), sepMax: Math.max(...sepKm), closure, rk4: { dE: num.dE, dL: num.dL, steps: num.steps },
  rho1: rho(M1, D1), rho2: rho(M2, D2), vesc, vorb, vsec, vprim, a3: Math.cbrt(G_SI * M_PAPER * T_S ** 2 / (4 * Math.PI ** 2)) / 1e3,
  T_from_paper_M: 2 * Math.PI * Math.sqrt(aM ** 3 / (G_SI * M_PAPER)) / 3600,
  Tspread: [2 * Math.PI * Math.sqrt((A_LO * 1e3) ** 3 / (G_SI * M_PAPER)) / 3600, 2 * Math.PI * Math.sqrt((A_HI * 1e3) ** 3 / (G_SI * M_PAPER)) / 3600],
  aRange: [Math.cbrt(G_SI * 3.8e15 * T_S ** 2 / (4 * Math.PI ** 2)) / 1e3, Math.cbrt(G_SI * 4.8e15 * T_S ** 2 / (4 * Math.PI ** 2)) / 1e3],
  ampl1: [Math.min(...dist1), Math.max(...dist1)], ampl2: [Math.min(...dist2), Math.max(...dist2)],
};
console.log(JSON.stringify(out, null, 1));

const fig1 = chart({
  title: 'The mass behind the orbit', xLabel: 'Semi-major axis (km)', yLabel: 'System mass (10¹⁵ kg)',
  series: [{ name: 'Kepler mass at T = 32.9741 h', kind: 'line', x: aa, y: MA }],
  xDomain: [44, 49], yDomain: [3, 5.2],
  vlines: [{ x: A_LO, text: '44.8', left: true }, { x: A_KM, text: '46.8' }, { x: A_HI, text: '48.6' }],
  hlines: [{ y: 4.3, text: 'paper 4.3' }],
  desc: `Kepler's third law: the mass of the Arecibo system against the assumed semi-major axis at the published period. At 46.8 km it is ${(M_KEPLER / 1e15).toFixed(2)} times ten to the fifteen kilograms; the paper's size range 44.8 to 48.6 km gives ${mLo.toFixed(2)} to ${mHi.toFixed(2)}.`, height: 270,
});
const fig2 = chart({
  title: 'How far each body sits from the balance point', xLabel: 'Time through one orbit (hours)', yLabel: 'Distance from centre of mass (km)',
  series: [{ name: 'Secondary (6.2 km)', kind: 'line', x: hrs, y: dist2 }, { name: 'Primary (18.7 km)', kind: 'line', x: hrs, y: dist1 }],
  xDomain: [0, T_H], yDomain: [0, 52],
  desc: `Distance of each body from the system's centre of mass over one 32.97-hour orbit. The secondary stays near ${rSec.toFixed(1)} km out; the primary stays within about ${rPrim.toFixed(1)} km of the centre of mass.`, height: 270,
});
const fig3 = chart({
  title: 'The primary’s own small circle', xLabel: 'Time through one orbit (hours)', yLabel: 'Primary offset (km)',
  series: [{ name: 'x', kind: 'line', x: hrs, y: x1 }, { name: 'y', kind: 'line', x: hrs, y: y1 }],
  xDomain: [0, T_H], yDomain: [-3, 3], hlines: [{ y: 0, text: '' }],
  desc: `Position of the primary relative to the centre of mass, along two perpendicular axes, over one orbit. Both swing by about ${rPrim.toFixed(1)} km, which is the wobble the Gaia astrometry looks for.`, height: 260,
});
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'mass', figure(fig1, 'Figure 1. The system mass that Kepler\'s third law gives at the paper\'s period for each semi-major axis. Dashed lines mark the paper\'s 46.8 km and its error range; the horizontal line is the paper\'s own mass.'));
  md = inject(md, 'dist', figure(fig2, 'Figure 2. How far each body stays from the centre of mass during one orbit, from the two-body tool\'s exact solution for the paper\'s orbit with our split of the mass (4.1 and 0.2 × 10¹⁵ kg).'));
  md = inject(md, 'wobble', figure(fig3, 'Figure 3. The primary\'s position relative to the centre of mass along two perpendicular directions over one orbit. This is the small circle that a precise astrometric survey tries to see.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2, fig3].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
