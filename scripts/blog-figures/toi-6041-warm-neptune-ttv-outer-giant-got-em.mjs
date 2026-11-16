// Figures for src/blog/discoveries/toi-6041-warm-neptune-ttv-outer-giant-got-em.md, made with the maths of the
// Exoplanet mass calculator (src/lib/sci/rvmass.ts), the Habitable zone calculator (src/lib/sci/habitable.ts) and the
// Transit light curve fitter (src/lib/sci/transit.ts).
// Run: node scripts/blog-figures/toi-6041-warm-neptune-ttv-outer-giant-got-em.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { minMass, semiAmplitude, density, M_JUP, M_EARTH, R_EARTH, R_SUN, AU } from '../../src/lib/sci/rvmass.ts';
import { auForPeriod, insolation, tEq, habitableZone, lumFrom } from '../../src/lib/sci/habitable.ts';
import { fluxAt, durations } from '../../src/lib/sci/transit.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/toi-6041-warm-neptune-ttv-outer-giant-got-em.md', import.meta.url);

// Inputs from Heidari et al. (2026), A&A 707, A134, doi:10.1051/0004-6361/202556700 (CC BY 4.0): star 0.885 Suns,
// 0.879 solar radii, 5445 K, 0.532 solar luminosities; planet b 26.04945 d, 4.55 Earth radii, K < 7 m/s (3 sigma),
// mass < 28.9 Earths; planet c 88.0 d, m sin i 0.245 Jupiter masses, circular orbit adopted.
const MS = 0.885, RS = 0.879, TEFF = 5445, L = 0.532;
const B = { P: 26.04945, Rp: 4.55, Kmax: 7 }, C = { P: 88.0, msini: 0.245 };
const ALBEDO = 0.3; // our assumption
const U = [0.40, 0.25]; // our assumption: the Transit light curve fitter's "Sun-like star, visible light" limb darkening

const aB = auForPeriod(B.P, MS), aC = auForPeriod(C.P, MS);
const k = (B.Rp * R_EARTH) / (RS * R_SUN), aR = (aB * AU) / (RS * R_SUN);
const dur = durations({ P: B.P, k, aR, b: 0 }); // central transit assumed
const mBmax = minMass(B.Kmax, MS, B.P).m / M_EARTH;
const facts = {
  aB: +aB.toFixed(4), aC: +aC.toFixed(4), SB: +insolation(L, aB).toFixed(1), SC: +insolation(L, aC).toFixed(2),
  TB: Math.round(tEq(L, aB, ALBEDO)), TC: Math.round(tEq(L, aC, ALBEDO)), depthPct: +(k * k * 100).toFixed(3), aR: +aR.toFixed(1),
  t14h: +(dur.t14 * 24).toFixed(2), mBmax: +mBmax.toFixed(1), rhoMax: +(density(mBmax * M_EARTH, B.Rp * R_EARTH) / 1000).toFixed(2),
  KC: +semiAmplitude(C.msini * M_JUP, MS, C.P).toFixed(2), KC03: +semiAmplitude(C.msini * M_JUP, MS, C.P, 0.3).toFixed(2),
  KB17: +semiAmplitude(17.15 * M_EARTH, MS, B.P).toFixed(2), ratio: +(C.P / B.P).toFixed(3),
  hz: habitableZone(TEFF, L, '1').conservative.map((x) => +x.toFixed(3)), Lrt: +lumFrom(RS, TEFF).toFixed(3),
};

// Figure 1: the star's wobble over 180 days (circular orbits, simulated): planet c, and planet b at its upper limit
// and at Neptune's mass. Not the measured velocities.
const tt = Array.from({ length: 181 }, (_, i) => i);
const sine = (K, P, t) => +(K * Math.sin((2 * Math.PI * t) / P)).toFixed(2);
const fig1 = chart({
  title: 'Wobbles the spectrographs had to find (simulated)', xLabel: 'Days', yLabel: 'Star speed (m/s)',
  series: [
    { name: `Planet c, ${facts.KC} m/s`, kind: 'line', x: tt, y: tt.map((t) => sine(facts.KC, C.P, t)) },
    { name: 'Planet b at the 7 m/s limit', kind: 'line', x: tt, y: tt.map((t) => sine(B.Kmax, B.P, t)) },
    { name: `b at Neptune's mass, ${facts.KB17} m/s`, kind: 'line', dash: '4 3', x: tt, y: tt.map((t) => sine(facts.KB17, B.P, t)) },
  ],
  xDomain: [0, 180], yDomain: [-14, 14], hlines: [{ y: 0, text: '' }], height: 260,
  desc: `Simulated wobbles: planet c swings the star by about ${facts.KC} m/s; planet b at most 7 m/s, and about ${facts.KB17} m/s if it had Neptune's mass.`,
});

// Figure 2: a model transit of planet b (central transit, Sun-like limb darkening; simulated, not the TESS data).
const hrs = Array.from({ length: 121 }, (_, i) => -12 + i * 0.2);
const model = { T0: 0, P: B.P, k, aR, b: 0, F0: 1, u1: U[0], u2: U[1] };
const fig2 = chart({
  title: 'A model transit of TOI-6041 b (simulated)', xLabel: 'Hours from mid-transit', yLabel: 'Brightness (%)',
  series: [{ name: 'Model', kind: 'line', x: hrs, y: hrs.map((h) => +(fluxAt(h / 24, model) * 100).toFixed(4)) }],
  xDomain: [-12, 12], yDomain: [99.65, 100.05], height: 240,
  desc: `Model transit of TOI-6041 b: about ${(k * k * 100).toFixed(2)} % deep and ${facts.t14h} hours long for a central crossing.`,
});

console.log(JSON.stringify(facts));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'rv', figure(fig1, 'Figure 1. Simulated circular-orbit wobbles from the Exoplanet mass calculator\'s maths: planet c with the paper\'s minimum mass, and planet b at the paper\'s 7 m/s upper limit and at Neptune\'s mass. An illustration, not the measured velocities.'));
  md = inject(md, 'transit', figure(fig2, 'Figure 2. A model transit of planet b from the Transit light curve fitter\'s maths, using the paper\'s radii, a central crossing and Sun-like limb darkening (our assumptions). Simulated, not the TESS light curve.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
