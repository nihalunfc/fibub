// Figures for src/blog/discoveries/lysine-tryptophan-peptide-permutations-gravy-net-charge-mass.md, made with the
// maths of the Hydropathy plot (src/lib/sci/hydropathy.ts: windowAverages, gravy) and the Protein calculator
// (src/lib/sci/protparam.ts: analyse, chargeCurve).
// Run: node scripts/blog-figures/lysine-tryptophan-peptide-permutations-gravy-net-charge-mass.mjs
import fs from 'node:fs';
import { SCALE_FIBUB, windowAverages, gravy } from '../../src/lib/sci/hydropathy.ts';
import { analyse, chargeCurve } from '../../src/lib/sci/protparam.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/lysine-tryptophan-peptide-permutations-gravy-net-charge-mass.md', import.meta.url);

// The parent peptide from the paper's text: Peng et al. (2025), Antibiotics 14(11): 1077, doi:10.3390/antibiotics14111077 (CC BY).
const PARENT = 'KKWRKWLKWLAKK';
// The paper's twelve derivatives are drawn as helical wheels in a figure, not written out. The twelve circular
// permutations of the parent are OUR construction, used only to show what such a rearrangement can and cannot change.
const PERMS = [...Array(PARENT.length)].map((_, k) => PARENT.slice(k) + PARENT.slice(0, k));
const W = 3; // plot window: 3 residues, because the peptide is only 13 long

const same = (xs) => [...new Set(xs)];
const props = PERMS.map((p) => analyse(p, { pH: 7 }));
const facts = {
  gravy: same(PERMS.map((p) => +gravy(p, SCALE_FIBUB).toFixed(6))),
  avg: same(props.map((a) => +a.avg.toFixed(3))),
  mono: same(props.map((a) => +a.mono.toFixed(3))),
  pI: same(props.map((a) => +a.pI.toFixed(3))),
  chargeAt7: same(props.map((a) => +a.chargeAt.toFixed(3))),
  eps: same(props.map((a) => a.epsUsed)),
  a280of1gL: +props[0].abs01.toFixed(3),
  withExtraAla: (() => { const a = analyse(PARENT + 'A', { pH: 7 }); return { avg: +a.avg.toFixed(3), mono: +a.mono.toFixed(3), gravy: +gravy(PARENT + 'A', SCALE_FIBUB).toFixed(4) }; })(),
  windowRange: same(PERMS.map((p) => { const w = windowAverages(p, SCALE_FIBUB, W).avg; return `${Math.min(...w).toFixed(3)} to ${Math.max(...w).toFixed(3)}`; })).length,
};

// Figure 1: the window-3 hydropathy profile of the parent and two of the rearrangements.
const SHOW = [0, 2, 8];
const fig1 = chart({
  title: `Same residues, different profile (window of ${W})`, xLabel: 'Residue (middle of the window)', yLabel: 'Mean hydropathy',
  series: SHOW.map((k) => { const w = windowAverages(PERMS[k], SCALE_FIBUB, W); return { name: k === 0 ? `Parent ${PERMS[k]}` : `Shift ${k}`, kind: 'line', x: w.pos, y: w.avg.map((v) => +v.toFixed(3)) }; }),
  xDomain: [2, 12], yDomain: [-4.5, 2.5], xTicks: [2, 4, 6, 8, 10, 12],
  hlines: [{ y: 0, text: '' }],
  desc: `Sliding-window hydropathy of the parent peptide and two circular rearrangements of it. Every curve is made of the same thirteen values, so the grand average is identical at ${facts.gravy[0]}, but the water-repelling residues sit in different places.`,
  height: 280,
});

// Figure 2: net charge against pH, the same for every rearrangement.
const cc = chargeCurve(PARENT);
const fig2 = chart({
  title: 'Net charge against pH', xLabel: 'pH', yLabel: 'Net charge',
  series: [{ name: '', noLegend: true, kind: 'line', x: cc.x, y: cc.y.map((v) => +v.toFixed(3)) }],
  xDomain: [0, 14], yDomain: [-1, 8],
  hlines: [{ y: 0, text: '' }, { y: 7, text: 'charge +7' }],
  vlines: [{ x: +props[0].pI.toFixed(2), text: `pI ${props[0].pI.toFixed(2)}`, left: true }],
  desc: `The peptide carries a net charge of about plus seven from pH 2 to pH 9 and reaches zero at its isoelectric point of ${props[0].pI.toFixed(2)}. Rearranging the residues does not change this curve.`,
  height: 260,
});

console.log(JSON.stringify(facts, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'profile', figure(fig1, `Figure 1. Window-3 hydropathy along the peptide for the parent and two circular rearrangements of it (our construction, not the paper's own set). All thirteen arrangements share one grand average of ${facts.gravy[0]}; only the order changes.`));
  md = inject(md, 'charge', figure(fig2, 'Figure 2. Net charge against pH for the parent peptide, from the Protein calculator’s maths. Every rearrangement gives exactly this curve, because charge depends on the composition and not on the order.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
