// Figures for src/blog/discoveries/trionda-world-cup-ball-drag-crisis-critical-reynolds-number-range.md, made with the maths of
// the Dimensionless numbers calculator (src/lib/sci/phdimless.ts) and Projectile drag (src/lib/sci/phprojectile.ts).
// Run: node scripts/blog-figures/trionda-world-cup-ball-drag-crisis-critical-reynolds-number-range.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { dimensionless } from '../../src/lib/sci/phdimless.ts';
import { simulate, vacuum } from '../../src/lib/sci/phprojectile.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/trionda-world-cup-ball-drag-crisis-critical-reynolds-number-range.md', import.meta.url);

// Inputs from the paper: Goff, Hong, Liu and Asai (2026), Applied Sciences 16(6): 2808, doi:10.3390/app16062808 (CC BY).
// Ball diameter 0.22 m (area 0.038 m²), air density 1.2 kg/m³, kinematic viscosity 1.55e-5 m²/s, g = 9.8 m/s²,
// launch at 25° and 15 to 35 m/s with no spin or wind; critical (drag-crisis) speeds: Trionda 11.9 m/s,
// Al Rihla / Telstar 18 / Brazuca about 14 to 18 m/s, Jabulani 21.9 and 26.9 m/s (two orientations).
const D = 0.22, RHO = 1.2, NU = 1.55e-5, MU = RHO * NU, G = 9.8, ANG = 25;
const BALLS = [{ id: 'Trionda', v: 11.9 }, { id: 'Brazuca era, low', v: 14 }, { id: 'Brazuca era, high', v: 18 }, { id: 'Jabulani A', v: 21.9 }, { id: 'Jabulani B', v: 26.9 }];
// OUR assumptions: mass 0.43 kg (Laws of the Game allow 410 to 450 g), post-crisis drag coefficient 0.20 for the flight.
const M = 0.43, A = Math.PI * (D / 2) ** 2, CD = 0.2;
const air = { rho: RHO, mu: MU, c: 343, sigma: NaN, cp: 1005, k: 0.0257, beta: 1 / 293.15 };
const re = BALLS.map((b) => { const n = dimensionless({ ...air, U: b.v, L: D, geometry: 'sphere' })[0]; return { ...b, Re: Math.round(n.value), note: n.note }; });

const fly = (v0, Cd = CD) => simulate({ v0, angle: ANG, m: M, Cd, A, rho: RHO, g: G });
const runs = [15, 25, 35].map((v0) => {
  const s = fly(v0), sp = s.vx.map((x, i) => Math.hypot(x, s.vy[i]));
  const above = (c) => { let t = 0; for (let i = 1; i < s.t.length; i++) if (sp[i] >= c) t += s.t[i] - s.t[i - 1]; return t / s.tof; };
  return { v0, s, sp, range: +s.range.toFixed(1), tof: +s.tof.toFixed(2), vmin: +Math.min(...sp).toFixed(1), vac: +vacuum(v0, ANG, 0, G).range.toFixed(1), fracJabA: +(above(21.9) * 100).toFixed(0), fracJabB: +(above(26.9) * 100).toFixed(0), fracTri: +(above(11.9) * 100).toFixed(0) };
});
const sens = [0.15, 0.2, 0.25, 0.45].map((Cd) => ({ Cd, r25: +fly(25, Cd).range.toFixed(1), r35: +fly(35, Cd).range.toFixed(1) }));

// Figure 1: speed along the flight (every 40th step and the landing, rounded).
const thin = (a) => a.filter((_, i) => i % 40 === 0 || i === a.length - 1);
const fig1 = chart({
  title: 'Ball speed during the flight (Cd 0.20, 25° kick)', xLabel: 'Time after the kick (s)', yLabel: 'Speed (m/s)',
  series: runs.map((r) => ({ name: `Kicked at ${r.v0} m/s`, kind: 'line', x: thin(r.s.t).map((t) => +t.toFixed(3)), y: thin(r.sp).map((v) => +v.toFixed(2)) })),
  xDomain: [0, 2.8], yDomain: [0, 36],
  hlines: [{ y: 11.9, text: 'Trionda crisis 11.9' }, { y: 21.9, text: 'Jabulani crisis 21.9' }],
  desc: `Speed against time for kicks at 15, 25 and 35 m/s and 25 degrees. The slowest point of each flight is ${runs.map((r) => r.vmin).join(', ')} m/s, all above the Trionda's 11.9 m/s drag-crisis speed, while the 15 and 25 m/s kicks spend most or all of their flight below the Jabulani's 21.9 m/s.`, height: 270,
});
const VV = Array.from({ length: 21 }, (_, i) => 15 + i);
const fig2 = chart({
  title: 'Range of a 25° kick for three drag coefficients', xLabel: 'Launch speed (m/s)', yLabel: 'Range (m)',
  series: [0.15, 0.2, 0.25].map((Cd) => ({ name: `Cd ${Cd.toFixed(2)}`, kind: 'line', x: VV, y: VV.map((v) => +fly(v, Cd).range.toFixed(2)) })),
  xDomain: [15, 35], yDomain: [10, 70],
  desc: `Range on level ground for a 0.43 kg, 22 cm ball kicked at 25 degrees. At 25 m/s it is ${sens[0].r25}, ${sens[1].r25} and ${sens[2].r25} m for drag coefficients 0.15, 0.20 and 0.25.`, height: 260,
});

console.log(JSON.stringify({ A: +A.toFixed(4), re: re.map((r) => ({ id: r.id, v: r.v, Re: r.Re, note: r.note })), runs: runs.map(({ s, sp, ...r }) => r), sens }));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'speed', figure(fig1, 'Figure 1. Speed along the flight for three kicks at 25°, from the Projectile drag tool\'s maths with a constant drag coefficient of 0.20 and a 0.43 kg ball (our assumptions). Dashed lines: the drag-crisis speeds measured in the paper for Trionda and for Jabulani (orientation A).'));
  md = inject(md, 'range', figure(fig2, 'Figure 2. How far a 25° kick goes for three constant drag coefficients, from the same maths. A small rise in post-crisis drag costs metres at match speeds.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
