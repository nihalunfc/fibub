// Figures for src/blog/discoveries/toi-672b-hot-super-neptune-m-dwarf-nirps-neptunian-ridge.md, made with the maths of the
// Exoplanet mass calculator (src/lib/sci/rvmass.ts), the Transit light curve fitter (src/lib/sci/transit.ts) and the
// Habitable zone calculator (src/lib/sci/habitable.ts).
// Run: node scripts/blog-figures/toi-672b-hot-super-neptune-m-dwarf-nirps-neptunian-ridge.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { minMass, semiMajor, density, radiusFromDepth, M_EARTH, R_EARTH, R_SUN, AU } from '../../src/lib/sci/rvmass.ts';
import { fluxAt, durations, stellarDensity } from '../../src/lib/sci/transit.ts';
import { insolation, tEq } from '../../src/lib/sci/habitable.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/toi-672b-hot-super-neptune-m-dwarf-nirps-neptunian-ridge.md', import.meta.url);

// Inputs from Osborn et al. (2026), A&A 709, A23, doi:10.1051/0004-6361/202558343 (CC BY 4.0): star 0.54 Suns and
// 0.54 solar radii (empirical relations), 3810 K, 0.056 solar luminosities; planet P = 3.633581 d, K = 32.0 m/s,
// e fixed at 0, radius 5.31 Earth radii, mass 50.9 Earth masses; TOI catalogue depth 8668 ppm and duration 1.78 h,
// earlier impact parameter 0.42, all as quoted by the paper.
const MS = 0.54, RS = 0.54, L = 0.056, P = 3.633581, K = 32.0, RP = 5.31, TOI_DEPTH = 8668e-6, TOI_DUR = 1.78;
const U = [0.25, 0.30]; // our assumption: the fitter's "Near infrared or TESS band" limb darkening

const m = minMass(K, MS, P).m, a = semiMajor(MS, m, P), aR = a / (RS * R_SUN), k = (RP * R_EARTH) / (RS * R_SUN);
const model = (b, u) => ({ T0: 0, P, k, aR, b, F0: 1, u1: u[0], u2: u[1] });
const facts = {
  mE: +(m / M_EARTH).toFixed(2), aAU: +(a / AU).toFixed(4), aR: +aR.toFixed(2), k2ppm: Math.round(k * k * 1e6),
  depthLDppm: Math.round((1 - fluxAt(0, model(0.42, U))) * 1e6), rFromToiDepth: +(radiusFromDepth(TOI_DEPTH, RS) / R_EARTH).toFixed(2),
  rho: +(density(m, RP * R_EARTH) / 1000).toFixed(2), rhoStar: +stellarDensity(aR, P).toFixed(2),
  t14: [0, 0.42, 0.6].map((b) => +(durations({ P, k, aR, b }).t14 * 24).toFixed(2)),
  S: +insolation(L, a / AU).toFixed(1), Teq0: Math.round(tEq(L, a / AU, 0)), Teq03: Math.round(tEq(L, a / AU, 0.3)),
};

// Figure 1: model transit, uniform star against a limb-darkened star (simulated, not the TESS data).
const hrs = Array.from({ length: 121 }, (_, i) => -1.5 + i * 0.025);
const fig1 = chart({
  title: 'Limb darkening makes the dip deeper than (Rp/R*)² (simulated)', xLabel: 'Hours from mid-transit', yLabel: 'Brightness (%)',
  series: [
    { name: 'Limb-darkened star', kind: 'line', x: hrs, y: hrs.map((h) => +(fluxAt(h / 24, model(0.42, U)) * 100).toFixed(3)) },
    { name: 'Uniform star', kind: 'line', dash: '4 3', x: hrs, y: hrs.map((h) => +(fluxAt(h / 24, model(0.42, [0, 0])) * 100).toFixed(3)) },
  ],
  xDomain: [-1.5, 1.5], yDomain: [98.9, 100.1], hlines: [{ y: 100 - TOI_DEPTH * 100, text: 'TOI catalogue depth' }], height: 250,
  desc: `Model transits of TOI-672 b at impact parameter 0.42: a uniform star gives ${(k * k * 100).toFixed(2)} %, a limb-darkened one about ${(facts.depthLDppm / 1e4).toFixed(2)} %.`,
});

// Figure 2: transit duration against impact parameter, with the catalogue's 1.78 h.
const bs = Array.from({ length: 46 }, (_, i) => i * 0.02);
const fig2 = chart({
  title: 'Transit length against impact parameter', xLabel: 'Impact parameter b', yLabel: 'Duration (hours)',
  series: [{ name: 'Model', kind: 'line', x: bs, y: bs.map((b) => +(durations({ P, k, aR, b }).t14 * 24).toFixed(3)) }],
  xDomain: [0, 0.9], yDomain: [0.8, 2.2], hlines: [{ y: TOI_DUR, text: '1.78 h (TOI catalogue)' }], height: 240,
  desc: 'The full transit lasts about 2.0 hours for a central crossing and shortens as the planet crosses nearer the edge of the star.',
});

console.log(JSON.stringify(facts));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'transit', figure(fig1, 'Figure 1. Model transits of TOI-672 b from the Transit light curve fitter\'s maths, with the paper\'s radii and an impact parameter of 0.42: a uniform star and a limb-darkened one (the fitter\'s near-infrared/TESS setting, our assumption). Simulated, not the TESS data.'));
  md = inject(md, 'dur', figure(fig2, 'Figure 2. First-to-fourth-contact duration from the fitter\'s duration formula (Winn 2010) for the paper\'s period, radii and a/R* from Kepler\'s law, against the TOI catalogue\'s 1.78 hours.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
