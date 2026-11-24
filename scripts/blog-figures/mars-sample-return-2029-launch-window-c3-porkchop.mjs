// Figures for src/blog/discoveries/mars-sample-return-2029-launch-window-c3-porkchop.md, made with the maths of the
// Porkchop plot (src/lib/astro/porkchop.ts: Lambert transfers between planet states, C3 and the burn from a parking orbit).
// Run: node scripts/blog-figures/mars-sample-return-2029-launch-window-c3-porkchop.mjs
import fs from 'node:fs';
import { leg, burnFromOrbit, synodicDays, hohmannDays } from '../../src/lib/astro/porkchop.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/mars-sample-return-2029-launch-window-c3-porkchop.md', import.meta.url);
const DAY = 864e5, EPOCH = Date.UTC(2028, 0, 1);
const d2x = (ms) => (ms - EPOCH) / DAY;
const iso = (ms) => new Date(ms).toISOString().slice(0, 10);
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const label = (ms) => { const d = new Date(ms); return `${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}`; };

// Lowest C3 over flight times of 150 to 420 days for one departure date (the paper's transits are 7 to 9 months).
function bestAt(ms, t0 = 150, t1 = 420, step = 5) {
  let b = null;
  for (let t = t0; t <= t1; t += step) { const l = leg('Earth', 'Mars', ms, t); if (l && (!b || l.c3 < b.c3)) b = l; }
  return b;
}
const scan = (from, to, stepDays = 2) => { const out = []; for (let t = from; t <= to; t += stepDays * DAY) out.push(bestAt(t)); return out; };

// Window 1: the real Earth-to-Mars window either side of the turn of 2029. Window 2: the paper's backup, 2031.
const w1 = scan(Date.UTC(2028, 8, 1), Date.UTC(2029, 6, 1));
const w2 = scan(Date.UTC(2030, 10, 1), Date.UTC(2031, 6, 1));
const whole = scan(Date.UTC(2028, 8, 1), Date.UTC(2031, 6, 1), 4);
const pick = (rows) => rows.reduce((p, c) => (c.c3 < p.c3 ? c : p));
const span = (rows, lim) => { const u = rows.filter((r) => r.c3 <= lim); return { from: u[0].dep, to: u[u.length - 1].dep, days: Math.round((u[u.length - 1].dep - u[0].dep) / DAY), vinfLo: Math.min(...u.map((r) => r.vinfArr)), vinfHi: Math.max(...u.map((r) => r.vinfArr)) }; };
const b1 = pick(w1), b2 = pick(w2), s1 = span(w1, 10), s2 = span(w2, 10.2);

// The paper's stated primary departure date, and a 7.5-month (228-day) transfer.
const PAPER_DEP = Date.UTC(2029, 5, 15);
const paperDate = bestAt(PAPER_DEP);
const short = [Date.UTC(2028, 10, 14), b1.dep, Date.UTC(2029, 0, 25), PAPER_DEP].map((t) => ({ dep: t, l228: leg('Earth', 'Mars', t, 228) }));

const out = {
  window2029: { date: iso(b1.dep), c3: +b1.c3.toFixed(2), tof: b1.tof, vinfDep: +b1.vinfDep.toFixed(3), vinfArr: +b1.vinfArr.toFixed(2) },
  under10: { from: iso(s1.from), to: iso(s1.to), days: s1.days, vinfArr: [+s1.vinfLo.toFixed(2), +s1.vinfHi.toFixed(2)] },
  window2031: { date: iso(b2.dep), c3: +b2.c3.toFixed(2), tof: b2.tof, vinfArr: +b2.vinfArr.toFixed(2) },
  under102_2031: { from: iso(s2.from), to: iso(s2.to), days: s2.days, vinfArr: [+s2.vinfLo.toFixed(2), +s2.vinfHi.toFixed(2)] },
  paperDate: { date: iso(PAPER_DEP), c3: +paperDate.c3.toFixed(1), tof: paperDate.tof, vinfArr: +paperDate.vinfArr.toFixed(2) },
  tof228: short.map((s) => ({ dep: iso(s.dep), c3: +s.l228.c3.toFixed(1), vinfArr: +s.l228.vinfArr.toFixed(2) })),
  synodic: +synodicDays('Earth', 'Mars').toFixed(1), hohmann: +hohmannDays('Earth', 'Mars').toFixed(1),
  marsEscape0: +burnFromOrbit('Mars', 0, 200).toFixed(3),
  marsBurn: [2.5, 2.75, 3.0].map((v) => +burnFromOrbit('Mars', v, 200).toFixed(3)),
  earthBurn: [b1.c3, 8.5, paperDate.c3].map((c) => +burnFromOrbit('Earth', Math.sqrt(c), 200).toFixed(3)),
};
console.log(JSON.stringify(out, null, 1));

// Figure 1: the lowest launch energy for every departure date, three Earth years at a glance.
const fig1 = chart({
  title: 'Lowest launch energy for each departure date', xLabel: 'Departure date', yLabel: 'C3 (km² s⁻²), log scale',
  series: [{ name: 'Best over 150 to 420 day flights', kind: 'line', x: whole.map((r) => d2x(r.dep)), y: whole.map((r) => Math.log10(r.c3)) }],
  xDomain: [d2x(Date.UTC(2028, 8, 1)), d2x(Date.UTC(2031, 6, 1))], yDomain: [Math.log10(7), Math.log10(400)],
  xTicks: [[2028, 9], [2029, 3], [2029, 9], [2030, 3], [2030, 9], [2031, 3]].map(([y, m]) => d2x(Date.UTC(y, m, 1))),
  xFmt: (t) => label(EPOCH + t * DAY), yTicks: [1, 1.5, 2, 2.5].map((v) => v), yFmt: (t) => String(+(10 ** t).toPrecision(2)),
  hlines: [{ y: Math.log10(8.5), text: "paper's 8.5" }],
  vlines: [{ x: d2x(PAPER_DEP), text: "paper's date", dy: 16 }, { x: d2x(b1.dep), text: 'real window', left: true, dy: 0 }],
  desc: `The lowest launch energy C3 for each Earth-to-Mars departure date from September 2028 to July 2031. The windows sit at ${iso(b1.dep)} (C3 ${b1.c3.toFixed(1)}) and ${iso(b2.dep)} (C3 ${b2.c3.toFixed(1)}); on 15 June 2029 the best C3 is ${paperDate.c3.toFixed(0)} km² s⁻².`,
  height: 290,
});

// Figure 2: launch energy against flight time for three departure dates inside the real window.
const tofs = Array.from({ length: 55 }, (_, i) => 150 + i * 5);
const deps = [Date.UTC(2028, 10, 14), b1.dep, Date.UTC(2029, 0, 25)];
const fig2 = chart({
  title: 'Launch energy against flight time, late 2028 window', xLabel: 'Flight time (days)', yLabel: 'C3 (km² s⁻²)',
  series: deps.map((t) => ({ name: label(t) + ' ' + new Date(t).getUTCDate(), kind: 'line', x: tofs, y: tofs.map((tf) => { const l = leg('Earth', 'Mars', t, tf); return l ? l.c3 : NaN; }) })),
  xDomain: [150, 420], yDomain: [7, 40], hlines: [{ y: 10, text: 'C3 = 10' }],
  vlines: [{ x: 228, text: "paper's 7.5 months", dy: 14 }],
  desc: 'Launch energy against flight time for three departure dates in the late-2028 window. Shorter flights than about 280 days cost far more launch energy.',
  height: 280,
});

// Figure 3: the burn out of a 200 km circular Mars orbit, against the excess speed it buys.
const vs = Array.from({ length: 81 }, (_, i) => i * 0.05);
const fig3 = chart({
  title: 'Leaving a 200 km Mars orbit: one burn', xLabel: 'Excess speed v∞ after escape (km s⁻¹)', yLabel: 'Burn Δv (km s⁻¹)',
  series: [{ name: 'Single burn from 200 km circular orbit', kind: 'line', x: vs, y: vs.map((v) => burnFromOrbit('Mars', v, 200)) }],
  xDomain: [0, 4], yDomain: [1.2, 4.6],
  hlines: [{ y: burnFromOrbit('Mars', 0, 200), text: "escape only, 1.43" }, { y: 1.46 + 2.94, text: "paper's 1.46 + 2.94 = 4.40" }],
  vlines: [{ x: 2.75, text: '2.75', left: true }],
  desc: `The burn needed to leave a 200 km circular Mars orbit with a given excess speed. Escape alone costs ${burnFromOrbit('Mars', 0, 200).toFixed(2)} km/s; reaching v∞ 2.75 km/s costs ${burnFromOrbit('Mars', 2.75, 200).toFixed(2)} km/s in one burn, not the sum of the two steps.`,
  height: 280,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'windows', figure(fig1, `Figure 1. The lowest launch energy C3 for every Earth-to-Mars departure date from September 2028 to July 2031, worked out with the Porkchop plot's Lambert solver. The dips are the launch windows. The paper's primary departure date, 15 June 2029, sits on the far side of the first dip.`));
  md = inject(md, 'tof', figure(fig2, 'Figure 2. Launch energy against flight time for three departure dates in the real late-2028 window. A 7.5-month (228-day) transfer is only possible near the end of the window, and then the arrival speed is much higher.'));
  md = inject(md, 'burn', figure(fig3, 'Figure 3. The single burn that takes a spacecraft from a 200 km circular Mars orbit to a given excess speed. Adding an escape burn and a separate injection burn double-counts the Oberth effect.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2, fig3].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
