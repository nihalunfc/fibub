// Figures for src/blog/discoveries/gpr-pipe-hyperbola-velocity-crossing-angle-burial-depth.md, made with the maths of
// the GPR radargram viewer (src/lib/sci/gpr.ts: fitHyperbola, depthOf, epsOf).
// Run: node scripts/blog-figures/gpr-pipe-hyperbola-velocity-crossing-angle-burial-depth.mjs   (rewrites the charts)
import fs from 'node:fs';
import { fitHyperbola, depthOf, epsOf } from '../../src/lib/sci/gpr.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/gpr-pipe-hyperbola-velocity-crossing-angle-burial-depth.md', import.meta.url);

// From the paper (Štifanić et al. 2025, Remote Sensing 17: 3493, doi:10.3390/rs17203493, CC BY 3.0): 350 MHz antenna,
// transmitter-receiver separation 0.16 m, 60 traces per metre, apex two-way times about 9 to 43 ns, burial depths 0.4 to
// 2.0 m, diameters 0.025 to 0.6 m, survey line to pipe angles 19 to 90°.
// OUR assumptions: soil speed v = 0.09 m/ns, a pipe whose top is 1.0 m down, picks over ±0.8 m from the apex.
const V = 0.09, TOP = 1.0, DX = 1 / 60, HALF = 0.8, S = 0.16;
const xs = Array.from({ length: Math.round((2 * HALF) / DX) + 1 }, (_, i) => -HALF + i * DX);
const r = (v, d = 3) => +v.toFixed(d);

// Two-way time to a cylinder of radius R (top at TOP) seen at horizontal distance u across it, zero offset:
// the ray goes to the nearest point of the circle, so t = 2 (√(u² + (TOP + R)²) − R) / v.
const tCyl = (u, R, v = V) => (2 * (Math.hypot(u, TOP + R) - R)) / v;
// With transmitter and receiver S apart along the line (point target at the pipe centre, bistatic), minus the radius.
const tOff = (u, R, v = V) => (Math.hypot(u - S / 2, TOP + R) + Math.hypot(u + S / 2, TOP + R) - 2 * R) / v;
// The line crosses the pipe at angle θ: a step x along the line is x·sin θ across the pipe.
const fit = (f) => fitHyperbola(xs.map((x) => ({ x, t: f(x) })));

// 1. What the paper's ranges imply if the shallowest pipe has the shortest time and the deepest the longest (OUR pairing).
const implied = [[0.4, 9], [2.0, 43]].map(([d, t]) => ({ d, t, v: r((2 * d) / t, 4), eps: r(epsOf((2 * d) / t), 1) }));
// 2. A point target (R → 0) crossed at 90°: the fit gives the true speed.
const point = fit((x) => tCyl(x, 0));
// 3. Pipe size: diameters 0.025 to 0.6 m, crossed at 90°, fitted as if it were a point.
const sizes = [0.025, 0.1, 0.2, 0.3, 0.4, 0.6].map((D) => { const f = fit((x) => tCyl(x, D / 2)); return { D, v: r(f.v, 4), eps: r(f.eps, 2), depth: r(f.depth, 3), t0: r(f.t0, 2) }; });
// 4. Crossing angle 19 to 90°, a 0.3 m pipe, fitted as if crossed at right angles.
const angles = [19, 25, 30, 40, 45, 50, 60, 70, 80, 90].map((a) => { const s = Math.sin((a * Math.PI) / 180), f = fit((x) => tCyl(x * s, 0.15)); return { a, v: r(f.v, 4), eps: r(f.eps, 2), depth: r(f.depth, 3), vCorrected: r(f.v * s, 4) }; });
// 5. The 0.16 m antenna separation, a 0.3 m pipe at 90°, fitted with the zero-offset formula.
const off = fit((x) => tOff(x, 0.15));
const apex = { t: r(tCyl(0, 0), 2), depthBack: depthOf(tCyl(0, 0), V) };

// Figure 1: the three hyperbolas (times every 5 cm).
const sub = xs.filter((_, i) => i % 3 === 0);
const fig1 = chart({
  title: 'One pipe, three crossing angles', xLabel: 'Distance along the survey line (m)', yLabel: 'Two-way time (ns)',
  series: [90, 45, 19].map((a) => { const s = Math.sin((a * Math.PI) / 180); return { name: `Crossed at ${a}°`, kind: 'line', x: sub.map((x) => r(x, 3)), y: sub.map((x) => r(tCyl(x * s, 0.15), 2)) }; }),
  xDomain: [-HALF, HALF], yDomain: [21, 36], yReverse: true, height: 270,
  desc: `Simulated two-way times over a 0.3 m pipe whose top is 1.0 m down in soil with a wave speed of 0.09 m/ns, crossed at 90, 45 and 19 degrees. The apex is at ${apex.t} ns in every case; the shallower the angle, the flatter the hyperbola.`,
});
// Figure 2: fitted speed against crossing angle.
const fig2 = chart({
  title: 'Speed from a hyperbola fit, against crossing angle', xLabel: 'Angle between survey line and pipe (°)', yLabel: 'Fitted wave speed (m/ns)',
  series: [
    { name: 'Fitted as if at 90°', kind: 'line', x: angles.map((a) => a.a), y: angles.map((a) => a.v) },
    { name: 'Multiplied by sin(angle)', kind: 'line', x: angles.map((a) => a.a), y: angles.map((a) => a.vCorrected), dash: '5 4' },
  ],
  hlines: [{ y: 0.09, text: 'true soil speed, 0.09' }, { y: 0.3, text: 'speed of light in air, 0.30' }], xDomain: [15, 90], yDomain: [0, 0.32], height: 270,
  desc: `Wave speed found by fitting a hyperbola to a 0.3 m pipe in soil of 0.09 m/ns, as the survey line turns from 90 to 19 degrees to the pipe. At 19 degrees the fit gives ${angles[0].v} m/ns, faster than is possible in soil; multiplying by sin(angle) gives back about ${angles[0].vCorrected}.`,
});

console.log(JSON.stringify({ implied, point: { v: r(point.v, 5), depth: r(point.depth, 4) }, sizes, angles, offset: { v: r(off.v, 4), eps: r(off.eps, 2), depth: r(off.depth, 3), t0: r(off.t0, 2) }, apex, epsTrue: r(epsOf(V), 2), n: xs.length }));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'hyper', figure(fig1, 'Figure 1. Simulated reflection times over one buried pipe (0.3 m wide, top 1.0 m down, soil wave speed 0.09 m/ns: our assumptions), for three angles between the survey line and the pipe. Not the paper\'s data.'));
  md = inject(md, 'angle', figure(fig2, 'Figure 2. The wave speed the GPR viewer\'s hyperbola fit returns for the same pipe, as the crossing angle changes, and the same speed multiplied by the sine of the angle. The fit is exact only at 90°.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
