// Figures for src/blog/discoveries/lake-biwa-internal-waves-two-layer-wave-speed-rossby-radius-inertial-period.md,
// made with the maths of the Ocean currents calculator (src/lib/sci/oceancurrents.ts: Coriolis parameter, Rossby radii).
// Run: node scripts/blog-figures/lake-biwa-internal-waves-two-layer-wave-speed-rossby-radius-inertial-period.mjs
import fs from 'node:fs';
import { rossby, coriolis } from '../../src/lib/sci/oceancurrents.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/lake-biwa-internal-waves-two-layer-wave-speed-rossby-radius-inertial-period.md', import.meta.url);

// Inputs from the paper: Koue (2025), Water 17(19): 2905, doi:10.3390/w17192905 (CC BY). Latitude about 35.2° N,
// effective depth H ≈ 44 m; two-layer seasons (upper layer h1, density step Δρ) and the wave speeds and first-mode
// periods the paper reports. ρ0 = 1000 kg/m³ is OUR reading of the paper's g' (9.81 × 0.76 / 1000 = 7.46e-3).
const LAT = 35.2, H = 44, RHO0 = 1000;
const SEASONS = [
  { id: 'Spring', h1: 10, dr: 0.76, gPaper: 7.45e-3, cPaper: 0.240, TPaper: 146 },
  { id: 'Summer', h1: 15, dr: 2.7, gPaper: 2.65e-2, cPaper: 0.511, TPaper: 68.5 },
  { id: 'Autumn', h1: 20, dr: 0.70, gPaper: 6.87e-3, cPaper: 0.273, TPaper: 128 },
];
const f = coriolis(LAT), Tin = (2 * Math.PI) / f / 3600;
const res = SEASONS.map((s) => { const r = rossby(LAT, H, s.h1, s.dr, RHO0, 0); return { ...s, g: r.gPrime, c: r.cBaroclinic, Rd: r.twoLayer, Limplied: (s.TPaper * 3600 * r.cBaroclinic) / 2 }; });
const bt = rossby(LAT, H, 10, 0.76, RHO0, 0).barotropic;
console.log(JSON.stringify({ f, inertialHours: +Tin.toFixed(2), barotropicKm: +(bt / 1000).toFixed(1), cBarotropic: +Math.sqrt(9.81 * H).toFixed(2),
  seasons: res.map((r) => ({ id: r.id, g: +r.g.toPrecision(4), c: +r.c.toFixed(4), RdKm: +(r.Rd / 1000).toFixed(3), LimpliedKm: +(r.Limplied / 1000).toFixed(1), ratio36: +(36000 / r.Rd).toFixed(1) })) }));

// Figure 1: two-layer internal wave speed against the density step for the three upper-layer depths.
const DR = Array.from({ length: 61 }, (_, i) => i * 0.05);
const fig1 = chart({
  title: 'Internal wave speed in a 44 m deep two-layer lake', xLabel: 'Density step Δρ (kg/m³)', yLabel: 'Wave speed (m/s)',
  series: [
    ...[10, 15, 20].map((h1) => ({ name: `Upper layer ${h1} m`, kind: 'line', x: DR, y: DR.map((d) => +rossby(LAT, H, h1, d, RHO0, 0).cBaroclinic.toFixed(4)) })),
    { name: 'Paper: spring, summer, autumn', kind: 'dots', x: SEASONS.map((s) => s.dr), y: SEASONS.map((s) => s.cPaper), size: 4, colour: 'var(--ink)' },
  ],
  xDomain: [0, 3], yDomain: [0, 0.6], height: 270,
  desc: `Two-layer internal wave speed against the density step for upper layers of 10, 15 and 20 m, with the paper's three seasonal values (0.240, 0.511 and 0.273 m/s) on the curves.`,
});
// Figure 2: Rossby radius against the density step, same layers, with the seasons.
const fig2 = chart({
  title: 'Internal Rossby radius at 35.2° N', xLabel: 'Density step Δρ (kg/m³)', yLabel: 'Rossby radius (km)',
  series: [
    ...[10, 15, 20].map((h1) => ({ name: `Upper layer ${h1} m`, kind: 'line', x: DR, y: DR.map((d) => +(rossby(LAT, H, h1, d, RHO0, 0).twoLayer / 1000).toFixed(3)) })),
    { name: 'Seasons', kind: 'dots', x: res.map((r) => r.dr), y: res.map((r) => +(r.Rd / 1000).toFixed(3)), size: 4, colour: 'var(--ink)' },
  ],
  xDomain: [0, 3], yDomain: [0, 7], height: 270,
  desc: `Internal Rossby radius from the two-layer wave speed and the Coriolis parameter at 35.2° N: ${res.map((r) => `${r.id.toLowerCase()} ${(r.Rd / 1000).toFixed(1)} km`).join(', ')}.`,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'speed', figure(fig1, 'Figure 1. The two-layer internal wave speed √(g′h₁h₂/H) from the Ocean currents calculator\'s maths, for a 44 m deep lake with an upper layer of 10, 15 or 20 m, against the density step between the layers. The dots are the speeds the paper reports for its three seasons; each sits on its own curve.'));
  md = inject(md, 'rossby', figure(fig2, 'Figure 2. The internal Rossby radius, the wave speed divided by the Coriolis parameter at 35.2° N, for the same layers. Our recomputation; the paper does not give these values.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
