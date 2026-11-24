// Figures for src/blog/discoveries/hohmann-transfer-delta-v-continuous-thrust-augmented.md, made with the maths of the
// Orbit transfer calculator (src/lib/sci/orbit.ts: hohmann) and the Rocket equation (propellantFor).
// Run: node scripts/blog-figures/hohmann-transfer-delta-v-continuous-thrust-augmented.mjs   (rewrites the charts)
import fs from 'node:fs';
import { hohmann, BODIES, AU, propellantFor } from '../../src/lib/sci/orbit.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/hohmann-transfer-delta-v-continuous-thrust-augmented.md', import.meta.url);

// Inputs from the paper: Quarta (2025), Aerospace 12(4): 307, doi:10.3390/aerospace12040307 (CC BY).
// Stated: a classical Hohmann transfer that doubles the orbit radius needs about 28 % of the starting circular speed,
// and one that halves it about 40 %; the paper's plots cover ratios 0.5 to 2 and Earth-Venus, Earth-Mars and an
// Earth-orbit raising case. The planet distances (0.7233 and 1.5237 AU) are the tool's own presets; the 300 km
// starting orbit and doubling to 13,356 km radius are OUR example.
const mu1 = 1, r1 = 1; // dimensionless: speeds in units of sqrt(mu/r_i), times in units of sqrt(r_i³/mu)
const frac = (rho) => hohmann(mu1, r1, rho).dv; // Δv / v_c
const tofN = (rho) => hohmann(mu1, r1, rho).tof; // = π √(((1+ρ)/2)³)
const rhos = Array.from({ length: 151 }, (_, i) => 0.5 + i * 0.01);
const fig1 = chart({
  title: 'Hohmann transfer cost as a share of the starting speed', xLabel: 'Orbit ratio ρ = target radius ÷ start radius', yLabel: 'Total Δv ÷ starting circular speed',
  series: [
    { name: 'Tool: Hohmann total', kind: 'line', x: rhos, y: rhos.map((r) => +frac(r).toFixed(4)) },
    { name: 'Paper: about 0.28 and 0.40', kind: 'dots', x: [0.5, 2], y: [0.40, 0.28], size: 4.5, colour: 'var(--ink)' },
  ],
  xDomain: [0.5, 2], yDomain: [0, 0.45],
  desc: `Hohmann total delta-v divided by the starting circular speed, for target-to-start radius ratios 0.5 to 2. It is ${frac(2).toFixed(4)} at a ratio of 2 and ${frac(0.5).toFixed(4)} at 0.5.`, height: 260,
});
const fig2 = chart({
  title: 'Hohmann flight time against orbit ratio', xLabel: 'Orbit ratio ρ', yLabel: 'Flight time ÷ (start period ÷ 2π)',
  series: [{ name: 'Tool: half the transfer orbit', kind: 'line', x: rhos, y: rhos.map((r) => +tofN(r).toFixed(4)) }],
  xDomain: [0.5, 2], yDomain: [0, 7], hlines: [{ y: Math.PI, text: 'π: half the starting orbit' }],
  vlines: [{ x: 0.7233, text: 'Venus' }, { x: 1.5237, text: 'Mars' }],
  desc: `Hohmann flight time in units of the start orbit's period over 2 pi: ${tofN(0.5).toFixed(3)} at a ratio of 0.5, pi at 1 and ${tofN(2).toFixed(3)} at 2.`, height: 240,
});

const S = BODIES.find((b) => b.id === 'sun').mu, E = BODIES.find((b) => b.id === 'earth');
const vM = hohmann(S, AU, 1.5237 * AU), vV = hohmann(S, AU, 0.7233 * AU);
const leo = hohmann(E.mu, E.radius + 300, 2 * (E.radius + 300));
const r = (h) => ({ dv1: +h.dv1.toFixed(3), dv2: +h.dv2.toFixed(3), dv: +h.dv.toFixed(3), v1: +h.v1.toFixed(3), frac: +(h.dv / h.v1).toFixed(4), days: +(h.tof / 86400).toFixed(1), hours: +(h.tof / 3600).toFixed(3) });
// Rocket equation: propellant per kg of final mass for the doubling burn at two exhaust speeds (our examples: Isp 320 s chemical, 1600 s electric).
const prop = (dv, isp) => +propellantFor(dv * 1000, isp, 1).toFixed(3);
const out = {
  rho2: { dv1: +hohmann(1, 1, 2).dv1.toFixed(4), dv2: +hohmann(1, 1, 2).dv2.toFixed(4), dv: +frac(2).toFixed(4) },
  rhoHalf: { dv1: +hohmann(1, 1, 0.5).dv1.toFixed(4), dv2: +hohmann(1, 1, 0.5).dv2.toFixed(4), dv: +frac(0.5).toFixed(4) },
  peak: (() => { let best = [0, 0]; for (let x = 1; x <= 30; x += 0.001) { const f = frac(x); if (f > best[1]) best = [x, f]; } return { rho: +best[0].toFixed(2), frac: +best[1].toFixed(4) }; })(),
  tof: { half: +tofN(0.5).toFixed(3), two: +tofN(2).toFixed(3) },
  mars: r(vM), venus: r(vV), leo: r(leo),
  propLeo: { isp320: prop(leo.dv, 320), isp1600: prop(leo.dv, 1600) },
};
console.log(JSON.stringify(out));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'cost', figure(fig1, 'Figure 1. Total velocity change of a classical Hohmann transfer as a share of the starting circular speed, from the Orbit transfer calculator\'s maths, for the range of orbit ratios the paper plots. The dots are the paper\'s stated "about 28 %" (doubling) and "about 40 %" (halving).'));
  md = inject(md, 'time', figure(fig2, 'Figure 2. Hohmann flight time for the same range, in units of the starting orbit\'s period divided by 2π (so π means half a starting orbit). The dashed lines mark the Venus and Mars ratios round the Sun.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((x) => (x.length / 1024).toFixed(1) + ' KB').join(', '));
}
