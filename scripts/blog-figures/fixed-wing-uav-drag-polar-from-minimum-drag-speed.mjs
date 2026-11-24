// Figures for src/blog/discoveries/fixed-wing-uav-drag-polar-from-minimum-drag-speed.md, made with the maths of the
// Aircraft performance calculator (src/lib/sci/eng-aircraft.ts: parabolic polar, characteristic speeds, ground roll).
// Run: node scripts/blog-figures/fixed-wing-uav-drag-polar-from-minimum-drag-speed.mjs
import fs from 'node:fs';
import { performance as perf, dragAt, speedFor, polar, takeoff } from '../../src/lib/sci/eng-aircraft.ts';
import { atmosphere, G0 } from '../../src/lib/sci/eng-atmos.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/fixed-wing-uav-drag-polar-from-minimum-drag-speed.md', import.meta.url);

// Inputs from the paper: Panagiotopoulos, Sakellariou and Hatziefremidis (2024), Drones 8(6): 217,
// doi:10.3390/drones8060217 (CC BY 4.0). A 6 kg electric fixed-wing UAV: wing area 0.49 m2, span 2.21 m,
// aspect ratio 10, CLmax 1.724 with flaperons, stall 10.3 m/s at sea level, cruise 15.86 m/s (no winglets),
// least-power speed 12.71 m/s, least-drag speed 16.73 m/s, maximum speed 28.8 m/s, cruise power about 75 W,
// maximum power demand 287.5 W, battery 3S 13,000 mAh, endurance 1.5 to 2 h.
const MASS = 6, S = 0.49, SPAN = 2.21, CLMAX = 1.724, VMD = 16.73, VMP = 12.71, VCR = 15.86, VMAX = 28.8;
const P_CRUISE = 75, P_MAX = 287.5, WH = 11.1 * 13; // 3S nominal 11.1 V x 13 Ah = 144.3 Wh
const E_OSWALD = 0.85, ETA = 0.65; // OUR assumptions: Oswald efficiency and propeller (plus drive) efficiency

const rho = atmosphere(0).rho, W = MASS * G0, AR = (SPAN * SPAN) / S, k = 1 / (Math.PI * E_OSWALD * AR);
// The drag polar implied by the paper's least-drag speed: at that speed CL = sqrt(CD0/k).
const CLmd = (2 * W) / (rho * S * VMD * VMD), CD0 = k * CLmd * CLmd;
const AC = { mass: MASS, S, span: SPAN, CD0, e: E_OSWALD, CLmax: CLMAX, engine: 'prop', power: P_MAX, eta: ETA, fuel: 0, alt: 0 };
const R = perf(AC);
const shaft = (V) => dragAt(AC, k, W, rho, V).P / ETA;
const bisect = (f, lo, hi) => { for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (f(m) < 0) lo = m; else hi = m; } return (lo + hi) / 2; };
const vMaxTool = bisect((V) => shaft(V) - P_MAX, VMD, 60);
const clStall = (2 * W) / (rho * S * 10.3 * 10.3); // the CLmax the paper's 10.3 m/s stall really needs

const VV = Array.from({ length: 121 }, (_, i) => 8 + i * 0.2);
const fig1 = chart({
  title: 'Shaft power the UAV needs in level flight', xLabel: 'Airspeed (m/s)', yLabel: 'Shaft power (W)',
  series: [
    { name: 'Power required ÷ 0.65', kind: 'line', x: VV, y: VV.map((V) => +shaft(V).toFixed(2)) },
    { name: 'Paper: cruise and maximum', kind: 'dots', x: [VCR, VMAX], y: [P_CRUISE, P_MAX], size: 5, colour: 'var(--ink)' },
  ],
  xDomain: [8, 32], yDomain: [0, 320],
  vlines: [{ x: VMP, text: 'Vmp 12.71', left: true }, { x: VMD, text: 'Vmd 16.73', dy: 16 }],
  desc: 'Shaft power against airspeed for the paper’s UAV, from the drag polar implied by its least-drag speed, with the paper’s own cruise and maximum power points.', height: 260,
});

const EV = Array.from({ length: 101 }, (_, i) => 10 + i * 0.15);
const fig2 = chart({
  title: 'Endurance on a 144 Wh battery', xLabel: 'Cruise airspeed (m/s)', yLabel: 'Endurance (hours)',
  series: [{ name: 'Flat-out electrical draw ignored', noLegend: true, kind: 'line', x: EV, y: EV.map((V) => +(WH / shaft(V)).toFixed(3)) }],
  xDomain: [10, 25], yDomain: [0, 3.5],
  hlines: [{ y: 2, text: "paper's 2 h" }, { y: 1.5, text: "paper's 1.5 h" }],
  vlines: [{ x: VMP, text: 'Vmp', left: true }, { x: VCR, text: 'cruise 15.86' }],
  desc: 'Endurance from a 144 Wh battery against cruise speed, using the power curve above. The paper’s claimed 1.5 to 2 hours falls where its own cruise speed does.', height: 250,
});

const out = {
  AR: +AR.toFixed(2), k: +k.toFixed(5), CLmd: +CLmd.toFixed(4), CD0: +CD0.toFixed(5), LDmax: +R.LDmax.toFixed(2),
  vmd: +R.speeds.minDrag.V.toFixed(2), vmp: +R.speeds.minPower.V.toFixed(2), ratio: +(VMD / VMP).toFixed(4), root3: +(3 ** 0.25).toFixed(4),
  stall: +R.speeds.stall.V.toFixed(2), clStallNeeded: +clStall.toFixed(3),
  cruise: { V: VCR, CL: +dragAt(AC, k, W, rho, VCR).CL.toFixed(3), D: +dragAt(AC, k, W, rho, VCR).D.toFixed(2), Preq: +dragAt(AC, k, W, rho, VCR).P.toFixed(1), shaft: +shaft(VCR).toFixed(1) },
  minPower: { V: +R.speeds.minPower.V.toFixed(2), shaft: +shaft(R.speeds.minPower.V).toFixed(1), hours: +(WH / shaft(R.speeds.minPower.V)).toFixed(2) },
  hoursAtCruise: +(WH / shaft(VCR)).toFixed(2), vMaxTool: +vMaxTool.toFixed(2), shaftAtVmax: +shaft(VMAX).toFixed(1),
  roll: +R.takeoff.s.toFixed(1), Vlo: +R.takeoff.Vlo.toFixed(2), thrust: +R.takeoff.T.toFixed(1),
  cd0For: [0.75, 0.8, 0.85, 0.9, 0.95].map((e) => { const kk = 1 / (Math.PI * e * AR), cl = (2 * W) / (rho * S * VMD * VMD); return [e, +(kk * cl * cl).toFixed(5), +(1 / (2 * Math.sqrt(kk * cl * cl * kk))).toFixed(1)]; }),
};
console.log(JSON.stringify(out));

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'power', figure(fig1, 'Figure 1. Shaft power against airspeed, worked out by the Aircraft performance calculator’s maths from the drag polar that the paper’s own least-drag speed implies, assuming an Oswald efficiency of 0.85 and a 65 % efficient propeller (both ours). The black dots are the paper’s cruise and maximum power figures, which it reached by other means.'));
  md = inject(md, 'endurance', figure(fig2, 'Figure 2. Endurance from the 144 Wh battery against cruise speed, from the same power curve. The paper’s claim of 1.5 to 2 hours lands where its own cruise speed does.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
