// Figures for src/blog/discoveries/titanium-alloy-spring-rate-control-aerospace.md, made with the maths of the
// Spring designer tool (src/lib/sci/eng-spring.ts: the compression-spring rate, Wahl factor, stress and solid height).
// Run: node scripts/blog-figures/titanium-alloy-spring-rate-control-aerospace.mjs
import fs from 'node:fs';
import { compression, rate, shear, wahl, index } from '../../src/lib/sci/eng-spring.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/titanium-alloy-spring-rate-control-aerospace.md', import.meta.url);

// Inputs from the paper: Li, L. et al. (2024), Aerospace 11(7): 514, doi:10.3390/aerospace11070514 (CC BY 4.0).
// Steel spring being replaced: wire 12 mm, mean coil 66 mm, 26 active and 28 total coils, free length 616 mm,
// rate 28.0 to 28.8 N/mm, about 5.1 kg. Titanium design: 18 active and 20 total coils, 13.0 mm wire, mean coil
// D = 78 - d, G = 40 GPa, target rate 28.4 N/mm, 780 MPa shear stress at the 341 mm working length, about 2.6 kg.
// Aged 540 °C/10 h the measured rate was 25.2 N/mm; aged 480 °C/12 h it was 28.32 N/mm.
const L0 = 616, WORK = 341, Y = L0 - WORK; // 275 mm of compression at the working length
const STEEL = { d: 12, D: 66, Na: 26, rho: 7850 }, TI = { d: 13, D: 65, Na: 18, rho: 4820 };
const G_TI = 40000, TARGET = 28.4, TAU_PAPER = 780, K_540 = 25.2, K_480 = 28.32;
const NU = 0.33; // OUR assumption, to turn the paper's measured Young's modulus into a shear modulus

const common = { ends: 'squared-ground', L0, y: Y, tauAllow: 800, alpha: 0.5 };
const ti = compression({ ...TI, G: G_TI, ...common });
const steelLo = compression({ ...STEEL, G: 79300, ...common }), steelHi = compression({ ...STEEL, G: 82700, ...common });
const gFor = (k) => (k * 8 * TI.D ** 3 * TI.Na) / TI.d ** 4 / 1000; // GPa that a measured rate implies
const kAt = (G) => rate(G * 1000, TI.d, TI.D, TI.Na);
const f = (x, n = 2) => +x.toFixed(n);

console.log(JSON.stringify({
  ti: { C: ti.C, Kw: f(ti.Kw, 4), k: f(ti.k), Nt: ti.Nt, Ls: ti.Ls, F: Math.round(ti.F), tau: Math.round(ti.tau), Fs: Math.round(ti.Fs), tauS: Math.round(ti.tauS), nWork: f(ti.nWork), Lcrit: f(ti.Lcrit, 1), stable: ti.stable, fn: f(ti.fn, 1), mass: f(ti.mass), wire: Math.round(ti.wireLength) },
  tauAtTarget: Math.round(shear(wahl(index(TI.D, TI.d)), TARGET * Y, TI.D, TI.d)), tauPaper: TAU_PAPER,
  steel: { kLo: f(steelLo.k), kHi: f(steelHi.k), mass: f(steelLo.mass), Nt: steelLo.Nt, Ls: steelLo.Ls, C: f(steelLo.C, 2), tau: Math.round(steelHi.tau) },
  saving: f(100 * (1 - ti.mass / steelLo.mass), 1),
  gForTarget: f(gFor(TARGET)), gFor540: f(gFor(K_540)), gFor480: f(gFor(K_480)),
  gFromE: { e95: f(95 / (2 * (1 + NU))), e105_5: f(105.5 / (2 * (1 + NU))), e85_6: f(85.6 / (2 * (1 + NU))) },
  dSens: [12.9, 13.0, 13.1].map((d) => f(rate(G_TI, d, 78 - d, TI.Na), 3)),
}));

const ds = Array.from({ length: 61 }, (_, i) => 12.4 + i * 0.02);
const fig1 = chart({
  title: 'Why a tenth of a millimetre of wire matters', xLabel: 'Wire diameter d (mm)', yLabel: 'Spring rate (N/mm)',
  series: [
    { name: 'mean coil D = 78 − d', kind: 'line', x: ds, y: ds.map((d) => f(rate(G_TI, d, 78 - d, TI.Na), 3)) },
    { name: 'mean coil D = 65 fixed', kind: 'line', x: ds, y: ds.map((d) => f(rate(G_TI, d, 65, TI.Na), 3)), dash: '5 4' },
  ],
  xDomain: [12.4, 13.6], yDomain: [24, 34],
  hlines: [{ y: TARGET, text: `target ${TARGET} N/mm` }],
  vlines: [{ x: 13, text: 'the chosen 13.0 mm' }],
  desc: `The rate goes as the fourth power of the wire diameter: with the mean coil held at 65 mm it runs from ${f(rate(G_TI, 12.9, 65, TI.Na), 2)} N/mm at 12.9 mm to ${f(rate(G_TI, 13.1, 65, TI.Na), 2)} at 13.1 mm, about 0.9 N/mm for each tenth of a millimetre, and a little more along the paper's D = 78 - d line.`,
  height: 275,
});

const gs = Array.from({ length: 61 }, (_, i) => 33 + i * 0.15);
const fig2 = chart({
  title: 'The rate is the shear modulus, and ageing sets that', xLabel: 'Shear modulus G (GPa)', yLabel: 'Spring rate (N/mm)',
  series: [
    { name: '', noLegend: true, kind: 'line', x: gs, y: gs.map((g) => f(kAt(g), 3)) },
    { name: 'measured after ageing', kind: 'dots', x: [gFor(K_540), gFor(K_480)], y: [K_540, K_480], size: 5, colour: 'var(--ink)' },
    { name: 'G from the measured E', kind: 'dots', x: [95 / (2 * (1 + NU)), 105.5 / (2 * (1 + NU))], y: [kAt(95 / (2 * (1 + NU))), kAt(105.5 / (2 * (1 + NU)))], size: 5, colour: 'var(--c-tools)' },
  ],
  xDomain: [33, 42], yDomain: [23, 31],
  hlines: [{ y: TARGET, text: `target ${TARGET} N/mm` }],
  desc: `Rate against shear modulus for the chosen geometry. The 25.2 N/mm spring implies G = ${f(gFor(K_540))} GPa and the 28.32 N/mm spring G = ${f(gFor(K_480))} GPa, against ${f(95 / (2 * (1 + NU)))} and ${f(105.5 / (2 * (1 + NU)))} GPa from the paper's own measured Young's moduli.`,
  height: 275,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'rate', figure(fig1, 'Figure 1. The Spring designer’s rate formula for the paper’s titanium geometry (18 active coils, G = 40 GPa), against wire diameter, both with the paper’s rule D = 78 − d and with the mean coil diameter held at 65 mm.'));
  md = inject(md, 'modulus', figure(fig2, 'Figure 2. The same formula against shear modulus. Black dots: the modulus each measured rate implies. Blue dots: the rate expected from the paper’s own measured Young’s moduli after ageing at 440 °C and 480 °C, converted with a Poisson ratio of 0.33 (our assumption).'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
