// Figures for src/blog/discoveries/eta-meson-mass-threshold-beam-momentum-cosy-anke.md, made with the maths of the
// Relativistic kinematics tool (src/lib/sci/phrel.ts: threshold, sqrtSFixed, twoBody).
// Run: node scripts/blog-figures/eta-meson-mass-threshold-beam-momentum-cosy-anke.mjs
import fs from 'node:fs';
import { threshold, sqrtSFixed, twoBody, massOf } from '../../src/lib/sci/phrel.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/eta-meson-mass-threshold-beam-momentum-cosy-anke.md', import.meta.url);

// Inputs. From the paper (Goslawski 2012): eta mass 547.873 MeV/c2, threshold deuteron momentum 3141.688 +- 0.021 MeV/c,
// momentum precision 3e-5, mass shift 23 keV/c2, twelve points with excess energy Q from 1.1 to about 11 MeV.
// Masses of the proton, deuteron and helion (3He nucleus) are CODATA 2022 values, our own input (the paper gives none).
const MP = 938.27208943, MD = 1875.612945, MH = 2808.39161112;
const PAPER = { meta: 547.873, pd: 3141.688, dpd: 0.021, dm: 0.023, rel: 3e-5 };
const thr = (meta, ma = MD, mb = MP, mh = MH) => threshold(ma, mb, mh + meta);
const pThr = (meta) => thr(meta).p;
const t0 = thr(PAPER.meta);

// What the tool's own rounded names give (d = 1875.613, p = 938.272), with the helion typed in.
const tTool = threshold(massOf('d'), massOf('p'), 2808.392 + 547.873);

// Mass sensitivity: how much the eta mass moves per MeV/c of beam momentum.
const h = 1e-3;
const dmdp = 2 * h / (pThr(PAPER.meta + h) - pThr(PAPER.meta - h));
const formula = (MP * t0.p) / ((MH + PAPER.meta) * t0.E); // the paper's own expression
const dmFromRel = dmdp * PAPER.rel * t0.p; // MeV
const dmFromDp = dmdp * PAPER.dpd;

// Inverting: which eta mass does the paper's beam momentum give?
let lo = 547.5, hi = 548.5;
for (let i = 0; i < 100; i++) { const mid = (lo + hi) / 2; (pThr(mid) < PAPER.pd ? lo = mid : hi = mid); }
const metaFromPd = (lo + hi) / 2;

// Excess energy Q and the helion momentum in the centre of mass above threshold.
const s = (pd) => 2 * MP * Math.hypot(MD, pd) + MD * MD + MP * MP;
const Q = (pd) => Math.sqrt(s(pd)) - MH - PAPER.meta;
const pf = (pd) => { const S = s(pd), k = (S - (MH + PAPER.meta) ** 2) * (S - (MH - PAPER.meta) ** 2); return k > 0 ? Math.sqrt(k) / (2 * Math.sqrt(S)) : 0; };
const pdForQ = (q) => { let a = t0.p, b = t0.p + 200; for (let i = 0; i < 100; i++) { const m = (a + b) / 2; (Q(m) < q ? a = m : b = m); } return (a + b) / 2; };
// Check s(pd) is the same as sqrtSFixed with the deuteron beam on a proton target.
const sCheck = sqrtSFixed(MD, Math.hypot(MD, PAPER.pd), MP) ** 2 - s(PAPER.pd);
const q1 = 1.1, q2 = 11;

// Figure 1: threshold beam momentum against the eta mass.
const ms = Array.from({ length: 41 }, (_, i) => 547.5 + (i * 0.8) / 40);
const fig1 = chart({
  title: 'Threshold deuteron momentum against the eta mass', xLabel: 'Assumed eta mass (MeV/c²)', yLabel: 'Threshold momentum (MeV/c)',
  series: [
    { name: 'Tool: d + p → 3He + eta', kind: 'line', x: ms, y: ms.map((m) => +pThr(m).toFixed(3)) },
    { name: 'Paper: measured threshold and mass', kind: 'dots', x: [PAPER.meta], y: [PAPER.pd], size: 5, colour: 'var(--c-tools)' },
  ],
  xDomain: [547.5, 548.3], vlines: [{ x: PAPER.meta, text: '547.873', left: true }], hlines: [{ y: PAPER.pd, text: '3141.688 MeV/c' }],
  desc: `The threshold beam momentum for deuterons on protons rises by ${(1 / dmdp).toFixed(2)} MeV/c for each MeV/c² of eta mass. At the paper's eta mass of 547.873 the tool gives ${t0.p.toFixed(3)} MeV/c, against the paper's measured 3141.688.`,
  height: 290,
});

// Figure 2: excess energy and helion momentum against beam momentum, over the paper's measured range.
const pds = Array.from({ length: 61 }, (_, i) => 3138 + (i * 66) / 60);
const fig2 = chart({
  title: 'Excess energy above the threshold', xLabel: 'Deuteron beam momentum (MeV/c)', yLabel: 'Excess energy Q (MeV)',
  series: [{ name: 'Q', kind: 'line', x: pds, y: pds.map((p) => +Math.max(Q(p), 0).toFixed(3)) }],
  xDomain: [3138, 3204], yDomain: [0, 15],
  vlines: [{ x: +pdForQ(q1).toFixed(2), text: 'Q = 1.1', left: false }, { x: +pdForQ(q2).toFixed(2), text: 'Q = 11', left: true }],
  hlines: [{ y: 15, text: 'ANKE acceptance ~15 MeV' }],
  desc: `Excess energy Q of the reaction d p → 3He eta against the deuteron beam momentum. Q is 1.1 MeV at ${pdForQ(q1).toFixed(1)} MeV/c and 11 MeV at ${pdForQ(q2).toFixed(1)} MeV/c.`,
  height: 280,
});

const out = {
  thresholdP_exact: +t0.p.toFixed(4), thresholdT: +t0.T.toFixed(3), thresholdE: +t0.E.toFixed(3), sqrtS: +t0.sqrtS.toFixed(3),
  diffFromPaper_keV: +((t0.p - PAPER.pd) * 1000).toFixed(1), diffInSigmas: +((t0.p - PAPER.pd) / PAPER.dpd).toFixed(3),
  toolRounded_p: +tTool.p.toFixed(3), toolRounded_T: +tTool.T.toFixed(3), toolRounded_E: +tTool.E.toFixed(3),
  dmdp: +dmdp.toFixed(5), dmdp_formula: +formula.toFixed(5), dm_from_3e5_keV: +(dmFromRel * 1000).toFixed(2), dm_from_21keVc: +(dmFromDp * 1000).toFixed(2),
  metaFromPd: +metaFromPd.toFixed(4), sCheck: +sCheck.toExponential(2),
  pdAtQ1_1: +pdForQ(q1).toFixed(2), pdAtQ11: +pdForQ(q2).toFixed(2), pdAtQ15: +pdForQ(15).toFixed(2),
  pf_Q1_1: +pf(pdForQ(q1)).toFixed(2), pf_Q6_3: +pf(pdForQ(6.3)).toFixed(2), pf_Q11: +pf(pdForQ(q2)).toFixed(2), pdAtQ6_3: +pdForQ(6.3).toFixed(2),
  sensRelAt3141: +((t0.p * PAPER.rel)).toFixed(4),
  // a different eta mass to see the lever: PDG-like 547.862 (our own round number, not from the paper)
  pdFor547_862: +pThr(547.862).toFixed(4),
  twoBodyEtaHe_atQ: twoBody(MH + PAPER.meta + 6.3, MH, PAPER.meta).p,
};
console.log(JSON.stringify(out, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'thr', figure(fig1, `Figure 1. Threshold deuteron momentum for d + p → 3He + eta against the assumed eta mass, from the Relativistic kinematics tool's threshold maths with CODATA 2022 masses for the three nuclei. The dot is the paper's measured threshold momentum and eta mass.`));
  md = inject(md, 'q', figure(fig2, 'Figure 2. Excess energy Q of the reaction against the deuteron beam momentum, over the range of the paper\'s twelve measurement points (our recomputation; the paper gives only the range of Q).'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((x) => (x.length / 1024).toFixed(1) + ' KB').join(', '));
}
