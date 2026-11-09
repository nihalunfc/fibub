// #908 Lagrangian helper: Euler-Lagrange equations from the TypeScript differentiator checked against SymPy's
// euler_equations, evaluated at a test point, for six systems; the integrator against SciPy solve_ivp (double pendulum).
import { read, lagrange, evaluate, print, diff, simulate } from '../../src/lib/sci/phlagrange.ts';
export default async (check) => {
  const near = (a, b, t = 1e-10) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const pt = { m: 1.3, g: 9.81, l: 0.7, M: 2.1, theta: 0.4, thetadot: -1.2, thetaddot: 0.9, x: 0.3, xdot: 0.5, xddot: -0.7, t: 0.6, m1: 1.1, m2: 0.8, l1: 0.9, l2: 0.6, th1: 0.5, th2: -0.3, th1dot: 1.1, th2dot: -0.4, th1ddot: 0.2, th2ddot: -1.5, k: 20, L0: 0.5, r: 0.8, rdot: 0.3, rddot: -0.2, phi: 0.7, phidot: 0.9, phiddot: 0.1, a: 0.05, w: 30, R: 0.4 };
  const cases = [
    ['simple pendulum', ['theta'], "1/2 m l^2 theta'^2", '-m g l cos(theta)', [4.049676483623554]],
    ['pendulum on a cart', ['x', 'theta'], "1/2 (M + m) x'^2 + m l x' theta' cos(theta) + 1/2 m l^2 theta'^2", '-m g l cos(theta)', [-2.1359448416728926, 3.4629606304437166]],
    ['double pendulum', ['th1', 'th2'], "1/2 (m1 + m2) l1^2 th1'^2 + 1/2 m2 l2^2 th2'^2 + m2 l1 l2 th1' th2' cos(th1 - th2)", '-(m1 + m2) g l1 cos(th1) - m2 g l2 cos(th2)', [7.9483290579853785, -2.1383264652743192]],
    ['spring pendulum', ['r', 'phi'], "1/2 m (r'^2 + r^2 phi'^2)", '-m g r cos(phi) + 1/2 k (r - L0)^2', [-4.85643241443908, 7.21736653227382]],
    ['pendulum with a shaken pivot (explicit time)', ['theta'], "1/2 m (l^2 theta'^2 + a^2 w^2 sin(w t)^2 + 2 l theta' a w sin(w t) sin(theta))", '-m g (l cos(theta) + a cos(w t))', [14.579536466575092]],
    ['bead on a spinning hoop', ['theta'], "1/2 m R^2 (theta'^2 + w^2 sin(theta)^2)", '-m g R cos(theta)', [-64.97082926041047]],
  ];
  for (const [name, qs, T, V, want] of cases) {
    const r = lagrange(qs, read(T), read(V));
    check(`lagrange: ${name} matches SymPy euler_equations`, r.EL.every((e, i) => near(evaluate(e, pt), want[i], 1e-11)));
  }
  const p = lagrange(['theta'], read("1/2 m l^2 theta'^2"), read('-m g l cos(theta)'));
  check('lagrange: pendulum equation prints as g·l·m·sin(θ) + l²·m·θ″', print(p.EL[0]) === 'l²·m·θ″ + g·l·m·sin(θ)' || print(p.EL[0]) === 'g·l·m·sin(θ) + l²·m·θ″');
  check('lagrange: momentum ∂L/∂θ′ = m l² θ′ and parameters g, l, m', print(p.p[0], false) === 'l^2*m*thetadot' && p.params.join() === 'g,l,m');
  check('lagrange: sin² + cos² = 1 simplifies', print(read("1/2 m ((l theta' cos(theta))^2 + (l theta' sin(theta))^2)"), false) === 'l^2*m*thetadot^2/2');
  check('lagrange: d/dx sqrt(x² + y²) = x/sqrt(x² + y²)', near(evaluate(diff(read('sqrt(x^2 + y^2)'), 'x'), { x: 3, y: 4 }), 0.6));
  check('lagrange: chain rule for exp, ln, atan, tan', near(evaluate(diff(read('exp(2x) + ln(x) + atan(x) + tan(x)'), 'x'), { x: 0.5 }), 2 * Math.exp(1) + 2 + 1 / 1.25 + 1 / Math.cos(0.5) ** 2));
  const dp = lagrange(['th1', 'th2'], read(cases[2][2]), read(cases[2][3]));
  const s = simulate(['th1', 'th2'], dp, { m1: 1.1, m2: 0.8, l1: 0.9, l2: 0.6, g: 9.81 }, [1, 0.5], [0, 0], 2, 4000);
  const last = s.q.length - 1, ref = [0.5660907000609212, 0.3816859066999936, 2.5493083234178053, 0.2944397243099412];
  check('lagrange: double pendulum after 2 s matches SciPy solve_ivp', near(s.q[last][0], ref[0], 1e-7) && near(s.q[last][1], ref[1], 1e-7) && near(s.v[last][0], ref[2], 1e-6) && near(s.v[last][1], ref[3], 1e-6));
  check('lagrange: energy kept to 1e-9 over 2 s', Math.max(...s.E.map((e) => Math.abs(e - s.E[0]))) < 1e-9 * Math.abs(s.E[0]) + 1e-9);
};
