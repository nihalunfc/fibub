// #903 two-body orbit: universal-variable Kepler solution and direct RK4 checked against SciPy DOP853 (rtol 1e-13).
import { elements, kepler, system, positionsAt, integrate, stumpff } from '../../src/lib/sci/phtwobody.ts';
export default async (check) => {
  const AU = 1.495978707e11, Ms = 1.98892e30, day = 86400;
  const rel = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]) / Math.hypot(b[0], b[1]);
  const cases = {
    'near-circular (Sun and an Earth-like planet, 100 days)': [{ m: Ms, p: [0, 0], v: [0, 0] }, { m: 3e-6 * Ms, p: [AU, 0], v: [0, 29780] }, 100 * day, [-22338431163.914192, 147820760014.86288], [-29462.600176663946, -4469.456184496227], 0.0005744279823211346, 149511986831.08127],
    'eccentric binary (e 0.70, 50 days)': [{ m: Ms, p: [0, 0], v: [0, 0] }, { m: 0.5 * Ms, p: [AU, 0], v: [0, 20000] }, 50 * day, [55823143383.09062, 62773229892.15443], [-49731.60602396264, -2326.205870517463], 0.6994815738384875, 88025591452.64217],
    'hyperbolic fly-by (e 1.90, 200 days)': [{ m: Ms, p: [0, 0], v: [0, 0] }, { m: 1e-3 * Ms, p: [AU, 0], v: [-10000, 50000] }, 200 * day, [-288781766472.66565, 559830069382.8772], [-25788.088919394682, 24091.043416534398], 1.8998533616060862, -161356303480.46588],
  };
  for (const [name, [b1, b2, t, r, v, e, a]] of Object.entries(cases)) {
    const s = system(b1, b2), k = kepler(s.mu, s.r, s.v, t);
    check(`two-body: ${name}: e and a`, Math.abs(s.el.e - e) < 1e-9 && Math.abs(s.el.a / a - 1) < 1e-10);
    check(`two-body: ${name}: Kepler position and velocity vs SciPy`, rel(k.r, r) < 1e-8 && rel(k.v, v) < 1e-8);
    const n = integrate(b1, b2, t, 4000), dr = [n.p2[0] - n.p1[0], n.p2[1] - n.p1[1]];
    check(`two-body: ${name}: direct RK4 agrees and conserves E and L`, rel(dr, r) < 1e-6 && n.dE < 1e-8 && n.dL < 1e-8);
  }
  { const s = system(cases['eccentric binary (e 0.70, 50 days)'][0], cases['eccentric binary (e 0.70, 50 days)'][1]);
    check('two-body: period 2π√(a³/μ) = 11,628,833 s', Math.abs(s.el.T / 11628833.362742413 - 1) < 1e-10);
    const k = kepler(s.mu, s.r, s.v, s.el.T); check('two-body: one full period returns to the start', rel(k.r, s.r) < 1e-9);
    check('two-body: periapsis and apoapsis a(1 ∓ e)', Math.abs(s.el.rp / (s.el.a * (1 - s.el.e)) - 1) < 1e-12 && Math.abs(s.el.ra / (s.el.a * (1 + s.el.e)) - 1) < 1e-12);
    const p = positionsAt({ m: 2, p: [0, 0], v: [0, 0] }, { m: 1, p: [3, 0], v: [0, 0.5] }, 1.7, 1);
    check('two-body: bodies stay on opposite sides of the centre of mass (m1 r1 + m2 r2 = 0)', Math.abs(2 * p.p1[0] + p.p2[0]) < 1e-12 && Math.abs(2 * p.p1[1] + p.p2[1]) < 1e-12); }
  { const c = elements(1, [1, 0], [0, 1]); check('two-body: unit circle (μ = 1, r = 1, v = 1): e = 0, a = 1, T = 2π', c.e < 1e-12 && Math.abs(c.a - 1) < 1e-12 && Math.abs(c.T - 2 * Math.PI) < 1e-12 && c.kind === 'circle'); }
  { const pb = elements(1, [1, 0], [0, Math.SQRT2]); check('two-body: escape speed √(2μ/r) gives a parabola', Math.abs(pb.e - 1) < 1e-12 && pb.kind === 'parabola'); }
  { const [C, S] = stumpff(1e-3), [C2, S2] = stumpff(-1e-3); check('two-body: Stumpff functions near zero', Math.abs(C - (1 - Math.cos(Math.sqrt(1e-3))) / 1e-3) < 1e-12 && Math.abs(S2 - (Math.sinh(Math.sqrt(1e-3)) - Math.sqrt(1e-3)) / Math.sqrt(1e-3) ** 3) < 1e-9); }
};
