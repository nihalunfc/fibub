// Figures for src/blog/discoveries/elephant-hospital-monthly-workload-queueing-capacity-mmck.md, made with the
// maths of the Queueing calculator (src/lib/sci/queue.ts: solveQueue for M/M/c and M/M/c/K, and erlangB).
// Run: node scripts/blog-figures/elephant-hospital-monthly-workload-queueing-capacity-mmck.mjs
import fs from 'node:fs';
import { solveQueue, erlangB } from '../../src/lib/sci/queue.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/elephant-hospital-monthly-workload-queueing-capacity-mmck.md', import.meta.url);

// Values printed by the paper: Kosaruk et al. (2025), PLOS ONE 20(12): e0337825 (CC BY 4.0).
// NEI: 467 cases over 60 months (Jan 2020 to Dec 2024), monthly workload mean 30.43, room for 20 elephants at a time.
// DLD: 198 elephants over 108 months (2016 to 2024), monthly workload mean 18.68, no more than 3 elephants at a time.
const H = [
  { id: 'NEI', name: 'Elephant hospital with 20 places', cases: 467, months: 60, workload: 30.43, c: 20 },
  { id: 'DLD', name: 'Elephant hospital with 3 places', cases: 198, months: 108, workload: 18.68, c: 3 },
].map((h) => ({ ...h, lambda: h.cases / h.months }));

// Little's law, L = lambda * W, read backwards for the average stay a workload figure implies.
const little = H.map((h) => ({
  id: h.id, lambda: h.lambda, c: h.c,
  stayIfPresent: h.workload / h.lambda,            // if the workload is the number of elephants present
  stayIfCount: (h.workload - h.lambda) / h.lambda, // if it counts every case open at some point in the month
  maxStayStable: h.c / h.lambda,                   // longest average stay a c-place hospital can keep up with
  maxCount: h.c + h.lambda,                        // most cases a full hospital can touch in one month
}));

// Erlang B (M/M/c/c: every place busy means the next arrival must be turned away or sent elsewhere).
const STAY = Array.from({ length: 120 }, (_, i) => 0.25 + i * 0.05); // months
const curve = (h) => STAY.map((w) => {
  const r = solveQueue({ kind: 'erlangb', lambda: h.lambda, mu: 1 / w, c: h.c });
  return { w, L: r.L, block: r.pBlock, count: r.L + r.lambdaEff };
});
const C = H.map((h) => ({ h, pts: curve(h) }));

const figFor = (k, yMax) => {
  const { h, pts } = C[k];
  return chart({
    title: `${h.id}: how many elephants ${h.c} places can hold`,
    xLabel: 'Average length of stay (months)', yLabel: 'Elephants, or cases in a month',
    series: [
      { name: 'In the hospital at one time', kind: 'line', x: pts.map((p) => p.w), y: pts.map((p) => +p.L.toFixed(3)) },
      { name: 'Cases open at some point in a month', kind: 'line', x: pts.map((p) => p.w), y: pts.map((p) => +p.count.toFixed(3)) },
    ],
    xDomain: [0.25, 6], yDomain: [0, yMax],
    hlines: [{ y: h.c, text: `${h.c} places` }, { y: h.workload, text: `reported monthly workload ${h.workload}` }],
    desc: `For the ${h.id} hospital, with ${h.cases} cases in ${h.months} months (${h.lambda.toFixed(2)} a month) and ${h.c} places, the average number of elephants present and the number of cases open at some point in a month, against the average length of stay. Both flatten out at the capacity, so the reported monthly workload of ${h.workload} ${h.workload > h.c + h.lambda ? 'cannot be a count of elephants in the hospital' : 'needs an average stay of about ' + ((h.workload - h.lambda) / h.lambda).toFixed(1) + ' months'}.`,
    height: 285,
  });
};
const fig1 = figFor(0, 36), fig2 = figFor(1, 22);

// A few worked points for the article, from the same functions.
const atStay = (h, w) => {
  const b = solveQueue({ kind: 'erlangb', lambda: h.lambda, mu: 1 / w, c: h.c });
  const q = solveQueue({ kind: 'mmc', lambda: h.lambda, mu: 1 / w, c: h.c });
  return { w, a: +(h.lambda * w).toFixed(3), L: +b.L.toFixed(2), block: +(b.pBlock * 100).toFixed(2), count: +(b.L + b.lambdaEff).toFixed(2), rho: +q.rho.toFixed(3), Wq: q.stable ? +q.Wq.toFixed(3) : null, pWait: q.stable ? +(q.pWait * 100).toFixed(1) : null };
};
console.log(JSON.stringify({
  little: little.map((l) => ({ id: l.id, lambda: +l.lambda.toFixed(3), c: l.c, stayIfPresent: +l.stayIfPresent.toFixed(2), stayIfCount: +l.stayIfCount.toFixed(2), maxStayStable: +l.maxStayStable.toFixed(2), maxCount: +l.maxCount.toFixed(2) })),
  nei: [1, 1.5, 2, 2.5, 2.91, 3.91].map((w) => atStay(H[0], w)),
  dld: [0.5, 1, 1.64, 3, 9.19].map((w) => atStay(H[1], w)),
  erlangB20: [15, 19.46, 22.65].map((a) => ({ a, B: +(erlangB(20, a) * 100).toFixed(2) })),
  erlangB3: [0.92, 1.83, 5.5].map((a) => ({ a, B: +(erlangB(3, a) * 100).toFixed(2) })),
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'nei', figure(fig1, 'Figure 1. The 20-place hospital. With 7.78 new cases a month, the average number of elephants present (lower line) and the number of cases open at some point in a month (upper line) both level off as the places fill. The reported monthly workload of 30.43 sits just above what 20 places can touch in a month.'));
  md = inject(md, 'dld', figure(fig2, 'Figure 2. The three-place hospital. With 1.83 new cases a month, no average length of stay can put more than about 4.8 cases through a month, so the reported monthly workload of 18.68 must count something other than elephants in the hospital.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
