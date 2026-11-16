// Figures for src/blog/discoveries/toi-3288b-toi-4666b-gas-giants-m-dwarfs-nirps.md, made with the maths of the
// Exoplanet mass calculator (src/lib/sci/rvmass.ts) and the Habitable zone calculator (src/lib/sci/habitable.ts).
// Run: node scripts/blog-figures/toi-3288b-toi-4666b-gas-giants-m-dwarfs-nirps.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { minMass, semiMajor, density, radiusFromDepth, M_JUP, R_JUP, R_SUN, AU } from '../../src/lib/sci/rvmass.ts';
import { tEq, insolation, lumFrom } from '../../src/lib/sci/habitable.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/toi-3288b-toi-4666b-gas-giants-m-dwarfs-nirps.md', import.meta.url);

// Inputs, all from Frensch et al. (2026), A&A 707, A73, doi:10.1051/0004-6361/202557656 (CC BY 4.0):
// periods, joint semi-amplitudes K, planet radii, star masses (Mann et al. 2019 relation), radii (Mann et al. 2015),
// SED luminosities and temperatures; the paper's masses and Teq are kept only for the comparison column.
const PL = [
  { id: 'TOI-3288 b', P: 1.43, K: 511, Ms: 0.64, Rs: 0.67, L: 0.110, T: 3933, Rp: 1.00, paperM: 2.11, paperTeq: 1059 },
  { id: 'TOI-4666 b', P: 2.91, K: 144, Ms: 0.58, Rs: 0.59, L: 0.060, T: 3512, Rp: 1.11, paperM: 0.70, paperTeq: 713, paperS: 54 },
];
const rows = PL.map((p) => {
  const m = minMass(p.K, p.Ms, p.P).m, a = semiMajor(p.Ms, m, p.P) / AU; // transiting, so sin i is close to 1
  const depth = (p.Rp * R_JUP / (p.Rs * R_SUN)) ** 2, Lrt = lumFrom(p.Rs, p.T);
  return {
    id: p.id, mJ: +(m / M_JUP).toFixed(3), a: +a.toFixed(4), aR: +(a * AU / (p.Rs * R_SUN)).toFixed(2),
    depthPct: +(depth * 100).toFixed(2), rBack: +(radiusFromDepth(depth, p.Rs) / R_JUP).toFixed(3), rho: +(density(m, p.Rp * R_JUP) / 1000).toFixed(2),
    S: +insolation(p.L, a).toFixed(1), teqSED: Math.round(tEq(p.L, a, 0)), Lrt: +Lrt.toFixed(4), teqRT: Math.round(tEq(Lrt, a, 0)),
  };
});

// Figure 1: the star's wobble over one orbit (circular orbits, simulated from the paper's K; not the NIRPS data).
const ph = Array.from({ length: 101 }, (_, i) => i / 100);
const fig1 = chart({
  title: 'How hard each planet pulls its star (simulated)', xLabel: 'Orbital phase', yLabel: 'Star speed (m/s)',
  series: PL.map((p) => ({ name: `${p.id}, K = ${p.K} m/s`, kind: 'line', x: ph, y: ph.map((f) => Math.round(-p.K * Math.sin(2 * Math.PI * f))) })),
  xDomain: [0, 1], yDomain: [-600, 600], hlines: [{ y: 0, text: '' }], height: 260,
  desc: 'Circular-orbit wobble curves: TOI-3288 b swings its star by 511 m/s, TOI-4666 b by 144 m/s.',
});

// Figure 2: the planet mass the tool gives as the adopted star mass changes (mass scales as star mass to the 2/3).
const ms = Array.from({ length: 41 }, (_, i) => 0.4 + i * 0.01);
const fig2 = chart({
  title: 'Planet mass depends on the star mass you adopt', xLabel: 'Star mass (Suns)', yLabel: 'Planet mass (Jupiters)',
  series: [
    ...PL.map((p) => ({ name: p.id, kind: 'line', x: ms, y: ms.map((M) => +(minMass(p.K, M, p.P).m / M_JUP).toFixed(3)) })),
    { name: 'Paper', kind: 'dots', x: PL.map((p) => p.Ms), y: PL.map((p) => p.paperM), size: 4.5, colour: 'var(--ink)' },
  ],
  xDomain: [0.4, 0.8], yDomain: [0, 2.6], height: 260,
  desc: 'Planet mass from the same K grows with the star mass adopted; the paper\'s masses sit on the tool\'s curves at 0.64 and 0.58 solar masses.',
});

console.log(JSON.stringify(rows));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'rv', figure(fig1, 'Figure 1. The star\'s line-of-sight speed over one orbit for each planet, simulated as circular orbits from the paper\'s semi-amplitudes with the Exoplanet mass calculator\'s maths. An illustration, not the HARPS or NIRPS measurements.'));
  md = inject(md, 'mass', figure(fig2, 'Figure 2. The planet mass the Exoplanet mass calculator gives from each measured K, for star masses from 0.4 to 0.8 Suns. Dots: the paper\'s masses at its adopted star masses.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
