// Figures for src/blog/discoveries/tv-umi-marginal-contact-binary-tess-masses.md, made with the maths of the
// Radial velocity fitter (src/lib/sci/rvfit.ts), the Exoplanet mass calculator (src/lib/sci/rvmass.ts, which works for
// any two bodies) and the Blackbody calculator (src/lib/sci/blackbody.ts).
// Run: node scripts/blog-figures/tv-umi-marginal-contact-binary-tess-masses.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { fitOrbit, rv, binary } from '../../src/lib/sci/rvfit.ts';
import { semiAmplitude, semiMajor, M_SUN, R_SUN, G, DAY } from '../../src/lib/sci/rvmass.ts';
import { star } from '../../src/lib/sci/blackbody.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/tv-umi-marginal-contact-binary-tess-masses.md', import.meta.url);

// Inputs. "Paper": Čeki and Latković (2026), Galaxies 14(1), 9, doi:10.3390/galaxies14010009 (CC BY 3.0), Table 2 and text.
const P = 0.4155480;                      // days, paper (orbital period)
const INC = 48.28;                        // degrees, paper (inclination)
const M1 = 1.254, M2 = 0.929;             // solar masses, paper
const R1 = 1.240, R2 = 1.080;             // solar radii, paper
const T1 = 6152, T2 = 6336;               // K, paper
const L1p = 1.95, L2p = 1.68;             // solar luminosities, paper (for comparison)

// 1. Size of the orbit and the predicted speeds, seen at the paper's inclination.
const a = semiMajor(M1 + M2, 0, P) / R_SUN;                       // solar radii
const K1 = semiAmplitude(M2 * M_SUN, M1, P, 0, INC) / 1000;       // km/s
const K2 = semiAmplitude(M1 * M_SUN, M2, P, 0, INC) / 1000;
const K1edge = semiAmplitude(M2 * M_SUN, M1, P, 0, 90) / 1000;

// 2. Simulated velocities (our assumptions: 24 spectra over 40 nights, 8 km/s scatter, systemic velocity 0) fitted with
// the Radial velocity fitter's maths, which is told nothing about the period except a search range.
let seed = 11; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const NOISE = 8, N = 24;
const t = Array.from({ length: N }, () => +(rnd() * 40).toFixed(4)).sort((x, y) => x - y);
const true1 = { P, K: K1, e: 0, w: 0, tp: 0, gamma: 0 }, true2 = { P, K: K2, e: 0, w: Math.PI, tp: 0, gamma: 0 };
const v1 = t.map((x) => rv(x, true1) + NOISE * gauss()), v2 = t.map((x) => rv(x, true2) + NOISE * gauss());
const f1 = fitOrbit(t, v1, null, { pmin: 0.3, pmax: 2, circular: true }), f2 = fitOrbit(t, v2, null, { pmin: 0.3, pmax: 2, circular: true });
// Masses from the two fitted speeds: M sin³i = P (K1 + K2)² K_other / (2πG).
const Pf = f1.o.P, Ks = (f1.o.K + f2.o.K) * 1000, s3 = Math.sin(INC * Math.PI / 180) ** 3;
const m1sin3 = (Pf * DAY * Ks * Ks * f2.o.K * 1000) / (2 * Math.PI * G) / M_SUN, m2sin3 = (Pf * DAY * Ks * Ks * f1.o.K * 1000) / (2 * Math.PI * G) / M_SUN;
const fm1 = binary(f1.o.K, Pf, 0);

const ph = (x) => (((x - f1.o.tp) / Pf) % 1 + 1) % 1;
const grid = Array.from({ length: 101 }, (_, i) => i / 100);
const fig1 = chart({
  title: 'Simulated velocities and the fitted orbits', xLabel: 'Orbital phase', yLabel: 'Speed towards or away from us (km/s)',
  series: [
    { name: 'Primary (simulated)', kind: 'dots', x: t.map((x) => +ph(x).toFixed(4)), y: v1.map((v) => +v.toFixed(1)), size: 3 },
    { name: 'Secondary (simulated)', kind: 'dots', x: t.map((x) => +ph(x).toFixed(4)), y: v2.map((v) => +v.toFixed(1)), size: 3 },
    { name: '', kind: 'line', x: grid, y: grid.map((p) => +rv(f1.o.tp + p * Pf, f1.o).toFixed(2)), colour: 'var(--c-blog)', noLegend: true },
    { name: '', kind: 'line', x: grid, y: grid.map((p) => +rv(f1.o.tp + p * Pf, f2.o).toFixed(2)), colour: 'var(--c-tools)', noLegend: true },
  ],
  xDomain: [0, 1], yDomain: [-200, 200], hlines: [{ y: 0, text: '' }],
  desc: `Simulated velocities of both stars with the Radial velocity fitter's circular orbits: K = ${f1.o.K.toFixed(0)} and ${f2.o.K.toFixed(0)} km/s, period ${Pf.toFixed(5)} days.`, height: 300,
});

// 3. How the speeds depend on the tilt of the orbit: K1 + K2 against inclination, from the paper's masses.
const incs = Array.from({ length: 81 }, (_, i) => 10 + i);
const fig2 = chart({
  title: 'Total speed swing against the tilt of the orbit', xLabel: 'Inclination (degrees, 90 = edge-on)', yLabel: 'K₁ + K₂ (km/s)',
  series: [{ name: 'K₁ + K₂', kind: 'line', x: incs, y: incs.map((i) => +((semiAmplitude(M2 * M_SUN, M1, P, 0, i) + semiAmplitude(M1 * M_SUN, M2, P, 0, i)) / 1000).toFixed(2)) }],
  xDomain: [10, 90], yDomain: [0, 400], vlines: [{ x: INC, text: `${INC}° (paper)`, left: true }],
  desc: `The two stars' combined speed swing grows with the sine of the inclination, from zero face-on to ${(K1edge * (M1 + M2) / M2).toFixed(0)} km/s edge-on; at ${INC} degrees it is ${(K1 + K2).toFixed(0)} km/s.`, height: 280,
});

// Roche lobe sizes from Eggleton (1983), ApJ 268, 368 (not a fibub tool; a check of our own).
const egg = (q) => 0.49 * q ** (2 / 3) / (0.6 * q ** (2 / 3) + Math.log(1 + q ** (1 / 3)));
const s1 = star(T1, R1), s2 = star(T2, R2);
const facts = {
  a: a.toFixed(3), fill: ((R1 + R2) / a).toFixed(3), K1: K1.toFixed(1), K2: K2.toFixed(1), Ksum: (K1 + K2).toFixed(1), Ksum90: (K1edge * (M1 + M2) / M2).toFixed(1),
  fitP: [f1.o.P.toFixed(6), f2.o.P.toFixed(6)], fitK: [f1.o.K.toFixed(1), f2.o.K.toFixed(1)], fitKerr: [f1.err.K.toFixed(1), f2.err.K.toFixed(1)], rms: [f1.rms.toFixed(1), f2.rms.toFixed(1)],
  q: (f1.o.K / f2.o.K).toFixed(3), m1sin3: m1sin3.toFixed(3), m2sin3: m2sin3.toFixed(3), m1: (m1sin3 / s3).toFixed(3), m2: (m2sin3 / s3).toFixed(3), sin3: s3.toFixed(4), fm1: fm1.fm.toFixed(4),
  L1: s1.Lsun.toFixed(3), L2: s2.Lsun.toFixed(3), L1p, L2p, r1a: (R1 / a).toFixed(3), r2a: (R2 / a).toFixed(3), lobe1: egg(M1 / M2).toFixed(3), lobe2: egg(M2 / M1).toFixed(3), vEq1: (2 * Math.PI * R1 * R_SUN / (P * DAY) / 1000).toFixed(0),
};
console.log(JSON.stringify(facts));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'rv', figure(fig1, 'Figure 1. Simulated velocities of the two stars (24 spectra, 8 km/s scatter, our assumptions) built from the paper\'s masses and tilt, with the orbits found by the Radial velocity fitter\'s maths. Simulated, not the observatory\'s spectra.'));
  md = inject(md, 'inc', figure(fig2, 'Figure 2. The two stars\' combined speed swing against inclination, from the paper\'s masses and period with the Exoplanet mass calculator\'s maths. A shallow tilt hides much of the motion.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
