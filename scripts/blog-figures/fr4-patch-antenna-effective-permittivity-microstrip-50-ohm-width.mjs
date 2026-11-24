// Figures for src/blog/discoveries/fr4-patch-antenna-effective-permittivity-microstrip-50-ohm-width.md, made with
// the maths of the PCB trace tool (src/lib/sci/eng-pcb.ts: Hammerstad and Jensen microstrip, width for an impedance).
// Run: node scripts/blog-figures/fr4-patch-antenna-effective-permittivity-microstrip-50-ohm-width.mjs
import fs from 'node:fs';
import { microstrip, widthFor, perLength, traceR, ipcCurrent, MIL } from '../../src/lib/sci/eng-pcb.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/fr4-patch-antenna-effective-permittivity-microstrip-50-ohm-width.md', import.meta.url);

// Inputs from the paper: Aslan, H. et al. (2026), Electronics 15(21): 5054, doi:10.3390/electronics15215054 (CC BY 4.0).
// FR-4, εr 4.4, loss tangent 0.02, substrate 40 × 47 × 1.6 mm, copper 0.035 mm; patch 36 mm wide (Wa) by 29.5 mm
// long (La); the paper's own analytical estimates εeff ≈ 4.07, ΔL ≈ 0.74 mm and f10 ≈ 2.40 GHz; target bands
// 1.75 and 2.45 GHz; measured resonances about 1.85 and 2.44 GHz.
const ER = 4.4, H = 1.6e-3, T = 0.035e-3, C0 = 299792458;
const WA = 36e-3, LA = 29.5e-3, DL = 0.74e-3; // ΔL is the paper's value, not the tool's

const patch = microstrip(WA, H, T, ER);
const w50 = widthFor(50, (w) => microstrip(w, H, T, ER).z0, 0.1e-3, 20e-3);
const line50 = microstrip(w50, H, T, ER);
const pl = perLength(line50.z0, line50.eeff);
const feed2 = microstrip(2e-3, H, T, ER); // the width a reader might guess for a 50 Ω line

const fRes = (L) => C0 / (2 * (L + 2 * DL) * Math.sqrt(patch.eeff)); // half-wave patch with the paper's edge extension
const lenFor = (f) => C0 / (2 * f * Math.sqrt(patch.eeff)) - 2 * DL;

// Figure 1: impedance against trace width on this board.
const ws = Array.from({ length: 160 }, (_, i) => 0.2e-3 + i * 0.075e-3);
const fig1 = chart({
  title: 'Microstrip impedance on the paper\'s FR-4 board', xLabel: 'Trace width (mm)', yLabel: 'Characteristic impedance Z₀ (Ω)',
  series: [{ name: '', noLegend: true, kind: 'line', x: ws.map((w) => +(w * 1000).toFixed(3)), y: ws.map((w) => +microstrip(w, H, T, ER).z0.toFixed(3)) }],
  xDomain: [0, 12], yDomain: [0, 130],
  hlines: [{ y: 50, text: '50 Ω' }], vlines: [{ x: +(w50 * 1000).toFixed(3), text: `${(w50 * 1000).toFixed(2)} mm` }],
  desc: 'Characteristic impedance against trace width for a microstrip on 1.6 mm FR-4 with a relative permittivity of 4.4 and 35 micrometre copper. Fifty ohms needs a width of 3.02 millimetres.',
  height: 280,
});

// Figure 2: resonant frequency against patch length, with the paper's own values marked.
const Ls = Array.from({ length: 141 }, (_, i) => 20e-3 + i * 0.2e-3);
const fig2 = chart({
  title: 'Patch length and the band it lands on', xLabel: 'Patch length (mm)', yLabel: 'Resonant frequency (GHz)',
  series: [
    { name: '', noLegend: true, kind: 'line', x: Ls.map((L) => +(L * 1000).toFixed(2)), y: Ls.map((L) => +(fRes(L) / 1e9).toFixed(4)) },
    { name: '', noLegend: true, kind: 'dots', x: [29.5], y: [+(fRes(LA) / 1e9).toFixed(3)], size: 4, colour: 'var(--ink)' },
  ],
  xDomain: [20, 48], yDomain: [1.4, 3.6],
  hlines: [{ y: 2.45, text: 'Wi-Fi 2.45 GHz' }, { y: 1.75, text: 'GSM-1800 uplink 1.75 GHz' }],
  vlines: [{ x: 29.5, text: '29.5 mm' }, { x: +(lenFor(1.75e9) * 1000).toFixed(2), text: `${(lenFor(1.75e9) * 1000).toFixed(1)} mm`, left: true }],
  desc: 'Resonant frequency of a half-wave patch against its length, using the effective permittivity from the tool and the edge extension the paper states. The paper\'s 29.5 millimetre patch lands at 2.40 gigahertz; reaching 1.75 gigahertz with a plain patch would need 41 millimetres.',
  height: 285,
});

const amil2 = (w50 / MIL) * (T / MIL);
const out = {
  patch: { z0: +patch.z0.toFixed(4), eeff: +patch.eeff.toFixed(4), simple: +((ER + 1) / 2 + ((ER - 1) / 2) / Math.sqrt(1 + (12 * H) / WA)).toFixed(4) },
  w50mm: +(w50 * 1000).toFixed(4), line50: { z0: +line50.z0.toFixed(3), eeff: +line50.eeff.toFixed(4) },
  feed2mm: { z0: +feed2.z0.toFixed(3), eeff: +feed2.eeff.toFixed(4) },
  perLength: { psPerMm: +(pl.delay * 1e9).toFixed(4), nHPerMm: +(pl.L * 1e6).toFixed(5), pFPerMm: +(pl.C * 1e9).toFixed(5) },
  guided2450mm: +((C0 / (2.45e9 * Math.sqrt(line50.eeff))) * 1000).toFixed(3),
  f10GHz: +(fRes(LA) / 1e9).toFixed(4), f10NoExtension: +(C0 / (2 * LA * Math.sqrt(patch.eeff)) / 1e9).toFixed(4),
  lengthFor: [2.45e9, 2.44e9, 1.75e9].map((f) => [f / 1e9, +(lenFor(f) * 1000).toFixed(2)]),
  feedR20mm: +(traceR(w50, T, 20e-3) * 1000).toFixed(3),
  ipc10C: +ipcCurrent(amil2, 10, false).toFixed(2), areaMil2: +amil2.toFixed(1),
};
console.log(JSON.stringify(out, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'z0', figure(fig1, 'Figure 1. Microstrip impedance against trace width for the paper\'s stack-up (1.6 mm FR-4, εr 4.4, 35 µm copper), from the PCB trace tool\'s Hammerstad and Jensen maths. A 50 Ω feed line needs 3.02 mm; the 36 mm patch itself is far off the right of this chart at 7.2 Ω.'));
  md = inject(md, 'length', figure(fig2, 'Figure 2. Resonant frequency of a half-wave patch against its length, using the effective permittivity the tool gives for the paper\'s 36 mm patch and the 0.74 mm edge extension the paper states. The dot is the paper\'s own patch.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
