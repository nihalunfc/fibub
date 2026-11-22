// Extra question shapes for work-energy-collisions (templates wec-t21..t26). Imported by work-energy-collisions.js.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
import { msqOf } from './_more.js';

const g = 9.8, n3 = (x) => String(+x.toPrecision(3));

export default [
  { id: 'wec-t21', type: 'mcq', level: 3, exams: ['jam'], sub: 'potential energy', format: 'graph in words',
    make(r) {
      const A = int(r, 1, 3), B = int(r, 3, 12), flip = r() < 0.5, x0 = Math.sqrt(B / (3 * A));
      const U = flip ? `-${A === 1 ? '' : A}x^3 + ${B}x` : `${A === 1 ? '' : A}x^3 - ${B}x`;
      const right = flip ? -x0 : x0;
      const show = (x) => `$x = ${round(x, 3) + 0}$ m`;
      const o = mcqOptions(r, right, [-right, 0, Math.sqrt(B / A), Math.sqrt(B / (3 * A)) * (flip ? 1 : -1) * 2], show);
      return { q: `A particle moves along the $x$-axis in the potential $U(x) = ${U}$ (SI units). It has a point of stable equilibrium at`, ...o,
        sol: `Equilibrium: $U'(x) = ${flip ? -3 * A : 3 * A}x^2 ${flip ? '+' : '-'} ${B} = 0$, so $x = \\pm\\sqrt{${B}/${3 * A}} = \\pm${round(x0, 3)}$ m. Stability needs a minimum, $U''(x) = ${flip ? -6 * A : 6 * A}x > 0$, which holds at $x = ${round(right, 3)}$ m. The other point is a maximum (unstable).`,
        trap: 'Both roots of $U\' = 0$ are equilibria; only the one where $U$ curves upward is stable.' };
    } },
  { id: 'wec-t22', type: 'nat', level: 2, exams: ['jam'], sub: 'power', unit: 'kW',
    make(r) {
      const m = pick(r, 800, 1600, 100), n = int(r, 10, 50), f = pick(r, 200, 800, 50), vk = choose(r, [36, 54, 72, 90]);
      const v = vk / 3.6, P = ((m * g) / n + f) * v / 1000;
      return { q: `A car of mass ${m} kg climbs a road that rises 1 m for every ${n} m travelled along it, at a steady ${vk} km/h. Air and rolling resistance total ${f} N. The engine's output power is ______ kW ($g = 9.8$ m/s², two decimal places).`,
        answer: round(P, 2), tol: Math.max(0.02, round(P * 0.002, 2)), unit: 'kW', m, n, f, v,
        sol: `At steady speed the driving force balances gravity along the slope plus resistance: $F = mg\\sin\\theta + f = ${m}\\times9.8/${n} + ${f} = ${round((m * g) / n + f, 1)}$ N (here $\\sin\\theta = 1/${n}$). Speed $= ${vk}/3.6 = ${round(v, 3)}$ m/s. Power $P = Fv = ${round(P * 1000, 0)}$ W $= ${round(P, 2)}$ kW.`,
        trap: 'Convert km/h to m/s (divide by 3.6) before multiplying.' };
    },
    verify: (p) => (p.m * g * (p.v / p.n) + p.f * p.v) / 1000 },
  { id: 'wec-t23', type: 'msq', level: 3, exams: ['jam'], sub: 'collisions',
    make(r) {
      const m1 = int(r, 1, 5), m2 = int(r, 1, 5), u1 = int(r, 2, 8), u2 = int(r, -4, u1 - 1), e = choose(r, [0, 0.5, 1]);
      const M = m1 + m2, P = m1 * u1 + m2 * u2, du = u1 - u2;
      const v1 = (P - m2 * e * du) / M, v2 = (P + m1 * e * du) / M, loss = 0.5 * (m1 * m2 / M) * (1 - e * e) * du * du;
      const eW = e === 1 ? 0 : 1, v2w = (P + m1 * eW * du) / M;
      const res = msqOf(r, [
        [`The total momentum after the collision is $${P}$ kg m/s`, true, 'No external horizontal force acts, so momentum is conserved.'],
        ['Kinetic energy is conserved', e === 1, `Only an elastic collision ($e = 1$) conserves kinetic energy; here $e = ${e}$.`],
        ['The two bodies move off together', e === 0, `They stick only when $e = 0$; here $e = ${e}$.`],
        [`The second body moves off at $${round(v2, 3) + 0}$ m/s`, true, `$v_2 = \\dfrac{m_1u_1 + m_2u_2 + m_1e(u_1 - u_2)}{m_1 + m_2} = \\dfrac{${P} + ${m1}\\times${e}\\times${du}}{${M}} = ${round(v2, 3)}$ m/s.`],
        [`The second body moves off at $${round(v2w, 3) + 0}$ m/s`, round(v2w, 3) === round(v2, 3), `That value uses $e = ${eW}$; with $e = ${e}$ it is $${round(v2, 3)}$ m/s.`],
        [`The kinetic energy lost is $${round(loss, 3) + 0}$ J`, true, `$\\Delta K = \\tfrac12\\dfrac{m_1m_2}{m_1 + m_2}(1 - e^2)(u_1 - u_2)^2 = \\tfrac12\\times${round((m1 * m2) / M, 4)}\\times${1 - e * e}\\times${du * du} = ${round(loss, 3)}$ J.`],
        ['The first body reverses its direction of motion', v1 < 0, `$v_1 = \\dfrac{${P} - ${m2}\\times${e}\\times${du}}{${M}} = ${round(v1, 3)}$ m/s, ${v1 < 0 ? 'negative, so it bounces back' : 'not negative, so it does not reverse'}.`],
      ]);
      return { q: `A ${m1} kg body moving at ${u1} m/s collides head-on with a ${m2} kg body moving at ${u2} m/s along the same line (positive direction = first body's motion). The coefficient of restitution is ${e}. Which statements are correct?`, ...res,
        trap: 'Momentum is conserved in every collision; kinetic energy only in an elastic one.' };
    } },
  { id: 'wec-t24', type: 'nat', level: 3, exams: ['jam'], sub: 'restitution', unit: 'm',
    make(r) {
      const H = int(r, 2, 10), f = choose(r, [0.25, 0.36, 0.49, 0.64, 0.81]), h1 = round(H * f, 3), D = (H * (1 + f)) / (1 - f);
      return { q: `A ball dropped from ${H} m rebounds to ${h1} m after its first bounce. If every bounce has the same coefficient of restitution, the total distance it travels before coming to rest is ______ m (two decimal places).`,
        answer: round(D, 2), tol: Math.max(0.02, round(D * 0.002, 2)), unit: 'm', H, f,
        sol: `The rebound height scales as $e^2$: $e^2 = ${h1}/${H} = ${f}$, so $e = ${round(Math.sqrt(f), 2)}$. Heights are $H, He^2, He^4, \\dots$, and each rebound is travelled up and down. Total $= H + 2He^2(1 + e^2 + e^4 + \\dots) = H\\dfrac{1 + e^2}{1 - e^2} = ${H}\\times\\dfrac{${round(1 + f, 2)}}{${round(1 - f, 2)}} = ${round(D, 2)}$ m.`,
        trap: 'The ratio of heights is $e^2$, not $e$; and each rebound counts twice (up and down).' };
    },
    verify: (p) => { let D = p.H, h = p.H; for (let k = 0; k < 600; k++) { h *= p.f; D += 2 * h; } return D; } },
  { id: 'wec-t25', type: 'mcq', level: 1, exams: ['jam'], sub: 'potential energy', format: 'dimensions',
    make(r) {
      const n = choose(r, [1, 2, 3, 4, -1, -2, 6]);
      const u = (p, s = 2) => `$\\mathrm{kg${p === 0 ? '' : p === 1 ? '\\,m' : `\\,m^{${p}}`}\\,s^{-${s}}}$`;
      const o = mcqOptions(r, u(2 - n), [u(2 + n), u(-n), u(2 - n, 1), u(1 - n)]);
      return { q: `The potential energy of a particle is $U(x) = \\alpha x^{${n}}$, with $x$ in metres. The SI unit of $\\alpha$ is`, ...o,
        sol: `$\\alpha = U/x^{${n}}$ has units $\\mathrm{J\\,m^{${-n}}}$. A joule is $\\mathrm{kg\\,m^2\\,s^{-2}}$, so $\\alpha$ is in ${u(2 - n)}.`,
        trap: 'A joule already contains $\\mathrm{m^2}$; dividing by $x^n$ takes away $n$ powers of metre.' };
    } },
  { id: 'wec-t26', type: 'nat', level: 4, exams: ['jam'], sub: 'collisions', unit: 'cm',
    make(r) {
      const m = int(r, 1, 4), M = int(r, 1, 6), v = int(r, 1, 5), k = pick(r, 100, 1000, 50);
      const mu = (m * M) / (m + M), x = v * Math.sqrt(mu / k) * 100;
      return { q: `A ${m} kg block slides at ${v} m/s on a smooth floor towards a ${M} kg block at rest, which has a light spring of stiffness ${k} N/m fixed to the side facing it. The greatest compression of the spring is ______ cm (two decimal places).`,
        answer: round(x, 2), tol: Math.max(0.02, round(x * 0.002, 2)), unit: 'cm', m, M, v, k,
        sol: `At greatest compression both blocks move together: $v_c = \\dfrac{${m}\\times${v}}{${m + M}}$ (momentum). The kinetic energy lost to the spring is $\\tfrac12\\mu v^2$ with $\\mu = \\dfrac{${m}\\times${M}}{${m + M}} = ${round(mu, 4)}$ kg. So $\\tfrac12kx^2 = \\tfrac12\\mu v^2$, $x = v\\sqrt{\\mu/k} = ${v}\\sqrt{${round(mu, 4)}/${k}} = ${round(x / 100, 5)}$ m $= ${round(x, 2)}$ cm.`,
        trap: 'The second block moves too, so not all the kinetic energy goes into the spring: use the reduced mass.' };
    },
    verify: (p) => { const vc = (p.m * p.v) / (p.m + p.M), E = 0.5 * p.m * p.v ** 2 - 0.5 * (p.m + p.M) * vc ** 2; return Math.sqrt((2 * E) / p.k) * 100; } },
];
