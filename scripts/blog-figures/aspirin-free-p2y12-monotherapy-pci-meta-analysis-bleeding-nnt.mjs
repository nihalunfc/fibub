// Figures for src/blog/discoveries/aspirin-free-p2y12-monotherapy-pci-meta-analysis-bleeding-nnt.md, made with the maths of the
// Meta-analysis tool (src/lib/sci/meta.ts) and the NNT calculator (src/lib/sci/nnt.ts).
// Run: node scripts/blog-figures/aspirin-free-p2y12-monotherapy-pci-meta-analysis-bleeding-nnt.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { parseStudies, metaAnalysis } from '../../src/lib/sci/meta.ts';
import { compare, patientNNT } from '../../src/lib/sci/nnt.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/aspirin-free-p2y12-monotherapy-pci-meta-analysis-bleeding-nnt.md', import.meta.url);

// Inputs, all from the paper's text: Navarese et al. (2026), PLOS Medicine 23(3): e1004995, doi:10.1371/journal.pmed.1004995 (CC BY 4.0).
// Subgroup hazard ratios (P2Y12 monotherapy vs DAPT) by when aspirin stopped, with 95% CIs.
const SUB = {
  mi: 'Group\tHR\tLower\tUpper\nNo aspirin from the start\t1.41\t1.01\t1.97\nAspirin stopped by 3 months\t0.97\t0.76\t1.24',
  bleed: 'Group\tHR\tLower\tUpper\nNo aspirin from the start\t0.61\t0.28\t1.33\nAspirin stopped by 3 months\t0.53\t0.46\t0.61',
};
// Pooled event counts: monotherapy events/total, DAPT events/total.
const COUNTS = { mi: [215, 13865, 194, 13878], bleed: [527, 13865, 840, 13878], major: [94, 9169, 197, 9198], stroke: [102, 13865, 97, 13878] };

const pool = (t) => { const p = parseStudies(t, 'ci', { log: true, conf: 0.95 }); const r = metaAnalysis(p.studies.map((s) => s.y), p.studies.map((s) => s.v), 'DL'); return { p, r }; };
const res = Object.fromEntries(Object.entries(SUB).map(([k, t]) => [k, pool(t)]));
const cmp = Object.fromEntries(Object.entries(COUNTS).map(([k, c]) => [k, compare(...c)]));

// Figure 1: forest-style chart of the two timing subgroups for each outcome, with the fixed-effect pool, on a log axis.
const rows = [];
let yy = 6;
for (const [k, lab] of [['mi', 'Heart attack'], ['bleed', 'Bleeding']]) {
  const { p, r } = res[k];
  SUB[k].split('\n').slice(1).forEach((line, i) => { const [, e, l, u] = line.split('\t').map(Number); rows.push({ lab: `${lab}: ${i ? 'stopped by 3 mo' : 'no aspirin'}`, y: yy--, est: Math.log(e), lo: Math.log(l), hi: Math.log(u), pooled: false }); });
  rows.push({ lab: `${lab}: pooled (Q p = ${r.pQ.toFixed(2)})`, y: yy--, est: r.fixed.est, lo: r.fixed.lo, hi: r.fixed.hi, pooled: true });
}
const ln = Math.log, tk = [0.25, 0.5, 1, 2];
const fig1 = chart({
  title: 'Hazard ratios by when aspirin stopped (log scale)', xLabel: 'Hazard ratio, P2Y12 alone vs DAPT', yLabel: '',
  series: rows.flatMap((w) => [
    { name: '', kind: 'line', x: [w.lo, w.hi].map((v) => +v.toFixed(3)), y: [w.y, w.y], colour: w.pooled ? 'var(--c-blog)' : 'var(--ink)', noLegend: true },
    { name: '', kind: 'dots', x: [+w.est.toFixed(3)], y: [w.y], size: w.pooled ? 6 : 4, colour: w.pooled ? 'var(--c-blog)' : 'var(--ink)', noLegend: true, label: { text: w.lab, at: [ln(0.25), w.y], dx: 4, dy: -7 } },
  ]),
  xDomain: [ln(0.25), ln(2.2)], yDomain: [0, 7], xTicks: tk.map(ln), xFmt: (t) => String(+Math.exp(t).toFixed(2)), yTicks: [],
  vlines: [{ x: 0, text: 'no difference' }],
  desc: `Heart attack: no-aspirin-from-start HR 1.41 against 0.97 when aspirin stopped by 3 months (heterogeneity p ${res.mi.r.pQ.toFixed(2)}). Bleeding: 0.61 and 0.53, consistent (p ${res.bleed.r.pQ.toFixed(2)}), pooled ${Math.exp(res.bleed.r.fixed.est).toFixed(2)}.`, height: 300,
});

// Figure 2: number needed to treat to prevent one clinically relevant bleed, by the patient's baseline bleeding risk on DAPT.
const B = cmp.bleed, xs = Array.from({ length: 39 }, (_, i) => 0.01 + i * 0.005);
const pn = xs.map((b) => patientNNT(b, B.rrr, B.rrrCI));
const fig2 = chart({
  title: 'Patients to switch to prevent one bleed', xLabel: 'Bleeding risk on DAPT over the trial period (%)', yLabel: 'Number needed to treat',
  series: [
    { name: 'NNT', kind: 'line', x: xs.map((x) => +(x * 100).toFixed(1)), y: pn.map((p) => +p.nnt.toFixed(1)) },
    { name: '95% limits', kind: 'line', dash: '4 4', colour: 'var(--muted)', x: xs.map((x) => +(x * 100).toFixed(1)), y: pn.map((p) => +p.ci.hi.toFixed(1)) },
    { name: '', kind: 'line', dash: '4 4', colour: 'var(--muted)', noLegend: true, x: xs.map((x) => +(x * 100).toFixed(1)), y: pn.map((p) => +p.ci.lo.toFixed(1)) },
  ],
  xDomain: [1, 20], yDomain: [0, 200], vlines: [{ x: 6.05, text: 'trial DAPT arms 6.05%' }],
  desc: `With the trials' relative reduction of ${(B.rrr * 100).toFixed(0)}%, the NNT falls from about ${pn[0].nnt.toFixed(0)} at 1% risk to ${pn[pn.length - 1].nnt.toFixed(0)} at 20%.`, height: 280,
});

const facts = {
  mi: { fixed: [res.mi.r.fixed.est, res.mi.r.fixed.lo, res.mi.r.fixed.hi].map((v) => Math.exp(v).toFixed(3)), Q: res.mi.r.Q.toFixed(3), p: res.mi.r.pQ.toFixed(4), I2: res.mi.r.I2.toFixed(3) },
  bleed: { fixed: [res.bleed.r.fixed.est, res.bleed.r.fixed.lo, res.bleed.r.fixed.hi].map((v) => Math.exp(v).toFixed(3)), Q: res.bleed.r.Q.toFixed(3), p: res.bleed.r.pQ.toFixed(4), I2: res.bleed.r.I2 },
  counts: Object.fromEntries(Object.entries(cmp).map(([k, r]) => [k, { p1: r.p1.toFixed(4), p2: r.p2.toFixed(4), rd: r.rd.toFixed(4), rr: r.rr.toFixed(3), rrCI: r.rrCI.map((v) => v.toFixed(3)), nnt: r.nnt.nnt.toFixed(1), ci: r.nnt.ci }])),
  patient: [0.03, 0.06, 0.1, 0.15].map((b) => [b, patientNNT(b, B.rrr, B.rrrCI).nnt.toFixed(1)]),
};
console.log(JSON.stringify(facts));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'forest', figure(fig1, 'Figure 1. The paper\'s subgroup hazard ratios (dots, 95% CI lines) by when aspirin was stopped, pooled with the Meta-analysis tool\'s fixed-effect maths to test whether the two timings agree. Recomputed from the published estimates, not from patient data.'));
  md = inject(md, 'nnt', figure(fig2, 'Figure 2. The NNT calculator\'s "different baseline risk" maths: the relative bleeding reduction from the pooled counts applied to other starting risks. An illustration of the method, not advice for any patient.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
