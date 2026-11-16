// Figures for src/blog/discoveries/mu-herculis-quadruple-star-orbits-dynamical-masses.md, made with the maths of the
// Double star calculator (src/lib/sci/visualbinary.ts).
// Run: node scripts/blog-figures/mu-herculis-quadruple-star-orbits-dynamical-masses.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { orbitAt, systemMass } from '../../src/lib/sci/visualbinary.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/mu-herculis-quadruple-star-orbits-dynamical-masses.md', import.meta.url);

// Inputs from Marcussen et al. (2026), A&A 709, A145, doi:10.1051/0004-6361/202658981 (CC BY 4.0), joint solution:
// Aa-Ab: P 78.987 yr, periastron BJD 2460156.6, e 0.379, i 62.39, node 267.50, omega 50.303, a 20.418 au, a1 3.427 au.
// B-C:   P 43.141 yr, periastron BJD 2454637.0, e 0.179, i 66.10, node 60.48, omega 173.430, a 11.705 au, a1 5.664 au.
// Parallax 120.069 mas; masses Aa 1.134, Ab 0.2286, B 0.417, C 0.445 Suns.
const PLX = 0.120069; // arcsec
const yearOfBJD = (b) => 2000 + (b - 2451545.0) / 365.25;
const A = { P: 78.987, T: yearOfBJD(2460156.6), e: 0.379, a: 20.418 * PLX, i: 62.39, node: 267.50, omega: 50.303 };
const BC = { P: 43.141, T: yearOfBJD(2454637.0), e: 0.179, a: 11.705 * PLX, i: 66.10, node: 60.48, omega: 173.430 };
const paper = { A: 1.134 + 0.2286, BC: 0.417 + 0.445 };

const extremes = (o) => { let mn = [9, 0], mx = [0, 0]; for (let k = 0; k <= 20000; k++) { const y = o.T + (k / 20000) * o.P, r = orbitAt(o, y).rho; if (r < mn[0]) mn = [r, y]; if (r > mx[0]) mx = [r, y]; } return { min: mn.map((x) => +x.toFixed(3)), max: mx.map((x) => +x.toFixed(3)) }; };
const facts = {
  TA: +A.T.toFixed(3), TBC: +BC.T.toFixed(3), aA: +A.a.toFixed(4), aBC: +BC.a.toFixed(4),
  massA: +systemMass(A.a, A.P, PLX).toFixed(4), massBC: +systemMass(BC.a, BC.P, PLX).toFixed(4), paper,
  Ab: +((3.427 / 20.418) * paper.A).toFixed(4), lighterBC: +((5.664 / 11.705) * paper.BC).toFixed(4),
  periA: +(20.418 * (1 - 0.379)).toFixed(2), apoA: +(20.418 * (1 + 0.379)).toFixed(2),
  exA: extremes(A), exBC: extremes(BC), now: [2026.9].map((y) => ({ y, A: orbitAt(A, y), BC: orbitAt(BC, y) })),
  cycles: +((2026 - 1750) / A.P).toFixed(2),
};

// Figure 1: the two inner orbits as seen on the sky (east to the left, as on a sky map).
const ring = (o) => Array.from({ length: 181 }, (_, k) => orbitAt(o, o.T + (k / 180) * o.P));
const rA = ring(A), rB = ring(BC), nA = orbitAt(A, 2026.9), nB = orbitAt(BC, 2026.9);
const fig1 = chart({
  title: 'The two inner orbits on the sky', xLabel: 'East (arcseconds)', yLabel: 'North (arcseconds)',
  series: [
    { name: 'Ab round Aa', kind: 'line', x: rA.map((p) => +(-p.east).toFixed(3)), y: rA.map((p) => +p.north.toFixed(3)) },
    { name: 'B round C', kind: 'line', x: rB.map((p) => +(-p.east).toFixed(3)), y: rB.map((p) => +p.north.toFixed(3)) },
    { name: 'Late 2026', kind: 'dots', x: [nA.east, nB.east].map((v) => +(-v).toFixed(3)), y: [nA.north, nB.north].map((v) => +v.toFixed(3)), size: 4.5, colour: 'var(--ink)' },
    { name: '', kind: 'dots', x: [0], y: [0], size: 3, colour: 'var(--muted)', noLegend: true, label: { text: 'primary', dx: 6, dy: -6 } },
  ],
  xDomain: [-3, 3], yDomain: [-2.5, 2.5], height: 300, xTicks: [-3, -2, -1, 0, 1, 2, 3], xFmt: (t) => String(t === 0 ? 0 : -t),
  desc: `Apparent relative orbits of mu Herculis Ab round Aa (up to ${facts.exA.max[0]} arcseconds apart) and of the B-C pair (up to ${facts.exBC.max[0]} arcseconds), from the paper's orbital elements.`,
});

// Figure 2: separation of Aa-Ab since the first usable measurement in 1750.
const yrs = Array.from({ length: 281 }, (_, k) => 1750 + k);
const fig2 = chart({
  title: 'Separation of µ Her Aa and Ab since 1750', xLabel: 'Year', yLabel: 'Separation (arcseconds)',
  series: [
    { name: 'Aa–Ab', kind: 'line', x: yrs, y: yrs.map((y) => +orbitAt(A, y).rho.toFixed(3)) },
    { name: 'B–C', kind: 'line', dash: '4 3', x: yrs, y: yrs.map((y) => +orbitAt(BC, y).rho.toFixed(3)) },
  ],
  xDomain: [1750, 2030], yDomain: [0, 3.2], vlines: [{ x: 2023.58, text: '2023 periastron', left: true }], height: 250,
  desc: 'Separation of the two inner pairs from 1750 to 2030 from the paper\'s orbits: Aa-Ab cycles every 79 years, B-C every 43 years.',
});

console.log(JSON.stringify(facts));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'sky', figure(fig1, 'Figure 1. Where each companion sits relative to its primary over one orbit, from the paper\'s orbital elements and the Double star calculator\'s maths (east to the left, as on the sky). Dots: late 2026. The two pairs are drawn round a common origin; on the sky they are far apart.'));
  md = inject(md, 'sep', figure(fig2, 'Figure 2. The predicted separation of the two inner pairs since 1750, the year of the first measurement the paper could use. Worked out from the fitted orbit, not the historical measurements themselves.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
