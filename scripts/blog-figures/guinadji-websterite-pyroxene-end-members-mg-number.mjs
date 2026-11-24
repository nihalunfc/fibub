// Figures for src/blog/discoveries/guinadji-websterite-pyroxene-end-members-mg-number.md, made with the maths of the
// Mineral formula calculator (src/lib/sci/mineral.ts: cations per formula unit, Droop charge balance, end-members).
// Run: node scripts/blog-figures/guinadji-websterite-pyroxene-end-members-mg-number.mjs
import fs from 'node:fs';
import { formula, BY_KEY, molarMass } from '../../src/lib/sci/mineral.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/guinadji-websterite-pyroxene-end-members-mg-number.md', import.meta.url);

// Inputs from the paper: Kagarabi, Ntaflos, Tamen, Nkouathio and Tumba (2025), Mineralogia 56,
// doi:10.2478/mipo-2025-0011 (CC BY 4.0). Guinadji volcano, Adamawa Plateau, northern Cameroon.
// Stated compositions (abstract): diopside En 43.88-45.13, Wo 45.90-46.91, Fs 8.92-9.28, Mg# 0.83-0.85;
// enstatite En 75.98-76.65, Wo 1.21-1.76, Fs 21.74-22.45, Mg# 0.77-0.79; plagioclase An 58.30-61.47.
const PAPER = {
  cpx: { Wo: [45.90, 46.91], En: [43.88, 45.13], Fs: [8.92, 9.28], mg: [83, 85] },
  opx: { Wo: [1.21, 1.76], En: [75.98, 76.65], Fs: [21.74, 22.45], mg: [77, 79] },
  pl: { An: [58.30, 61.47] },
};
// OUR reconstruction: stoichiometric analyses built to the mid-range end-members, so that the cation sum on the
// formula's oxygen basis is exactly right and the charge balances. The paper's own oxide tables were not readable
// from here. Morimoto (1988) counts Fe (total) and Mn in Fs, which is what the tool does.
const mid = (a) => (a[0] + a[1]) / 2;
const chargeOf = { SiO2: 4, TiO2: 4, Al2O3: 3, Cr2O3: 3, FeO: 2, MnO: 2, MgO: 2, CaO: 2, Na2O: 1, K2O: 1 };
const APFU = {
  // Clinopyroxene: Si 1.93, with Ti, Al, Cr, Na chosen so cations = 4 and charge = 12 on 6 oxygens.
  cpx: { SiO2: 1.93, TiO2: 0.02, Al2O3: 0.11, Cr2O3: 0.01, FeO: 0.16381, MnO: 0.01, MgO: 0.84995, CaO: 0.88624, Na2O: 0.02 },
  opx: { SiO2: 1.9575, TiO2: 0.01, Al2O3: 0.06, Cr2O3: 0.005, FeO: 0.424785, MnO: 0.012, MgO: 1.501203, CaO: 0.029513 },
  pl: { SiO2: 2.40, Al2O3: 1.60, CaO: 0.599, Na2O: 0.390, K2O: 0.011 },
};
const r = (v, n = 2) => +v.toFixed(n);
const stoich = (a) => ({ cations: r(Object.values(a).reduce((s, v) => s + v, 0), 4), charge: r(Object.entries(a).reduce((s, [k, v]) => s + v * chargeOf[k], 0), 4) });
const toWt = (a) => { const w = {}; let t = 0; for (const [k, c] of Object.entries(a)) { const o = BY_KEY.get(k); const g = (c / o.nCat) * molarMass(o); w[k] = g; t += g; } const out = {}; for (const k of Object.keys(w)) out[k] = r((w[k] / t) * 100); return out; };
const WT = Object.fromEntries(Object.entries(APFU).map(([k, a]) => [k, toWt(a)]));

const CFG = { cpx: [6, 4, 'pyroxene'], opx: [6, 4, 'pyroxene'], pl: [8, 5, 'feldspar'] };
const run = (k, fe = k === 'pl' ? 'fe2' : 'droop') => { const [X, T, min] = CFG[k]; return formula(WT[k], X, { fe, T, mineral: min }); };
const out = Object.fromEntries(Object.keys(WT).map((k) => {
  const f = run(k);
  return [k, { wt: WT[k], stoich: stoich(APFU[k]), total: r(f.total), sumCat: r(f.sumCat, 4), sumO: r(f.sumO, 4), charge: r(f.charge, 3), fe3: r(f.fe3, 4), droopF: f.droopF === null ? null : r(f.droopF, 4), mg: f.mgNum === null ? null : r(f.mgNum, 2), em: f.endMembers.map((e) => [e.name, r(e.value)]) }];
}));

// Chart 1: Mg# of the clinopyroxene against the share of iron taken as ferric, with the paper's Mg# band.
const Mg = APFU.cpx.MgO, Fe = APFU.cpx.FeO;
const FR = Array.from({ length: 101 }, (_, i) => i * 0.005); // 0 to 50 % ferric
const mgOf = (x) => (100 * Mg) / (Mg + (1 - x) * Fe);
const solve = (target) => { let lo = 0, hi = 0.9; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; mgOf(m) < target ? (lo = m) : (hi = m); } return (lo + hi) / 2; };
const xAt = [r(100 * solve(PAPER.cpx.mg[0]), 1), r(100 * solve(PAPER.cpx.mg[1]), 1)];
const fig1 = chart({
  title: 'Diopside Mg# depends on the ferric guess', xLabel: 'Share of iron taken as Fe³⁺ (%)', yLabel: 'Mg# = 100 Mg/(Mg + Fe²⁺)',
  series: [{ name: '', noLegend: true, kind: 'line', x: FR.map((x) => 100 * x), y: FR.map((x) => r(mgOf(x), 3)) }],
  xDomain: [0, 50], yDomain: [82, 92],
  hlines: PAPER.cpx.mg.map((v) => ({ y: v, text: `paper: Mg# ${(v / 100).toFixed(2)}` })),
  vlines: [{ x: xAt[1], text: `${xAt[1]} %`, dy: 28 }],
  desc: `Mg# of the reconstructed diopside against the share of its iron treated as ferric. The paper's range of 0.83 to 0.85 is met only for a ferric share below about ${xAt[1]} per cent.`,
  height: 275,
});

// Chart 2: how a small SiO2 error drives the charge-balance Fe3+ and Mg#, while Wo-En-Fs barely moves.
const SI = Array.from({ length: 81 }, (_, i) => 51.5 + i * 0.025);
const scan = SI.map((s) => { const w = { ...WT.cpx, SiO2: s }; const d = formula(w, 6, { fe: 'droop', T: 4, mineral: 'pyroxene' }); const a = formula(w, 6, { fe: 'fe2', T: 4, mineral: 'pyroxene' }); return { s, ferric: (100 * d.fe3) / Math.max(1e-12, d.fe3 + d.fe2), mg: d.mgNum, fs: d.endMembers[2].value, sumCat: a.sumCat }; });
const fig2 = chart({
  title: 'A 1 wt% SiO₂ error moves Mg#, not Wo-En-Fs', xLabel: 'SiO₂ in the analysis (wt%)', yLabel: 'Per cent',
  series: [
    { name: 'Fe³⁺ share of iron (charge balance)', kind: 'line', x: SI, y: scan.map((p) => r(p.ferric, 3)) },
    { name: 'Mg#', kind: 'line', x: SI, y: scan.map((p) => r(p.mg, 3)) },
    { name: 'Fs (Wo-En-Fs)', kind: 'line', x: SI, y: scan.map((p) => r(p.fs, 3)) },
  ],
  xDomain: [51.5, 53.5], yDomain: [0, 92],
  vlines: [{ x: WT.cpx.SiO2, text: 'balanced analysis', left: true }],
  desc: `Changing only the SiO2 figure of the reconstructed diopside. Below the balanced value the charge-balance method invents ferric iron and Mg# climbs; Fs, which counts all the iron, does not move.`,
  height: 290,
});

const pts = [51.5, 52.0, 52.48, 53.0].map((s) => { const p = scan.reduce((a, b) => (Math.abs(b.s - s) < Math.abs(a.s - s) ? b : a)); return { SiO2: s, sumCat: r(p.sumCat, 4), ferric: r(p.ferric, 1), mg: r(p.mg, 2), fs: r(p.fs, 2) }; });
console.log(JSON.stringify({ out, xAt, pts, paperMid: { cpxWo: r(mid(PAPER.cpx.Wo)), cpxEn: r(mid(PAPER.cpx.En)), cpxFs: r(mid(PAPER.cpx.Fs)), opxWo: r(mid(PAPER.opx.Wo)), opxEn: r(mid(PAPER.opx.En)), opxFs: r(mid(PAPER.opx.Fs)), plAn: r(mid(PAPER.pl.An)) },
  enFs: { cpx: r((100 * mid(PAPER.cpx.En)) / (mid(PAPER.cpx.En) + mid(PAPER.cpx.Fs)), 2), opx: r((100 * mid(PAPER.opx.En)) / (mid(PAPER.opx.En) + mid(PAPER.opx.Fs)), 2) } }, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'ferric', figure(fig1, `Figure 1. Mg# of the reconstructed diopside as more of its iron is called ferric. The paper's stated Mg# of 0.83 to 0.85 is reached only while the ferric share stays under about ${xAt[1]} per cent, so its analyses cannot have carried much Fe³⁺.`));
  md = inject(md, 'sierror', figure(fig2, `Figure 2. The same analysis with only its SiO₂ figure changed. One weight per cent of SiO₂ either way is enough to make the charge-balance method assign a fifth of the iron to Fe³⁺ and push Mg# up by three points, while the Wo-En-Fs triple, which counts total iron, stays put.`));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
