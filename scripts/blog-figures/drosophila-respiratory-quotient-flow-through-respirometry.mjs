// Figures for src/blog/discoveries/drosophila-respiratory-quotient-flow-through-respirometry.md, made with the
// maths of the Respirometry calculator (src/lib/sci/respiro.ts: the flow-through mass balances, the Haldane
// transformation and the oxycalorific equivalents).
// Run: node scripts/blog-figures/drosophila-respiratory-quotient-flow-through-respirometry.mjs
import fs from 'node:fs';
import { openBoth, joulesPerMl, watts, kjPerDay } from '../../src/lib/sci/respiro.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/drosophila-respiratory-quotient-flow-through-respirometry.md', import.meta.url);

// From the paper (Akhtar et al. 2026, eLife 14: RP108681): chamber flow 25 mL/min, 25 flies per chamber,
// 24 h average RQ 1.20 (WT in light-dark), 1.19 (WT in constant dark), 1.20 (per01), 1.09 (fumin), 0.94 (sleepless).
const FLOW = 25;              // mL/min, set by a mass flow controller (the paper)
const FI_O2 = 0.2095, FI_CO2 = 0.0004;  // dry incurrent air: OUR assumption (the paper does not give the readings)
const RQS = [{ id: 'WT, light-dark', rq: 1.20 }, { id: 'WT, constant dark', rq: 1.19 }, { id: 'per01', rq: 1.20 }, { id: 'fumin', rq: 1.09 }, { id: 'sleepless', rq: 0.94 }];

/** Inverse of the flow-through mass balance: the excurrent readings that give this VO2 and RQ at this incurrent flow. */
function readingsFor(vo2, rq) {
  const vco2 = rq * vo2, fri = FLOW;
  let fre = fri;
  for (let i = 0; i < 200; i++) {
    const feO2 = (fri * FI_O2 - vo2) / fre, feCO2 = (fri * FI_CO2 + vco2) / fre;
    const next = (fri * (1 - FI_O2 - FI_CO2)) / (1 - feO2 - feCO2);
    if (Math.abs(next - fre) < 1e-14) { fre = next; break; }
    fre = next;
  }
  const feO2 = (fri * FI_O2 - vo2) / fre, feCO2 = (fri * FI_CO2 + vco2) / fre;
  return { feO2, feCO2, fre, dO2ppm: (FI_O2 - feO2) * 1e6, dCO2ppm: (feCO2 - FI_CO2) * 1e6 };
}

/** What the readings give back through the tool's maths, properly (Haldane) and the naive way (one flow for both). */
function bothWays(feO2, feCO2) {
  const good = openBoth(FLOW, 'in', FI_O2, FI_CO2, feO2, feCO2);
  const vo2n = FLOW * (FI_O2 - feO2), vco2n = FLOW * (feCO2 - FI_CO2);
  return { good, naive: { vo2: vo2n, vco2: vco2n, rq: vco2n / vo2n } };
}

// Step 1: a mid-range whole-chamber VO2 of 0.00125 mL/min (25 flies at 3 µL O2 per fly per hour: OUR assumption).
const VO2 = 0.00125;
const table = RQS.map((r) => {
  const g = readingsFor(VO2, r.rq), b = bothWays(g.feO2, g.feCO2);
  return {
    ...r, ...g,
    rqBack: b.good.rq, rqNaive: b.naive.rq, rqNaiveErrPct: (b.naive.rq / r.rq - 1) * 100,
    vo2Naive: b.naive.vo2, vo2ErrPct: (b.naive.vo2 / VO2 - 1) * 100,
    jLighton: joulesPerMl(r.rq, 'lighton'), jWeir: joulesPerMl(r.rq, 'weir'),
    uW: watts(VO2, r.rq * VO2, 'lighton') * 1e6, kjd: kjPerDay(watts(VO2, r.rq * VO2, 'lighton')),
  };
});

// Figure 1: the gas signal the analysers must resolve, against whole-chamber VO2, at the two extreme RQs.
const vo2s = Array.from({ length: 81 }, (_, i) => (i * 5e-3) / 80);
const sig = (rq, key) => vo2s.map((v) => (v > 0 ? +readingsFor(v, rq)[key].toFixed(3) : 0));
const fig1 = chart({
  title: 'What the analysers see at 25 mL/min', xLabel: 'Whole-chamber V̇O₂ (mL/min, 25 flies)', yLabel: 'Change in the air (ppm)',
  series: [
    { name: 'O₂ drop, RQ 1.20', kind: 'line', x: vo2s, y: sig(1.2, 'dO2ppm') },
    { name: 'CO₂ rise, RQ 1.20', kind: 'line', x: vo2s, y: sig(1.2, 'dCO2ppm'), dash: '5 3' },
    { name: 'CO₂ rise, RQ 0.94', kind: 'line', x: vo2s, y: sig(0.94, 'dCO2ppm'), colour: 'var(--ink)', dash: '2 3' },
  ],
  xDomain: [0, 0.005], vlines: [{ x: VO2, text: 'our mid value', dy: 0 }],
  desc: 'The O2 drop and CO2 rise in parts per million against whole-chamber oxygen uptake at a flow of 25 mL per minute. At 0.00125 mL per minute the signal is about 50 ppm.',
  height: 280,
});

// Figure 2: the error in RQ if the Haldane transformation is left out, across the whole RQ range.
const rqRange = Array.from({ length: 61 }, (_, i) => 0.7 + i * 0.01);
const naiveErr = rqRange.map((rq) => { const g = readingsFor(VO2, rq); return +((bothWays(g.feO2, g.feCO2).naive.rq / rq - 1) * 100).toFixed(4); });
const naiveVo2Err = rqRange.map((rq) => { const g = readingsFor(VO2, rq); return +((bothWays(g.feO2, g.feCO2).naive.vo2 / VO2 - 1) * 100).toFixed(4); });
const fig2 = chart({
  title: 'Leaving out the Haldane correction', xLabel: 'True respiratory quotient', yLabel: 'Error (%)',
  series: [
    { name: 'Error in RQ', kind: 'line', x: rqRange, y: naiveErr },
    { name: 'Error in V̇O₂', kind: 'line', x: rqRange, y: naiveVo2Err, dash: '5 3' },
  ],
  hlines: [{ y: 0, text: '' }], vlines: [{ x: 1, text: 'RQ = 1', left: true }],
  desc: 'The percentage error in RQ and in VO2 when one flow is used for both sides of the chamber instead of the nitrogen balance. The error is zero at RQ 1 and grows either side of it.',
  height: 270,
});

console.log(JSON.stringify(table.map((t) => ({
  id: t.id, rq: t.rq, dO2ppm: +t.dO2ppm.toFixed(2), dCO2ppm: +t.dCO2ppm.toFixed(2), feO2pct: +(t.feO2 * 100).toFixed(5), feCO2pct: +(t.feCO2 * 100).toFixed(5),
  fre: +t.fre.toFixed(6), rqBack: +t.rqBack.toFixed(6), rqNaive: +t.rqNaive.toFixed(4), rqNaiveErrPct: +t.rqNaiveErrPct.toFixed(3),
  vo2ErrPct: +t.vo2ErrPct.toFixed(3), jLighton: +t.jLighton.toFixed(3), jWeir: +t.jWeir.toFixed(3), uW: +t.uW.toFixed(2), kjd: +t.kjd.toPrecision(4),
})), null, 1));
console.log('signal at mid value:', JSON.stringify({ dO2ppm_120: +readingsFor(VO2, 1.2).dO2ppm.toFixed(2), dCO2ppm_120: +readingsFor(VO2, 1.2).dCO2ppm.toFixed(2), dCO2ppm_094: +readingsFor(VO2, 0.94).dCO2ppm.toFixed(2), dO2ppm_094: +readingsFor(VO2, 0.94).dO2ppm.toFixed(2) }));
const relO2 = (readingsFor(VO2, 1.2).dO2ppm / (FI_O2 * 1e6)) * 100, relCO2 = (readingsFor(VO2, 1.2).dCO2ppm / (FI_CO2 * 1e6)) * 100;
console.log('relative signal at the mid value: O2 reading changes by', relO2.toFixed(4), '% of itself; CO2 reading by', relCO2.toFixed(2), '% of itself; ratio', (relCO2 / relO2).toFixed(0));
console.log('energy spread, 1.20 vs 0.94:', ((joulesPerMl(1.2, 'lighton') / joulesPerMl(0.94, 'lighton') - 1) * 100).toFixed(2), '% (Lighton);',
  ((joulesPerMl(1.2, 'weir') / joulesPerMl(0.94, 'weir') - 1) * 100).toFixed(2), '% (Weir)');
// A worked reading for "Check it yourself": RQ 1.20 at the mid VO2, rounded to the 4 decimal places the page takes.
const w = readingsFor(VO2, 1.2);
const rounded = { feO2: +(w.feO2 * 100).toFixed(4), feCO2: +(w.feCO2 * 100).toFixed(4) };
const back = openBoth(FLOW, 'in', FI_O2, FI_CO2, rounded.feO2 / 100, rounded.feCO2 / 100);
console.log('check-it-yourself:', JSON.stringify({ rounded, vo2: +back.vo2.toFixed(6), vco2: +back.vco2.toFixed(6), rq: +back.rq.toFixed(4), fre: +back.fre.toFixed(4), uW: +(watts(back.vo2, back.vco2, 'lighton') * 1e6).toFixed(2), kjd: +kjPerDay(watts(back.vo2, back.vco2, 'lighton')).toPrecision(4), weirW: +(watts(back.vo2, back.vco2, 'weir') * 1e6).toFixed(2) }));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'signal', figure(fig1, 'Figure 1. How big a gas signal a chamber of 25 flies makes at the paper\'s flow of 25 mL/min, worked out by inverting the Respirometry calculator\'s flow-through mass balance. Incurrent air of 20.95 % O2 and 0.04 % CO2 is our assumption. The dashed line marks the whole-chamber oxygen uptake we use in the text.'));
  md = inject(md, 'haldane', figure(fig2, 'Figure 2. The error you make by multiplying one flow by both gas differences instead of using the nitrogen balance, across the respiratory quotients the paper reports. Zero at RQ 1, and it changes sign there.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
