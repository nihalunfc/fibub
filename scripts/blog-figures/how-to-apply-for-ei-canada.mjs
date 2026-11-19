// Figures for src/blog/life/how-to-apply-for-ei-canada.md, made with the maths of the EI Calculator
// (#T848, src/lib/money/ei.ts): hours needed by regional unemployment rate, and weeks of regular benefits
// by insurable hours (Schedule I of the Employment Insurance Act).
// Run: node scripts/blog-figures/how-to-apply-for-ei-canada.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { hoursNeeded, scheduleWeeks } from '../../src/lib/money/ei.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/life/how-to-apply-for-ei-canada.md', import.meta.url);

// 1. Hours needed to qualify, for regional rates from 4% to 15% (step every 0.1 point).
const rates = Array.from({ length: 111 }, (_, i) => +(4 + i / 10).toFixed(1));
const fig1 = chart({
  title: 'Hours you need fall as local unemployment rises',
  xLabel: 'Regional unemployment rate (%)', yLabel: 'Insurable hours needed',
  series: [{ name: 'Hours needed', kind: 'line', x: rates, y: rates.map((r) => hoursNeeded(r)) }],
  yDomain: [380, 740], yTicks: [420, 490, 560, 630, 700],
  vlines: [{ x: 6.8, text: 'Niagara 6.8%' }],
  desc: 'Step chart: 700 hours at 6% or less, 35 fewer for each extra point, down to 420 hours above 13%.',
});

// 2. Weeks of regular benefits by insurable hours, for three regional rates.
const hrs = Array.from({ length: 141 }, (_, i) => 420 + i * 10);
const at = (rate) => hrs.map((h) => (h >= hoursNeeded(rate) ? scheduleWeeks(h, rate) : NaN));
const fig2 = chart({
  title: 'More hours and higher local unemployment mean more weeks',
  xLabel: 'Insurable hours in the last 52 weeks', yLabel: 'Weeks of benefits',
  series: [
    { name: 'Rate 6% or less', kind: 'line', x: hrs, y: at(6) },
    { name: 'Rate 9%', kind: 'line', x: hrs, y: at(9) },
    { name: 'Rate over 13%', kind: 'line', x: hrs, y: at(13.5) },
  ],
  yDomain: [0, 48], yTicks: [0, 10, 20, 30, 40, 45],
  xTicks: [420, 700, 1000, 1400, 1820], xFmt: (v) => v.toLocaleString('en-CA'),
  desc: 'Weeks rise in steps with hours; each line starts at the hours its region needs and stops rising at 45 weeks.',
});

let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'hours', figure(fig1, 'Hours needed to qualify for EI regular benefits, worked out by the EI Calculator for every rate from 4% to 15%. Without a violation on your record.'));
md = inject(md, 'weeks', figure(fig2, 'Weeks of regular benefits from the table in the Employment Insurance Act, worked out by the EI Calculator. Lines start where each region\'s qualifying hours are met. Temporary extra weeks are not included.'));
fs.writeFileSync(ART, md);
console.log('ok');
