// Figures for src/blog/discoveries/mussel-antioxidant-peptide-masses.md, made with the maths of the
// Peptide mass calculator (src/lib/sci/peptide.ts: peptideProps, mz, fragments, sites).
// Run: node scripts/blog-figures/mussel-antioxidant-peptide-masses.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import * as P from '../../src/lib/sci/peptide.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/mussel-antioxidant-peptide-masses.md', import.meta.url);

// The five peptide sequences the paper identified and synthesised: Lu et al. (2025), Marine Drugs 23(8): 294 (CC BY).
const PEPS = ['VPPFY', 'IMLFP', 'LPFLF', 'FLPF', 'FPRIM'];
// The paper's search settings: precursor tolerance 20 ppm, fragment tolerance 0.02 Da (Byonic).
const PPM = 20, FRAG_DA = 0.02;

const props = PEPS.map((s) => {
  const p = P.peptideProps(s);
  return { seq: s, ...p, mh: P.mz(p.mono, 1), mh2: P.mz(p.mono, 2), trypsin: P.sites(s, 'trypsin'), chymo: P.sites(s, 'chymotrypsin') };
});
for (const p of props) console.log(p.seq, p.mono.toFixed(4), p.avg.toFixed(3), p.formula, '[M+H]+', p.mh.toFixed(4), '[M+2H]2+', p.mh2.toFixed(4), 'trypsin cuts', p.trypsin.length);

// Residue monoisotopic masses from the same library (a residue is the peptide minus its water).
const AAS = 'ACDEFGHIKLMNPQRSTVWY'.split('');
const RES = Object.fromEntries(AAS.map((a) => [a, P.peptideProps(a).mono - P.WATER_MONO]));

/** How many distinct amino-acid sequences of `n` residues have a monoisotopic mass within `ppm` of `target`?
 *  Walks every composition (multiset) of n residues and adds its number of arrangements. */
function candidates(target, n, ppm) {
  const tol = (target * ppm) / 1e6;
  let total = 0;
  const comp = new Array(n);
  const fact = [1]; for (let i = 1; i <= n; i++) fact[i] = fact[i - 1] * i;
  const walk = (start, left, mass) => {
    if (left === 0) {
      if (Math.abs(mass + P.WATER_MONO - target) <= tol) {
        const counts = {}; for (const a of comp) counts[a] = (counts[a] ?? 0) + 1;
        let arr = fact[n]; for (const c of Object.values(counts)) arr /= fact[c];
        total += arr;
      }
      return;
    }
    for (let i = start; i < AAS.length; i++) {
      const a = AAS[i], m = mass + RES[a];
      if (m + P.WATER_MONO - tol > target) continue; // heavier residues may still fit, so keep scanning
      comp[n - left] = a;
      walk(i, left - 1, m);
    }
  };
  walk(0, n, 0);
  return total;
}

const target = props[2].mono; // LPFLF
const PPMS = [0.5, 1, 2, 3, 5, 7, 10, 15, 20, 30, 50, 75, 100];
const curve5 = PPMS.map((p) => candidates(target, 5, p));
const curve4 = PPMS.map((p) => candidates(props[3].mono, 4, p));
console.log('LPFLF candidates (5 residues):', PPMS.map((p, i) => `${p}ppm:${curve5[i]}`).join(' '));
console.log('FLPF candidates (4 residues):', PPMS.map((p, i) => `${p}ppm:${curve4[i]}`).join(' '));
console.log('permutations of LPFLF itself:', 120 / 2 / 2, '; of IMLFP:', 120, '; of FLPF:', 24 / 2);

// Fragment ladders: the paper's LPFLF against two sequences made of the same residues (our own permutations).
const LADDERS = ['LPFLF', 'PLFLF', 'FLPLF'];
const ladder = LADDERS.map((s) => P.fragments(s));
for (const [k, s] of LADDERS.entries()) console.log(s, 'b ions', ladder[k].map((r) => r.b.toFixed(3)).join(' '), '| y ions', ladder[k].map((r) => r.y.toFixed(3)).join(' '));
const y4 = P.fragments('LPFLF')[1].y;
console.log('LPFLF y4 =', y4.toFixed(4), 'vs FLPF [M+H]+ =', props[3].mh.toFixed(4), 'difference (ppm):', (((y4 - props[3].mh) / props[3].mh) * 1e6).toFixed(3));

const fig1 = chart({
  title: 'b-ion ladders: the same five residues, three orders',
  xLabel: 'Residue counted from the N end', yLabel: 'b ion m/z (singly charged)',
  series: LADDERS.map((s, k) => ({ name: s === 'LPFLF' ? 'LPFLF (the paper)' : `${s} (our permutation)`, kind: 'line', x: [1, 2, 3, 4, 5], y: ladder[k].map((r) => +r.b.toFixed(3)) })),
  xDomain: [0.8, 5.2], xTicks: [1, 2, 3, 4, 5], yDomain: [60, 680],
  desc: `b-ion m/z against position for LPFLF and two sequences made of the same residues. The ladders meet from the third residue on, so only the first two ions separate the three sequences, although all three have the same precursor mass of ${props[2].mh.toFixed(3)}.`,
  height: 290,
});

const fig2 = chart({
  title: 'Sequences that fit the mass, as the window tightens',
  xLabel: 'Precursor tolerance (ppm)', yLabel: 'Matching sequences (log scale)',
  series: [
    { name: '5 residues (mass of LPFLF)', kind: 'line', x: PPMS, y: curve5.map((v) => Math.log10(v)) },
    { name: '4 residues (mass of FLPF)', kind: 'line', x: PPMS, y: curve4.map((v) => Math.log10(v)) },
  ],
  xDomain: [0, 100], yDomain: [1, Math.log10(Math.max(...curve5)) + 0.2],
  yFmt: (v) => (Math.abs(v - Math.round(v)) < 1e-9 ? (10 ** Math.round(v)).toLocaleString('en') : ''),
  vlines: [{ x: PPM, text: "paper's 20 ppm" }],
  desc: `The number of distinct amino-acid sequences whose monoisotopic mass falls within a given tolerance of the paper's peptides, counted over the 20 standard residues. At 20 ppm about ${curve5[PPMS.indexOf(20)].toLocaleString('en')} five-residue sequences fit the mass of LPFLF.`,
  height: 290,
});

let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'ladders', figure(fig1, `Figure 1. Singly charged b ions against position, from the Peptide mass calculator's fragment table, for the paper's LPFLF and for two rearrangements of the same five residues that we made up. All three share the precursor mass; the ladders separate only at the first two ions.`));
md = inject(md, 'candidates', figure(fig2, `Figure 2. How many amino-acid sequences fit the measured mass, against the precursor tolerance, counted by walking every composition of four or five of the 20 standard residues. The dashed line is the 20 ppm window the paper's search used.`));
fs.writeFileSync(ART, md);
console.log('figures written:', fig1.length, fig2.length, 'bytes');
