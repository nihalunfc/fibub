// Figures for src/blog/discoveries/ag-tio2-cotton-photocatalyst-band-gap-dye-kinetics.md, made with the maths of the
// Tauc plot tool (src/lib/sci/tauc.ts) and the Reaction kinetics fitter (src/lib/sci/kinetics.ts).
// Run: node scripts/blog-figures/ag-tio2-cotton-photocatalyst-band-gap-dye-kinetics.mjs   (rewrites the charts inside the article)
import { HC, exampleAlpha, toSpectrum, taucY, autoWindow, gapFit } from '../../src/lib/sci/tauc.ts';
import { conc, fitOrders, akaikeWeights } from '../../src/lib/sci/kinetics.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/ag-tio2-cotton-photocatalyst-band-gap-dye-kinetics.md', import.meta.url);

// Inputs. "Paper": Alvarez-Amparan, Chacon-Argaez and Cedeno-Caero (2026), Molecules 31(5), 782,
// doi:10.3390/molecules31050782 (CC BY): indirect gap 3.55 eV for Ag-TiO2 on cotton, 3.2 eV anatase reference;
// about 88 % of the dye gone in 90 min under the mercury lamp, about 33 % under the blue LED, under 5 % without catalyst.
// "Ours": the spectrum shape (tail width 0.06 eV, strength), the noise and the 10-minute sampling are made up.
const GAP = 3.55, GAP_REF = 3.2, EU = 0.06;

// A made-up diffuse-reflectance spectrum with an indirect gap, turned into R % by inverting Kubelka-Munk.
let seed = 2026; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648) - 0.5;
function reflectance(Eg) {
  const nm = [], R = [];
  for (let l = 250; l <= 500; l += 1) {
    const F = exampleAlpha(HC / l, Eg, EU, 4, 'indirect');
    nm.push(l); R.push(+(100 * (1 + F - Math.sqrt(F * F + 2 * F)) + 0.15 * rnd()).toFixed(2));
  }
  return { nm, R };
}
const fit = (sp, n) => { const s = toSpectrum(sp.nm, sp.R, 'nm', 'rpct'); const y = taucY(s, n); const w = autoWindow(s.E, y); return { s, y, w, g: gapFit(s.E, y, ...w) }; };
const ag = reflectance(GAP), ref = reflectance(GAP_REF);
const fi = fit(ag, 0.5), fd = fit(ag, 2), fr = fit(ref, 0.5);

// Figure 1: the indirect Tauc plot of the made-up Ag-TiO2 spectrum, with the fitted line.
const keep = fi.s.E.map((e, i) => i).filter((i) => fi.s.E[i] >= 3.0 && fi.s.E[i] <= 5 && i % 2 === 0);
const lineX = [fi.g.Eg, fi.s.E[fi.w[1]]];
const fig1 = chart({
  title: 'Tauc plot, indirect transition (simulated Ag-TiO2 spectrum)', xLabel: 'Photon energy (eV)', yLabel: '(F(R)·hν)^½',
  series: [
    { name: 'Spectrum', kind: 'dots', x: keep.map((i) => +fi.s.E[i].toFixed(3)), y: keep.map((i) => +fi.y[i].toFixed(3)), size: 1.8 },
    { name: 'Fitted straight line', kind: 'line', x: lineX, y: lineX.map((e) => +(fi.g.fit.slope * e + fi.g.fit.intercept).toFixed(3)) },
  ],
  vlines: [{ x: fi.g.Eg, text: `Eg = ${fi.g.Eg.toFixed(2)} eV` }], xDomain: [3.0, 5.0],
  desc: `Tauc plot of a simulated reflectance spectrum with an indirect gap of 3.55 eV. The straight-line fit crosses zero at ${fi.g.Eg.toFixed(3)} eV.`, height: 260,
});

// Kinetics: first-order rate constants from the paper's end points, then simulated runs every 10 min with 1.5 % noise.
const kOf = (gone, t) => -Math.log(1 - gone) / t;
const RUNS = [{ name: 'Mercury lamp, 88 % in 90 min', gone: 0.88 }, { name: 'Blue LED, 33 % in 90 min', gone: 0.33 }, { name: 'No catalyst, under 5 %', gone: 0.05 }];
const t = Array.from({ length: 10 }, (_, i) => i * 10);
const runs = RUNS.map((r) => {
  const k = kOf(r.gone, 90), c = t.map((x, i) => (i === 0 ? 1 : +(conc(1, 1, k, x) * (1 + 0.015 * 2 * rnd())).toFixed(4)));
  const f = fitOrders(t, c), w = akaikeWeights(f.map((x) => x.aicc));
  return { ...r, k, c, f1: f[1], w1: w[1] };
});
const tt = Array.from({ length: 46 }, (_, i) => i * 2);
const fig2 = chart({
  title: 'Dye left over time (simulated runs, first-order fits)', xLabel: 'Time (min)', yLabel: 'C/C0',
  series: runs.flatMap((r, j) => [
    { name: r.name, colour: ['var(--c-blog)', 'var(--c-tools)', 'var(--ink)'][j], kind: 'line', x: tt, y: tt.map((x) => +conc(1, r.f1.a0, r.f1.k, x).toFixed(4)) },
    { name: '', noLegend: true, kind: 'dots', x: t, y: r.c, size: 2.5, colour: ['var(--c-blog)', 'var(--c-tools)', 'var(--ink)'][j] },
  ]),
  yDomain: [0, 1.05], height: 260,
  desc: `Simulated dye concentration against time. First-order fits give k = ${runs.map((r) => r.f1.k.toFixed(4)).join(', ')} per minute.`,
});

let md = (await import('node:fs')).readFileSync(ART, 'utf8');
md = inject(md, 'tauc', figure(fig1, 'Figure 1. A spectrum we simulated with an indirect gap of 3.55 eV (the paper\'s value) and a 60 meV tail, read as diffuse reflectance and fitted by the Tauc plot tool\'s maths. Not the paper\'s measured spectrum.'));
md = inject(md, 'kin', figure(fig2, 'Figure 2. Runs we simulated from the paper\'s 90-minute end points (dots, 1.5 % noise) and the Reaction kinetics fitter\'s first-order fits (lines). An illustration, not the paper\'s data.'));
(await import('node:fs')).writeFileSync(ART, md);

console.log('indirect fit', fi.g.Eg.toFixed(4), '±', fi.g.se.toFixed(4), 'window', fi.s.E[fi.w[0]].toFixed(3), fi.s.E[fi.w[1]].toFixed(3));
console.log('direct reading of same spectrum', fd.g.Eg.toFixed(4));
console.log('anatase ref indirect', fr.g.Eg.toFixed(4), 'edge nm', (HC / GAP).toFixed(1), (HC / GAP_REF).toFixed(1));
for (const r of runs) console.log(r.name, 'k true', r.k.toFixed(5), 'fit', r.f1.k.toFixed(5), '±', r.f1.seK.toFixed(5), 'r2', r.f1.r2.toFixed(4), 'w1', r.w1.toFixed(3), 'half', r.f1.halfLife.toFixed(1));
console.log('sizes', fig1.length, fig2.length);
