// Figures and numbers for src/blog/discoveries/scarf-oscillator-diatomic-bcl-entropy-partition-function-nist-300k.md,
// made with the maths of the Partition function explorer (src/lib/sci/phpartition.ts: thermo, presets, UNIT, KB, NA, H, C0).
// Run: node scripts/blog-figures/scarf-oscillator-diatomic-bcl-entropy-partition-function-nist-300k.mjs
import fs from 'node:fs';
import { thermo, presets, UNIT, KB, NA, H, C0 } from '../../src/lib/sci/phpartition.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/scarf-oscillator-diatomic-bcl-entropy-partition-function-nist-300k.md', import.meta.url);

// Stated in the paper (facts): the 41 vibrational term values of BCl (nu = 0 to 40, cm-1) printed from its model,
// the equilibrium bond length re = 1.7159 angstrom, and the printed entropy and heat capacity at 300 K and 6000 K
// (NIST-based reference value and the paper's own model value), at 0.1 MPa.
export const LEVELS = [418.228, 1249.181, 2071.965, 2886.579, 3693.023, 4491.297, 5281.402, 6063.337, 6837.102, 7602.698, 8360.124, 9109.380, 9850.466, 10583.382, 11308.129, 12024.706, 12733.114, 13433.351, 14125.419, 14809.318, 15485.046, 16152.605, 16811.994, 17463.213, 18106.263, 18741.143, 19367.853, 19986.393, 20596.764, 21198.965, 21792.996, 22378.857, 22956.549, 23526.071, 24087.423, 24640.606, 25185.619, 25722.462, 26251.135, 26771.639, 27283.973];
const RE = 1.7159e-10;
const PAPER = { 300: { S: [213.441, 212.994], Cp: [31.693, 33.746] }, 6000: { S: [323.737, 322.508], Cp: [39.742, 38.751] } };
// Our assumption: the 11B-35Cl isotopologue (exact masses, u), a rigid rotor, and one bar for the Sackur-Tetrode term.
const AMU = 1.66053906892e-27, MB = 11.0093054, MCL = 34.96885268, R = KB * NA, P = 1e5;
const M = (MB + MCL) * AMU, MU = ((MB * MCL) / (MB + MCL)) * AMU;
export const Bcm = H / (8 * Math.PI ** 2 * C0 * 100 * MU * RE ** 2);

const cmJ = UNIT.cm.j;
export function model(T, nLevels = LEVELS.length) {
  const Str = R * (Math.log(((2 * Math.PI * M * KB * T) / H ** 2) ** 1.5 * (KB * T) / P) + 2.5);
  const nrot = Math.max(60, Math.ceil(5 * Math.sqrt((KB * T) / (H * C0 * 100 * Bcm))));
  const rot = thermo(presets.rotor(Bcm, nrot).map((l) => ({ E: l.E * cmJ, g: l.g })), T);
  const vib = thermo(LEVELS.slice(0, nLevels).map((e) => ({ E: (e - LEVELS[0]) * cmJ, g: 1 })), T);
  return { Str, Srot: rot.S * NA, Svib: vib.S * NA, S: Str + (rot.S + vib.S) * NA, Cp: 2.5 * R + (rot.Cv + vib.Cv) * NA, Cvvib: vib.Cv * NA, top: vib.top, Zvib: vib.Z };
}

const Ts = Array.from({ length: 60 }, (_, i) => 300 + (i * 5700) / 59);
const curve = (key, n) => Ts.map((T) => model(T, n)[key]);
const dots = (k, i) => ({ x: [300, 6000], y: [PAPER[300][k][i], PAPER[6000][k][i]] });

const fig1 = chart({
  title: 'Entropy of BCl at 0.1 MPa, rebuilt from the levels', xLabel: 'Temperature (K)', yLabel: 'Entropy S (J/(mol K))',
  desc: 'Entropy of gaseous BCl from 300 to 6000 kelvin, built from the paper\'s 41 vibrational levels, a rigid rotor and translation (line), with the paper\'s two printed reference values and two model values as dots.',
  series: [
    { name: 'partition-function tool + rotor + translation', x: Ts, y: curve('S'), kind: 'line', colour: 'var(--c-blog)' },
    { name: 'NIST value (paper)', ...dots('S', 0), kind: 'dots', size: 5, colour: 'var(--ink)' },
    { name: 'paper\'s model', ...dots('S', 1), kind: 'dots', size: 5, colour: 'var(--c-tools)' },
  ], xDomain: [0, 6500], yDomain: [180, 350],
});
const fig2 = chart({
  title: 'Heat capacity Cp of BCl, and the 41-level cut-off', xLabel: 'Temperature (K)', yLabel: 'Cp (J/(mol K))',
  desc: 'Constant-pressure heat capacity of gaseous BCl against temperature from the tool, for 21 and 41 vibrational levels, with the paper\'s printed NIST and model values as dots. The curve with 41 levels is closer to NIST at 300 K than the paper\'s model.',
  series: [
    { name: '41 levels', x: Ts, y: curve('Cp'), kind: 'line', colour: 'var(--c-blog)' },
    { name: '21 levels', x: Ts, y: curve('Cp', 21), kind: 'line', colour: 'var(--muted)', dash: '4 3' },
    { name: 'NIST value (paper)', ...dots('Cp', 0), kind: 'dots', size: 5, colour: 'var(--ink)' },
    { name: 'paper\'s model', ...dots('Cp', 1), kind: 'dots', size: 5, colour: 'var(--c-tools)' },
  ], xDomain: [0, 6500], yDomain: [28, 44],
});

const f = (x, d = 3) => +x.toFixed(d);
const out = { B_cm: f(Bcm, 5), levelGap01: f(LEVELS[1] - LEVELS[0], 3) };
for (const T of [300, 1000, 3000, 6000]) { const m = model(T); out[T] = { Str: f(m.Str), Srot: f(m.Srot), Svib: f(m.Svib), S: f(m.S), Cp: f(m.Cp), Cvvib: f(m.Cvvib), top: m.top, Zvib: f(m.Zvib, 4) }; }
for (const n of [21, 31, 41]) out['6000_n' + n] = { S: f(model(6000, n).S), Cp: f(model(6000, n).Cp) };
out.diff300 = { S_tool_minus_NIST: f(model(300).S - 213.441), S_paper_minus_NIST: f(212.994 - 213.441), Cp_tool_minus_NIST: f(model(300).Cp - 31.693), Cp_paper_minus_NIST: f(33.746 - 31.693) };
out.diff6000 = { S_tool_minus_NIST: f(model(6000).S - 323.737), S_paper_minus_NIST: f(322.508 - 323.737), Cp_tool_minus_NIST: f(model(6000).Cp - 39.742), Cp_paper_minus_NIST: f(38.751 - 39.742) };
console.log(JSON.stringify(out, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'entropy', figure(fig1, 'Figure 1. Entropy of gaseous BCl from 300 to 6000 K, built from the paper\'s 41 printed vibrational levels (line), compared with the paper\'s two printed NIST values and two model values. The partition-function tool plus a rigid rotor and translation (our assumptions) lands within 0.06 J/(mol K) of NIST at 300 K.'));
  md = inject(md, 'cp', figure(fig2, 'Figure 2. Heat capacity of gaseous BCl against temperature. With all 41 levels the curve is close to NIST at 300 K; keeping only 21 levels would lose heat capacity at the hot end (34.90 against 37.87 J/(mol K) at 6000 K), the cut-off effect described in the text.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
