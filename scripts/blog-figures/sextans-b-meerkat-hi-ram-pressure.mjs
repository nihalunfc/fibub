// Figures for src/blog/discoveries/sextans-b-meerkat-hi-ram-pressure.md, made with the maths of the
// Hydrogen line analyser (src/lib/astro/hline.ts) and the Rotation curve fitter (src/lib/sci/rotcurve.ts).
// Run: node scripts/blog-figures/sextans-b-meerkat-hi-ram-pressure.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { baseline, smooth, freqRadio, columnDensity, F0 } from '../../src/lib/astro/hline.ts';
import { enclosedMass } from '../../src/lib/sci/rotcurve.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/sextans-b-meerkat-hi-ram-pressure.md', import.meta.url);

// Inputs. "Paper": Namumba et al. (2026), A&A 712, A27, doi:10.1051/0004-6361/202660238 (CC BY 4.0), full text.
const D = 1.36;                       // Mpc: paper
const VSYS = 302.671;                 // km/s: paper (kinematic model)
const FLUX = 104.5;                   // Jy km/s: paper
const MHI_PAPER = 4.6e7;              // solar masses: paper
const W20 = 59.5, W50 = 38.8;         // km/s: paper
const INC = 30;                       // degrees: paper ("close to 30°")
const VROT = [50, 55], R_OUT = 1.5;   // km/s at the outermost radii, and the HI extent in kpc: paper
const NHI_LIMIT = 3.3e18, NHI_WIDTH = 20; // cm⁻² over 20 km/s: paper
const HE = 1.33;                      // helium correction for total gas: literature convention (our choice)

// 1. HI mass from the flux, M = 2.356e5 D² S (the standard formula; the paper rounds the constant to 2.36e5).
const mHI = 2.356e5 * D * D * FLUX;

// 2. A simulated integrated spectrum (our assumption: one Gaussian with the paper's W50, which also gives close to its W20,
// with the paper's flux and velocity, on a gently curved baseline, with 15 mJy of noise per 1.4 km/s channel).
const sig = W50 / (2 * Math.sqrt(2 * Math.log(2))), peak = FLUX / (sig * Math.sqrt(2 * Math.PI));
const w20Gauss = 2 * sig * Math.sqrt(2 * Math.log(5));
let seed = 11; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const v = [], y = [];
for (let x = 150; x <= 455; x += 1.4) { v.push(+x.toFixed(2)); y.push(peak * Math.exp(-0.5 * ((x - VSYS) / sig) ** 2) + 0.05 + 0.0004 * (x - 300) - 6e-7 * (x - 300) ** 2 + 0.015 * gauss()); }
// The Hydrogen line analyser's steps: 2nd-order baseline, 3-channel smoothing, area over the channels flagged as line.
const run = (v, y, k) => {
  const bl = baseline(v, y, 2), line = smooth(bl.residual, k);
  let integ = 0; for (let n = 1; n < v.length; n++) if (bl.line[n] || bl.line[n - 1]) integ += ((bl.residual[n] + bl.residual[n - 1]) / 2) * (v[n] - v[n - 1]);
  let pk = -Infinity, vpk = NaN; line.forEach((t, i) => { if (t > pk) { pk = t; vpk = v[i]; } });
  return { bl, line, integ, pk, vpk, sigma: bl.sigma / Math.sqrt(2 * k + 1) };
};
const R = run(v, y, 1);
const fig1 = chart({
  title: 'Simulated Sextans B spectrum after the baseline', xLabel: 'Velocity (km/s)', yLabel: 'Flux density (Jy)',
  series: [{ name: 'Simulated', kind: 'line', x: v.filter((_, i) => i % 2 === 0), y: R.line.filter((_, i) => i % 2 === 0).map((t) => +t.toFixed(4)) }],
  vlines: [{ x: VSYS, text: `${VSYS.toFixed(1)} km/s`, left: true }], hlines: [{ y: 0, text: '' }], yDomain: [-0.3, 3],
  desc: `A simulated single-dish style spectrum of Sextans B with the paper's flux and velocity; the Hydrogen line analyser's maths finds an area of ${R.integ.toFixed(1)} Jy km/s.`, height: 270,
});

// A short noise-free version for readers to paste (15 km/s channels, flat baseline at zero).
const vs = Array.from({ length: 41 }, (_, k) => k * 15), ys = vs.map((x) => +(peak * Math.exp(-0.5 * ((x - VSYS) / sig) ** 2)).toFixed(3));
const Rs = run(vs, ys, 1);

// 3. Rotation and mass.
const vFromW = (W) => W / (2 * Math.sin((INC * Math.PI) / 180));
const mDyn = VROT.map((vr) => enclosedMass(R_OUT, vr));
const mGas = HE * MHI_PAPER;
const rr = [], mm = [];
for (let k = 1; k <= 40; k++) { const r = (k / 40) * 2; rr.push(+r.toFixed(3)); mm.push(+Math.log10(enclosedMass(r, 52.5)).toFixed(4)); }
const fig2 = chart({
  title: 'Mass needed to hold the gas in orbit at 52.5 km/s', xLabel: 'Radius (kpc)', yLabel: 'Mass inside (solar masses)',
  series: [{ name: 'Mass from rotation, v²r/G', kind: 'line', x: rr, y: mm }],
  hlines: [{ y: +Math.log10(mGas).toFixed(3), text: `Gas seen: ${(mGas / 1e7).toFixed(1)} × 10⁷` }],
  vlines: [{ x: R_OUT, text: 'edge of the HI, 1.5 kpc', left: true }],
  yDomain: [7, 9.2], yTicks: [7, 7.5, 8, 8.5, 9], yFmt: (t) => (Number.isInteger(t) ? `10^${t}` : `${(10 ** (t % 1)).toFixed(1)}×10^${Math.floor(t)}`), height: 280,
  desc: `The mass needed to keep gas moving at 52.5 km/s at 1.5 kpc is about ${(enclosedMass(R_OUT, 52.5) / 1e8).toFixed(1)} × 10⁸ solar masses, far more than the ${(mGas / 1e7).toFixed(1)} × 10⁷ in gas.`,
});

const facts = {
  mHI: mHI.toExponential(3), mHIfromSim: (2.356e5 * D * D * R.integ).toExponential(3), simArea: R.integ.toFixed(2), simPeakV: R.vpk.toFixed(1), simSN: (R.pk / R.sigma).toFixed(0),
  shortArea: Rs.integ.toFixed(2), shortPeakV: Rs.vpk, shortPeak: Rs.pk.toFixed(3),
  sigma: sig.toFixed(2), peak: peak.toFixed(3), w20Gauss: w20Gauss.toFixed(1),
  fObs: freqRadio(VSYS).toFixed(3), F0, vW50: vFromW(W50).toFixed(1), vW20: vFromW(W20).toFixed(1),
  mDyn: mDyn.map((m) => m.toExponential(2)), mGas: mGas.toExponential(2), gasShare: mDyn.map((m) => (mGas / m * 100).toFixed(1)),
  intLimit: (NHI_LIMIT / columnDensity(1)).toFixed(2), meanTb: (NHI_LIMIT / columnDensity(1) / NHI_WIDTH).toFixed(3),
};
console.log(JSON.stringify(facts, null, 1));
console.log(vs.map((x, i) => `${x}, ${ys[i]}`).join('\n'));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'spec', figure(fig1, 'Figure 1. A simulated whole-galaxy hydrogen spectrum of Sextans B (one Gaussian with the paper\'s W50, flux and velocity, plus a curved baseline and noise), after the Hydrogen line analyser\'s baseline and smoothing steps. Simulated, not the MeerKAT data.'));
  md = inject(md, 'mass', figure(fig2, 'Figure 2. Mass needed inside each radius to keep gas circling at 52.5 km/s (the middle of the paper\'s 50 to 55 km/s), from the Rotation curve fitter\'s enclosed-mass formula, against the hydrogen and helium the paper sees. Logarithmic mass axis.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
