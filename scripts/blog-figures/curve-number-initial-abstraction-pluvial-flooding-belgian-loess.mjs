// Figures for src/blog/discoveries/curve-number-initial-abstraction-pluvial-flooding-belgian-loess.md, made with the
// maths of the Runoff calculator (src/lib/sci/runoff.ts: retention, scsRunoff, cnWet, kirpich, triangularHydrograph).
// Run: node scripts/blog-figures/curve-number-initial-abstraction-pluvial-flooding-belgian-loess.mjs
//      (prints every number in the article and rewrites the two charts inside it)
import fs from 'node:fs';
import { retention, scsRunoff, cnWet, cnDry, kirpich, triangularHydrograph } from '../../src/lib/sci/runoff.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/curve-number-initial-abstraction-pluvial-flooding-belgian-loess.md', import.meta.url);

// Inputs. "Paper": Herpoel et al. (2026), HESS 30, 6661-6699, doi:10.5194/hess-30-6661-2026 (CC BY 4.0).
const AREA_HA = 111, AREA2_HA = 84;   // outlet areas, ha (paper)
const LPATH = 2036;                   // longest hydraulic path, m (paper)
const SLOPE = 0.038;                  // mean slope 3.8 % (paper; the slope along the path is not given, so using the mean is OUR ASSUMPTION)
const JAIN = { lam: 0.3, alpha: 1.5 };// Jain initial abstraction parameters (paper, citing Jain et al. 2006)
// The paper's CN table is an image we did not read, so the curve number is OUR ASSUMPTION: 78, the usual
// handbook value for row crops on hydrologic soil group B (USDA TR-55, 1986), a reasonable stand-in for arable loess.
const CN = 78;

// Jain et al. (2006) initial abstraction, Ia = λ S (P / (P + S))^α. NOT in the Runoff calculator: these two lines are ours,
// and they reuse the tool's retention() and the same runoff equation.
function jain(P, cn) {
  const S = retention(cn), Ia = JAIN.lam * S * (P / (P + S)) ** JAIN.alpha;
  return { S, Ia, Q: P > Ia ? (P - Ia) ** 2 / (P - Ia + S) : 0 };
}

const Ps = Array.from({ length: 81 }, (_, i) => i);   // storm rainfall 0 to 80 mm
const q02 = Ps.map((P) => scsRunoff(P, CN, 0.2).Q), q005 = Ps.map((P) => scsRunoff(P, CN, 0.05).Q), qj = Ps.map((P) => jain(P, CN).Q);
const r2 = (v) => +v.toFixed(2);

const fig1 = chart({
  title: `Runoff from one storm, CN ${CN}, three ways to start runoff`, xLabel: 'Storm rainfall P (mm)', yLabel: 'Runoff depth Q (mm)',
  series: [{ name: 'Ia = 0.2 S (standard)', kind: 'line', x: Ps, y: q02.map(r2) },
    { name: 'Ia = 0.05 S, S × 1.42', kind: 'line', x: Ps, y: q005.map(r2) },
    { name: 'Jain (λ 0.3, α 1.5)', kind: 'line', x: Ps, y: qj.map(r2), dash: '5 4' }],
  xDomain: [0, 80], yDomain: [0, 40],
  desc: `For a curve number of ${CN}, the standard rule gives no runoff until 14 mm of rain, while the 0.05 rule and the Jain rule start much earlier and give more runoff from small and medium storms.`, height: 300,
});

// Figure 2: runoff from each rule as a share of the standard rule's runoff, for storms of 20 to 80 mm.
const Pr = Ps.filter((P) => P >= 20);
const ratio = (f) => Pr.map((P) => r2(f(P) / scsRunoff(P, CN, 0.2).Q));
const fig2 = chart({
  title: 'How many times more runoff than the standard rule', xLabel: 'Storm rainfall P (mm)', yLabel: 'Runoff ÷ standard runoff',
  series: [{ name: 'Ia = 0.05 S, S × 1.42', kind: 'line', x: Pr, y: ratio((P) => scsRunoff(P, CN, 0.05).Q), colour: 'var(--c-tools)' },
    { name: 'Jain (λ 0.3, α 1.5)', kind: 'line', x: Pr, y: ratio((P) => jain(P, CN).Q), colour: 'var(--ink)', dash: '5 4' }],
  xDomain: [20, 80], yDomain: [0, 10], hlines: [{ y: 1, text: 'Same as standard' }],
  desc: 'Near the 14 mm threshold the other two rules give several times the standard runoff; by 80 mm the three agree within about 10 to 30 percent.', height: 280,
});

const s = (v, n = 3) => Number(v.toPrecision(n));
const tc = kirpich(LPATH, SLOPE);                            // minutes
const at = (P) => ({ P, std: s(scsRunoff(P, CN, 0.2).Q), h05: s(scsRunoff(P, CN, 0.05).Q), jain: s(jain(P, CN).Q), IaStd: s(scsRunoff(P, CN, 0.2).Ia), IaJ: s(jain(P, CN).Ia) });
const P40 = scsRunoff(40, CN, 0.2), P40h = scsRunoff(40, CN, 0.05);
const hyd = triangularHydrograph(AREA_HA / 100, P40.Q, 1, tc / 60), hydh = triangularHydrograph(AREA_HA / 100, P40h.Q, 1, tc / 60);
const facts = {
  S02: s(retention(CN)), S005: s(1.42 * retention(CN)), Ia02: s(0.2 * retention(CN)), Ia005: s(0.05 * 1.42 * retention(CN)),
  table: [10, 20, 30, 40, 60, 80].map(at),
  biasIfHawkinsTruth_20mm: s(scsRunoff(20, CN, 0.2).Q / scsRunoff(20, CN, 0.05).Q - 1),
  tc_min: s(tc), vol40_m3: s(P40.Q * AREA_HA * 10), vol40h_m3: s(P40h.Q * AREA_HA * 10), peak40: s(hyd.qp), peak40h: s(hydh.qp), Tp: s(hyd.Tp),
  cnWet: s(cnWet(CN)), cnDry: s(cnDry(CN)), wet20: s(scsRunoff(20, cnWet(CN), 0.2).Q),
};
console.log(JSON.stringify(facts, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'q', figure(fig1, `Figure 1. Runoff depth against storm rainfall for a curve number of ${CN} (our assumption for arable loess), with the Runoff calculator's two initial-abstraction rules and our own lines for the Jain rule the paper found best. Calculated, not measured.`));
  md = inject(md, 'ratio', figure(fig2, 'Figure 2. The same three rules as a ratio to the standard Ia = 0.2 S runoff. Small storms are where the choice matters: near the threshold the other rules give several times as much runoff.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((x) => (x.length / 1024).toFixed(1) + ' KB').join(', '));
}
