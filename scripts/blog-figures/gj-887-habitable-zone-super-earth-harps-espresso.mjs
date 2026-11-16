// Figures for src/blog/discoveries/gj-887-habitable-zone-super-earth-harps-espresso.md, made with the maths of the
// Habitable zone calculator (src/lib/sci/habitable.ts) and the Exoplanet mass calculator (src/lib/sci/rvmass.ts).
// Run: node scripts/blog-figures/gj-887-habitable-zone-super-earth-harps-espresso.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { habitableZone, auForPeriod, insolation, tEq } from '../../src/lib/sci/habitable.ts';
import { minMass, M_EARTH } from '../../src/lib/sci/rvmass.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/gj-887-habitable-zone-super-earth-harps-espresso.md', import.meta.url);

// Inputs. "Paper": Hartogh et al. (2026), A&A 707, A93, doi:10.1051/0004-6361/202554984 (CC BY 4.0): periods and
// semi-amplitudes K, Teff 3688 K (Mann et al. 2015, as used by the paper), distance 3.2877 pc.
// "Literature": star mass 0.489 solar and luminosity 0.0368 solar from Jeffers et al. (2020), Science 368, 1477.
const TEFF = 3688, L = 0.0368, MS = 0.489, DIST = 3.2877;
const PLANETS = [
  { id: 'f (candidate)', P: 2.21661, K: 0.37 },
  { id: 'e', P: 4.42490, K: 0.89 },
  { id: 'b', P: 9.2617, K: 2.27 },
  { id: 'c', P: 21.781, K: 2.4 },
  { id: 'd', P: 50.77, K: 1.8 },
];
const ALBEDO = 0.3; // our assumption, Earth-like

const hz = habitableZone(TEFF, L, '5'); // runaway edge for a 5 Earth-mass planet (Kopparapu 2014)
const hz1 = habitableZone(TEFF, L, '1');
const rows = PLANETS.map((p) => {
  const a = auForPeriod(p.P, MS), m = minMass(p.K, MS, p.P).m / M_EARTH; // circular orbits assumed for the masses
  return { id: p.id, P: p.P, K: p.K, a: +a.toFixed(4), msini: +m.toFixed(2), S: +insolation(L, a).toFixed(3), Teq: Math.round(tEq(L, a, ALBEDO)) };
});

// Figure 1: the planets against the habitable zone (distance in AU, height = minimum mass).
const E = hz.edges, fig1 = chart({
  title: 'GJ 887: the planets and the habitable zone', xLabel: 'Distance from the star (AU)', yLabel: 'Minimum mass (Earths)',
  series: [
    { name: 'Planets', kind: 'dots', x: rows.map((r) => r.a), y: rows.map((r) => r.msini), size: 4.5 },
    ...rows.map((r) => ({ name: '', kind: 'dots', x: [r.a], y: [r.msini], size: 0.1, noLegend: true, label: { text: r.id.split(' ')[0], dx: 6, dy: -6 } })),
  ],
  bands: [{ x0: hz.optimistic[0], x1: hz.optimistic[1], text: '' }, { x0: hz.conservative[0], x1: hz.conservative[1], text: 'habitable zone' }],
  xDomain: [0, 0.45], yDomain: [0, 10],
  desc: `GJ 887's planets by distance and minimum mass. The conservative habitable zone runs from ${hz.conservative[0].toFixed(3)} to ${hz.conservative[1].toFixed(3)} AU; planet d at ${rows[4].a.toFixed(3)} AU sits inside it.`, height: 280,
});

// Figure 2: how fast the star is pulled by each planet, simulated as circular orbits over 60 days (illustration only).
const tt = Array.from({ length: 241 }, (_, i) => i * 0.25);
const sig = (p, t) => p.K * Math.sin(2 * Math.PI * t / p.P);
const fig2 = chart({
  title: 'The star\'s wobble from each planet (simulated, circular orbits)', xLabel: 'Days', yLabel: 'Speed (m/s)',
  series: [
    { name: 'All four planets', kind: 'line', x: tt, y: tt.map((t) => +PLANETS.slice(1).reduce((s, p) => s + sig(p, t), 0).toFixed(3)) },
    { name: 'Planet d alone', kind: 'line', x: tt, y: tt.map((t) => +sig(PLANETS[4], t).toFixed(3)) },
  ],
  xDomain: [0, 60], yDomain: [-8, 8], hlines: [{ y: 0, text: '' }],
  desc: 'The combined pull of four planets on GJ 887 is a few metres per second; the habitable-zone planet d alone swings the star by only 1.8 m/s.', height: 280,
});

const facts = { rows, hz5: { cons: hz.conservative.map((x) => x.toFixed(4)), opt: hz.optimistic.map((x) => x.toFixed(4)) }, hz1: { cons: hz1.conservative.map((x) => x.toFixed(4)) }, ly: (DIST * 3.261563777).toFixed(2), periodsHZ: [hz.conservative[0], hz.conservative[1]].map((a) => (365.25636 * Math.sqrt(a ** 3 / MS)).toFixed(1)), ratio: (rows[1].P / rows[0].P).toFixed(4) };
console.log(JSON.stringify(facts));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'hz', figure(fig1, 'Figure 1. GJ 887\'s planets (minimum masses from the paper\'s semi-amplitudes, circular orbits assumed) against the habitable zone from the Habitable zone calculator\'s maths: conservative zone labelled, optimistic zone the lighter band around it.'));
  md = inject(md, 'rv', figure(fig2, 'Figure 2. The wobble each planet causes, simulated as circular orbits with the paper\'s semi-amplitudes and periods, starting in step. An illustration, not the HARPS or ESPRESSO data.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
