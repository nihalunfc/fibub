// Figures for src/blog/discoveries/mmwave-window-te01-cutoff-dielectric-filled-waveguide.md, made with the maths of
// the Waveguide mode calculator (src/lib/sci/ph-waveguide.ts: rectModes and propagate).
// Run: node scripts/blog-figures/mmwave-window-te01-cutoff-dielectric-filled-waveguide.mjs
import fs from 'node:fs';
import { rectModes, propagate, C0 } from '../../src/lib/sci/ph-waveguide.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/mmwave-window-te01-cutoff-dielectric-filled-waveguide.md', import.meta.url);

// Inputs from the paper's abstract: Jo et al. (2026), IEEE Access 14: 154325-154332, doi:10.1109/ACCESS.2026.3737647
// (CC BY 4.0). Window width a = 4.0 mm, filling er = 3, window height b taken from 4.0 mm down to 2.8 mm,
// operating frequency 27.5 GHz, reported imbalance 7.5 dB. The window thickness is OUR assumption (see the article).
const A = 4.0e-3, ER = 3, F = 27.5e9, NP_TO_DB = 20 / Math.LN10;
const modesOf = (b) => rectModes(A, b, ER, 90e9);
const fcOf = (b, name) => modesOf(b).find((m) => m.name === name).fc;
const fc = (b, name) => fcOf(b, name) / 1e9;

const BS = Array.from({ length: 141 }, (_, i) => 1.5e-3 + i * 0.025e-3); // 1.5 to 5.0 mm
const te10 = BS.map((b) => fc(b, 'TE10')), te01 = BS.map((b) => fc(b, 'TE01'));

// Cut-off height: where the TE01 cut-off crosses the operating frequency.
const bCut = C0 / (2 * F * Math.sqrt(ER));
// Evanescent decay of the TE01 mode at 27.5 GHz, and the window thickness that makes it 7.5 dB.
const alphaDb = (b) => { const m = modesOf(b).find((x) => x.name === 'TE01'); const p = propagate(m, F, ER); return p.on ? 0 : p.alpha * NP_TO_DB; };
const a28 = alphaDb(2.8e-3) / 1000, tFor75 = 7.5 / a28; // a28 in dB per mm, tFor75 in mm
const p10 = propagate(modesOf(2.8e-3).find((m) => m.name === 'TE10'), F, ER);
// The two-material fix: the inner permittivity that puts a short window's cut-off back where the tall one had it.
const erFor = (b, target) => (C0 / (2 * b * target)) ** 2;
const erThreshold = erFor(2.8e-3, F), erRestore = erFor(2.8e-3, fcOf(4e-3, 'TE01'));

const fig1 = chart({
  title: 'Window cut-off against window height (a = 4 mm, εr = 3)', xLabel: 'Window height b (mm)', yLabel: 'Cut-off frequency (GHz)',
  series: [
    { name: 'TE01 (vertical polarisation)', kind: 'line', x: BS.map((b) => b * 1e3), y: te01 },
    { name: 'TE10 (horizontal)', kind: 'line', x: BS.map((b) => b * 1e3), y: te10 },
  ],
  xDomain: [1.5, 5], yDomain: [15, 60], hlines: [{ y: 27.5, text: '27.5 GHz band' }],
  vlines: [{ x: 2.8, text: '2.8 mm', left: true }, { x: 4.0, text: '4.0 mm' }],
  desc: `Cut-off frequency of the TE01 and TE10 modes of a 4 mm wide window filled with permittivity 3, against the window height. The TE01 cut-off crosses 27.5 GHz at a height of ${(bCut * 1e3).toFixed(2)} mm.`, height: 270,
});

const BS2 = Array.from({ length: 111 }, (_, i) => 2.0e-3 + i * 0.01e-3); // 2.0 to 3.1 mm
const fig2 = chart({
  title: 'Leakage through a cut-off window at 27.5 GHz', xLabel: 'Window height b (mm)', yLabel: `One-way loss through ${tFor75.toFixed(2)} mm (dB)`,
  series: [{ name: '', kind: 'line', x: BS2.map((b) => b * 1e3), y: BS2.map((b) => +((alphaDb(b) / 1000) * tFor75).toFixed(2)) }],
  xDomain: [2, 3.1], yDomain: [0, 14], hlines: [{ y: 7.5, text: 'measured imbalance 7.5 dB' }], vlines: [{ x: 2.8, text: '2.8 mm', left: true }],
  desc: `The evanescent TE01 mode loses ${a28.toFixed(2)} dB per millimetre at a window height of 2.8 mm, so a ${tFor75.toFixed(2)} mm thick window gives 7.5 dB.`, height: 260,
});

const ERS = Array.from({ length: 121 }, (_, i) => 2 + i * 0.05);
const fig3 = chart({
  title: 'Filling the short window with a higher permittivity', xLabel: 'Permittivity εr of the filling', yLabel: 'TE01 cut-off at b = 2.8 mm (GHz)',
  series: [{ name: '', kind: 'line', x: ERS, y: ERS.map((er) => +(rectModes(A, 2.8e-3, er, 120e9).find((m) => m.name === 'TE01').fc / 1e9).toFixed(2) ) }],
  xDomain: [2, 8], yDomain: [15, 40], hlines: [{ y: 27.5, text: '27.5 GHz band' }, { y: fc(4e-3, 'TE01'), text: 'the 4 mm window' }],
  vlines: [{ x: +erThreshold.toFixed(2), text: erThreshold.toFixed(2), left: true }, { x: +erRestore.toFixed(2), text: erRestore.toFixed(2) }],
  desc: `With a 2.8 mm window height, the TE01 cut-off falls back below 27.5 GHz once the filling permittivity passes ${erThreshold.toFixed(2)}, and matches the 4 mm window at ${erRestore.toFixed(2)}.`, height: 260,
});

console.log(JSON.stringify({
  tall: modesOf(4e-3).slice(0, 4).map((m) => `${m.name} ${(m.fc / 1e9).toFixed(2)}`),
  short: modesOf(2.8e-3).slice(0, 4).map((m) => `${m.name} ${(m.fc / 1e9).toFixed(2)}`),
  bCutMm: +(bCut * 1e3).toFixed(3), dbPerMm: +a28.toFixed(2), tFor75mm: +tFor75.toFixed(2),
  te10: { lgMm: +(p10.lg * 1e3).toFixed(2), z: +p10.z.toFixed(1), vpOverC: +(p10.vp / C0).toFixed(4) },
  erThreshold: +erThreshold.toFixed(3), erRestore: +erRestore.toFixed(3),
  singleMode: [+fc(2.8e-3, 'TE10').toFixed(2), +fc(2.8e-3, 'TE01').toFixed(2)],
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'cutoff', figure(fig1, 'Figure 1. Cut-off frequency of the two lowest modes of the radiation window, treated as a rectangular waveguide 4 mm wide filled with permittivity 3, as the window height shrinks. The TE10 mode (set by the fixed width) never moves; the TE01 mode, which carries the other polarisation, crosses the 27.5 GHz band at a height of ' + (bCut * 1e3).toFixed(2) + ' mm. Worked out with the Waveguide mode calculator\'s maths.'));
  md = inject(md, 'leak', figure(fig2, 'Figure 2. Below that height the TE01 mode is evanescent: it decays instead of propagating. The curve is the one-way loss through a window ' + tFor75.toFixed(2) + ' mm thick (the thickness that reproduces the paper\'s 7.5 dB at 2.8 mm; our assumption). The loss is zero to the right of ' + (bCut * 1e3).toFixed(2) + ' mm, where the mode propagates again.'));
  md = inject(md, 'fix', figure(fig3, 'Figure 3. Why a higher-permittivity insert works. At the short window height of 2.8 mm the TE01 cut-off drops back under 27.5 GHz once the filling permittivity passes ' + erThreshold.toFixed(2) + ', and reaches the tall window\'s own cut-off at ' + erRestore.toFixed(2) + '.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2, fig3].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
