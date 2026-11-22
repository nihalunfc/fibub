// Round 4 extras for work-energy-collisions: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;
const G = 9.8;

export default {
  items: [
    { id: 'wec-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'work',
      q: R`A ball is thrown straight up and caught again at the height it left the hand (no air resistance). The total work done on it by gravity during the flight is`,
      options: ['zero', 'positive, equal to $mgh_{\\max}$', 'negative, equal to $-mgh_{\\max}$', R`$2mgh_{\max}$`], answer: 0,
      sol: R`On the way up gravity does $-mgh_{\max}$ (force opposite to motion); on the way down $+mgh_{\max}$. They cancel. Equivalently, gravity is conservative and the ball ends at the same height, so the work is $-\Delta U = 0$, and the ball returns with the speed it started with.`,
      trap: R`Work is not the force times the total distance travelled; the sign changes with direction.` },
    { id: 'wec-r4-02', type: 'nat', level: 2, exams: ['jam'], sub: 'energy',
      q: R`A block slides at 6 m/s onto a rough horizontal floor with $\mu_k = 0.3$. The distance it slides before stopping is ______ m ($g = 9.8$ m/s², two decimal places).`,
      answer: 6.12, tol: 0.02, unit: 'm', calc: () => 36 / (2 * 0.3 * 9.8),
      sol: R`Friction $\mu_kmg$ does work $-\mu_kmg\,d$, which must remove the kinetic energy $\tfrac12mv^2$: $d = \dfrac{v^2}{2\mu_kg} = \dfrac{36}{5.88} = 6.12$ m. The mass cancels.`,
      trap: R`The answer does not depend on the mass; heavier blocks feel more friction in proportion.` },
    { id: 'wec-r4-03', type: 'mcq', level: 2, exams: ['jam'], sub: 'energy',
      q: R`A 1 kg body and a 4 kg body have the same kinetic energy. The ratio of their momenta, $p_1 : p_2$, is`,
      options: ['1 : 4', '1 : 2', '2 : 1', '1 : 1'], answer: 1,
      sol: R`$K = \dfrac{p^2}{2m}$, so $p = \sqrt{2mK}$. With equal $K$, $p \propto \sqrt m$: $p_1 : p_2 = \sqrt1 : \sqrt4 = 1 : 2$. (The light body is twice as fast, $v_1 : v_2 = 2 : 1$, but the heavy one carries more momentum.)`,
      trap: R`$2 : 1$ is the ratio of speeds, not momenta.` },
    { id: 'wec-r4-04', type: 'msq', level: 3, exams: ['jam'], sub: 'work', format: 'statements',
      q: R`Which statements about work are true?`,
      options: ['The floor of a lift moving upward does positive work on a person standing in it', 'Static friction can do non-zero work on a body (seen from the ground)', 'The internal forces of a rigid body do zero total work on it', 'Kinetic friction always does negative work on the body it acts on'], answer: [0, 1, 2],
      sol: R`The normal force on the person points up and the person moves up: positive work. A crate on the bed of an accelerating truck is sped up by static friction, which does positive work on it in the ground frame. In a rigid body the distances between particles never change, so each action-reaction pair does zero net work. Kinetic friction can do positive work: a parcel dropped onto a moving conveyor belt is dragged forward by kinetic friction until it matches the belt's speed.`,
      trap: R`Friction opposes relative sliding, not the motion seen from the ground.` },
    { id: 'wec-r4-05', type: 'mcq', level: 3, exams: ['jam'], sub: 'momentum',
      q: R`A shell at rest bursts into three pieces of equal mass. Two of them fly off at right angles to each other, each with speed $v$. The third piece moves with speed`,
      options: [R`$v$, opposite to one of the others`, R`$2v$, between the other two`, R`$v/\sqrt2$, at $135^\circ$ to each of the others`, R`$\sqrt2\,v$, at $135^\circ$ to each of the others`], answer: 3,
      sol: R`The total momentum stays zero. The first two have momenta $mv\hat i$ and $mv\hat j$, so the third has $-mv(\hat i + \hat j)$: speed $\sqrt2\,v$, pointing away from the corner between the other two, at $135^\circ$ to each.`,
      trap: R`Add the momenta as vectors: the two perpendicular ones give $\sqrt2\,mv$, not $2mv$.` },
    { id: 'wec-r4-06', type: 'nat', level: 3, exams: ['jam'], sub: 'collisions',
      q: R`A 1 kg block sliding at 4 m/s on a smooth floor hits and sticks to a 1 kg block attached to a light horizontal spring ($k = 200$ N/m) whose other end is fixed to a wall; the spring is at its natural length. The greatest compression of the spring is ______ m.`,
      answer: 0.2, tol: 0.002, unit: 'm', calc: () => Math.sqrt(2 * (0.5 * 2 * 2 ** 2) / 200),
      sol: R`The sticking is quick, so momentum is conserved in it (the spring has no time to push): $v' = \dfrac{1\times4}{2} = 2$ m/s, with kinetic energy $\tfrac12\times2\times2^2 = 4$ J (half the original 8 J is lost). This 4 J then goes into the spring: $\tfrac12kx^2 = 4$, $x = \sqrt{8/200} = 0.2$ m.`,
      trap: R`Using the original 8 J ignores the energy lost in the sticking and gives 0.28 m.` },
    { id: 'wec-r4-07', type: 'nat', level: 4, exams: ['jam'], sub: 'restitution',
      q: R`A ball is dropped from 1.25 m onto a hard floor. The time between its first and second bounce is 0.60 s. The coefficient of restitution is ______ ($g = 9.8$ m/s², three decimal places).`,
      answer: 0.594, tol: 0.003, calc: () => (9.8 * 0.3) / Math.sqrt(2 * 9.8 * 1.25),
      sol: R`Impact speed $\sqrt{2gh} = \sqrt{24.5} = 4.95$ m/s. Between bounces the ball rises and falls for 0.60 s, so it left the floor at $v = g\cdot0.30 = 2.94$ m/s. Then $e = 2.94/4.95 = 0.594$.`,
      trap: R`The full 0.60 s is up and down; the rise alone takes half of it.` },
    { id: 'wec-r4-08', type: 'mcq', level: 4, exams: ['jam'], sub: 'power',
      q: R`A projectile is launched at an angle above the horizontal and lands at the launch height. The power delivered to it by gravity, plotted against time from launch to landing, is`,
      options: ['always zero, because gravity is conservative', 'a parabola, zero at launch and at landing', 'a straight line, negative at launch, zero at the top, and positive (equal in size) at landing', 'a positive constant'], answer: 2,
      sol: R`$P = \vec F\cdot\vec v = (-mg)(v_y) = -mg(u_y - gt)$, linear in $t$. At launch $v_y = u_y > 0$, so $P = -mgu_y$; at the top $v_y = 0$; at landing $v_y = -u_y$, so $P = +mgu_y$. Gravity first drains kinetic energy, then returns it.`,
      trap: R`Only the vertical velocity matters for the power of a vertical force.` },
    { id: 'wec-r4-09', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'collisions', format: 'statements',
      q: R`A small ball bounces elastically back and forth between a fixed wall and a heavy piston that moves slowly towards the wall at speed $u$ (much less than the ball's speed). Which statements are true?`,
      options: ['The ball speeds up as the gap closes', 'The ball\'s kinetic energy is conserved', 'At each bounce off the piston the ball\'s speed increases by $2u$', 'The product of the ball\'s speed and the gap width stays (nearly) constant'], answer: [0, 2, 3],
      sol: R`In the piston's frame the bounce is elastic: the ball arrives at $v + u$ and leaves at $v + u$, i.e. $v + 2u$ in the lab. So the piston does work on the ball, which speeds up: its energy is not conserved. The time between hits on the piston is $2L/v$, so $\dfrac{dv}{dt} = \dfrac{2u}{2L/v} = \dfrac{uv}{L}$ with $\dfrac{dL}{dt} = -u$, giving $\dfrac{dv}{v} = -\dfrac{dL}{L}$: $vL$ stays constant (an adiabatic invariant, the 1D model of gas heating when compressed).`,
      trap: R`A moving wall is not a fixed one: the elastic bounce is elastic in the wall's frame.` },
    { id: 'wec-r4-10', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'power',
      q: R`Sand drops vertically onto a horizontal conveyor belt at 2 kg/s. The belt is kept moving at a steady 3 m/s. The power the motor must supply (ignoring losses in the machinery) is ______ W.`,
      answer: 18, tol: 0, unit: 'W', calc: () => 2 * 3 ** 2,
      sol: R`Each second 2 kg of sand must be given 3 m/s of horizontal momentum, so the belt pushes the sand (and the motor pushes the belt) with $F = \dot mv = 6$ N. Power $= Fv = \dot mv^2 = 18$ W. Only half, $\tfrac12\dot mv^2 = 9$ W, becomes kinetic energy of the sand; the other 9 W is turned into heat by friction while each grain slides before matching the belt's speed.`,
      trap: R`$\tfrac12\dot mv^2 = 9$ W counts only the kinetic energy; the sliding loss is always equal to it.` },
  ],
  gens: [
    { id: 'wec-r4g1', type: 'nat', level: 3, exams: ['jam'], sub: 'collisions',
      make(r) {
        const m1 = pick(r, 0.5, 3, 0.5), m2 = pick(r, 0.5, 4, 0.5), v = pick(r, 1, 8, 0.5), k = choose(r, [50, 100, 200, 400, 500, 800]);
        const vp = m1 * v / (m1 + m2), answer = round(m1 * v / Math.sqrt(k * (m1 + m2)), 4);
        return { q: R`A ${m1} kg block sliding at ${v} m/s on a smooth floor hits and sticks to a ${m2} kg block attached to a light spring ($k = ${k}$ N/m) whose other end is fixed to a wall; the spring is at its natural length. Find the greatest compression of the spring in metres (four decimal places).`,
          answer, tol: Math.max(0.0005, answer * 0.002), unit: 'm', m1, m2, v, k,
          sol: R`Momentum in the sudden sticking: $v' = \dfrac{${m1}\times${v}}{${round(m1 + m2, 2)}} = ${round(vp, 4)}$ m/s. Then $\tfrac12(m_1 + m_2)v'^2 = \tfrac12kx^2$, so $x = v'\sqrt{\dfrac{m_1 + m_2}{k}} = ${answer}$ m.`,
          trap: 'Energy is lost in the sticking; only the energy left afterwards goes into the spring.' };
      },
      verify: (p) => (p.m1 * p.v / (p.m1 + p.m2)) * Math.sqrt((p.m1 + p.m2) / p.k) },
    { id: 'wec-r4g2', type: 'nat', level: 4, exams: ['jam'], sub: 'restitution',
      make(r) {
        const h = pick(r, 0.5, 4, 0.25), e0 = pick(r, 0.3, 0.9, 0.05), t = round(2 * e0 * Math.sqrt(2 * G * h) / G, 2);
        const answer = round((G * t / 2) / Math.sqrt(2 * G * h), 3);
        return { q: R`A ball is dropped from ${h} m onto a hard floor. The time between its first and second bounce is ${t} s. Find the coefficient of restitution (three decimal places, $g = 9.8$ m/s²).`,
          answer, tol: 0.002, h, t,
          sol: R`Impact speed $\sqrt{2gh} = ${round(Math.sqrt(2 * G * h), 3)}$ m/s. The ball is in the air for ${t} s, so it left the floor at $g\cdot\tfrac{${t}}{2} = ${round(G * t / 2, 3)}$ m/s. $e = ${round(G * t / 2, 3)}/${round(Math.sqrt(2 * G * h), 3)} = ${answer}$.`,
          trap: 'Half the time between bounces is the rise.' };
      },
      verify: (p) => (G * p.t / 2) / Math.sqrt(2 * G * p.h) },
    { id: 'wec-r4g3', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'power',
      make(r) {
        const md = pick(r, 0.5, 10, 0.5), v = pick(r, 0.5, 5, 0.5), ask = choose(r, ['power', 'force', 'heat']);
        const answer = round(ask === 'power' ? md * v * v : ask === 'force' ? md * v : 0.5 * md * v * v, 3);
        const what = ask === 'power' ? 'the power (W) the motor must supply' : ask === 'force' ? 'the horizontal force (N) the belt must exert on the sand' : 'the rate (W) at which heat is produced as the sand slides on the belt';
        return { q: R`Sand falls vertically onto a horizontal conveyor belt at ${md} kg/s, and the belt is kept moving at a steady ${v} m/s. Find ${what}.`,
          answer, tol: Math.max(0.005, answer * 0.002), unit: ask === 'force' ? 'N' : 'W', md, v, ask,
          sol: R`Force $= \dot mv = ${round(md * v, 3)}$ N (momentum given to the sand per second). Power $= Fv = \dot mv^2 = ${round(md * v * v, 3)}$ W, of which $\tfrac12\dot mv^2 = ${round(0.5 * md * v * v, 3)}$ W becomes kinetic energy and the same amount is heat from sliding. Answer: ${answer} ${ask === 'force' ? 'N' : 'W'}.`,
          trap: 'The motor supplies twice the rate of gain of kinetic energy.' };
      },
      verify: (p) => (p.ask === 'power' ? p.md * p.v ** 2 : p.ask === 'force' ? p.md * p.v : 0.5 * p.md * p.v ** 2) },
  ],
};
