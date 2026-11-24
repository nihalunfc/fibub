// Figures for src/blog/discoveries/s-cluster-stars-schwarzschild-pericentre-precession-sgr-a.md, made with the
// maths of the Schwarzschild orbit plotter (src/lib/sci/phgr.ts: bound(), circular(), lightRay()).
// Run: node scripts/blog-figures/s-cluster-stars-schwarzschild-pericentre-precession-sgr-a.mjs
import fs from 'node:fs';
import { bound, circular, lightRay, M_SUN_M } from '../../src/lib/sci/phgr.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/s-cluster-stars-schwarzschild-pericentre-precession-sgr-a.md', import.meta.url);
const AU = 1.495978707e11;
const ARCMIN = (rad) => (rad * 180 * 60) / Math.PI;

// Orbit sizes from Casiero, Consolati and Mascolo (2026), Universe 12(11): 318, doi:10.3390/universe12110318 (CC BY 4.0).
// S2's elements are NOT in that paper's readable text; they are the GRAVITY Collaboration (2022) values, OUR addition.
const STARS = [
  { id: 'S2', a: 1020, e: 0.88466, paper: 12 },
  { id: 'S62', a: 740.08, e: 0.976, paper: 75 },
  { id: 'S4714', a: 841.35, e: 0.985, paper: 104 },
  { id: 'S22', a: 10802.26, e: 0.449, paper: null },
  { id: 'S91', a: 15807.58, e: 0.303, paper: null },
];

/** One star's orbit in units of M = GM/c² for a black hole of `Ms` solar masses, and what the tool's maths gives. */
function orbit(s, Ms) {
  const M = (Ms * M_SUN_M) / AU; // M in au
  const rp = (s.a * (1 - s.e)) / M, ra = (s.a * (1 + s.e)) / M;
  const o = bound(rp, ra);
  return { rp, ra, rpRs: rp / 2, M, ...o, arcmin: ARCMIN(o.precession), weakArcmin: ARCMIN(o.weak) };
}

const MS_G = 4.297e6; // GRAVITY Collaboration (2022) mass of Sgr A*
const MS_P = 4.1e6; // the mass the paper's numbers imply (this article's result)
const table = STARS.map((s) => {
  const g = orbit(s, MS_G), p = orbit(s, MS_P);
  const implied = s.paper ? (MS_G * s.paper) / g.arcmin : null;
  return { id: s.id, a: s.a, e: s.e, paper: s.paper, rpRs: +p.rpRs.toFixed(0), rpAu: +(s.a * (1 - s.e)).toFixed(2),
    gravity: +g.arcmin.toFixed(2), best: +p.arcmin.toFixed(2), weak: +p.weakArcmin.toFixed(2),
    exactOverWeak: +(((p.precession / p.weak) - 1) * 100).toFixed(3), E: +p.E.toFixed(8), L: +p.L.toFixed(1),
    implied: implied ? +(implied / 1e6).toFixed(3) : null };
});

// ---- Figure 1: precession per orbit against the assumed black hole mass ----
const masses = Array.from({ length: 121 }, (_, i) => 3.4e6 + i * (5.0e6 - 3.4e6) / 120);
const three = STARS.filter((s) => s.paper);
const fig1 = chart({
  title: 'Pericentre advance against the mass of Sgr A*',
  xLabel: 'Assumed black hole mass (million suns)', yLabel: 'Advance per orbit (arcminutes)',
  series: [
    ...three.map((s) => ({ name: s.id, kind: 'line', x: masses.map((m) => m / 1e6), y: masses.map((m) => +orbit(s, m).arcmin.toFixed(3)) })),
  ],
  xDomain: [3.4, 5.0], yDomain: [0, 130],
  hlines: three.map((s) => ({ y: s.paper, text: `${s.id}: paper ${s.paper}′` })),
  vlines: [{ x: 4.1, text: '4.1 million' }],
  desc: 'The advance per orbit worked out by the tool for S2, S62 and S4714 rises in proportion to the assumed black hole mass. The three dashed lines are the values the paper reports; all three are crossed near 4.1 million solar masses.',
  height: 300,
});

// ---- Figure 2: how far the exact result sits above the weak-field formula ----
const rsGrid = Array.from({ length: 160 }, (_, i) => 8 * Math.pow(3000 / 8, i / 159)); // pericentre in Schwarzschild radii
const excess = (eccen) => rsGrid.map((rs) => {
  const rp = 2 * rs, ra = (rp * (1 + eccen)) / (1 - eccen), o = bound(rp, ra);
  return o ? +(((o.precession / o.weak) - 1) * 100).toFixed(4) : NaN;
});
const fig2 = chart({
  title: 'Exact geodesic against the textbook 6πM/p formula',
  xLabel: 'Pericentre distance (Schwarzschild radii)', yLabel: 'Exact result above 6πM/p (%)',
  series: [
    { name: 'e = 0.985 (like S4714)', kind: 'line', x: rsGrid, y: excess(0.985) },
    { name: 'e = 0.885 (like S2)', kind: 'line', x: rsGrid, y: excess(0.88466) },
  ],
  xDomain: [8, 3000], yDomain: [0, 12],
  xTicks: [8, 100, 500, 1000, 1500, 2000, 2500, 3000],
  vlines: [{ x: table.find((t) => t.id === 'S4714').rpRs, text: 'S4714', dy: 0 }, { x: table.find((t) => t.id === 'S2').rpRs, text: 'S2', dy: 14 }],
  desc: 'The exact Schwarzschild advance divided by the weak-field formula, minus one, against pericentre distance. At the pericentres of S4714 and S2 the gap is well under one per cent; it only passes ten per cent inside about twenty Schwarzschild radii.',
  height: 290,
});

// ---- Key radii of a 4.1-million-solar-mass black hole, as the tool's table gives them ----
const Lm = MS_P * M_SUN_M;
const radii = { horizon: (2 * Lm) / 1000, photon: (3 * Lm) / 1000, isco: (6 * Lm) / 1000, shadow: (lightRay(1e4).bc * Lm) / 1000, iscoPeriodHours: (circular(6).Tcoord * MS_P * 4.925491e-6) / 3600 };

console.log(JSON.stringify({ table, radii, iscoAu: (6 * Lm) / AU, s4714: orbit(STARS[2], MS_P) }, (k, v) => (typeof v === 'number' ? +v.toPrecision(8) : v), 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'mass', figure(fig1, 'Figure 1. The pericentre advance per orbit that the Schwarzschild orbit plotter’s maths gives for three S-cluster stars, against the black hole mass you assume. The flat dashed lines are the three values the paper reports. All three are met at about 4.1 million solar masses, so the paper’s numbers hang together on one mass.'));
  md = inject(md, 'excess', figure(fig2, 'Figure 2. How much the exact Schwarzschild advance exceeds the weak-field formula 6πM/p, against how close the orbit comes in. Dashed lines mark the pericentres of S4714 and S2.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
