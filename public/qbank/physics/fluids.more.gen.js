// Extra question shapes for fluids (templates fld-t21..t26). Imported by fluids.js.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
import { msqOf, bisect, rk4 } from './_more.js';

const g = 9.8, n3 = (x) => String(+x.toPrecision(3));

export default [
  { id: 'fld-t21', type: 'mcq', level: 3, exams: ['jam'], sub: 'buoyancy',
    make(r) {
      const r1 = choose(r, [700, 750, 800, 850, 900]), rb = pick(r, r1 + 25, 975, 25), r2 = 1000;
      const f = (rb - r1) / (r2 - r1), P = (x) => `$${round(100 * x, 1)}\\%$`;
      const o = mcqOptions(r, P(f), [P(rb / r2), P(1 - f), P(r1 / rb), P((rb - r1) / r2)]);
      return { q: `A block of density ${rb} kg/m³ floats at the boundary between water (1000 kg/m³, below) and a deep layer of oil (${r1} kg/m³, above), fully covered by the oil. The fraction of its volume that lies in the water is`, ...o,
        sol: `Let $f$ be the fraction in water. The buoyant forces from both liquids balance the weight: $\\rho_b = f\\rho_w + (1 - f)\\rho_o$, so $f = \\dfrac{\\rho_b - \\rho_o}{\\rho_w - \\rho_o} = \\dfrac{${rb} - ${r1}}{${r2 - r1}} = ${round(f, 4)}$, that is ${P(f)}.`,
        trap: 'Using $\\rho_b/\\rho_w$ ignores the upthrust from the oil.' };
    } },
  { id: 'fld-t22', type: 'nat', level: 3, exams: ['jam'], sub: 'draining tanks', unit: 's',
    make(r) {
      const A = pick(r, 0.5, 3, 0.5), a = int(r, 2, 20), H = pick(r, 1, 4, 0.5), full = r() < 0.5, h2 = full ? 0 : round(H / choose(r, [2, 4, 9]), 4);
      const k = (a * 1e-4) / A, t = (Math.sqrt(2 / g) * (Math.sqrt(H) - Math.sqrt(h2))) / k;
      return { q: `An open tank of cross-section ${A} m² holds water ${H} m deep. A small hole of area ${a} cm² is opened in its floor (efflux speed $\\sqrt{2gh}$). The time for the level to fall ${full ? 'until the tank is empty' : `to ${h2} m`} is ______ s ($g = 9.8$ m/s², one decimal place).`,
        answer: round(t, 1), tol: Math.max(0.2, round(t * 0.003, 1)), unit: 's', A, a, H, h2,
        sol: `Continuity: $A\\,\\dfrac{dh}{dt} = -a\\sqrt{2gh}$. Separating, $\\dfrac{dh}{\\sqrt h} = -\\dfrac{a}{A}\\sqrt{2g}\\,dt$, so $2(\\sqrt{h_1} - \\sqrt{h_2}) = \\dfrac{a}{A}\\sqrt{2g}\\,t$ and $t = \\dfrac{A}{a}\\sqrt{\\dfrac2g}\\left(\\sqrt{${H}} - \\sqrt{${h2}}\\right) = ${round(t, 1)}$ s.${!full && h2 === round(H / 4, 4) ? ' Notice it is exactly half the emptying time: the flow is fastest at the start.' : ''}`,
        trap: 'The outflow slows as the level falls, so time is not depth divided by the starting speed.' };
    },
    verify: (p) => { const k = (p.a * 1e-4) / p.A, f = (s, y) => [-k * Math.sqrt(2 * g * Math.max(y[0], 0))]; const T0 = (Math.sqrt(2 / g) * Math.sqrt(p.H)) / k; return p.h2 === 0 ? bisect((t) => rk4(f, [p.H], 0, t, 300)[0] - 1e-9, 0, 1.2 * T0, 50) : bisect((t) => rk4(f, [p.H], 0, t, 300)[0] - p.h2, 0, T0, 50); } },
  { id: 'fld-t23', type: 'msq', level: 2, exams: ['jam'], sub: 'bernoulli',
    make(r) {
      const A1 = int(r, 20, 60), A2 = Math.round(A1 / choose(r, [2, 3, 4])), v1 = pick(r, 0.5, 2, 0.5);
      const v2 = (v1 * A1) / A2, dP = (0.5 * 1000 * (v2 * v2 - v1 * v1)) / 1000, Q = A1 * 1e-4 * v1 * 1000, not = r() < 0.35;
      const res = msqOf(r, [
        [`The speed in the narrow part is $${n3(v2)}$ m/s`, true, `Continuity: $v_2 = v_1A_1/A_2 = ${v1}\\times${A1}/${A2}$.`],
        [`The speed in the narrow part is $${n3((v1 * A2) / A1)}$ m/s`, false, 'The fluid must speed up where the pipe narrows, not slow down.'],
        ['The pressure is lower in the narrow part', true, 'Bernoulli (same height): faster flow, lower pressure.'],
        ['The pressure is higher in the narrow part', false, 'Faster flow goes with lower pressure.'],
        [`The pressure difference between the parts is $${n3(dP)}$ kPa`, true, `$\\Delta P = \\tfrac12\\rho(v_2^2 - v_1^2) = \\tfrac12\\times1000\\times(${n3(v2 * v2)} - ${n3(v1 * v1)})$ Pa.`],
        [`The volume flow rate is $${n3(Q)}$ L/s in both parts`, true, `$Q = A_1v_1 = ${A1}\\times10^{-4}\\times${v1}$ m³/s, the same everywhere.`],
        ['More mass per second passes through the wide part than through the narrow part', false, 'In steady flow the mass flow rate is the same through every cross-section.'],
      ], { not });
      return { q: `Water flows steadily through a horizontal pipe that narrows from ${A1} cm² to ${A2} cm². In the wide part its speed is ${v1} m/s. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...res,
        trap: 'Lower pressure in the throat feels backwards but follows from energy conservation.' };
    } },
  { id: 'fld-t24', type: 'nat', level: 3, exams: ['jam'], sub: 'rotating liquids', unit: 'rpm', format: 'reverse',
    make(r) {
      const R = int(r, 5, 20), h = int(r, 1, 10), w = Math.sqrt(2 * g * h * 1e-2) / (R * 1e-2), rpm = (w * 60) / (2 * Math.PI);
      return { q: `A cylinder of radius ${R} cm, partly filled with water, spins steadily about its vertical axis. The water at the wall stands ${h} cm higher than at the centre. The rotation rate is ______ revolutions per minute (one decimal place).`,
        answer: round(rpm, 1), tol: Math.max(0.2, round(rpm * 0.002, 1)), unit: 'rpm', R, h,
        sol: `The surface is a paraboloid $z = \\dfrac{\\omega^2r^2}{2g}$, so the rim-to-centre height is $h = \\dfrac{\\omega^2R^2}{2g}$. Then $\\omega = \\dfrac{\\sqrt{2gh}}{R} = \\dfrac{\\sqrt{2\\times9.8\\times${h / 100}}}{${R / 100}} = ${round(w, 3)}$ rad/s $= ${round(rpm, 1)}$ rpm.`,
        trap: 'Convert rad/s to rpm by multiplying by $60/2\\pi$.' };
    },
    verify: (p) => (bisect((w) => (w * w * (p.R / 100) ** 2) / (2 * g) - p.h / 100, 0, 200) * 60) / (2 * Math.PI) },
  { id: 'fld-t25', type: 'mcq', level: 2, exams: ['jam'], sub: 'stokes law', format: 'scaling',
    make(r) {
      const n = choose(r, [2, 8, 27, 64, 125]), v0 = int(r, 1, 9), V = (x) => `$${n3(x)}$ cm/s`;
      const o = mcqOptions(r, V(v0 * n ** (2 / 3)), [V(v0 * n ** (1 / 3)), V(v0 * n), V(v0), V(v0 * n * n)]);
      return { q: `Identical small rain droplets each fall at a terminal speed of ${v0} cm/s (Stokes' law). ${n} of them merge into one drop. Its terminal speed is`, ...o,
        sol: `Volume is conserved, so the radius grows by $${n}^{1/3}$. In Stokes' law the terminal speed $v = \\dfrac{2r^2(\\rho - \\sigma)g}{9\\eta}$ goes as $r^2$, so it grows by $${n}^{2/3} = ${n3(n ** (2 / 3))}$: $${n3(v0 * n ** (2 / 3))}$ cm/s.`,
        trap: 'Merging multiplies the volume by $n$, not the radius.' };
    } },
  { id: 'fld-t26', type: 'msq', level: 2, exams: ['jam'], sub: 'surface tension',
    make(r) {
      const not = r() < 0.5;
      const res = msqOf(r, [
        ['Surface tension can be measured in N/m or, equivalently, in J/m²', true, 'Force per length equals energy per area.'],
        ['The viscosity of a liquid usually decreases as it is heated', true, 'Molecules escape their neighbours more easily (think of warm honey).'],
        ['The viscosity of a gas usually increases as it is heated', true, 'In a gas momentum is carried by moving molecules, which move faster when hot.'],
        ['Water rises higher in a narrower glass capillary', true, 'Jurin\'s law: $h = 2T\\cos\\theta/(\\rho gr)$ grows as $r$ shrinks.'],
        ['Surface tension of water increases as it is heated', false, 'It decreases with temperature (and vanishes at the critical point).'],
        ['Mercury in a glass capillary stands below the outside level', true, 'Its contact angle with glass is greater than $90^\\circ$, so $\\cos\\theta < 0$.'],
        ['The Reynolds number has units of m/s', false, '$Re = \\rho vL/\\eta$ is dimensionless.'],
        ['Flow tends to become turbulent at low Reynolds number', false, 'Low $Re$ means viscosity dominates and the flow is smooth (laminar); turbulence sets in at high $Re$.'],
      ], { not });
      return { q: `Which statements about surface tension and viscosity are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...res,
        trap: 'Liquids and gases behave oppositely when heated: liquid viscosity falls, gas viscosity rises.' };
    } },
];
