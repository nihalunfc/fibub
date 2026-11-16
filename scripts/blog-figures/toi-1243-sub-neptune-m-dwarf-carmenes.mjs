// Figures for src/blog/discoveries/toi-1243-sub-neptune-m-dwarf-carmenes.md, made with the maths of the
// Transit light curve fitter (src/lib/sci/transit.ts) and the Exoplanet mass calculator (src/lib/sci/rvmass.ts).
// Run: node scripts/blog-figures/toi-1243-sub-neptune-m-dwarf-carmenes.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { fluxAt, fitTransit, fold, stellarDensity, durations } from '../../src/lib/sci/transit.ts';
import { semiAmplitude, semiMajor, density, M_EARTH, R_EARTH, R_SUN } from '../../src/lib/sci/rvmass.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/toi-1243-sub-neptune-m-dwarf-carmenes.md', import.meta.url);

// Inputs. "Paper": Poultourtzidis et al. (2026), A&A 707, A106, doi:10.1051/0004-6361/202557155 (CC BY 4.0):
// abstract (periods, radii, masses, limits) and Table 1 (stars).
const PL = [
  { id: 'TOI-1243 b', P: 4.65, R: 2.33, Rerr: 0.12, M: 7.7, Merr: 1.5, Ms: 0.515, Rs: 0.511, Teff: 3515 },
  { id: 'TOI-4529 b', P: 5.88, R: 1.77, Rerr: 0.09, Mlim: 4.9, Ms: 0.482, Rs: 0.480, Teff: 3697 },
  { id: 'TOI-5388 b', P: 2.59, R: 0.99, Rerr: 0.07, Mlim: 2.2, Ms: 0.292, Rs: 0.300, Teff: 3440 },
];
const RHO_SUN = 1.98840987e33 / ((4 / 3) * Math.PI * (R_SUN * 100) ** 3); // g/cm³
const RHO_EARTH = density(M_EARTH, R_EARTH) / 1000;                        // g/cm³

const rows = PL.map((p) => {
  const k = (p.R * R_EARTH) / (p.Rs * R_SUN), a = semiMajor(p.Ms, (p.M ?? 0) * M_EARTH, p.P), aR = a / (p.Rs * R_SUN);
  const m = p.M ?? p.Mlim;
  return {
    id: p.id, k: +k.toFixed(4), depthPpm: Math.round(k * k * 1e6), aAU: +(a / 1.495978707e11).toFixed(4), aR: +aR.toFixed(2),
    rhoStar: +(stellarDensity(aR, p.P)).toFixed(2), rhoStarMR: +((p.Ms / p.Rs ** 3) * RHO_SUN).toFixed(2),
    K: +semiAmplitude(m * M_EARTH, p.Ms, p.P).toFixed(2), rhoP: +((m / p.R ** 3)).toFixed(2), rhoPgcc: +((m / p.R ** 3) * RHO_EARTH).toFixed(2),
    Teq: Math.round(p.Teff * Math.sqrt(1 / (2 * aR))), // zero albedo, heat spread all round: our simple formula
    t14h: +(durations({ P: p.P, k, aR, b: 0.4 }).t14 * 24).toFixed(2), // b = 0.4 assumed
  };
});
// An Earth-like (rocky) mass for TOI-5388 b at its radius, for the speed it would cause: M = R³ at Earth's density.
const k5388Earth = +semiAmplitude(PL[2].R ** 3 * M_EARTH, PL[2].Ms, PL[2].P).toFixed(2);

// Simulated TESS-like data for TOI-1243 b: one 27-day sector of 2-minute points, kept within 0.2 days of each transit.
// Our assumptions: impact parameter b = 0.4, limb darkening u1 = u2 = 0.3, 1.5 ppt noise per point, T0 = 1.0.
let seed = 3; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const r0 = rows[0], truth = { T0: 1.0, P: PL[0].P, k: r0.k, aR: r0.aR, b: 0.4, F0: 1, u1: 0.3, u2: 0.3 };
const t = [], f = [];
for (let x = 0; x < 27; x += 2 / 1440) { if (Math.abs(fold(x, truth.T0, truth.P)) > 0.2) continue; t.push(x); f.push(fluxAt(x, truth) + 0.0015 * gauss()); }
const fit = fitTransit(t, f, null, { P: truth.P, u1: 0.3, u2: 0.3 });
const rhoFit = fit.derived((m) => stellarDensity(m.aR, m.P));
const RpFit = fit.m.k * PL[0].Rs * R_SUN / R_EARTH, RpErr = fit.err.k * PL[0].Rs * R_SUN / R_EARTH;

// Figure 1: folded simulated data in 15-minute bins with the fitted model.
const bw = 15 / 1440, bins = new Map();
t.forEach((x, i) => { const ph = fold(x, fit.m.T0, fit.m.P), j = Math.round(ph / bw); const b = bins.get(j) ?? [0, 0]; b[0] += f[i]; b[1]++; bins.set(j, b); });
const bx = [...bins.keys()].sort((a, b) => a - b), byv = bx.map((j) => bins.get(j));
const mx = Array.from({ length: 161 }, (_, i) => -0.2 + i * 0.0025);
const fig1 = chart({
  title: 'TOI-1243 b: simulated TESS transits, folded, with the fit', xLabel: 'Hours from mid-transit', yLabel: 'Brightness drop (ppt)',
  series: [
    { name: 'Simulated data, 15-min bins', kind: 'dots', x: bx.map((j) => +(j * bw * 24).toFixed(3)), y: byv.map(([s, n]) => +((1 - s / n / fit.m.F0) * 1000).toFixed(3)), size: 3 },
    { name: 'Fitted model', kind: 'line', x: mx.map((h) => +(h * 24).toFixed(3)), y: mx.map((h) => +((1 - fluxAt(fit.m.T0 + h, fit.m) / fit.m.F0) * 1000).toFixed(4)) },
  ],
  xDomain: [-4.8, 4.8], yReverse: true, yDomain: [-0.6, 2.4],
  desc: `Folded simulated light curve of TOI-1243 b with the Transit light curve fitter's model: depth about ${(fit.m.k ** 2 * 1000).toFixed(2)} ppt, lasting about ${(durations(fit.m).t14 * 24).toFixed(1)} hours.`, height: 290,
});

// Figure 2: mass-radius diagram with lines of constant density, from the mass calculator's density maths.
const rr = Array.from({ length: 61 }, (_, i) => 0.6 + i * 0.04);
const line = (rho) => rr.map((R) => +(rho * R ** 3).toFixed(3)); // M (Earths) = rho (Earth units) x R³
const fig2 = chart({
  title: 'Masses and radii, with lines of equal density', xLabel: 'Radius (Earths)', yLabel: 'Mass (Earths)',
  series: [
    { name: 'Earth density', kind: 'line', x: rr, y: line(1), colour: 'var(--muted)', noLegend: true, label: { text: '1 ρ⊕', at: [1.95, 1 * 1.95 ** 3], dx: 6, dy: 4 } },
    { name: 'Half Earth density', kind: 'line', x: rr, y: line(0.5), colour: 'var(--muted)', dash: '4 4', noLegend: true, label: { text: '0.5 ρ⊕', at: [2.95, 0.5 * 2.95 ** 3], dx: -50, dy: 18 } },
    { name: 'TOI-1243 b (measured)', kind: 'dots', x: [2.33], y: [7.7], errors: [1.5], size: 4 },
    { name: 'Upper limits', kind: 'dots', x: [1.77, 0.99], y: [4.9, 2.2], size: 4, label: { text: 'upper limits', at: [1.77, 4.9], dx: 8, dy: 4 } },
  ],
  xDomain: [0.6, 3], yDomain: [0, 12],
  desc: 'TOI-1243 b sits near the half-Earth-density line, too light for solid rock; the other two planets have only upper limits on their mass.', height: 290,
});

const facts = { rows, k5388Earth, nPts: t.length, fit: { k: fit.m.k.toFixed(4), kErr: fit.err.k.toFixed(4), aR: fit.m.aR.toFixed(1), aRerr: fit.err.aR.toFixed(1), b: fit.m.b.toFixed(2), bErr: fit.err.b.toFixed(2), Rp: RpFit.toFixed(2), RpErr: RpErr.toFixed(2), rho: rhoFit.v.toFixed(1), rhoErr: rhoFit.e.toFixed(1), t14h: (durations(fit.m).t14 * 24).toFixed(2) }, rhoEarth: RHO_EARTH.toFixed(3) };
console.log(JSON.stringify(facts, null, 0));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'lc', figure(fig1, 'Figure 1. A simulated 27-day TESS light curve of TOI-1243 b (2-minute points, 1.5 ppt noise, impact parameter 0.4: our assumptions), folded on the 4.65-day period, with the Transit light curve fitter\'s best fit. Simulated, not the TESS data.'));
  md = inject(md, 'mr', figure(fig2, 'Figure 2. The three planets\' radii and masses from the paper (TOI-1243 b measured; the others 3-sigma upper limits), with lines of constant density from the Exoplanet mass calculator\'s maths.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
