// Figures for src/blog/discoveries/ready-to-eat-crayfish-shelf-life-arrhenius-q10-cold-storage.md, made with the
// maths of the Shelf life tool (src/lib/sci/shelflife.ts: q10From, q10Shift, q10FromEa, fitShelf).
// Run: node scripts/blog-figures/ready-to-eat-crayfish-shelf-life-arrhenius-q10-cold-storage.mjs
import fs from 'node:fs';
import { q10From, q10Shift, q10FromEa, fitShelf, R } from '../../src/lib/sci/shelflife.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/ready-to-eat-crayfish-shelf-life-arrhenius-q10-cold-storage.md', import.meta.url);

// From the paper's running text: Li, Lei, Su, Chen, Cheng, Yang and Ou (2025), Foods 14(8): 1296,
// doi:10.3390/foods14081296 (CC BY 4.0). Shelf life of ready-to-eat crayfish by total viable count and sensory score:
// 2 days at 25 degrees C and 1.5 days at 37 degrees C; at 4 degrees C no limit was reached inside the 10-day study.
const PAIR = [{ T: 25, t: 2 }, { T: 37, t: 1.5 }];
const COLD = { T: 4, atLeast: 10 };
// Total viable counts stated in the text: 0.57 log CFU/g at the start; 1.7, 6.83 and 7.8 log CFU/g at the end of
// storage at 4, 25 and 37 degrees C (2.5 days at 25 and 37, 10 days at 4). The acceptable limit is 6 log CFU/g.
const TVC = { start: 0.57, limit: 6, end: { 4: 1.7, 25: 6.83, 37: 7.8 }, days: { 4: 10, 25: 2.5, 37: 2.5 } };

const fit = fitShelf(PAIR);
const q10 = q10From(PAIR[0].t, PAIR[0].T, PAIR[1].t, PAIR[1].T);
const needQ10 = q10From(COLD.atLeast, COLD.T, PAIR[0].t, PAIR[0].T); // Q10 that turns 2 days at 25 into 10 days at 4
const EaNeed = R * Math.log(needQ10) * ((COLD.T + 273.15) * (COLD.T + 283.15)) / 10;

const rate = (T) => (TVC.end[T] - TVC.start) / TVC.days[T]; // log CFU/g per day, assuming a straight log-linear rise
const toLimit = (T) => (TVC.limit - TVC.start) / rate(T);

const report = {
  q10FromPair: +q10.toFixed(4),
  EaFromPair_kJ: +(fit.Ea / 1000).toFixed(2),
  q10FromThatEaAt4: +q10FromEa(fit.Ea, 4).toFixed(4),
  predictQ10at4: +fit.predictQ10(4).toFixed(2),
  predictArrAt4: +fit.predictArr(4).toFixed(2),
  needQ10forTenDays: +needQ10.toFixed(4),
  EaNeeded_kJ: +(EaNeed / 1000).toFixed(2),
  tvcRates: { 25: +rate(25).toFixed(3), 37: +rate(37).toFixed(3) },
  tvcQ10: +Math.pow(rate(37) / rate(25), 10 / 12).toFixed(4),
  daysToLimit: { 25: +toLimit(25).toFixed(2), 37: +toLimit(37).toFixed(2) },
  // Two of the paper's own Arrhenius activation energies (its TVC and TVB-N fits), turned into Q10 near a fridge
  // temperature and into a predicted shelf life at 4 degrees C starting from 2 days at 25 degrees C.
  fromPaperEa: [['TVC', 45961], ['TVB-N', 70736]].map(([k, Ea]) => ({
    k, Ea_kJ: Ea / 1000, q10At4: +q10FromEa(Ea, 4).toFixed(3), q10At25: +q10FromEa(Ea, 25).toFixed(3),
    at4: +q10Shift(2, 25, 4, q10FromEa(Ea, 15)).toFixed(2),
  })),
  sensitivity: [1.0, 1.25, 1.5, 1.75].map((t37) => {
    const q = q10From(2, 25, t37, 37);
    return { t37, q10: +q.toFixed(3), at4: +q10Shift(2, 25, 4, q).toFixed(2) };
  }),
};

const TT = Array.from({ length: 81 }, (_, i) => i * 0.5); // 0 to 40 degrees C
const fig1 = chart({
  title: 'Crayfish shelf life against storage temperature', xLabel: 'Storage temperature (°C)', yLabel: 'Shelf life (days)',
  series: [
    { name: `Q10 line from the two points (Q10 ${q10.toFixed(2)})`, kind: 'line', x: TT, y: TT.map((T) => Math.log10(fit.predictQ10(T))) },
    { name: `Line that reaches 10 days at 4 °C (Q10 ${needQ10.toFixed(2)})`, kind: 'line', dash: '5 4', x: TT, y: TT.map((T) => Math.log10(q10Shift(2, 25, T, needQ10))) },
    { name: "The paper's two accelerated points", kind: 'dots', x: PAIR.map((p) => p.T), y: PAIR.map((p) => Math.log10(p.t)), size: 3.6 },
  ],
  xDomain: [0, 40], yDomain: [-0.2, 1.6], yTicks: [0, 0.301, 0.699, 1, 1.301],
  yFmt: (t) => String(+(10 ** t).toPrecision(2)),
  hlines: [{ y: 1, text: '10 days (not reached at 4 °C)' }],
  desc: 'Shelf life on a log scale against storage temperature. The line through the 25 and 37 degree points predicts only about 3.4 days at 4 degrees C, while the study saw more than 10 days.',
  height: 290,
});

const QS = Array.from({ length: 121 }, (_, i) => 1 + i * 0.015); // Q10 from 1.0 to 2.8
const fig2 = chart({
  title: 'What Q10 is needed for 10 days at 4 °C?', xLabel: 'Q10', yLabel: 'Shelf life at 4 °C (days)',
  series: [{ name: 'From 2 days at 25 °C', kind: 'line', x: QS, y: QS.map((q) => q10Shift(2, 25, 4, q)), noLegend: true }],
  xDomain: [1, 2.8], yDomain: [0, 26], hlines: [{ y: 10, text: '10 days' }],
  vlines: [{ x: q10, text: `${q10.toFixed(2)} from the pair`, dy: 0 }, { x: needQ10, text: `${needQ10.toFixed(2)} needed`, left: true, dy: 16 }],
  desc: 'Shelf life at 4 degrees C worked out from 2 days at 25 degrees C for each Q10. It passes 10 days only above a Q10 of about 2.14, well above the 1.28 the two accelerated points give.',
  height: 260,
});

console.log(JSON.stringify(report, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'q10line', figure(fig1, `Figure 1. The paper's two accelerated shelf lives (points) and the Q10 line the Shelf life tool fits through them, extended to cold storage. That line predicts ${fit.predictQ10(4).toFixed(1)} days at 4 °C, while the study found the limits were not reached in 10 days; the dashed line is the weaker-looking but steeper relation needed to match that.`));
  md = inject(md, 'needq10', figure(fig2, 'Figure 2. Shelf life at 4 °C worked out from 2 days at 25 °C, for every Q10. Ten days needs a Q10 of about 2.14 or more.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
