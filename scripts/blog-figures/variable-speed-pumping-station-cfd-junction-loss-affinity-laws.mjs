// Figures for src/blog/discoveries/variable-speed-pumping-station-cfd-junction-loss-affinity-laws.md, made with the
// maths of the Pump and system curve tool (src/lib/sci/pumpsys.ts: fitPump, setHead, quadSystem, operatingPoint, setEff).
// Run: node scripts/blog-figures/variable-speed-pumping-station-cfd-junction-loss-affinity-laws.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import * as P from '../../src/lib/sci/pumpsys.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/variable-speed-pumping-station-cfd-junction-loss-affinity-laws.md', import.meta.url);

// From the paper (Water 2025, doi:10.3390/w17172620, CC BY): pumps run at 0.8 to 1.0 of rated speed, and the losses
// at the junction behave as a quadratic in flow. Everything else is SIMULATED: the pump is the tool's own sample curve
// (default points in the tool), and the system is the tool's default (15 m static, 12 m friction at 40 L/s).
const Q = [0, 10, 20, 30, 40, 50].map((x) => x / 1000), H = [42, 41, 38.5, 34, 27.5, 19], E = [0, 45, 66, 75, 72, 60];
const fit = P.fitPump(Q, H, E, []);
const sys = P.quadSystem(15, 12, 0.04);
const SPEEDS = [1, 0.95, 0.9, 0.85, 0.8];
const arr = { n: 1, mode: 'single' };
const qs = Array.from({ length: 56 }, (_, i) => i / 1000);

const series = SPEEDS.map((r) => { const m = { fit, r, arr }, qm = P.maxFlow(m); const x = qs.filter((q) => q <= qm); return { name: `${Math.round(r * 100)} % speed`, kind: 'line', x: x.map((q) => q * 1000), y: x.map((q) => +P.setHead(m, q).toFixed(3)) }; });
series.push({ name: 'System (simulated)', kind: 'line', x: qs.map((q) => q * 1000), y: qs.map((q) => +sys(q).toFixed(3)) });
const ops = SPEEDS.map((r) => { const m = { fit, r, arr }, o = P.operatingPoint(m, sys); return { r, Q: +(o.Q * 1000).toFixed(2), H: +o.H.toFixed(2), eff: +(100 * P.setEff(m, o.Q)).toFixed(1) }; });
series.push({ name: 'Operating point', kind: 'dots', x: ops.map((o) => o.Q), y: ops.map((o) => o.H), size: 4 });
const fig1 = chart({
  title: 'Slowing the pump: five speeds against one system curve', xLabel: 'Flow (L/s)', yLabel: 'Head (m)', series,
  xDomain: [0, 55], yDomain: [0, 45],
  desc: `Simulated. Pump curves shrink by the affinity laws from 100 % to 80 % speed; the operating point slides down the quadratic system curve from ${ops[0].Q} to ${ops[4].Q} L/s.`, height: 320,
});
const fig2 = chart({
  title: 'Flow delivered at each speed (simulated)', xLabel: 'Speed (% of rated)', yLabel: 'Flow (L/s)',
  series: [{ name: 'Operating flow', kind: 'line', x: ops.map((o) => o.r * 100), y: ops.map((o) => o.Q) }, { name: 'Flow × speed (no static head)', kind: 'line', x: ops.map((o) => o.r * 100), y: ops.map((o) => +(ops[0].Q * o.r).toFixed(2)) }],
  xDomain: [80, 100], yDomain: [0, 45],
  desc: `With 15 m of static head, flow falls faster than speed: ${ops[0].Q} L/s at 100 % to ${ops[4].Q} L/s at 80 %.`, height: 280,
});
console.log(JSON.stringify({ ops, shut: SPEEDS.map((r) => +P.setHead({ fit, r, arr }, 0).toFixed(2)) }));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'curves', figure(fig1, 'Figure 1. The tool\'s sample pump at 100, 95, 90, 85 and 80 % speed (affinity laws) against a quadratic system curve: 15 m static head plus 12 m friction at 40 L/s. Simulated with the tool\'s maths; not the paper\'s pumps or data.'));
  md = inject(md, 'flow', figure(fig2, 'Figure 2. Operating flow against speed for the same simulated system, beside a line where flow simply follows speed. Simulated; no paper data.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
