// Figures for src/blog/discoveries/off-grid-solar-ethiopia-tier-3-household-pv-battery-sizing.md, made with the maths of the
// Battery solar sizing tool (src/lib/sci/batsolar.ts: solar(), the off-grid array, battery bank and controller sizing).
// Run: node scripts/blog-figures/off-grid-solar-ethiopia-tier-3-household-pv-battery-sizing.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { solar } from '../../src/lib/sci/batsolar.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/off-grid-solar-ethiopia-tier-3-household-pv-battery-sizing.md', import.meta.url);

// Inputs from the paper: Lidate et al. (2026), Energies 19(14): 3454, doi:10.3390/en19143454 (CC BY).
// Tier 3 design: 1.7 kWh/day; total demand = demand × 1.15 to 1.2; overall efficiency 85 %; worst-case 4.8 peak sun hours;
// 3 days of autonomy; 85 % maximum depth of discharge; 12 V; 130 Wp modules; 250 Ah batteries; 5.5 h for the current.
// The paper's hourly load bands: 40-50 W overnight (fridge only), about 80 W 06-08 h, 50-60 W in the day, 110-120 W 16-22 h.
const DAILY = 1700, PSH = 4.8, EFF = 0.85, DAYS = 3, DOD = 0.85, V = 12, PANEL = 130, BAH = 250;
const one = (Wh) => [{ name: 'Tier 3 daily load', W: Wh, h: 1, n: 1 }];
const base = { psh: PSH, losses: 1 - EFF, battEff: 1, days: DAYS, dod: DOD, Vsys: V, panelW: PANEL, battV: 12, battAh: BAH, safety: 1.25 };
// Tool mapping (our choice): the paper's ×1.15 (or ×1.2) goes in "Inverter efficiency" as 1/1.15 (87 %) or 1/1.2 (83.3 %);
// its 85 % overall efficiency goes in "System losses" as 15 %; battery charge efficiency 100 % (already inside the 85 %).
const full115 = solar({ ...base, loads: one(DAILY), invEff: 0.87 });
const full120 = solar({ ...base, loads: one(DAILY), invEff: 1 / 1.2 });
const bare = solar({ ...base, loads: one(DAILY), invEff: 1 });                 // no extra factor at all
const only115 = solar({ ...base, loads: one(DAILY), invEff: 0.87, losses: 0 }); // the ×1.15 but not the 85 %
// Hourly bands from the text, low and high ends.
const bands = (n, m, d, e) => [{ name: 'Night, fridge only (22-06 h)', W: n, h: 8, n: 1 }, { name: 'Morning (06-08 h)', W: m, h: 2, n: 1 }, { name: 'Daytime (08-16 h)', W: d, h: 8, n: 1 }, { name: 'Evening (16-22 h)', W: e, h: 6, n: 1 }];
const lo = solar({ ...base, loads: bands(40, 80, 50, 110), invEff: 1 }).daily, hi = solar({ ...base, loads: bands(50, 80, 60, 120), invEff: 1 }).daily, mid = solar({ ...base, loads: bands(45, 80, 55, 115), invEff: 1 }).daily;
// Daily PV energy of 400 Wp and 520 Wp (4 × 130) at the 85 % efficiency, against peak sun hours.
const pv = (W, psh) => solar({ ...base, psh, loads: one(1), invEff: 1, panelW: W }).dailyPv; // one panel of W watts: installed = W
const pshFor = (W, need, surplus) => (need * (1 + surplus)) / (W * EFF);
// Controller current: the paper's rule (energy charge ÷ 5.5 h ÷ 12 V) against the tool's (array W ÷ V × 1.25).
const paperCtrl = [1.15, 1.2].map((m) => (DAILY * m) / EFF / 5.5 / V);

const out = {
  arrayW: { full115: +full115.arrayW.toFixed(1), full120: +full120.arrayW.toFixed(1), bare: +bare.arrayW.toFixed(1), only115: +only115.arrayW.toFixed(1), bareNoEff: +(DAILY / PSH).toFixed(1), effOnly: +(DAILY / EFF / PSH).toFixed(1), x115only: +((DAILY * 1.15) / PSH).toFixed(1) },
  panels: { full115: full115.panels, full120: full120.panels, installed: full115.installedW },
  bank: { full115: [+full115.bankWh.toFixed(0), +full115.bankAh.toFixed(1), full115.parallel], bare: [+bare.bankWh.toFixed(0), +bare.bankAh.toFixed(1), bare.parallel], full120: [+full120.bankWh.toFixed(0), +full120.bankAh.toFixed(1), full120.parallel] },
  ctrl: { tool520: +full115.ctrlA.toFixed(1), at1: +(full115.installedW / V).toFixed(1), tool400: +((400 / V) * 1.25).toFixed(1), at1_400: +(400 / V).toFixed(1), paperRule: paperCtrl.map((x) => +x.toFixed(1)) },
  bands: { lo, mid, hi },
  pv48: { w400: +pv(400, 4.8).toFixed(0), w520: +pv(520, 4.8).toFixed(0) },
  pv73: { w400: +pv(400, 7.3).toFixed(0), w520: +pv(520, 7.3).toFixed(0) },
  surplus73: { w520_vs1700: +((pv(520, 7.3) / DAILY - 1) * 100).toFixed(0), w520_vs1955: +((pv(520, 7.3) / full115.dcDaily - 1) * 100).toFixed(0), w400_vs1700: +((pv(400, 7.3) / DAILY - 1) * 100).toFixed(0) },
  psh60: { w520_1700: +pshFor(520, DAILY, 0.6).toFixed(2), w520_1955: +pshFor(520, full115.dcDaily, 0.6).toFixed(2), w400_1700: +pshFor(400, DAILY, 0.6).toFixed(2) },
  dcDaily: +full115.dcDaily.toFixed(0),
  bankAtDod: [0.5, 0.6, 0.8, 0.85, 0.9].map((d) => [d, +solar({ ...base, dod: d, loads: one(DAILY), invEff: 1 }).bankAh.toFixed(0), +solar({ ...base, dod: d, loads: one(DAILY), invEff: 0.87 }).bankAh.toFixed(0)]),
};
console.log(JSON.stringify(out, null, 1));

// Figure 1: battery bank (Ah at 12 V) against usable depth of discharge, 3 days of autonomy.
const D = Array.from({ length: 61 }, (_, i) => 0.4 + i * 0.01);
const fig1 = chart({
  title: 'Tier 3 battery bank for 3 days without sun', xLabel: 'Usable depth of discharge (%)', yLabel: 'Bank at 12 V (Ah)',
  series: [
    { name: '1.7 kWh/day as stated', kind: 'line', x: D.map((d) => +(d * 100).toFixed(0)), y: D.map((d) => +solar({ ...base, dod: d, loads: one(DAILY), invEff: 1 }).bankAh.toFixed(1)) },
    { name: 'with the ×1.15 factor', kind: 'line', x: D.map((d) => +(d * 100).toFixed(0)), y: D.map((d) => +solar({ ...base, dod: d, loads: one(DAILY), invEff: 0.87 }).bankAh.toFixed(1)), dash: '5 4' },
  ],
  xDomain: [40, 100], yDomain: [400, 1300], hlines: [{ y: 500, text: '2 × 250 Ah' }, { y: 750, text: '3 × 250 Ah' }], vlines: [{ x: 85, text: '85 %' }, { x: 50, text: '50 %' }],
  desc: `Battery bank needed for three days of autonomy at 12 V against usable depth of discharge. At 85 % the stated 1.7 kWh/day needs ${out.bank.bare[1]} Ah, exactly the paper's 2 × 250 Ah; with the 1.15 factor it needs ${out.bank.full115[1]} Ah. At 50 %, typical for lead-acid, it needs ${out.bankAtDod[0][1]} Ah.`, height: 270,
});
// Figure 2: daily PV energy against peak sun hours for 400 Wp and 520 Wp.
const P = Array.from({ length: 41 }, (_, i) => 3.5 + i * 0.1);
const fig2 = chart({
  title: 'Daily solar energy: 400 Wp against 4 × 130 Wp', xLabel: 'Peak sun hours per day', yLabel: 'Energy (Wh/day)',
  series: [
    { name: '520 Wp (4 × 130)', kind: 'line', x: P.map((p) => +p.toFixed(1)), y: P.map((p) => +pv(520, p).toFixed(0)) },
    { name: '400 Wp', kind: 'line', x: P.map((p) => +p.toFixed(1)), y: P.map((p) => +pv(400, p).toFixed(0)) },
  ],
  xDomain: [3.5, 7.5], yDomain: [1000, 3400], hlines: [{ y: DAILY, text: '1700 load' }, { y: Math.round(full115.dcDaily), text: `${Math.round(full115.dcDaily)} with ×1.15` }],
  vlines: [{ x: 4.8, text: '4.8 design' }, { x: 7.3, text: '7.3', left: true }],
  desc: `Daily energy after the 85 % efficiency against peak sun hours. At the 4.8 h design value 400 Wp gives ${out.pv48.w400} Wh and 520 Wp gives ${out.pv48.w520} Wh.`, height: 270,
});
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'bank', figure(fig1, 'Figure 1. The Tier 3 battery bank for three days without sun at 12 V, worked out with the Battery solar sizing tool\'s maths for the stated 1.7 kWh/day (solid) and with the paper\'s 1.15 demand factor (dashed). Dashed lines mark two and three 250 Ah batteries.'));
  md = inject(md, 'pv', figure(fig2, 'Figure 2. Daily energy from a 400 Wp array and from four 130 Wp modules (520 Wp) at the paper\'s 85 % efficiency, against peak sun hours. Lines mark the 4.8 h worst-case design value and the 7.3 h long-term PVGIS value the paper quotes.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
