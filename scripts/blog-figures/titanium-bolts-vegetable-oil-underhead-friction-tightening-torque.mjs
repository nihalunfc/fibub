// Figures for src/blog/discoveries/titanium-bolts-vegetable-oil-underhead-friction-tightening-torque.md, made with
// the maths of the Bolt torque calculator (src/lib/sci/eng-bolt.ts: the thread and under-head friction torque split).
// Run: node scripts/blog-figures/titanium-bolts-vegetable-oil-underhead-friction-tightening-torque.mjs
import fs from 'node:fs';
import { torqueFriction, stressArea, pitchDia } from '../../src/lib/sci/eng-bolt.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/titanium-bolts-vegetable-oil-underhead-friction-tightening-torque.md', import.meta.url);

// Inputs from the paper: Croccolo et al. (2025), Eng. Proc. 85: 52, doi:10.3390/engproc2025085052 (CC BY): M10 × 1.25
// socket head cap screws (ISO 4762); target preload 44.5 kN; torque cut-off 60 Nm; under-head friction about 0.15
// (steel, start), 0.10 to 0.20 (steel, settled), 0.35 falling to 0.20 (Ti, castor oil), 0.38 to 0.48 (Ti, VG46, final),
// 0.40 to 0.60 (Ti, coconut oil, final); preloads about 16.6 kN (10 rpm) and 19.5 kN (250 rpm, torque above 80 Nm)
// for Ti with coconut oil. OUR assumptions: thread friction 0.12 (the paper gives no number, only "about equal to
// steel"), bearing face 16 mm (the ISO 4762 M10 head) and hole 10.5 mm.
const d = 10, P = 1.25, MUT = 0.12, DW = 16, DH = 10.5, F = 44500;
const split = (mub, mut = MUT, p = P) => torqueFriction(1, d, p, mut, mub, DW, DH); // per newton of preload, N·mm
const MU = Array.from({ length: 61 }, (_, i) => +(0.05 + i * 0.01).toFixed(2));
const CASES = [
  { id: 'Steel, settled (coconut oil)', mub: 0.10 }, { id: 'Steel, start', mub: 0.15 }, { id: 'Ti, castor oil, settled', mub: 0.20 },
  { id: 'Ti, castor oil, start', mub: 0.35 }, { id: 'Ti, VG46 final, low', mub: 0.38 }, { id: 'Ti, coconut oil final, low', mub: 0.40 },
  { id: 'Ti, VG46 final, high', mub: 0.48 }, { id: 'Ti, coconut oil final, high', mub: 0.60 },
];
const tab = CASES.map((c) => { const s = split(c.mub); return { ...c, K: s.K, Tneed: (s.T * F) / 1e3, bearPct: (100 * s.bearing) / s.T, threadPct: (100 * s.thread) / s.T, pitchPct: (100 * s.pitch) / s.T, F60: 60e3 / s.T / 1e3, F80: 80e3 / s.T / 1e3 }; });
const sens = [0.08, 0.12, 0.16].map((mut) => ({ mut, F60: [0.4, 0.6].map((mub) => 60e3 / split(mub, mut).T / 1e3), F80: [0.48, 0.55].map((mub) => 80e3 / split(mub, mut).T / 1e3) }));
const p15 = [1.25, 1.5].map((p) => (split(0.15, MUT, p).T * F) / 1e3);

const fig1 = chart({
  title: 'Torque to reach 44.5 kN in an M10 × 1.25 screw', xLabel: 'Under-head friction μb', yLabel: 'Tightening torque (N·m)',
  series: [{ name: 'Torque needed', kind: 'line', x: MU, y: MU.map((m) => +((split(m).T * F) / 1e3).toFixed(2)) }],
  xDomain: [0.05, 0.65], yDomain: [0, 240], hlines: [{ y: 60, text: '60 N·m cut-off' }],
  bands: [{ x0: 0.1, x1: 0.2, text: 'steel' }, { x0: 0.38, x1: 0.6, text: 'Ti, final' }],
  desc: `Torque needed for a 44.5 kN preload rises from ${tab[0].Tneed.toFixed(0)} N·m at μb 0.10 to ${tab[7].Tneed.toFixed(0)} N·m at μb 0.60, with thread friction 0.12 (our assumption).`, height: 260,
});
const fig2 = chart({
  title: 'Preload a given torque buys', xLabel: 'Under-head friction μb', yLabel: 'Preload (kN)',
  series: [
    { name: '60 N·m', kind: 'line', x: MU, y: MU.map((m) => +(60e3 / split(m).T / 1e3).toFixed(2)) },
    { name: '80 N·m', kind: 'line', x: MU, y: MU.map((m) => +(80e3 / split(m).T / 1e3).toFixed(2)) },
  ],
  xDomain: [0.05, 0.65], yDomain: [0, 60], hlines: [{ y: 44.5, text: 'target 44.5 kN' }, { y: 19.5, text: '19.5 kN measured, 250 rpm' }, { y: 16.6, text: '' }],
  bands: [{ x0: 0.4, x1: 0.6, text: 'Ti, coconut oil' }],
  desc: `Preload from 60 and 80 N·m against under-head friction. In the titanium coconut-oil range (μb 0.40 to 0.60), 60 N·m gives ${tab[7].F60.toFixed(1)} to ${tab[5].F60.toFixed(1)} kN, and 80 N·m gives ${tab[7].F80.toFixed(1)} to ${tab[5].F80.toFixed(1)} kN.`, height: 260,
});

console.log(JSON.stringify({ As: +stressArea(d, P).toFixed(2), d2: +pitchDia(d, P).toFixed(3), stress: +(F / stressArea(d, P)).toFixed(0), tab: tab.map((t) => ({ id: t.id, mub: t.mub, K: +t.K.toFixed(3), T: +t.Tneed.toFixed(1), bear: +t.bearPct.toFixed(0), thread: +t.threadPct.toFixed(0), pitch: +t.pitchPct.toFixed(0), F60: +t.F60.toFixed(1), F80: +t.F80.toFixed(1) })), sens: sens.map((s) => ({ mut: s.mut, F60: s.F60.map((v) => +v.toFixed(1)), F80: s.F80.map((v) => +v.toFixed(1)) })), pitch: p15.map((v) => +v.toFixed(1)) }));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'torque', figure(fig1, 'Figure 1. Tightening torque needed for a 44.5 kN preload in an M10 × 1.25 screw as the under-head friction rises, from the Bolt torque calculator\'s friction split, with thread friction 0.12 and a 16 mm by 10.5 mm bearing face (our assumptions). Shaded: the under-head friction ranges the paper reports for steel and for titanium in final tightening.'));
  md = inject(md, 'preload', figure(fig2, 'Figure 2. Preload reached with 60 and 80 N·m of torque against under-head friction, same assumptions. Dashed: the 44.5 kN target, and the 19.5 kN and 16.6 kN preloads the paper reports for titanium screws with coconut oil.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
