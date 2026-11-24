// Figures for src/blog/discoveries/mixed-martial-arts-training-load-monotony-strain-acwr.md, made with the maths of
// the Training load tool (src/lib/sci/trainload.ts: parseSessions, sessionLoad, daily, weeks).
// Run: node scripts/blog-figures/mixed-martial-arts-training-load-monotony-strain-acwr.mjs
import fs from 'node:fs';
import * as T from '../../src/lib/sci/trainload.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/mixed-martial-arts-training-load-monotony-strain-acwr.md', import.meta.url);

// Paper: Kirk et al. (2021), PLoS ONE 16(5): e0251266 (CC BY 4.0). Weekly means: load 1,287-1,791 AU,
// monotony 0.63-0.83, strain 1,143-1,819 AU, 3.9-5.3 h, 8 weeks, 14 athletes, session RPE 0-10.
const PAPER = { load: [1287, 1791], mono: [0.63, 0.83], strain: [1143, 1819], hours: [3.9, 5.3] };
const HR = { rest: 50, max: 190, female: false }; // not used by session RPE, but the functions take it
// OUR reconstruction: four sessions a week (Mon, Wed, Fri, Sat), minutes scaled per week, bout week at 0.55.
const WEEK = [[90, 8], [0, 0], [50, 5], [0, 0], [75, 6], [40, 3], [0, 0]];
const SCALE = [1, 1.08, 0.95, 1.12, 1.0, 1.15, 0.92, 0.55];
const START = T.dayNum('2026-01-05'); // a Monday

const lines = [];
SCALE.forEach((f, w) => WEEK.forEach(([m, r], d) => { if (m > 0) lines.push(`${T.dayStr(START + w * 7 + d)},${Math.round(m * f)},${r}`); }));
const sessions = T.parseSessions(`date,minutes,rpe\n${lines.join('\n')}\n`);
const wk = T.weeks(sessions, 'srpe', HR), dd = T.daily(sessions, 'srpe', HR);
const hours = SCALE.map((f) => WEEK.reduce((a, [m]) => a + Math.round(m * f), 0) / 60);

// Monotony of a week of k equal training days (independent of the load).
const monoEqual = (k) => { const w = new Array(7).fill(0); for (let i = 0; i < k; i++) w[i] = 1540 / k; return T.weeks(T.parseSessions(`date,minutes,rpe\n${w.map((v, i) => (v > 0 ? `${T.dayStr(START + i)},${v / 5},5` : '')).filter(Boolean).join('\n')}\n`), 'srpe', HR)[0].monotony; };
const kDays = [1, 2, 3, 4, 5, 6], monoByDays = kDays.map(monoEqual);
// Week 1 with the rest days dropped, as some papers compute it.
const w1 = WEEK.filter(([m]) => m > 0).map(([m, r]) => m * r);
const mTrain = w1.reduce((a, b) => a + b, 0) / w1.length;
const sdTrain = Math.sqrt(w1.reduce((a, b) => a + (b - mTrain) ** 2, 0) / (w1.length - 1));
const monoTrainingDaysOnly = mTrain / sdTrain;

// Figure 1: daily loads over the eight weeks.
const day0 = dd[0].day;
const stepX = [], stepY = [];
dd.forEach((d) => { stepX.push(d.day - day0, d.day - day0 + 1); stepY.push(d.load, d.load); });
const fig1 = chart({
  title: 'A reconstructed eight-week MMA camp', xLabel: 'Day of the camp', yLabel: 'Session-RPE load (AU)',
  series: [{ name: '', noLegend: true, kind: 'line', x: stepX, y: stepY }],
  xDomain: [0, 56], yDomain: [0, 900], xTicks: [0, 7, 14, 21, 28, 35, 42, 49, 56],
  bands: [{ x0: 49, x1: 56, text: 'bout week' }],
  desc: 'Daily session-RPE loads of a reconstructed eight-week mixed martial arts camp of four uneven sessions a week, with the bout week scaled to 55 %. A reconstruction built to match the published weekly means, not the study data.',
  height: 265,
});

// Figure 2: monotony against the number of training days, with the paper's range marked.
const fig2 = chart({
  title: 'Monotony depends on how many days you train', xLabel: 'Training days in the week (equal loads)', yLabel: 'Training monotony',
  series: [{ name: '', noLegend: true, kind: 'line', x: kDays, y: monoByDays.map((v) => +v.toFixed(3)) }],
  xDomain: [1, 6], yDomain: [0, 2.5], xTicks: kDays,
  bands: [{ x0: 1, x1: 6, text: '' }],
  hlines: [{ y: PAPER.mono[0], text: "paper's 0.63" }, { y: PAPER.mono[1], text: "paper's 0.83" }],
  desc: 'Foster monotony for a week whose load is spread equally over one to six days, with rest days counted as zero. The published range of 0.63 to 0.83 matches two to three equal days, or four uneven ones.',
  height: 265,
});

console.log(JSON.stringify({
  weeks: wk.map((w, i) => ({ week: i + 1, total: w.total, monotony: +w.monotony.toFixed(5), strain: +w.strain.toFixed(1), hours: +hours[i].toFixed(2), sessions: w.sessions })),
  lastDay: { acwr: +dd[dd.length - 1].acwr.toFixed(4), ewma: +dd[dd.length - 1].ewmaRatio.toFixed(4) },
  steadyAcwr: +dd[41].acwr.toFixed(3),
  monoByDays: monoByDays.map((v) => +v.toFixed(4)),
  monotonyTrainingDaysOnly: +monoTrainingDaysOnly.toFixed(3), strainTrainingDaysOnly: Math.round(wk[0].total * monoTrainingDaysOnly),
  paperMaxStrainPossible: +(PAPER.load[1] * PAPER.mono[1]).toFixed(0),
  impliedMonotony: [+(PAPER.strain[0] / PAPER.load[0]).toFixed(3), +(PAPER.strain[1] / PAPER.load[1]).toFixed(3)],
}, null, 1));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'daily', figure(fig1, "Figure 1. The daily session-RPE loads of our reconstructed camp: four uneven sessions a week, with the bout week at 55 %. Weeks 1 to 7 fall inside every weekly range the paper reports. A reconstruction, not the study's own sessions."));
  md = inject(md, 'monodays', figure(fig2, "Figure 2. Foster's monotony for a week spread equally over one to six days, with rest days as zeros. It does not depend on how big the loads are, only on how they are spread, so the paper's 0.63 to 0.83 points to very few training days."));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
