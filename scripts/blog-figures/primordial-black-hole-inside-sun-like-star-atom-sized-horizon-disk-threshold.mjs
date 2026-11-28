// Figures for src/blog/discoveries/primordial-black-hole-inside-sun-like-star-atom-sized-horizon-disk-threshold.md, made
// with the maths of the Schwarzschild orbit plotter (src/lib/sci/phgr.ts): horizon and ISCO radii, and the angular
// momentum per unit mass of the innermost stable circular orbit.
// Run: node scripts/blog-figures/primordial-black-hole-inside-sun-like-star-atom-sized-horizon-disk-threshold.mjs
import fs from 'node:fs';
import { circular, M_SUN_M } from '../../src/lib/sci/phgr.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/primordial-black-hole-inside-sun-like-star-atom-sized-horizon-disk-threshold.md', import.meta.url);

// From the paper (Gottlieb, Cantiello, Norton, Van Tilburg, Kleban 2026, ApJ 1012: 157, doi:10.3847/1538-4357/aeb7e1, CC BY 4.0):
// asteroid-mass window 1e17 to 1e23 g; Bondi radius R_B = 2GM/c_s² ≈ 4e-3 cm for 1e20 g and c_s = 600 km/s (Eq. 27);
// a disk forms once the inflow's angular momentum reaches the ISCO's; final black holes ~0.01 to 1 solar masses.
const C = 299792458, MSUN_G = 1.98841e33; // m/s; grams per solar mass (IAU nominal GM☉ / CODATA G)
const GM_SUN = M_SUN_M * C * C; // m³/s², from the tool's GM☉/c²
const R_SUN = 6.957e8; // m, IAU nominal solar radius
const OMEGA_K = Math.sqrt(GM_SUN / R_SUN ** 3); // break-up spin of a Sun-like star, rad/s
const lenM = (grams) => (grams / MSUN_G) * M_SUN_M; // GM/c² in metres
const isco = circular(6); // L = √12 in units of M c
// Horizon radius 2M for the mass window, and the Bondi radius of Eq. 27 (in units of M, R_B = 2c²/c_s²).
const horizon = (g) => 2 * lenM(g);
const bondiM = (cs) => 2 * (C / cs) ** 2;
// Disk threshold: gas at the Bondi radius with the star's spin averaged over a sphere, j_B = (2/3) Ω R_B², meets
// j_ISCO = L M c. With lengths in M: (2/3) Ω (bondiM M)² = L M c, so M (metres) = 3 L c / (2 Ω bondiM²).
const diskMsun = (lambda, cs, L = isco.L) => (3 * L * C) / (2 * lambda * OMEGA_K * bondiM(cs) ** 2) / M_SUN_M;

const out = {
  iscoL: +isco.L.toFixed(6), iscoE: +isco.E.toFixed(6),
  horizon_m: { '1e17': horizon(1e17), '1e20': horizon(1e20), '1e23': horizon(1e23) },
  bondi_cm_1e20_600: +(bondiM(6e5) * lenM(1e20) * 100).toExponential(3),
  bondi_over_rs_600: Math.round(bondiM(6e5) / 2),
  omegaK: +OMEGA_K.toExponential(4), breakupPeriod_h: +((2 * Math.PI) / OMEGA_K / 3600).toFixed(3),
  disk: Object.fromEntries([0.1, 0.2, 0.4].map((l) => [l, { cs500: +diskMsun(l, 5e5).toFixed(4), cs600: +diskMsun(l, 6e5).toFixed(4), cs700: +diskMsun(l, 7e5).toFixed(4) }])),
  diskMaxSpin_01_600: +diskMsun(0.1, 6e5, 2 / Math.sqrt(3)).toFixed(4),
};
const m01 = diskMsun(0.1, 6e5);
out.atThreshold = { Msun: +m01.toFixed(4), horizon_m: +(2 * m01 * M_SUN_M).toFixed(1), isco_m: +(6 * m01 * M_SUN_M).toFixed(1), bondi_km: +(bondiM(6e5) * m01 * M_SUN_M / 1000).toFixed(0), bondi_over_Rsun: +((bondiM(6e5) * m01 * M_SUN_M) / R_SUN).toFixed(4), period_h_star: +((2 * Math.PI) / (0.1 * OMEGA_K) / 3600).toFixed(2) };
console.log(JSON.stringify(out, null, 1));

// Figure 1: horizon radius across the asteroid-mass window, log-log.
const lg = Array.from({ length: 71 }, (_, i) => 16 + i * 0.1);
const fig1 = chart({
  title: 'How big is a primordial black hole?', xLabel: 'Mass (grams, powers of ten)', yLabel: 'Horizon radius (metres)',
  series: [{ name: 'Event horizon 2GM/c²', kind: 'line', x: lg, y: lg.map((x) => Math.log10(horizon(10 ** x))) }],
  xDomain: [16, 23], yDomain: [-13, -6], yTicks: [-13, -12, -11, -10, -9, -8, -7, -6],
  xFmt: (v) => `10^${v}`, yFmt: (v) => `1e${v}`,
  bands: [{ x0: 17, x1: 23, text: 'asteroid-mass window' }],
  hlines: [{ y: Math.log10(1.058e-10), text: 'hydrogen atom, 0.106 nm across' }],
  vlines: [{ x: 20, text: '10²⁰ g' }],
  desc: 'Event horizon radius against mass from 10 to the 16 to 10 to the 23 grams on log axes. A 10 to the 20 gram black hole has a horizon 0.149 nanometres in radius, about the size of a hydrogen atom.',
  height: 280,
});

// Figure 2: black hole mass at which a disk forms, against the star's spin as a fraction of break-up.
const lam = Array.from({ length: 96 }, (_, i) => 0.05 + i * 0.01);
const fig2 = chart({
  title: 'Mass the black hole must reach before a disk forms', xLabel: 'Star spin λ (fraction of break-up)', yLabel: 'Black hole mass (solar masses)',
  series: [
    { name: 'c_s = 500 km/s', kind: 'line', dash: '5 4', x: lam, y: lam.map((l) => diskMsun(l, 5e5)) },
    { name: 'c_s = 600 km/s', kind: 'line', x: lam, y: lam.map((l) => diskMsun(l, 6e5)) },
    { name: 'c_s = 700 km/s', kind: 'line', dash: '2 3', x: lam, y: lam.map((l) => diskMsun(l, 7e5)) },
  ],
  xDomain: [0.05, 1], yDomain: [0, 0.25], yTicks: [0, 0.05, 0.1, 0.15, 0.2, 0.25],
  hlines: [{ y: 0.01, text: '0.01 M☉' }], vlines: [{ x: 0.1, text: 'λ = 0.1' }],
  desc: 'Black hole mass at which gas falling in from the Bondi radius carries the angular momentum of the innermost stable orbit, against the star\'s spin from 0.05 to 1 of break-up, for core sound speeds of 500, 600 and 700 kilometres per second. At a tenth of break-up and 600 km/s it is 0.068 solar masses.',
  height: 280,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'horizon', figure(fig1, 'Figure 1. Horizon radius from the Schwarzschild orbit plotter\'s maths across the paper\'s mass window. At 10²⁰ g the horizon is 0.149 nm in radius, so its diameter is about three hydrogen atoms across.'));
  md = inject(md, 'disk', figure(fig2, 'Figure 2. Our recomputation of the disk threshold from the paper\'s criterion, with the ISCO angular momentum √12 GM/c from the tool. The mass falls as 1/λ and rises as the fourth power of the core sound speed; every curve sits inside the paper\'s range of a few hundredths to a few tenths of a solar mass.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
