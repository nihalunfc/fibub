// Figures for src/blog/discoveries/rice-leaf-light-response-canopy-position.md, made with the maths of the
// Photosynthesis curve fitter (src/lib/sci/photosynth.ts: the non-rectangular hyperbola and its fit).
// Run: node scripts/blog-figures/rice-leaf-light-response-canopy-position.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { nrhGross, fitLight } from '../../src/lib/sci/photosynth.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/rice-leaf-light-response-canopy-position.md', import.meta.url);

// Inputs from the paper: Guo and Lv (2025), Agronomy 15(1): 125, doi:10.3390/agronomy15010125 (CC BY).
// The 19 light steps (µmol m-2 s-1); the top-of-range values for the second leaf (net maximum 35.92, α 0.0563, Rd 0.90)
// and the seventh leaf (net maximum 16.00, α 0.0385, Rd 0.46). θ = 0.7 is OUR assumption (the paper gives no value).
const PPFD = [0, 30, 50, 70, 100, 150, 200, 300, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 1900, 1950, 2000];
const THETA = 0.7;
const LEAVES = [{ id: 'Second leaf from the top', pmax: 35.92, phi: 0.0563, rd: 0.90 }, { id: 'Seventh leaf from the top', pmax: 16.0, phi: 0.0385, rd: 0.46 }];
// Gross Amax so that net A at 2000 µmol m-2 s-1 equals the paper's net maximum (bisection).
const amaxFor = (L) => { let lo = L.pmax, hi = L.pmax * 3; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; nrhGross(2000, m, L.phi, THETA) - L.rd < L.pmax ? (lo = m) : (hi = m); } return (lo + hi) / 2; };

let seed = 125; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
const res = LEAVES.map((L) => {
  const amax = amaxFor(L), net = (I) => nrhGross(I, amax, L.phi, THETA) - L.rd;
  const A = PPFD.map((I) => +(net(I) + 0.3 * gauss()).toFixed(2)); // simulated, 0.3 µmol m-2 s-1 noise (our assumption)
  const free = fitLight(PPFD, A), fixed = fitLight(PPFD, A, 0.7), exact = fitLight(PPFD, PPFD.map((I) => +net(I).toFixed(2)));
  const sat = [0.75, 0.9, 0.95].map((f) => Math.round(fitLight(PPFD, PPFD.map((I) => +net(I).toFixed(2)), null, f).isat));
  return { ...L, amax, A, net, free, fixed, exact, sat };
});

const II = Array.from({ length: 101 }, (_, i) => i * 20);
const fig1 = chart({
  title: 'Rice leaves: net photosynthesis against light', xLabel: 'Light, PPFD (µmol m⁻² s⁻¹)', yLabel: 'Net A (µmol m⁻² s⁻¹)',
  series: [
    { name: 'Leaf 2 (simulated)', kind: 'dots', x: PPFD, y: res[0].A, size: 3 },
    { name: 'Leaf 7 (simulated)', kind: 'dots', x: PPFD, y: res[1].A, size: 3 },
    { name: '', noLegend: true, kind: 'line', x: II, y: II.map((I) => +(nrhGross(I, res[0].free.amax, res[0].free.phi, res[0].free.theta) - res[0].free.rd).toFixed(2)), colour: 'var(--c-blog)' },
    { name: '', noLegend: true, kind: 'line', x: II, y: II.map((I) => +(nrhGross(I, res[1].free.amax, res[1].free.phi, res[1].free.theta) - res[1].free.rd).toFixed(2)), colour: 'var(--c-tools)' },
  ],
  xDomain: [0, 2000], yDomain: [-2, 40], hlines: [{ y: 0, text: '' }],
  desc: `Simulated light-response curves for the second and seventh rice leaves, with the fitted non-rectangular hyperbolas. The upper leaf levels off near ${res[0].pmax} and the lower one near ${res[1].pmax} µmol m-2 s-1.`, height: 280,
});
const lo = Array.from({ length: 61 }, (_, i) => i * 2);
const fig2 = chart({
  title: 'Low light: where each leaf breaks even', xLabel: 'Light, PPFD (µmol m⁻² s⁻¹)', yLabel: 'Net A (µmol m⁻² s⁻¹)',
  series: res.map((r, k) => ({ name: k ? 'Leaf 7' : 'Leaf 2', kind: 'line', x: lo, y: lo.map((I) => +r.net(I).toFixed(3)) })),
  xDomain: [0, 120], yDomain: [-1.5, 6], hlines: [{ y: 0, text: '' }],
  vlines: res.map((r, k) => ({ x: +r.exact.lcp.toFixed(1), text: `${r.exact.lcp.toFixed(1)}`, left: k === 1, dy: k * 14 })),
  desc: `The first 120 µmol m-2 s-1 of light. The light compensation point, where net photosynthesis crosses zero, is ${res[0].exact.lcp.toFixed(1)} for the second leaf and ${res[1].exact.lcp.toFixed(1)} for the seventh.`, height: 260,
});

const fx = (f) => ({ amax: +f.amax.toFixed(2), phi: +f.phi.toFixed(4), theta: +f.theta.toFixed(3), rd: +f.rd.toFixed(2), lcp: +f.lcp.toFixed(1), isat: Math.round(f.isat), r2: +f.r2.toFixed(4), se: f.se.map((v) => +v.toPrecision(2)) });
console.log(JSON.stringify(res.map((r) => ({ id: r.id, amaxTrue: +r.amax.toFixed(2), rdOverPhi: +(r.rd / r.phi).toFixed(1), A: r.A, free: fx(r.free), fixed: fx(r.fixed), exact: fx(r.exact), sat: r.sat }))));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'curves', figure(fig1, 'Figure 1. Simulated light-response curves for the second and seventh leaves from the top, built from the paper\'s top-of-range values with a curvature of 0.7 (our assumption) and a small random scatter, and the non-rectangular hyperbolas the Photosynthesis curve fitter\'s maths fits to them. Not the paper\'s measurements.'));
  md = inject(md, 'lcp', figure(fig2, 'Figure 2. The low-light end of the same curves (no scatter). Each dashed line marks the light compensation point worked out by the fitter.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
