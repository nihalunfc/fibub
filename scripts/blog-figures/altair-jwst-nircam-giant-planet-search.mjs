// Figures for src/blog/discoveries/altair-jwst-nircam-giant-planet-search.md, made with the maths of the
// Blackbody calculator (#T56, src/lib/sci/blackbody.ts) and the Habitable zone calculator (src/lib/sci/habitable.ts).
// Run: node scripts/blog-figures/altair-jwst-nircam-giant-planet-search.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { planckLam, star } from '../../src/lib/sci/blackbody.ts';
import { tEq } from '../../src/lib/sci/habitable.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/altair-jwst-nircam-giant-planet-search.md', import.meta.url);

// Inputs. "Paper": Meshkat et al. (2026), arXiv:2611.13132 (CC BY 4.0), abstract. "Literature": rounded
// interferometric values for Altair (Monnier et al. 2007). "Assumed": our round choice, said in the article.
const DIST = 5.13;                    // parsecs, paper
const LIMITS = [[1, 2e-6], [2, 1.5e-7], [4, 3e-8]]; // [arcsec, F444W contrast], paper (abstract; "a few 1e-8" taken as 3e-8)
const TS = 7700, RS = 1.8;            // K and solar radii, literature (Altair is oblate; these are rounded averages)
const RP = 1.15;                      // Jupiter radii, assumed for a young giant planet
const LAM = 4.44e-6, LAM2 = 2.0e-6;   // m: middle of NIRCam's F444W and F200W filters
const ALB = 0.3;                      // assumed Bond albedo for the starlight-only temperature

const k2 = ((RP * 7.1492e7) / (RS * 6.957e8)) ** 2;
const contrast = (T, lam = LAM) => k2 * planckLam(lam, T) / planckLam(lam, TS);
const tFor = (c) => { let lo = 50, hi = 3000; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; contrast(m) > c ? (hi = m) : (lo = m); } return lo; };
const Lsun = star(TS, RS).Lsun;
const au = (arcsec) => arcsec * DIST; // small-angle rule: 1 arcsecond at 1 parsec is 1 au

// 1. Planet-to-star brightness at 4.44 µm and 2.0 µm against planet temperature (log scale).
const Ts = Array.from({ length: 91 }, (_, i) => 150 + i * 10);
const log = (v) => +Math.log10(v).toFixed(3);
const fig1 = chart({
  title: 'How bright a planet looks next to Altair', xLabel: 'Planet temperature (K)', yLabel: 'Planet ÷ star brightness',
  series: [
    { name: 'At 4.44 µm (F444W)', kind: 'line', x: Ts, y: Ts.map((T) => log(contrast(T))) },
    { name: 'At 2.0 µm (F200W)', kind: 'line', x: Ts.filter((T) => log(contrast(T, LAM2)) >= -14), y: Ts.map((T) => log(contrast(T, LAM2))).filter((v) => v >= -14) },
  ],
  xFmt: (v) => String(Math.round(v)), yDomain: [-14, -3], yTicks: [-14, -12, -10, -8, -6, -4], yFmt: (v) => `1e${v}`,
  hlines: LIMITS.map(([s, c]) => ({ y: Math.log10(c), text: `Reach at ${s}″` })),
  desc: 'Planet-to-star brightness ratio rises steeply with planet temperature, and is a hundred to a million times higher at 4.44 microns than at 2 microns.', height: 320,
});

// 2. Temperature a planet needs to be seen, against the warmth Altair's light alone would give it.
const seps = Array.from({ length: 41 }, (_, i) => 4 + i * 0.5);
const need = LIMITS.map(([s, c]) => ({ s: au(s), T: tFor(c) }));
const fig2 = chart({
  title: 'Seen only if the planet is still warm from birth', xLabel: 'Distance from Altair (au)', yLabel: 'Temperature (K)',
  series: [
    { name: 'Needed to be seen', kind: 'dots', x: need.map((n) => +n.s.toFixed(2)), y: need.map((n) => Math.round(n.T)), size: 5 },
    { name: 'From starlight alone', kind: 'line', x: seps, y: seps.map((d) => +tEq(Lsun, d, ALB).toFixed(1)) },
  ],
  xDomain: [4, 24], yDomain: [0, 550],
  desc: 'A planet must be about 460 K at 5 au, 340 K at 10 au and 290 K at 20 au to be seen, far warmer than the 100 to 200 K that Altair\'s light alone would give it.', height: 300,
});

const facts = {
  Lsun: Lsun.toFixed(1), au: LIMITS.map(([s]) => au(s).toFixed(1)), need: need.map((n) => Math.round(n.T)),
  starOnly: [5.13, 10.26, 20.52].map((d) => Math.round(tEq(Lsun, d, ALB))),
  c500: contrast(500).toExponential(1), c500at2: contrast(500, LAM2).toExponential(1), ratio500: Math.round(contrast(500) / contrast(500, LAM2)),
  c300: contrast(300).toExponential(1),
};
console.log(JSON.stringify(facts));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'contrast', figure(fig1, 'Figure 1. Brightness of a 1.15 Jupiter-radius planet compared with Altair, both treated as perfect glowing bodies, at the two NIRCam filters. Dashed lines: the reach the paper reports at 1, 2 and 4 arcseconds. Made with the Blackbody calculator\'s maths.'));
  md = inject(md, 'warm', figure(fig2, 'Figure 2. Dots: the planet temperature that matches the paper\'s reported reach at 1, 2 and 4 arcseconds (5.1, 10.3 and 20.5 au). Line: the temperature Altair\'s light alone would give a planet (albedo 0.3), from the Habitable zone calculator\'s maths.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
