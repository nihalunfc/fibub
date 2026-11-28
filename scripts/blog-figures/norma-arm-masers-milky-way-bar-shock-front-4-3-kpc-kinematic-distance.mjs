// Figures for src/blog/discoveries/norma-arm-masers-milky-way-bar-shock-front-4-3-kpc-kinematic-distance.md, made with
// the maths of the Hydrogen 21 cm line analyser (src/lib/astro/hline.ts): kinematic distances from a flat rotation
// curve, tangent points, and the tool's modern Milky Way constants (R0 8.2 kpc, V0 233 km/s).
// Run: node scripts/blog-figures/norma-arm-masers-milky-way-bar-shock-front-4-3-kpc-kinematic-distance.mjs
import fs from 'node:fs';
import { kinematicDistance, tangentPoint, GALAXY } from '../../src/lib/astro/hline.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/norma-arm-masers-milky-way-bar-shock-front-4-3-kpc-kinematic-distance.md', import.meta.url);

// From the paper's abstract (Davis, Bland-Hawthorn, Tepper-García, Agertz, Iles 2026, Nature Astronomy,
// doi:10.1038/s41550-026-03010-5, CC BY 4.0): bar semi-major axis a ≈ 4.3 ± 0.2 kpc, semi-minor b ≈ 2.3 ± 0.2 kpc,
// angle φ = 20 (+5/−2)° to the Sun–centre line, pattern speed Ω_p ≲ 40 km/s/kpc.
const { R0, V0 } = GALAXY.modern; const A = 4.3, B = 2.3, PHI = 20, OMP = 40;
const rad = Math.PI / 180;
// Near end of the bar (quadrant I): galactocentric (x toward the Sun, y toward l = 90°).
const tip = (a, phi) => { const x = a * Math.cos(phi * rad), y = a * Math.sin(phi * rad); return { l: Math.atan2(y, R0 - x) / rad, d: Math.hypot(y, R0 - x) }; };
const end = tip(A, PHI);
// LSR velocity of gas on a circular orbit at R in a flat rotation curve: v = V0 sin l (R0/R − 1).
const vCirc = (l, R) => V0 * Math.sin(l * rad) * (R0 / R - 1);
const vEnd = vCirc(end.l, A);
const kdEnd = kinematicDistance(end.l, 0, vEnd, R0, V0);
const vt = V0 * (1 - Math.sin(end.l * rad)); // terminal velocity on that sightline for a flat curve
const tp = tangentPoint(end.l, vt, R0, V0);
const shifts = [-40, -20, 20, 40].map((dv) => { const k = kinematicDistance(end.l, 0, vEnd + dv, R0, V0); return { dv, R: +k.R.toFixed(3), near: +k.d[0].toFixed(3), far: +k.d[1].toFixed(3), shiftNear: +(k.d[0] - kdEnd.d[0]).toFixed(3) }; });
const ends = { phi18: tip(A, 18), phi25: tip(A, 25), a41: tip(4.1, PHI), a45: tip(4.5, PHI) };
const out = {
  end_l: +end.l.toFixed(3), end_d: +end.d.toFixed(3), vEnd: +vEnd.toFixed(2), kdEnd: { R: +kdEnd.R.toFixed(3), d: kdEnd.d.map((x) => +x.toFixed(3)) },
  vt: +vt.toFixed(2), tp: { R: +tp.R.toFixed(3), V: +tp.V.toFixed(2), d: +tp.d.toFixed(3) }, shifts,
  endRange: Object.fromEntries(Object.entries(ends).map(([k, v]) => [k, { l: +v.l.toFixed(2), d: +v.d.toFixed(2) }])),
  Rcr_min: +(V0 / OMP).toFixed(3), ratio_min: +(V0 / OMP / A).toFixed(3), axisRatio: +(B / A).toFixed(3),
  v_tp_flatcheck: +(tp.V).toFixed(2),
};
console.log(JSON.stringify(out, null, 1));

// Figure 1: near and far kinematic distance against LSR velocity on the sightline to the bar's end.
const vs = Array.from({ length: 151 }, (_, i) => 1 + i * ((vt - 1.001) / 150));
const near = vs.map((v) => kinematicDistance(end.l, 0, v, R0, V0).d[0]);
const far = vs.map((v) => kinematicDistance(end.l, 0, v, R0, V0).d[1]);
const fig1 = chart({
  title: `Kinematic distance at l = ${end.l.toFixed(1)}°`, xLabel: 'LSR velocity (km/s)', yLabel: 'Distance from the Sun (kpc)',
  series: [
    { name: 'Near solution', kind: 'line', x: vs, y: near },
    { name: 'Far solution', kind: 'line', dash: '5 4', x: vs, y: far },
    { name: 'Bar end, circular orbit', kind: 'dots', x: [vEnd], y: [kdEnd.d[0]] },
  ],
  xDomain: [0, 160], yDomain: [0, 16], yTicks: [0, 4, 8, 12, 16],
  bands: [{ x0: vEnd - 20, x1: vEnd + 20, text: '±20 km/s' }],
  vlines: [{ x: vt, text: 'terminal' }],
  desc: `Near and far kinematic distances against LSR velocity from 0 to ${vt.toFixed(0)} km/s along Galactic longitude ${end.l.toFixed(1)} degrees, for a flat rotation curve of 233 km/s and R0 of 8.2 kpc. Gas on a circular orbit at the bar's end, 4.3 kpc from the centre, would move at ${vEnd.toFixed(1)} km/s and sit ${kdEnd.d[0].toFixed(2)} kpc away.`,
  height: 280,
});

// Figure 2: galactocentric radius the tool assigns when the gas streams faster or slower than circular.
const dvs = Array.from({ length: 81 }, (_, i) => -40 + i);
const fig2 = chart({
  title: 'Where non-circular motion moves the gas', xLabel: 'Velocity off circular rotation Δv (km/s)', yLabel: 'Galactocentric radius R (kpc)',
  series: [{ name: 'R from the kinematic distance', kind: 'line', x: dvs, y: dvs.map((dv) => kinematicDistance(end.l, 0, vEnd + dv, R0, V0).R) }],
  xDomain: [-40, 40], yDomain: [3, 6.5], yTicks: [3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5],
  hlines: [{ y: A, text: 'bar end, 4.3 kpc' }, { y: V0 / OMP, text: `corotation ≥ ${(V0 / OMP).toFixed(2)} kpc` }],
  desc: `Galactocentric radius from the kinematic distance against a velocity error from minus 40 to plus 40 km/s at longitude ${end.l.toFixed(1)} degrees. Twenty km/s slower than circular puts the gas at ${shifts[1].R.toFixed(2)} kpc, twenty faster at ${shifts[2].R.toFixed(2)} kpc.`,
  height: 270,
});

if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'kd', figure(fig1, `Figure 1. The Hydrogen line analyser's kinematic-distance maths on the sightline to the bar's near end. The dot is gas on a circular orbit at the end of a 4.3 kpc bar: ${vEnd.toFixed(1)} km/s, ${kdEnd.d[0].toFixed(2)} kpc away. A ±20 km/s error in the assumed motion slides the near distance along the curve by most of a kiloparsec.`));
  md = inject(md, 'shift', figure(fig2, 'Figure 2. The same sightline: the galactocentric radius the tool assigns if the gas moves faster or slower than circular rotation. Streaming of a few tens of km/s, normal at a bar\'s shock, moves the gas by half a kiloparsec or more, enough to turn a bar feature into an apparent arm.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
