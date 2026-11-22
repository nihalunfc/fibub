// Extra question shapes for variable-mass (templates vms-t21..t26). Imported by variable-mass.js.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
import { msqOf, bisect, rk4 } from './_more.js';

const g = 9.8, n3 = (x) => String(+x.toPrecision(3));

export default [
  { id: 'vms-t21', type: 'msq', level: 2, exams: ['jam'], sub: 'rocket equation',
    make(r) {
      const u = pick(r, 2, 4, 0.5), R = choose(r, [2, 3, 4, 5]), dv = u * Math.log(R), not = r() < 0.4;
      const res = msqOf(r, [
        ['In free space, the final speed of a rocket does not depend on how fast the fuel is burnt', true, '$\\Delta v = u\\ln(m_0/m)$ contains only the exhaust speed and the mass ratio, not the burn rate.'],
        ['Doubling the exhaust speed doubles the speed gained (same mass ratio)', true, '$\\Delta v$ is proportional to $u$.'],
        ['Doubling the mass ratio $m_0/m$ doubles the speed gained', false, 'It only adds $u\\ln 2$, because $\\Delta v$ grows with the logarithm of the mass ratio.'],
        ['The thrust equals the exhaust speed (relative to the rocket) times the rate of mass loss', true, 'Thrust $= u\\,|dm/dt|$.'],
        ['Rising vertically in uniform gravity, burning the same fuel more slowly gives a smaller final speed', true, 'Then $\\Delta v = u\\ln(m_0/m) - gt_{\\text{burn}}$: a longer burn loses more to gravity.'],
        [`With $u = ${u}$ km/s and $m_0/m = ${R}$, the speed gained in free space is $${round(dv, 2)}$ km/s`, true, `$\\Delta v = ${u}\\ln ${R} = ${round(dv, 2)}$ km/s.`],
        [`With $u = ${u}$ km/s and $m_0/m = ${R}$, the speed gained in free space is $${round(u * (R - 1), 2)}$ km/s`, false, `That would be $u(m_0/m - 1)$; the correct result is $u\\ln(m_0/m) = ${round(dv, 2)}$ km/s.`],
        ['The momentum of the rocket alone (without its exhaust) is conserved', false, 'Only the momentum of rocket plus exhaust gases is conserved.'],
      ], { not });
      return { q: `Which of the following statements about rockets are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...res,
        trap: 'The rocket equation is logarithmic in the mass ratio but linear in the exhaust speed.' };
    } },
  { id: 'vms-t22', type: 'nat', level: 3, exams: ['jam'], sub: 'rocket equation', unit: '%', format: 'reverse',
    make(r) {
      const u = pick(r, 2, 4.5, 0.5), dv = pick(r, 1, 9, 0.5), frac = 100 * (1 - Math.exp(-dv / u));
      return { q: `A rocket in free space must gain ${dv} km/s with an exhaust speed of ${u} km/s. The fuel must make up ______ % of its launch mass (one decimal place).`,
        answer: round(frac, 1), tol: Math.max(0.1, round(frac * 0.002, 2)), unit: '%', u, dv,
        sol: `$\\Delta v = u\\ln(m_0/m)$ gives $m_0/m = e^{${dv}/${u}} = ${round(Math.exp(dv / u), 4)}$. The fuel fraction is $1 - m/m_0 = 1 - e^{-${round(dv / u, 4)}} = ${round(frac / 100, 4)}$, that is $${round(frac, 1)}\\%$.`,
        trap: 'The fraction is $1 - e^{-\\Delta v/u}$, not $e^{-\\Delta v/u}$ (that is what is left at burnout).' };
    },
    verify: (p) => { const R = bisect((x) => p.u * Math.log(x) - p.dv, 1, 1e4); return 100 * (1 - 1 / R); } },
  { id: 'vms-t23', type: 'mcq', level: 3, exams: ['jam'], sub: 'general equation',
    make(r) {
      const kind = int(r, 0, 2);
      if (kind === 0) {
        const lam = pick(r, 0.5, 3, 0.5), x = pick(r, 0.5, 2, 0.5), W = lam * x * g, N = (v) => `$${n3(v)}$ N`;
        const o = mcqOptions(r, N(3 * W), [N(W), N(2 * W), N(4 * W), N(1.5 * W)]);
        return { q: `A flexible chain of ${lam} kg/m is held vertically with its lower end just touching a scale pan, then released. When ${x} m of it has fallen onto the pan, the scale reads ($g = 9.8$ m/s²)`, ...o,
          sol: `The part on the pan weighs $\\lambda xg = ${n3(W)}$ N. Links still falling arrive at speed $v = \\sqrt{2gx}$ and are stopped, which needs an extra force $\\lambda v^2 = 2\\lambda gx$. The reading is $3\\lambda xg = ${n3(3 * W)}$ N.`,
          trap: 'The scale must also stop the incoming links; that impact force is twice the weight already on the pan.' };
      }
      if (kind === 1) {
        const mu = pick(r, 1, 10, 0.5), v = pick(r, 0.5, 4, 0.5), P = mu * v * v, Wt = (x) => `$${n3(x)}$ W`;
        const o = mcqOptions(r, Wt(P), [Wt(P / 2), Wt(2 * P), Wt(mu * v), Wt(P / 4)]);
        return { q: `Sand falls vertically at ${mu} kg/s onto a conveyor belt that is kept moving at a steady ${v} m/s. The power the motor must supply (ignoring friction in the machine) is`, ...o,
          sol: `The belt must give the sand horizontal momentum at the rate $\\mu v$, so the force is $F = \\mu v$ and the power $Fv = \\mu v^2 = ${n3(P)}$ W. Only half of it becomes kinetic energy of the sand; the other half is heat in the sliding before the sand reaches belt speed.`,
          trap: 'Equating the power to the rate of kinetic energy gain ($\\mu v^2/2$) misses the energy dissipated as the sand slips.' };
      }
      const A = (x) => `$${n3(x)}$ m/s²`;
      const o = mcqOptions(r, A(g / 7), [A(g / 4), A(g / 2), A(g), A(g / 3)]);
      return { q: 'A tiny raindrop starts from rest and falls through a stationary cloud, sweeping up droplets so that its mass grows in proportion to its cross-section times its speed. Air drag is negligible. After it has grown well beyond its initial size, its acceleration settles to ($g = 9.8$ m/s²)', ...o,
        sol: 'With $m\\propto r^3$ and $dm/dt\\propto r^2v$, one finds $r$ grows in proportion to the distance fallen. Writing $d(mv)/dt = mg$ and trying $v^2 = 2ax$ gives $a = g/7$ (about $1.4$ m/s²). Picking up stationary mass costs momentum, so the drop falls with less than $g$.',
        trap: 'The answer is not $g$: each droplet swept up must be accelerated from rest.' };
    } },
  { id: 'vms-t24', type: 'nat', level: 3, exams: ['jam'], sub: 'staging', unit: 'km/s',
    make(r) {
      const u = pick(r, 2.5, 3.5, 0.5), m0 = int(r, 80, 150), f1 = Math.round(m0 * pick(r, 0.6, 0.7, 0.05)), c = int(r, 5, 12);
      const m1 = m0 - f1, m2 = m1 - c, f2 = Math.round(m2 * 0.6), m3 = m2 - f2;
      const dv = u * (Math.log(m0 / m1) + Math.log(m2 / m3));
      return { q: `A two-stage rocket in free space has launch mass ${m0} t. Stage 1 burns ${f1} t of fuel, then its empty ${c} t casing is dropped. Stage 2 then burns ${f2} t of fuel. Both stages have exhaust speed ${u} km/s. The total speed gained is ______ km/s (two decimal places).`,
        answer: round(dv, 2), tol: Math.max(0.01, round(dv * 0.002, 2)), unit: 'km/s', u, m0, m1, m2, m3,
        sol: `Stage 1: mass falls from ${m0} t to ${m1} t, $\\Delta v_1 = ${u}\\ln(${m0}/${m1}) = ${round(u * Math.log(m0 / m1), 3)}$ km/s. Dropping the casing leaves ${m2} t. Stage 2: from ${m2} t to ${m3} t, $\\Delta v_2 = ${u}\\ln(${m2}/${m3}) = ${round(u * Math.log(m2 / m3), 3)}$ km/s. Total $${round(dv, 2)}$ km/s.`,
        trap: 'The dropped casing is not exhaust: it leaves with the rocket\'s speed and adds nothing, but the rocket no longer has to carry it.' };
    },
    verify: (p) => p.u * Math.log((p.m0 * p.m2) / (p.m1 * p.m3)) },
  { id: 'vms-t25', type: 'msq', level: 2, exams: ['jam'], sub: 'conveyor belt',
    make(r) {
      const mu = pick(r, 2, 12, 1), v = pick(r, 1, 4, 0.5), F = mu * v, P = mu * v * v, not = r() < 0.5;
      const res = msqOf(r, [
        [`The horizontal force needed to keep the belt moving is $${n3(F)}$ N`, true, `$F = \\mu v = ${mu}\\times${v}$.`],
        [`The motor's power output is $${n3(P)}$ W`, true, `$P = Fv = \\mu v^2$.`],
        [`The sand gains kinetic energy at $${n3(P / 2)}$ W`, true, `$\\tfrac12\\mu v^2$.`],
        [`Heat is produced at $${n3(P / 2)}$ W by the sand sliding on the belt`, true, 'The rest of the motor\'s power, $\\mu v^2 - \\tfrac12\\mu v^2$.'],
        [`The horizontal force needed is $${n3(F / 2)}$ N`, false, `It is $\\mu v = ${n3(F)}$ N: the force equals the rate of change of momentum.`],
        [`The motor's power output is $${n3(P / 2)}$ W`, false, `That is only the kinetic-energy part; the motor supplies $\\mu v^2 = ${n3(P)}$ W.`],
        ['Friction between the sand and the belt does no net work overall', false, 'It dissipates energy while the sand slips, so heat is produced.'],
      ], { not });
      return { q: `Sand drops vertically at ${mu} kg/s onto a horizontal belt that moves at a steady ${v} m/s. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...res,
        trap: 'Half the power goes into kinetic energy and half into heat, whatever the friction coefficient.' };
    } },
  { id: 'vms-t26', type: 'nat', level: 3, exams: ['jam'], sub: 'losing mass', unit: 'm/s',
    make(r) {
      const F = pick(r, 10, 50, 5), m0 = pick(r, 50, 200, 10), mu = int(r, 1, 5), t = Math.round((m0 * pick(r, 0.2, 0.6, 0.1)) / mu);
      const v = (F / mu) * Math.log(m0 / (m0 - mu * t));
      return { q: `A cart of initial mass ${m0} kg (with its load of sand) starts from rest on a smooth level track and is pulled by a constant horizontal force of ${F} N. Sand leaks straight down through a hole in its floor at ${mu} kg/s. Its speed after ${t} s is ______ m/s (two decimal places).`,
        answer: round(v, 2), tol: Math.max(0.01, round(v * 0.002, 2)), unit: 'm/s', F, m0, mu, t,
        sol: `The sand leaves with the cart's own velocity, so it carries away no momentum relative to the cart: $m\\,dv/dt = F$ with $m = ${m0} - ${mu}t$. Then $v = \\displaystyle\\int_0^{${t}}\\dfrac{${F}\\,dt}{${m0} - ${mu}t} = \\dfrac{${F}}{${mu}}\\ln\\dfrac{${m0}}{${m0 - mu * t}} = ${round(v, 2)}$ m/s.`,
        trap: 'Writing $F = d(mv)/dt = m\\,dv/dt + v\\,dm/dt$ adds a fake force: the leaking sand pushes neither way on the cart.' };
    },
    verify: (p) => rk4((s, y) => [p.F / (p.m0 - p.mu * s)], [0], 0, p.t, 4000)[0] },
];
