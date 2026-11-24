// Figures for src/blog/discoveries/two-lane-highway-curve-operating-speed-radius-side-friction-demand.md, made with
// the maths of the Road curve tool (src/lib/sci/eng-road.ts: side friction needed, minimum radius, curve elements).
// Run: node scripts/blog-figures/two-lane-highway-curve-operating-speed-radius-side-friction-demand.mjs
import fs from 'node:fs';
import { frictionNeeded, minRadius, circularCurve } from '../../src/lib/sci/eng-road.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/two-lane-highway-curve-operating-speed-radius-side-friction-demand.md', import.meta.url);

// Inputs from the paper: Tottadi and Mehar (2024), Front. Future Transp. 5: 1260051, doi:10.3389/ffutr.2024.1260051
// (CC BY 4.0): mixed-traffic curve model V85 = 78.5 − 215.19/√R (km/h, R in m), radii 98 to 672 m, degree of curvature
// 2.6° to 17.5°. OUR assumptions: superelevation e = 0.07 and 0.04 (not stated in the paper), compared with a design
// side friction of 0.15 (IRC:73).
const V85 = (R) => 78.5 - 215.19 / Math.sqrt(R);
const slope100 = (R) => 100 * 0.5 * 215.19 * R ** -1.5; // km/h gained per extra 100 m of radius
const RS = [98, 150, 200, 300, 400, 600, 672];
const pts = RS.map((R) => ({ R, v: V85(R), per100: slope100(R), f7: frictionNeeded(V85(R), R, 0.07), f4: frictionNeeded(V85(R), R, 0.04) }));
const bisect = (g, lo, hi) => { for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; g(m) > 0 ? (lo = m) : (hi = m); } return (lo + hi) / 2; };
const rAt = (e) => bisect((R) => frictionNeeded(V85(R), R, e) - 0.15, 50, 1000); // radius where demand equals 0.15
const r7 = rAt(0.07), r4 = rAt(0.04);
const dc = [672, 98].map((R) => ({ R, dc20: circularCurve(R, 30, 1000).Dc, dc30: 1.5 * circularCurve(R, 30, 1000).Dc }));
const rminDesign = minRadius(V85(98), 0.07, 0.15);

const RR = Array.from({ length: 60 }, (_, i) => Math.round(98 + i * (672 - 98) / 59));
const fig1 = chart({
  title: 'Operating speed on two-lane highway curves', xLabel: 'Curve radius R (m)', yLabel: 'V85 (km/h)',
  series: [{ name: 'V85 = 78.5 − 215.19/√R', kind: 'line', x: RR, y: RR.map((R) => +V85(R).toFixed(2)) }, { name: '', noLegend: true, kind: 'dots', x: RS, y: pts.map((p) => +p.v.toFixed(2)), size: 3.5, colour: 'var(--ink)' }],
  xDomain: [0, 700], yDomain: [50, 75],
  vlines: [{ x: 600, text: '600 m' }],
  desc: `The paper's mixed-traffic model rises from ${V85(98).toFixed(1)} km/h at 98 m to ${V85(672).toFixed(1)} km/h at 672 m; past 600 m another 100 m of radius adds only ${slope100(600).toFixed(2)} km/h.`, height: 250,
});
const fig2 = chart({
  title: 'Side friction drivers need at their own speed', xLabel: 'Curve radius R (m)', yLabel: 'Side friction f',
  series: [
    { name: 'e = 0.04', kind: 'line', x: RR, y: RR.map((R) => +frictionNeeded(V85(R), R, 0.04).toFixed(4)) },
    { name: 'e = 0.07', kind: 'line', x: RR, y: RR.map((R) => +frictionNeeded(V85(R), R, 0.07).toFixed(4)) },
  ],
  xDomain: [0, 700], yDomain: [-0.05, 0.25], hlines: [{ y: 0.15, text: 'design f 0.15' }, { y: 0, text: '' }],
  vlines: [{ x: +r7.toFixed(0), text: `${r7.toFixed(0)} m`, left: false, dy: 40 }, { x: +r4.toFixed(0), text: `${r4.toFixed(0)} m`, left: false, dy: 56 }],
  desc: `Side friction demand v²/(gR) − e at the modelled 85th-percentile speed. It passes the design value 0.15 below ${r7.toFixed(0)} m with 7 % superelevation and below ${r4.toFixed(0)} m with 4 %.`, height: 260,
});

console.log(JSON.stringify({ pts: pts.map((p) => ({ R: p.R, v: +p.v.toFixed(1), per100: +p.per100.toFixed(2), f7: +p.f7.toFixed(3), f4: +p.f4.toFixed(3) })), r7: +r7.toFixed(1), r4: +r4.toFixed(1), dc: dc.map((d) => ({ R: d.R, dc20: +d.dc20.toFixed(2), dc30: +d.dc30.toFixed(2) })), rminDesign: +rminDesign.toFixed(1), fTool98: +frictionNeeded(57, 98, 0.07).toFixed(3) }));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'speed', figure(fig1, 'Figure 1. The paper\'s mixed-traffic operating-speed model across the radii it studied (98 to 672 m), with the points used in the text. The dashed line marks 600 m, where the paper says radius stops mattering.'));
  md = inject(md, 'friction', figure(fig2, 'Figure 2. Side friction needed to hold the curve at the modelled 85th-percentile speed, from the Road curve tool\'s v²/(gR) − e, for 4 % and 7 % superelevation (our assumptions; the paper does not give them). Dashed: a design side friction of 0.15.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
