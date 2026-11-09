// #1188 conic explorer. Foci, eccentricity, directrices and latus rectum checked with NumPy: points sampled
// from each curve's own equation satisfy the focus properties (sum of distances 2a for an ellipse, difference
// 2a for a hyperbola, PF = e·PD for all); the cone-slice eccentricity cos β / cos α against a NumPy fit of
// the conic cut from a double cone (Dandelin), for α = 30° and β = 60°, 45°, 30°, 20°.
import * as K from '../../src/lib/sci/school-conics.ts';
const near = (a, b, t = 1e-9) => Number.isFinite(a) && Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
export default async (check) => {
  const e = K.ellipse(5, 3);
  check('conics: ellipse a 5, b 3: c 4, e 0.8, latus 3.6, directrices x = ±6.25 (NumPy)', near(e.c, 4) && near(e.e, 0.8) && near(e.latus, 3.6) && near(e.directrices[0].x, 6.25) && e.equation === 'x²/25 + y²/9 = 1' && !e.vertical);
  const ts = [0.3, 1.1, 2, 3.5, 5.2];
  check('conics: ellipse PF₁ + PF₂ = 2a and PF = e·PD', ts.every((t) => { const p = e.point(t); return near(K.dist(p, e.foci[0]) + K.dist(p, e.foci[1]), 10) && near(K.dist(p, e.foci[0]), e.e * K.toLine(p, e.directrices[0])); }));
  const ev = K.ellipse(2, 4);
  check('conics: ellipse with b > a has a vertical major axis, foci (0, ±√12)', ev.vertical && near(ev.foci[0][1], Math.sqrt(12)) && near(ev.latus, 2) && ts.every((t) => { const p = ev.point(t); return near(K.dist(p, ev.foci[0]) + K.dist(p, ev.foci[1]), 8); }));
  const h = K.hyperbola(3, 4);
  check('conics: hyperbola a 3, b 4: c 5, e 5/3, latus 32/3, directrices x = ±1.8 (NumPy)', near(h.c, 5) && near(h.e, 5 / 3) && near(h.latus, 32 / 3) && near(h.directrices[0].x, 1.8) && h.equation === 'x²/9 − y²/16 = 1');
  check('conics: hyperbola |PF₁ − PF₂| = 2a and PF = e·PD', [-1.5, -0.4, 0.2, 0.9, 1.7].every((t) => { const p = h.point(t); return near(Math.abs(K.dist(p, h.foci[0]) - K.dist(p, h.foci[1])), 6) && near(K.dist(p, h.foci[0]), h.e * K.toLine(p, h.directrices[0])); }));
  for (const dir of ['right', 'left', 'up', 'down']) { const p = K.parabola(1.5, dir); check(`conics: parabola opening ${dir}: PF = PD, latus 6`, p.latus === 6 && p.e === 1 && [-2, -0.5, 0.7, 1.9].every((t) => near(K.dist(p.point(t), p.foci[0]), K.toLine(p.point(t), p.directrices[0])))); }
  check('conics: parabola equations', K.parabola(2, 'right').equation === 'y² = 8x' && K.parabola(2, 'down').equation === 'x² = −8y');
  const c = K.circle(1, -2, 3);
  check('conics: circle (x − 1)² + (y + 2)² = 9', c.equation === '(x − 1)² + (y + 2)² = 9' && c.e === 0 && near(K.dist(c.point(0.7), [1, -2]), 3));
  const fit = { 60: 0.5773502691896261, 45: 0.816496580927726, 30: 1, 20: 1.0850635751324984 };
  for (const [b, ee] of Object.entries(fit)) { const s = K.slice(30, +b); check(`conics: cone α 30°, plane β ${b}°: e ${ee.toFixed(4)} (NumPy fit)`, near(s.e, ee, 1e-9) && s.kind === (+b > 30 ? 'ellipse' : +b === 30 ? 'parabola' : 'hyperbola')); }
  check('conics: a plane square to the axis cuts a circle', K.slice(30, 90).kind === 'circle' && K.slice(30, 90).e === 0);
};
