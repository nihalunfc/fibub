// Figures for src/blog/discoveries/binary-asteroid-emma-low-bulk-density-satellite-orbit.md, made with the maths of
// the Planet data explorer (src/lib/sci/planets.ts: parentMassFromOrbit and derived).
// Run: node scripts/blog-figures/binary-asteroid-emma-low-bulk-density-satellite-orbit.mjs
import fs from 'node:fs';
import { BODIES, derived, parentMassFromOrbit, body } from '../../src/lib/sci/planets.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/binary-asteroid-emma-low-bulk-density-satellite-orbit.md', import.meta.url);

// Inputs from the paper: Minker et al. (2025), A&A 701: A42, doi:10.1051/0004-6361/202554973 (CC BY 4.0).
// Satellite orbits (semi-major axis in km, period in days) and primary volume-equivalent sizes in km.
const CASES = [
  { id: 'emma', name: '(283) Emma', a: 588, P: 3.41, radii: [{ label: 'equivalent radius 71 km', R: 71, says: 0.9, err: 0.3 }, { label: 'alternative shape model, 133 km across', R: 66.5, says: 1.1, err: 0.1 }], mSays: 1.4e18, mErr: 0.2e18 },
  { id: 'pulcova', name: '(762) Pulcova', a: 738, P: 4.14, radii: [{ label: '136 km across', R: 68, says: 1.4, err: 0.2 }], mSays: 1.865e18, mErr: 0.019e18 },
  { id: 'pulcova-old', name: '(762) Pulcova, earlier solution', a: 703, P: 4.44, radii: [{ label: '149 km across', R: 74.5, says: 0.9, err: 0.1 }], mSays: 1.4e18, mErr: 0.1e18 },
  { id: 'emma-2008', name: '(283) Emma, Marchis et al. (2008) orbit', a: 581, P: 3.35, radii: [{ label: 'equivalent radius 71 km', R: 71, says: 0.9, err: 0.3 }], mSays: 1.4e18, mErr: 0.2e18 },
];

// A minimal Body for the tool's own functions: a satellite (for Kepler) and a primary (for the derived values).
const sat = (a, P) => ({ id: 's', name: 's', kind: 'moon', parent: 'p', mass: 0, radius: 1, a, period: P, ecc: 0, incl: 0 });
const prim = (mass, R) => ({ id: 'p', name: 'p', kind: 'dwarf', mass, radius: R, a: 1, period: 1, ecc: 0, incl: 0 });

const res = CASES.map((c) => {
  const M = parentMassFromOrbit(sat(c.a, c.P));
  return {
    ...c, M,
    speed: derived(sat(c.a, c.P)).orbitalSpeed,
    rows: c.radii.map((r) => { const d = derived(prim(M, r.R)); return { ...r, rho: d.density, gravity: d.gravity, escape: d.escape * 1000 }; }),
  };
});

// Figure 1: the mass from Kepler's third law against the assumed orbital period, at the paper's semi-major axes.
const span = (P0, P1, n = 61) => Array.from({ length: n }, (_, i) => P0 + (i * (P1 - P0)) / (n - 1));
const emP = span(3.2, 3.6), puP = span(3.95, 4.6);
const fig1 = chart({
  title: 'The mass comes from the satellite’s period', xLabel: 'Satellite orbital period (days)', yLabel: 'Primary mass (10¹⁸ kg)',
  series: [
    { name: '(283) Emma, a = 588 km', kind: 'line', x: emP, y: emP.map((P) => parentMassFromOrbit(sat(588, P)) / 1e18) },
    { name: '(762) Pulcova, a = 738 km', kind: 'line', x: puP, y: puP.map((P) => parentMassFromOrbit(sat(738, P)) / 1e18) },
  ],
  xDomain: [3.2, 4.6], yDomain: [1.2, 2.2],
  vlines: [{ x: 3.41, text: '3.41 d' }, { x: 4.14, text: '4.14 d' }, { x: 4.44, text: '4.44 d', dy: 14 }],
  desc: 'Two falling curves: the primary mass from Kepler’s third law against the satellite period, at the paper’s fixed semi-major axes. Emma gives 1.39 and Pulcova 1.86 times ten to the eighteen kilograms at the published periods.',
  height: 290,
});

// Figure 2: where these densities sit among the worlds the tool already knows.
const pts = BODIES.map((b) => ({ x: Math.log10(b.radius), y: derived(b).density, name: b.name }));
const extra = [
  { x: Math.log10(71), y: res[0].rows[0].rho, name: 'Emma' },
  { x: Math.log10(66.5), y: res[0].rows[1].rho, name: 'Emma (alt.)' },
  { x: Math.log10(68), y: res[1].rows[0].rho, name: 'Pulcova' },
];
const fig2 = chart({
  title: 'Less dense than any solid world in the table', xLabel: 'Radius (km)', yLabel: 'Bulk density (kg/m³)',
  series: [
    { name: 'planets, Pluto and large moons', kind: 'dots', x: pts.map((p) => p.x), y: pts.map((p) => p.y), size: 3.2 },
    { name: 'the paper’s two binaries', kind: 'dots', x: extra.map((p) => p.x), y: extra.map((p) => p.y), size: 4.2 },
  ],
  xDomain: [1.6, 5], yDomain: [500, 6000], xFmt: (t) => (10 ** t >= 1000 ? (10 ** t / 1000).toPrecision(2) + 'e+3' : String(Math.round(10 ** t))),
  hlines: [{ y: 1000, text: 'water, 1000 kg/m³' }],
  desc: 'Bulk density against radius on a logarithmic radius axis. Every planet, Pluto and large moon lies above 1300 kilograms per cubic metre except Saturn; Emma sits at about 920, below water.',
  height: 290,
});

const fx = (r) => ({ R: r.R, rho: +(r.rho / 1000).toFixed(3), gravity: +r.gravity.toFixed(4), escape: +r.escape.toFixed(1), paperSays: r.says });
console.log(JSON.stringify(res.map((r) => ({ name: r.name, M: +(r.M / 1e18).toFixed(4), paperM: r.mSays / 1e18, speedKmS: +r.speed.toFixed(4), rows: r.rows.map(fx) })), null, 1));
console.log('least dense worlds in the tool:', BODIES.map((b) => [b.name, Math.round(derived(b).density)]).sort((a, b) => a[1] - b[1]).slice(0, 4).map((p) => p.join(' ')).join(', '));
console.log('Phobos escape m/s', (derived(body('phobos')).escape * 1000).toFixed(1), 'gravity', derived(body('phobos')).gravity.toFixed(4));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'kepler', figure(fig1, 'Figure 1. The primary mass that Kepler’s third law gives for each satellite orbit, against the assumed period, with the semi-major axis held at the paper’s value. The dashed lines mark the published periods: Pulcova’s drop from 4.44 to 4.14 days raises its mass by a third.'));
  md = inject(md, 'density', figure(fig2, 'Figure 2. Bulk density against radius for every world in the Planet data explorer’s table, with the paper’s two binary primaries added from their Kepler mass and their measured size.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
