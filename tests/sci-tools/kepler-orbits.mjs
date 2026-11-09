// #1027 Kepler orbits: positions from Kepler's equation checked against an independent velocity-Verlet
// integration of Newton's gravity (GM = 4π² AU³/yr²); T² = a³ for the rounded planet values; g and
// escape speed against hand-worked values.
import { MU, AU_PER_YR_KMS, orbit, position, sweptArea, eccentricAnomaly, PLANETS, gAt, surfaceSpeeds, openPath, questions } from '../../src/lib/sci/kepler.ts';
export default async (check) => {
  const near = (a, b, e) => Math.abs(a - b) <= e;
  const o = orbit(1, 2 * Math.PI);
  check('kepler-orbits: circular speed at 1 AU gives a = 1 AU, T = 1 yr, e = 0', o.bound && near(o.a, 1, 1e-12) && near(o.T, 1, 1e-12) && near(o.e, 0, 1e-12));
  check('kepler-orbits: Earth orbital speed 2π AU/yr = 29.785 km/s, escape 42.12 km/s', near(o.vCirc * AU_PER_YR_KMS, 29.7847, 1e-3) && near(o.vEsc * AU_PER_YR_KMS, 42.1219, 1e-3));
  const sim = (v, T) => { let x = 1, y = 0, vx = 0, vy = v; const h = 1e-5; for (let t = 0; t < T - 1e-12; t += h) { let r = Math.hypot(x, y); vx -= MU * x / r ** 3 * h / 2; vy -= MU * y / r ** 3 * h / 2; x += vx * h; y += vy * h; r = Math.hypot(x, y); vx -= MU * x / r ** 3 * h / 2; vy -= MU * y / r ** 3 * h / 2; } return { x, y }; };
  for (const [k, t] of [[1.2, 0.3], [1.2, 1.1], [0.8, 0.2], [0.8, 0.5], [1.35, 2]]) {
    const v = k * 2 * Math.PI, ob = orbit(1, v), p = position(ob, t), s = sim(v, t);
    check(`kepler-orbits: launch at ${k} × circular speed, t ${t} yr matches Verlet (${p.x.toFixed(5)}, ${p.y.toFixed(5)})`, near(p.x, s.x, 2e-4) && near(p.y, s.y, 2e-4));
  }
  { const ob = orbit(1, 1.2 * 2 * Math.PI); check('kepler-orbits: 1.2 × v_circ: e = 0.44, a = 1/(2 − 1.44) = 1.7857 AU, T = a^1.5', near(ob.e, 0.44, 1e-12) && near(ob.a, 1 / 0.56, 1e-12) && near(ob.T, ob.a ** 1.5, 1e-12) && near(ob.rp, 1, 1e-12) && ob.launchAtPeri); }
  { const ob = orbit(1, 0.8 * 2 * Math.PI); check('kepler-orbits: 0.8 × v_circ is launched at aphelion (ra = 1 AU)', !ob.launchAtPeri && near(ob.ra, 1, 1e-12) && near(position(ob, 0).x, 1, 1e-12)); }
  { const ob = orbit(1, 1.2 * 2 * Math.PI), A = sweptArea(ob, 0, ob.T); check('kepler-orbits: area swept in one period = πab', near(A, Math.PI * ob.a * ob.b, 1e-12)); }
  // equal areas from positions: area by summing small triangles
  { const ob = orbit(1, 1.3 * 2 * Math.PI), tri = (t1, t2) => { let A = 0; const n = 20000; for (let i = 0; i < n; i++) { const p = position(ob, t1 + (t2 - t1) * i / n), q = position(ob, t1 + (t2 - t1) * (i + 1) / n); A += 0.5 * Math.abs(p.x * q.y - p.y * q.x); } return A; };
    const a1 = tri(0, ob.T / 12), a2 = tri(ob.T / 2, ob.T / 2 + ob.T / 12); check(`kepler-orbits: equal areas near and far (${a1.toFixed(5)}, ${a2.toFixed(5)} AU²)`, near(a1, a2, 1e-6) && near(a1, sweptArea(ob, 0, ob.T / 12), 1e-6)); }
  check('kepler-orbits: escape speed or more is unbound', !orbit(1, Math.SQRT2 * 2 * Math.PI).bound && !orbit(1, 1.5 * 2 * Math.PI).bound && orbit(1, 1.41 * 2 * Math.PI).bound);
  { const p = openPath(1, 1.6 * 2 * Math.PI, 3); const r = Math.hypot(p.x.at(-1), p.y.at(-1)); check('kepler-orbits: unbound path flies away', r > 5); }
  check("kepler-orbits: Kepler's equation solved", [0.1, 0.5, 0.9, 0.99].every((e) => [0.1, 1, 3, 6].every((M) => { const E = eccentricAnomaly(M, e); return near(E - e * Math.sin(E), M, 1e-12); })));
  check('kepler-orbits: rounded planet values follow T² = a³ within 1 %', PLANETS.every(([, a, T]) => near((T * T) / (a ** 3), 1, 0.01)));
  check('kepler-orbits: g at R above the surface is g/4, at half depth g/2', near(gAt(2, 1, 9.8), 2.45, 1e-12) && near(gAt(0.5, 1, 9.8), 4.9, 1e-12) && gAt(0, 1, 9.8) === 0);
  { const s = surfaceSpeeds(9.8, 6.371e6); check('kepler-orbits: Earth escape √(2gR) = 11.17 km/s, low orbit 7.90 km/s', near(s.escape, 11174.3, 1) && near(s.orbit, 7901.4, 1)); }
  let seed = 6; const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647); let ok = true;
  for (let i = 0; i < 300; i++) for (const lv of [9, 11]) { const qs = questions(lv, r); if (qs.length !== (lv === 11 ? 5 : 3) || qs.some((x) => !Number.isFinite(x.ans) || x.ans <= 0)) ok = false; }
  check('kepler-orbits: questions have positive finite answers', ok);
};
