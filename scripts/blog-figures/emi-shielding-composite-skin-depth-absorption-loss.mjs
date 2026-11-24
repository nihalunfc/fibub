// Figures for src/blog/discoveries/emi-shielding-composite-skin-depth-absorption-loss.md, made with the maths of the
// Skin depth calculator (src/lib/sci/ph-skin.ts: the exact plane-wave skin depth, the good-conductor approximation
// and the absorption loss of a sheet).
// Run: node scripts/blog-figures/emi-shielding-composite-skin-depth-absorption-loss.mjs   (rewrites the charts)
import fs from 'node:fs';
import { skinDepth, skinDepthGood, absorptionDb, sheetR } from '../../src/lib/sci/ph-skin.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/emi-shielding-composite-skin-depth-absorption-loss.md', import.meta.url);
const EPS0 = 8.8541878188e-12;

// From the paper: Abo Elfath et al. (2026), Sci. Rep. 16: 2612, doi:10.1038/s41598-025-33772-3 (CC BY 4.0).
// Four composites with DC conductivities of about 0.01, 0.8, 1.8 and 2.5 S/m, about 5 mm thick, measured over the
// X band (8-12 GHz); at 10 GHz the paper gives eps' 12.0, eps'' 4.0, mu' 1.30, mu'' 0.30, and quotes a skin depth of
// about 3 mm with an attenuation constant of about 225 Np/m.
const SAMPLES = [
  { id: 'PMR10', sigma: 0.01, seT: 18.9, seA: 10.7, seR: 9.9 },
  { id: 'PMR20', sigma: 0.8, seT: 31.5, seA: 20.1, seR: 11.4 },
  { id: 'PMR30', sigma: 1.8, seT: 28.4, seA: 21.3, seR: 6.7 },
  { id: 'PMR40', sigma: 2.5, seT: 26.3, seA: 22.5, seR: 3.6 },
];
const ER = 12.0, EPP = 4.0, MR = 1.30, T = 0.005, F0 = 10e9;
const sEff = (sigma, f) => sigma + 2 * Math.PI * f * EPS0 * EPP; // conduction plus dielectric loss as one current
const NP_DB = 20 / Math.LN10;

console.log('At 10 GHz, eps_r = 12.0, mu_r = 1.30, sheet 5 mm thick:');
const rows = SAMPLES.map((s) => {
  const dDc = skinDepth(1 / s.sigma, F0, MR, ER), dEff = skinDepth(1 / sEff(s.sigma, F0), F0, MR, ER), dGood = skinDepthGood(1 / s.sigma, F0, MR);
  const r = { ...s, dDc, dEff, dGood, aDc: absorptionDb(T, dDc), aEff: absorptionDb(T, dEff), aGood: absorptionDb(T, dGood) };
  console.log(`  ${s.id}: sigma_dc ${s.sigma} S/m -> delta ${(dDc * 1000).toFixed(2)} mm (alpha ${(1 / dDc).toFixed(0)} Np/m), absorption ${r.aDc.toFixed(1)} dB`);
  console.log(`         with eps''=4 (sigma_eff ${sEff(s.sigma, F0).toFixed(3)} S/m) -> delta ${(dEff * 1000).toFixed(2)} mm, absorption ${r.aEff.toFixed(1)} dB; good-conductor formula would say delta ${(dGood * 1000).toFixed(2)} mm, absorption ${r.aGood.toFixed(1)} dB; measured SE_A ${s.seA} dB`);
  return r;
});
// What skin depth and effective conductivity would the measured absorption need?
const needed = SAMPLES.map((s) => {
  const d = T / (s.seA / NP_DB);
  let lo = 1e-3, hi = 1e4;
  for (let i = 0; i < 200; i++) { const mid = Math.sqrt(lo * hi); skinDepth(1 / mid, F0, MR, ER) > d ? (lo = mid) : (hi = mid); }
  const sig = Math.sqrt(lo * hi);
  return { ...s, d, alpha: 1 / d, sig, epp: sig / (2 * Math.PI * F0 * EPS0) };
});
console.log('\nTo explain the measured absorption loss by a plane wave in a 5 mm sheet:');
for (const n of needed) console.log(`  ${n.id}: SE_A ${n.seA} dB needs delta ${(n.d * 1000).toFixed(2)} mm (alpha ${n.alpha.toFixed(0)} Np/m), i.e. an effective conductivity of ${n.sig.toFixed(2)} S/m (eps'' = ${n.epp.toFixed(1)})`);
console.log('\nPaper: delta about 3 mm, alpha about 225 Np/m -> 1/225 =', (1000 / 225).toFixed(2), 'mm; 8.686*5/3 =', (NP_DB * T / 0.003).toFixed(1), 'dB');
console.log('omega eps / sigma for PMR40 at 10 GHz:', (2 * Math.PI * F0 * EPS0 * ER / 2.5).toFixed(2));
{
  const sig2 = sEff(2.5, F0), d2 = skinDepth(1 / sig2, F0, MR, ER);
  console.log(`\nsecond tool run: resistivity ${(1 / sig2).toPrecision(4)} ohm m -> delta ${(d2 * 1000).toFixed(3)} mm, t/delta ${(T / d2).toFixed(3)}, absorption ${absorptionDb(T, d2).toFixed(3)} dB, good-conductor ${(skinDepthGood(1 / sig2, F0, MR) * 1000).toFixed(3)} mm, omega eps/sigma ${((2 * Math.PI * F0 * EPS0 * ER) / sig2).toFixed(3)}`);
}
console.log('sheet resistance per square (PMR40, 5 mm, DC conduction only):', sheetR(1 / 2.5, T, rows[3].dDc).toFixed(1), 'ohm');

// Outside the tool: the full complex-permittivity, complex-permeability attenuation, alpha = (omega/c) Im sqrt(mu_r eps_r),
// with eps_r = 12.0 - j(4.0 + sigma_dc/(omega eps0)) and mu_r = 1.30 - j0.30. The Skin depth calculator has no slot
// for mu'', so this is a hand calculation beside it, printed here for the article's "fine print".
{
  const w = 2 * Math.PI * F0, c = 299792458;
  const mul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
  const csqrt = (z) => { const r = Math.hypot(z[0], z[1]), th = Math.atan2(z[1], z[0]) / 2; return [Math.sqrt(r) * Math.cos(th), Math.sqrt(r) * Math.sin(th)]; };
  for (const sigma of [2.5]) {
    const epsTot = EPP + sigma / (w * EPS0);
    const n = csqrt(mul([MR, -0.30], [ER, -epsTot]));
    const alpha = (w / c) * -n[1], d = 1 / alpha;
    console.log(`\nfull complex calculation (outside the tool), sigma_dc ${sigma} S/m: total eps'' ${epsTot.toFixed(2)}, alpha ${alpha.toFixed(0)} Np/m, delta ${(d * 1000).toFixed(2)} mm, absorption over 5 mm ${(NP_DB * T / d).toFixed(1)} dB`);
  }
}

// --- Chart 1: skin depth against frequency for the most conductive composite, three ways.
const FREQ = Array.from({ length: 69 }, (_, i) => 1 + i * 0.25); // GHz
const lg = (x) => +Math.log10(x).toFixed(4);
const fig1 = chart({
  title: 'Skin depth of the 2.5 S/m composite, three ways', xLabel: 'Frequency (GHz)', yLabel: 'Skin depth (mm)',
  series: [
    { name: 'Exact, conduction only', kind: 'line', x: FREQ, y: FREQ.map((g) => lg(skinDepth(1 / 2.5, g * 1e9, MR, ER) * 1000)), colour: 'var(--c-blog)' },
    { name: 'Exact, with ε″ = 4', kind: 'line', x: FREQ, y: FREQ.map((g) => lg(skinDepth(1 / sEff(2.5, g * 1e9), g * 1e9, MR, ER) * 1000)), colour: 'var(--c-tools)' },
    { name: 'Good-conductor formula', kind: 'line', x: FREQ, y: FREQ.map((g) => lg(skinDepthGood(1 / 2.5, g * 1e9, MR) * 1000)), colour: 'var(--ink)', dash: '5 4' },
  ],
  xDomain: [1, 18], yDomain: [lg(1.5), lg(30)], yTicks: [2, 3, 5, 10, 20, 30].map(lg), yFmt: (t) => String(+(10 ** t).toPrecision(2)),
  bands: [{ x0: 8, x1: 12, text: 'X band' }],
  hlines: [{ y: lg(3), text: 'paper: about 3 mm' }],
  desc: 'Skin depth of the most conductive composite from 1 to 18 GHz. The exact formula with conduction only gives about 6.6 mm at 10 GHz, adding the dielectric loss gives 3.6 mm, and the good-conductor approximation gives 2.8 mm.',
  height: 300,
});

// --- Chart 2: absorption loss against thickness at 10 GHz for three effective conductivities.
const TH = Array.from({ length: 51 }, (_, i) => (i * 10) / 50); // mm
const curve = (sig) => TH.map((mm) => +absorptionDb(mm / 1000, skinDepth(1 / sig, F0, MR, ER)).toFixed(2));
const fig2 = chart({
  title: 'Absorption loss at 10 GHz against sheet thickness', xLabel: 'Thickness (mm)', yLabel: 'Absorption loss (dB)',
  series: [
    { name: '2.5 S/m (their DC value)', kind: 'line', x: TH, y: curve(2.5), colour: 'var(--c-blog)' },
    { name: '4.73 S/m (with ε″ = 4)', kind: 'line', x: TH, y: curve(sEff(2.5, F0)), colour: 'var(--c-tools)' },
    { name: `${needed[3].sig.toFixed(1)} S/m (needed)`, kind: 'line', x: TH, y: curve(needed[3].sig), colour: 'var(--ink)', dash: '5 4' },
  ],
  xDomain: [0, 10], yDomain: [0, 50],
  hlines: [{ y: 22.5, text: 'measured SE_A 22.5 dB' }], vlines: [{ x: 5, text: 'their 5 mm', left: true }],
  desc: 'Absorption loss of a sheet at 10 GHz against its thickness for three effective conductivities. At 5 mm the measured 22.5 dB needs about 9.9 S/m, four times the composite’s DC conductivity.',
  height: 300,
});

let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'delta', figure(fig1, 'Figure 1. Skin depth of the most conductive composite (2.5 S/m, ε_r 12.0, μ_r 1.30) across the microwave band, worked out three ways by the Skin depth calculator’s maths. The good-conductor approximation, which only applies when the conduction current dominates, lands near the 3 mm the paper quotes; the exact formula does not.'));
md = inject(md, 'absorb', figure(fig2, 'Figure 2. How much a plane wave loses passing through the sheet, against thickness, at 10 GHz. To reach the measured 22.5 dB of absorption in 5 mm, the material has to behave like about 9.9 S/m, not 2.5 S/m.'));
fs.writeFileSync(ART, md);
console.log('\ncharts written; fig1', fig1.length, 'bytes, fig2', fig2.length, 'bytes');
