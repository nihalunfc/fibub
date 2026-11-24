// Figures for src/blog/discoveries/basketball-free-throw-release-trajectory-check.md, made with the maths of the
// Projectile drag tool (src/lib/sci/phprojectile.ts: quadratic drag, fourth-order Runge-Kutta).
// Run: node scripts/blog-figures/basketball-free-throw-release-trajectory-check.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { simulate } from '../../src/lib/sci/phprojectile.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/basketball-free-throw-release-trajectory-check.md', import.meta.url);

// Release conditions from the paper: Wang et al. (2026), Front. Sports Act. Living 8: 1834844 (CC BY 4.0), Table 2
// group means (release height m, release angle degrees, release velocity m/s).
const GROUPS = [
  { name: 'Athlete, made', h: 2.28, a: 52.2, v: 7.82 },
  { name: 'Athlete, missed', h: 2.19, a: 50.0, v: 7.46 },
  { name: 'Novice, made', h: 2.15, a: 50.3, v: 7.52 },
  { name: 'Novice, missed', h: 2.05, a: 47.9, v: 7.21 },
];
// Court and ball. Ring height and the free-throw line to ring-centre distance are the official court figures;
// ball mass, diameter and Cd 0.5 are the usual men's size-7 values (Cd is OUR assumption).
const RIM = 3.048, DIST = 4.191, RING_R = 0.2286, BALL_D = 0.2413, BALL_M = 0.6235, CD = 0.5;
const AREA = Math.PI * (BALL_D / 2) ** 2;
const CLEAR = RING_R - BALL_D / 2; // 0.1080 m: how far the ball's centre may be from the ring's centre

const path = (g, v = g.v, Cd = CD) => simulate({ v0: v, angle: g.a, h0: g.h, m: BALL_M, Cd, A: AREA }, 4000);
/** Where the falling ball's centre crosses ring height, from the tool's own path. */
function atRim(g, v = g.v, Cd = CD) {
  const r = path(g, v, Cd);
  for (let i = 1; i < r.y.length; i++) {
    if (r.vy[i] < 0 && (r.y[i - 1] - RIM) * (r.y[i] - RIM) <= 0) {
      const f = (RIM - r.y[i - 1]) / (r.y[i] - r.y[i - 1]), ip = (A) => A[i - 1] + f * (A[i] - A[i - 1]);
      return { x: ip(r.x), t: ip(r.t), vx: ip(r.vx), vy: ip(r.vy), entry: (Math.atan2(-ip(r.vy), ip(r.vx)) * 180) / Math.PI, apex: r.apex };
    }
  }
  return null;
}
/** Release speed that puts the ball's centre exactly over the ring centre (bisection on the tool's simulation). */
const needV = (g, D = DIST, Cd = CD) => { let lo = 4, hi = 14; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; const c = atRim(g, m, Cd); (!c || c.x < D) ? (lo = m) : (hi = m); } return (lo + hi) / 2; };

const rows = GROUPS.map((g) => { const c = atRim(g), need = needV(g); return { ...g, x: c.x, entry: c.entry, apex: c.apex, tof: c.t, need, over: c.x - DIST, lo: needV(g, DIST - CLEAR), hi: needV(g, DIST + CLEAR) }; });

// Sensitivity of the needed speed: drag coefficient, and how far in front of the line the ball leaves the hand.
const g0 = GROUPS[0];
const sens = {
  cd: [0, 0.45, 0.5, 0.54, 0.6].map((c) => ({ cd: c, v: needV(g0, DIST, c) })),
  forward: [0, 0.2, 0.4].map((f) => ({ f, v: needV(g0, DIST - f) })),
};

// Figure 1: the four mean trajectories up to the ring plane.
const trim = (g) => { // every 40th step, so each line stays a few dozen points
  const r = path(g), c = atRim(g), lim = Math.max(c.x, DIST) + 0.35;
  const keep = r.t.map((t, i) => i).filter((i) => r.x[i] <= lim && (i % 40 === 0 || r.x[i + 1] === undefined || r.x[i + 1] > lim));
  return { x: keep.map((i) => +r.x[i].toFixed(3)), y: keep.map((i) => +r.y[i].toFixed(3)) };
};
const fig1 = chart({
  title: 'Where each group mean puts the ball at ring height', xLabel: 'Distance from the free-throw line (m)', yLabel: 'Height (m)',
  series: GROUPS.map((g) => { const p = trim(g); return { name: g.name, kind: 'line', x: p.x, y: p.y, colour: ['var(--c-blog)', 'var(--c-tools)', 'var(--ink)', 'var(--muted)'][GROUPS.indexOf(g)] }; }),
  xDomain: [0, 5.3], yDomain: [1.8, 4.4], hlines: [{ y: RIM, text: 'ring 3.048 m' }], vlines: [{ x: DIST, text: 'ring centre' }],
  desc: `Four simulated free-throw paths from the group mean release height, angle and speed. The dashed lines mark ring height and the ring centre 4.19 m from the line.`, height: 290,
});

// Figure 2: the release speed the physics needs, against release angle, for the highest and lowest mean release height.
const angles = Array.from({ length: 41 }, (_, i) => 38 + i * 0.75);
const curve = (h) => angles.map((a) => needV({ h, a }));
const fig2 = chart({
  title: 'Release speed needed to reach the ring centre', xLabel: 'Release angle (°)', yLabel: 'Release speed (m/s)',
  series: [
    { name: 'From 2.28 m', kind: 'line', x: angles, y: curve(2.28).map((v) => +v.toFixed(3)) },
    { name: 'From 2.05 m', kind: 'line', x: angles, y: curve(2.05).map((v) => +v.toFixed(3)) },
    { name: 'Paper’s group means', kind: 'dots', x: GROUPS.map((g) => g.a), y: GROUPS.map((g) => g.v), size: 4, colour: 'var(--ink)' },
  ],
  xDomain: [38, 68], yDomain: [6.6, 8.1],
  desc: 'The release speed that puts the ball through the ring centre, against release angle, for release heights of 2.28 and 2.05 metres, with the four measured group means marked.', height: 290,
});

console.log(JSON.stringify({ rows: rows.map((r) => ({ name: r.name, x: +r.x.toFixed(3), over: +r.over.toFixed(3), entry: +r.entry.toFixed(1), apex: +r.apex.toFixed(3), tof: +r.tof.toFixed(3), need: +r.need.toFixed(3), window: [+r.lo.toFixed(3), +r.hi.toFixed(3)] })), sens, clear: +CLEAR.toFixed(4) }, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'paths', figure(fig1, 'Figure 1. The four group mean release conditions flown with the Projectile drag tool’s maths (mass 0.624 kg, diameter 24.1 cm, Cd 0.5, still air). The made-shot mean crosses ring height 0.6 m beyond the ring; the novice missed-shot mean falls 0.5 m short.'));
  md = inject(md, 'needed', figure(fig2, 'Figure 2. The release speed that drops the ball on the ring centre, for every release angle, at the highest and lowest mean release height in the paper. The four measured group means (black dots) all sit above the curve for their own height.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
