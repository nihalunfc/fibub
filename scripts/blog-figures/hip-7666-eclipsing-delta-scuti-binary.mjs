// Figures for src/blog/discoveries/hip-7666-eclipsing-delta-scuti-binary.md, made with the maths of the
// Period finder (src/lib/sci/lombscargle.ts), the Exoplanet mass calculator (src/lib/sci/rvmass.ts, which works
// for any two bodies) and the Blackbody calculator (src/lib/sci/blackbody.ts).
// Run: node scripts/blog-figures/hip-7666-eclipsing-delta-scuti-binary.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { lombScargle, peaks } from '../../src/lib/sci/lombscargle.ts';
import { semiAmplitude, semiMajor, M_SUN, R_SUN } from '../../src/lib/sci/rvmass.ts';
import { star } from '../../src/lib/sci/blackbody.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/hip-7666-eclipsing-delta-scuti-binary.md', import.meta.url);

// Inputs. "Paper": Lee et al. (2026), arXiv:2611.17590 (CC BY 4.0), abstract. "2005": García-Melendo et al.,
// arXiv:astro-ph/0505342 (the discovery paper). Everything else is labelled where it is used.
const M1 = 1.822, M2 = 1.246, R1 = 2.154, R2 = 1.170; // solar units, paper
const T1 = 7376, VSINI = 56.6;                          // K and km/s, paper
const P = 2.37229;                                      // days, 2005 (orbital period)
const F = 24.463;                                       // cycles per day, 2005 (strongest pulsation)

// 1. Orbit size and the two stars' speeds (circular orbit, seen edge-on as it eclipses).
const a = semiMajor(M1 + M2, 0, P) / R_SUN;             // total separation, solar radii (the two masses together)
const K1 = semiAmplitude(M2 * M_SUN, M1, P) / 1000;     // km/s: star 1 pulled by star 2
const K2 = semiAmplitude(M1 * M_SUN, M2, P) / 1000;
const ph = Array.from({ length: 121 }, (_, i) => i / 120);
const fig1 = chart({
  title: 'The two stars\' speeds round the orbit', xLabel: 'Orbital phase', yLabel: 'Speed towards or away from us (km/s)',
  series: [
    { name: `Primary (K = ${K1.toFixed(0)} km/s)`, kind: 'line', x: ph, y: ph.map((p) => +(-K1 * Math.sin(2 * Math.PI * p)).toFixed(2)) },
    { name: `Secondary (K = ${K2.toFixed(0)} km/s)`, kind: 'line', x: ph, y: ph.map((p) => +(K2 * Math.sin(2 * Math.PI * p)).toFixed(2)) },
  ],
  yDomain: [-160, 160], hlines: [{ y: 0, text: '' }],
  desc: `Predicted radial velocity curves: the primary swings by ${K1.toFixed(0)} km/s and the lighter secondary by ${K2.toFixed(0)} km/s, in opposite directions.`, height: 300,
});

// 2. The Period finder on a simulated TESS sector: 27 days of 2-minute points with the pulsation, eclipses
// (simple dips, our shape) and noise. The finder is not told the frequency.
let seed = 5; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const t = [], y = [];
for (let x = 0; x < 27; x += 2 / 1440) {
  if (x > 13 && x < 14) continue; // the data gap in the middle of a TESS sector
  const phase = (x / P) % 1, dPri = Math.min(phase, 1 - phase), dSec = Math.abs(phase - 0.5);
  const ecl = (dPri < 0.04 ? 0.25 * (1 - dPri / 0.04) : 0) + (dSec < 0.03 ? 0.06 * (1 - dSec / 0.03) : 0); // magnitudes, assumed
  t.push(x); y.push(ecl + 0.003 * Math.sin(2 * Math.PI * F * x) + 0.002 * gauss()); // 3 mmag pulsation, 2 mmag noise: assumed
}
// Remove the eclipses the way a researcher would: mask them out, then search what is left.
const keep = t.map((x) => { const p = (x / P) % 1; return Math.min(p, 1 - p) > 0.05 && Math.abs(p - 0.5) > 0.04; });
const tt = t.filter((_, i) => keep[i]), yy = y.filter((_, i) => keep[i]);
const pg = lombScargle(tt, yy, null, 0.5, 50, 6000);
const top = peaks(pg, 3);
const step = 15; // thin the curve for the chart (keeps the maximum in each bin)
const fx = [], fy = [];
for (let i = 0; i < pg.freq.length; i += step) { let m = 0; for (let j = i; j < Math.min(i + step, pg.freq.length); j++) m = Math.max(m, pg.power[j]); fx.push(+pg.freq[i].toFixed(3)); fy.push(+m.toFixed(4)); }
const fig2 = chart({
  title: 'Period finder on a simulated TESS light curve', xLabel: 'Frequency (cycles per day)', yLabel: 'Power',
  series: [{ name: 'Power', kind: 'line', x: fx, y: fy }], yDomain: [0, 1.05],
  vlines: [{ x: F, text: `${F} c/d`, left: true }],
  desc: 'The periodogram of the simulated light curve, with eclipses masked, has one tall peak at the pulsation frequency of 24.46 cycles per day.', height: 300,
});

// 3. Facts: luminosity, pulsation constant, rotation if the spin keeps pace with the orbit.
const rho1 = M1 / R1 ** 3;                              // mean density in solar units
const Q = (1 / F) * Math.sqrt(rho1);                    // days
const vSync = (2 * Math.PI * R1 * R_SUN) / (P * 86400) / 1000;
const facts = {
  a: a.toFixed(2), aAU: (a * R_SUN / 1.495978707e11).toFixed(4), r1: (R1 / a).toFixed(3), r2: (R2 / a).toFixed(3), K1: K1.toFixed(1), K2: K2.toFixed(1),
  L1: star(T1, R1).Lsun.toFixed(1), rho1: rho1.toFixed(3), Pp_min: (1440 / F).toFixed(1), Q: Q.toFixed(4), vSync: vSync.toFixed(1), vsini: VSINI,
  found: top.map((p) => +p.freq.toFixed(3)), N: tt.length,
};
console.log(JSON.stringify(facts));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'rv', figure(fig1, 'Figure 1. Radial velocity curves predicted from the paper\'s masses and the 2.372-day period, with the Exoplanet mass calculator\'s maths (which works for any pair of bodies). Circular orbit, seen edge-on.'));
  md = inject(md, 'pg', figure(fig2, 'Figure 2. Periodogram from the Period finder\'s maths on a simulated 27-day TESS light curve with eclipses, a 3 mmag pulsation at 24.463 cycles per day and noise. Simulated, not the TESS data.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
