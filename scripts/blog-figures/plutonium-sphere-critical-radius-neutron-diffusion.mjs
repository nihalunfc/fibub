// Figures for src/blog/discoveries/plutonium-sphere-critical-radius-neutron-diffusion.md, made with the maths of the
// Neutron diffusion tool (src/lib/sci/eng-diffusion.ts: buckling, k_eff, critical size, flux shape, finite volumes).
// Run: node scripts/blog-figures/plutonium-sphere-critical-radius-neutron-diffusion.mjs
import fs from 'node:fs';
import { materialB2, kInf, L2, keff1, buckling, extrapolated, extrap, criticalSize, fdSolve, shape, volume } from '../../src/lib/sci/eng-diffusion.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/plutonium-sphere-critical-radius-neutron-diffusion.md', import.meta.url);

// Inputs from the paper: El-Ajou et al. (2023), Front. Phys. 11, 1229142 (CC BY). One-group pure 239Pu data:
// fission 0.0816, scattering 0.225216, capture 0.019584 (1/cm), nu = 2.84 neutrons per fission.
const SF = 0.0816, SS = 0.225216, SG = 0.019584, NU = 2.84;
const ST = SF + SS + SG, D = 1 / (3 * ST), SA = SF + SG, NUSF = NU * SF;
const M = { D, sigA: SA, nuSigF: NUSF };
const B2 = materialB2(M), B = Math.sqrt(B2), d = extrap(D);
const zf = criticalSize('sphere', B2, 0), ext = criticalSize('sphere', B2, d);
const PAPER = { D: 1.021241834, B: 0.357553294, zfbc: 8.7864, ebc: 6.9138, rbc: 6.5021 };

// Figure 1: k_eff against the sphere's radius, with and without the extrapolation distance.
const RR = Array.from({ length: 141 }, (_, i) => 3 + (i * 9) / 140);
const keffExt = (R) => keff1(M, buckling(extrapolated({ kind: 'sphere', R }, d)));
const keffBare = (R) => keff1(M, buckling({ kind: 'sphere', R }));
const fig1 = chart({
  title: 'Plutonium sphere: k_eff against radius', xLabel: 'Sphere radius R (cm)', yLabel: 'k_eff',
  series: [
    { name: 'With the 2.13 D extrapolation', kind: 'line', x: RR, y: RR.map((R) => +keffExt(R).toFixed(5)) },
    { name: 'Flux zero at the surface', kind: 'line', x: RR, y: RR.map((R) => +keffBare(R).toFixed(5)) },
  ],
  xDomain: [3, 12], yDomain: [0.3, 1.5], hlines: [{ y: 1, text: 'critical' }],
  vlines: [{ x: +ext.R.toFixed(3), text: `${ext.R.toFixed(2)} cm (tool)`, left: true }, { x: PAPER.zfbc, text: `${PAPER.zfbc} cm (paper, flux zero)` }],
  desc: `k_eff of a bare plutonium sphere against its radius, from the paper's one-group data. With the extrapolation distance the tool makes it critical at ${ext.R.toFixed(3)} cm; with the flux forced to zero at the surface, at ${zf.R.toFixed(3)} cm.`,
  height: 290,
});

// Figure 2: flux shape of the critical sphere, formula against the tool's finite-volume solve.
const gExt = extrapolated(ext, d), fd = fdSolve(M, gExt, 120);
const rr = Array.from({ length: 121 }, (_, i) => (i * gExt.R) / 120);
const fig2 = chart({
  title: 'Flux across the critical sphere', xLabel: 'Distance from the centre (cm)', yLabel: 'Flux ÷ centre flux',
  series: [
    { name: 'sin(Br)/Br formula', kind: 'line', x: rr, y: rr.map((r) => +shape(gExt, r).toFixed(5)) },
    { name: 'Finite volumes (120 cells)', kind: 'dots', x: fd.x.filter((_, i) => i % 6 === 0), y: fd.phi.filter((_, i) => i % 6 === 0).map((v) => +v.toFixed(5)), size: 3 },
  ],
  xDomain: [0, gExt.R], yDomain: [0, 1.05], vlines: [{ x: +ext.R.toFixed(3), text: 'metal surface', left: true }],
  desc: `The flux across the critical plutonium sphere, from the sin(Br)/Br formula and from the tool's finite-volume solve with 120 cells. The two agree to better than 0.1 % and the flux is still about ${(shape(gExt, ext.R) * 100).toFixed(0)} % of its centre value at the metal surface.`,
  height: 280,
});

const out = {
  St: +ST.toFixed(6), D: +D.toFixed(9), Sa: +SA.toFixed(6), nuSf: +NUSF.toFixed(6),
  kInf: +kInf(M).toFixed(5), L2: +L2(M).toFixed(5), B2: +B2.toFixed(8), B: +B.toFixed(9),
  dExtrap: +d.toFixed(4), zfbc: +zf.R.toFixed(4), ext: +ext.R.toFixed(4),
  vsRbc: +((ext.R / PAPER.rbc - 1) * 100).toFixed(2), vsEbc: +((ext.R / PAPER.ebc - 1) * 100).toFixed(2),
  keffAtRbc: +keffExt(PAPER.rbc).toFixed(5), keffAtEbc: +keffExt(PAPER.ebc).toFixed(5),
  fdK: +fd.k.toFixed(7), fluxAtSurface: +shape(gExt, ext.R).toFixed(4), volume: Math.round(volume(ext)),
  slab: +criticalSize('slab', B2, d).a.toFixed(3), cylInf: +criticalSize('cylinder', B2, d).R.toFixed(3),
  cylHD1: +criticalSize('cylinder', B2, d, 1).R.toFixed(3), cube: +criticalSize('cuboid', B2, d).a.toFixed(3),
};
console.log(JSON.stringify(out, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'keff', figure(fig1, `Figure 1. k_eff of a bare plutonium sphere against its radius, worked out by the Neutron diffusion tool's maths from the paper's one-group cross sections. The dashed lines mark the tool's critical radius of ${ext.R.toFixed(2)} cm (flux zero 2.175 cm outside the metal) and the paper's ${PAPER.zfbc} cm for a flux forced to zero at the surface itself.`));
  md = inject(md, 'flux', figure(fig2, 'Figure 2. The flux across the critical sphere: the sin(Br)/Br formula against the tool\'s own finite-volume solve with 120 cells. Both are normalised to the centre.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
