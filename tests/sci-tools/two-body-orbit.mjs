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
  // New with the asteroid (4337) Arecibo article (A&A 688: L23, Table 1: a = 46.8 km, T = 32.9741 h, M = 4.3 × 10^15 kg).
  { const G = 6.6743e-11, a = 46.8e3, T = 32.9741 * 3600, M = (4 * Math.PI ** 2 * a ** 3) / (G * T * T);
    check('two-body: Arecibo binary, Kepler mass from 46.8 km and 32.9741 h = 4.3027 × 10^15 kg', Math.abs(M / 1e15 - 4.30270) < 1e-4);
    const mk = (m1, m2, e) => { const mu = G * (m1 + m2), rp = a * (1 - e), vp = Math.sqrt((mu * (1 + e)) / rp); return system({ m: m1, p: [0, 0], v: [0, 0] }, { m: m2, p: [rp, 0], v: [0, vp] }); };
    const s = mk(4.1e15, 0.2e15, 0.06);
    check('two-body: Arecibo binary (4.1 + 0.2 × 10^15 kg, a 46.8 km, e 0.06): period 32.984 h, a 46.8 km, closest 43.99 km, farthest 49.61 km', Math.abs(s.el.T / 3600 - 32.9844) < 1e-3 && Math.abs(s.el.a / 1e3 - 46.8) < 1e-9 && Math.abs(s.el.rp / 1e3 - 43.992) < 1e-9 && Math.abs(s.el.ra / 1e3 - 49.608) < 1e-9);
    const p = positionsAt({ m: 4.1e15, p: [0, 0], v: [0, 0] }, { m: 0.2e15, p: [a * 0.94, 0], v: [0, 2.6e-3] }, 0, G);
    check('two-body: Arecibo primary sits 2.18 km (4.65 %) from the centre of mass, the secondary 44.6 km', Math.abs(Math.hypot(...mk(4.1e15, 0.2e15, 0).r) * 0.2 / 4.3 / 1e3 - 2.1767) < 1e-3 && Math.hypot(...p.p2) > 0);
    check('two-body: Arecibo densities from 4.1 and 0.2 × 10^15 kg and 18.7 and 6.2 km are 1197 and 1603 kg/m3', Math.abs(4.1e15 / ((Math.PI / 6) * 18.7e3 ** 3) - 1197.5) < 0.5 && Math.abs(0.2e15 / ((Math.PI / 6) * 6.2e3 ** 3) - 1602.7) < 0.5);
    const n = integrate({ m: 4.1e15, p: [0, 0], v: [0, 0] }, { m: 0.2e15, p: [a * 0.94, 0], v: [0, Math.sqrt((G * 4.3e15 * 1.06) / (a * 0.94))] }, T, 4000, G);
    check('two-body: Arecibo orbit integrated directly for one period conserves energy and angular momentum to 1e-12', n.dE < 1e-12 && n.dL < 1e-12); }
};
