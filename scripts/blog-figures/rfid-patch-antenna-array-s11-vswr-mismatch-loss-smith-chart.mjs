// Figures for src/blog/discoveries/rfid-patch-antenna-array-s11-vswr-mismatch-loss-smith-chart.md, made with the maths of the
// Smith chart tool (src/lib/sci/eng-smith.ts), the Antenna size calculator (eng-antenna.ts) and the PCB trace calculator (eng-pcb.ts).
// Run: node scripts/blog-figures/rfid-patch-antenna-array-s11-vswr-mismatch-loss-smith-chart.mjs
import fs from 'node:fs';
import * as S from '../../src/lib/sci/eng-smith.ts';
import * as A from '../../src/lib/sci/eng-antenna.ts';
import * as P from '../../src/lib/sci/eng-pcb.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/rfid-patch-antenna-array-s11-vswr-mismatch-loss-smith-chart.md', import.meta.url);

// Values printed by El Ansari et al. (2022), E3S Web of Conferences 351: 01056, doi:10.1051/e3sconf/202235101056 (CC BY 4.0):
// Rogers RT/duroid 5880, er 2.2, thickness 1.56 mm, 2.4 GHz, 50 ohm feed; basic element S11 -24.57 dB, VSWR 1.12;
// 1x8 array S11 -13.14 dB, VSWR 1.56; patch 42.78 x 41.32 mm; quarter-wave transformer 24.05 x 0.72 mm; feed line width 4.84 mm.
const Z0 = 50, F = 2.4e9, ER = 2.2, H = 1.56e-3;
const T = 35e-6; // OUR assumption: 1 oz copper, the paper does not state it
// A reflection coefficient of a given S11 as a purely resistive load (OUR choice: only |Gamma| is known, so we take the real-axis load)
const loadFor = (s11) => { const g = 10 ** (s11 / 20); return S.mismatch([Z0 * (1 + g) / (1 - g), 0], Z0); };
const basic = loadFor(-24.57), arr = loadFor(-13.14);
const rLoad = (s11) => { const g = 10 ** (s11 / 20); return Z0 * (1 + g) / (1 - g); };
const p = A.patch(F, ER, H, Z0, 41.32e-3);
const zq = Math.sqrt(Z0 * p.Rin);
const zin = S.lineZin([p.Rin, 0], zq, 0.25);
const m = (w) => P.microstrip(w * 1e-3, H, T, ER), m0 = (w) => P.microstrip(w * 1e-3, H, 0, ER);
const lq = (299792458 / F / Math.sqrt(m(0.72).eeff)) / 4 * 1e3;
const wq = P.widthFor(zq, (w) => P.microstrip(w, H, T, ER).z0, 1e-4, 2e-2) * 1e3;
const wf = P.widthFor(50, (w) => P.microstrip(w, H, T, ER).z0, 1e-4, 2e-2) * 1e3;

const s11s = Array.from({ length: 49 }, (_, i) => -30 + i * 0.5);
const fig1 = chart({
  title: 'Return loss, VSWR and wasted power', xLabel: 'S11 (dB)', yLabel: 'VSWR',
  series: [
    { name: 'VSWR', x: s11s, y: s11s.map((s) => loadFor(s).vswr) },
    { name: 'Paper', kind: 'dots', x: [-24.57, -13.14], y: [1.12, 1.56], size: 5, colour: 'var(--ink)' },
  ],
  xDomain: [-30, -6], yDomain: [1, 3.2], hlines: [{ y: 2, text: 'VSWR 2' }],
  desc: 'VSWR against S11 in decibels from the Smith chart tool’s maths, with the paper’s two reported pairs as dots.',
});
const ws = Array.from({ length: 60 }, (_, i) => 0.3 + i * 0.1);
const fig2 = chart({
  title: 'Microstrip impedance against width', xLabel: 'Trace width (mm)', yLabel: 'Characteristic impedance (Ω)',
  series: [
    { name: 'Z0', x: ws, y: ws.map((w) => m(w).z0) },
    { name: 'Paper widths', kind: 'dots', x: [0.72, 4.84], y: [m(0.72).z0, m(4.84).z0], size: 5, colour: 'var(--ink)' },
  ],
  xDomain: [0.3, 6.2], yDomain: [30, 160], hlines: [{ y: 50, text: '50 Ω feed' }, { y: zq, text: `transformer ${zq.toFixed(0)} Ω` }],
  desc: 'Characteristic impedance of a microstrip line on 1.56 mm substrate of permittivity 2.2 against trace width, with the paper’s 0.72 mm transformer line and 4.84 mm feed line as dots.',
});
const out = { basic: { vswr: basic.vswr, gamma: basic.mag, rl: basic.returnLoss, ml: basic.mismatchLoss, refl: basic.powerReflected, R: rLoad(-24.57) },
  arr: { vswr: arr.vswr, gamma: arr.mag, rl: arr.returnLoss, ml: arr.mismatchLoss, refl: arr.powerReflected, R: rLoad(-13.14) },
  patch: { W: p.W, L: p.L * 1e3, eeff: p.eeff, Rin: p.Rin, inset: p.inset * 1e3, fCheck: p.fCheck, lambdag: p.lambdag * 1e3 }, zq, zin, z072: m(0.72).z0, z072nocu: m0(0.72).z0, z484: m(4.84).z0, z484nocu: m0(4.84).z0, lq, wq, wf, eeff072: m(0.72).eeff };
console.log(JSON.stringify(out, (k, v) => typeof v === 'number' ? +v.toPrecision(5) : v));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'vswr', figure(fig1, 'Figure 1. VSWR against S11, from the Smith chart tool’s maths for a purely resistive mismatch. Dots: the paper’s basic element (−24.57 dB, 1.12) and eight-patch array (−13.14 dB, 1.56).'));
  md = inject(md, 'width', figure(fig2, 'Figure 2. Impedance of a microstrip line on the paper’s substrate against trace width (1 oz copper assumed). Dots: the paper’s 0.72 mm transformer line and 4.84 mm feed line; dashed lines: 50 Ω and the transformer impedance a quarter-wave match to the tool’s patch edge resistance needs.'));
  fs.writeFileSync(ART, md);
  console.log('Charts:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
