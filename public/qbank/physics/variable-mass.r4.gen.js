// Round 4 extras for variable-mass: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;
const g = 9.8;

export default {
  items: [
    { id: 'vms-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'thrust',
      q: R`A gun fixed to a cart fires 8 bullets per second, each of mass 25 g, at 400 m/s relative to the ground (the cart is held still). The average recoil force on the cart is`,
      options: ['10 N', '80 N', '50 N', '16 kN'], answer: 1,
      sol: R`Each bullet carries away momentum $0.025\times400 = 10$ kg m/s. Eight of them leave every second, so the momentum given out per second is $8\times10 = 80$ kg m/s, and by Newton's third law the average force back on the gun is 80 N. This is the same idea as rocket thrust: force $=$ (mass leaving per second) $\times$ (speed it leaves with).`,
      trap: R`10 N is the momentum of one bullet, not a force; 16 kN is the kinetic energy carried off per second (a power in watts), not a force.` },
    { id: 'vms-r4-02', type: 'mcq', level: 2, exams: ['jam'], sub: 'rocket equation',
      q: R`A rocket starting from rest in free space reaches speed $V$ with mass ratio $R = m_0/m$. To reach $2V$ with the same exhaust speed, the mass ratio must be`,
      options: [R`doubled, to $2R$`, R`multiplied by $e$, to $eR$`, R`increased by one, to $R + 1$`, R`squared, to $R^2$`], answer: 3,
      sol: R`$V = u\ln R$. For $2V = u\ln R'$ we need $\ln R' = 2\ln R = \ln R^2$, so $R' = R^2$. A mass ratio of 3 that gives $V$ must become 9 to give $2V$: the fuel fraction climbs from 67% to 89%. This is why high speeds need either a higher exhaust speed or staging.`,
      trap: R`The speed is linear in $\ln R$, not in $R$; doubling $R$ only adds $u\ln2$.` },
    { id: 'vms-r4-03', type: 'nat', level: 2, exams: ['jam'], sub: 'thrust',
      q: R`A 500 kg rocket sled sits on a level track (coefficient of kinetic friction 0.2). Its engine burns 2 kg of propellant per second and sends the exhaust backwards horizontally at 1500 m/s relative to the sled. Just after it starts moving, its acceleration is ______ m/s² ($g = 9.8$ m/s², two decimal places).`,
      answer: 4.04, tol: 0.02, unit: 'm/s²', calc: () => (2 * 1500) / 500 - 0.2 * 9.8,
      sol: R`Thrust $= \mu u = 2\times1500 = 3000$ N forwards. Friction $= 0.2\times500\times9.8 = 980$ N backwards. Net force $= 2020$ N, so $a = 2020/500 = 4.04$ m/s². (As fuel burns, both the thrust per kilogram and the acceleration grow, while the friction per kilogram stays at $0.2g$.)`,
      trap: R`Forgetting friction gives 6 m/s²; the thrust has to beat friction first.` },
    { id: 'vms-r4-04', type: 'mcq', level: 3, exams: ['jam'], sub: 'rocket equation', format: 'graph',
      q: R`During a burn in free space from rest, a student plots the rocket's speed $v$ (vertical axis) against $\ln m$ (horizontal axis), where $m$ is the rocket's current mass. The exhaust speed $u$ is fixed. The graph is`,
      options: [R`a straight line sloping down, with slope of size $u$`, R`a straight line sloping up, with slope $u$`, 'a curve that bends upwards, getting steeper', 'a horizontal straight line'], answer: 0,
      sol: R`$v = u\ln(m_0/m) = u\ln m_0 - u\ln m$. Against $\ln m$ this is a straight line of slope $-u$. Time runs from right to left along the graph (the mass falls), and the line meets the axis $v = 0$ at $\ln m_0$. The burn rate does not appear at all: the graph is the same for a fast or a slow burn.`,
      trap: R`The curve of $v$ against time does bend upwards, but against $\ln m$ it is straight.` },
    { id: 'vms-r4-05', type: 'msq', level: 3, exams: ['jam'], sub: 'chains', format: 'statements',
      q: R`A uniform chain of length $L$ lies straight on a smooth horizontal table, with a length $x_0$ hanging over the smooth, rounded edge. It is released from rest. Which statements are correct (with $x$ the hanging length)?`,
      options: [R`Its acceleration is $gx/L$ when a length $x$ hangs`, R`Its acceleration stays equal to $gx_0/L$ throughout`, R`When the last link leaves the table its speed is $\sqrt{g(L^2 - x_0^2)/L}$`, R`Newton's second law cannot be applied to the whole chain, because the mass hanging over the edge changes`], answer: [0, 2],
      sol: R`Take the whole chain as the system: its mass $\lambda L$ never changes, and every link moves at the same speed. Only the hanging part's weight $\lambda xg$ drives it, so $\lambda La = \lambda xg$ and $a = gx/L$, which grows as more chain hangs. For the speed, use energy (smooth table and edge): the centre of mass of the hanging part falls, and $\tfrac12\lambda Lv^2 = \lambda g\tfrac{x^2 - x_0^2}{2}$, giving $v = \sqrt{g(x^2 - x_0^2)/L}$; at $x = L$ this is $\sqrt{g(L^2 - x_0^2)/L}$.`,
      trap: R`A chain that only changes direction is not a variable-mass system: no links join or leave it.` },
    { id: 'vms-r4-06', type: 'nat', level: 3, exams: ['jam'], sub: 'rockets in gravity',
      q: R`A 6000 kg rocket on its pad burns 30 kg/s with exhaust speed 2940 m/s and rises vertically ($g = 9.8$ m/s², fuel lasts long enough, no air drag). Its upward acceleration reaches $2g$ ______ s after ignition.`,
      answer: 100, tol: 0.5, unit: 's', calc: () => (6000 - (30 * 2940) / (3 * 9.8)) / 30,
      sol: R`Thrust $= 30\times2940 = 88\,200$ N, 1.5 times the launch weight $58\,800$ N. With mass $m$, $a = \dfrac{88\,200}{m} - g$. Setting $a = 2g$ gives $m = \dfrac{88\,200}{3\times9.8} = 3000$ kg. So 3000 kg must be burnt, at 30 kg/s: 100 s.`,
      trap: R`The thrust is constant but the weight is not: the acceleration grows because the mass falls, not because the engine gets stronger.` },
    { id: 'vms-r4-07', type: 'mcq', level: 4, exams: ['jam'], sub: 'conveyor belt',
      q: R`Sand is placed gently (at rest) at a steady rate $\mu$ onto the bottom of a belt that runs at constant speed $v$ up a slope, and leaves it at the top, a height $H$ higher. In the steady state, ignoring friction in the rollers, the power the motor must supply is`,
      options: [R`$\mu v^2$`, R`$\tfrac12\mu v^2 + \mu gH$`, R`$\mu v^2 + \mu gH$`, R`$\mu gH$`], answer: 2,
      sol: R`Two jobs. (i) Each kilogram placed on the belt must be brought up to speed $v$: force $\mu v$ along the belt, power $\mu v^2$ (half becomes the sand's kinetic energy, half is heat from the slipping while it speeds up). (ii) The sand riding on the belt has mass $\mu L/v$ (length $L$ of belt, time $L/v$ on it); holding it against gravity along the slope takes force $(\mu L/v)g\sin\theta$, and power $(\mu L/v)g\sin\theta\cdot v = \mu gL\sin\theta = \mu gH$. Total $\mu v^2 + \mu gH$.`,
      trap: R`$\tfrac12\mu v^2$ counts only the kinetic energy given to the sand and misses the heat produced as it slips into motion.` },
    { id: 'vms-r4-08', type: 'nat', level: 4, exams: ['jam'], sub: 'chains',
      q: R`A chain of 3 kg/m hangs vertically from a hand and is lowered at a steady 2 m/s onto the floor, where each link comes to rest as it lands. When 1 m of chain is lying on the floor, the floor pushes up on the chain with a force of ______ N ($g = 9.8$ m/s²).`,
      answer: 41.4, tol: 0.2, unit: 'N', calc: () => 3 * 9.8 * 1 + 3 * 2 ** 2,
      sol: R`The floor does two things. It supports the chain already lying there: $\lambda gs = 3\times9.8\times1 = 29.4$ N. It also stops the links arriving at speed $v$: mass arrives at $\lambda v$ per second, each kilogram losing momentum $v$, so this needs $\lambda v^2 = 3\times4 = 12$ N. Total 41.4 N. (The hand meanwhile holds just the weight of the hanging part, since that part moves at constant velocity.)`,
      trap: R`The floor's force is more than the weight resting on it while links keep landing.` },
    { id: 'vms-r4-09', type: 'msq', level: 2, exams: ['jam'], sub: 'losing mass', format: 'statements',
      q: R`A balloon (total mass $M$, buoyant force fixed) rises at constant speed in still air, with air drag negligible. Sand now trickles out through a hole in its floor, each grain leaving with the balloon's own velocity. Which statements are correct?`,
      options: ['The escaping sand exerts no thrust on the balloon', 'The balloon begins to speed up as it loses sand', R`When its mass has fallen to $M - \Delta m$, its acceleration is $\dfrac{\Delta m\,g}{M - \Delta m}$ upwards`, 'Its speed stays constant, because the sand carries away momentum at the rate the balloon loses it'], answer: [0, 1, 2],
      sol: R`Rising at constant speed with no drag means the buoyant force $B$ equals $Mg$. Sand leaving with zero relative velocity gives no thrust ($\vec u - \vec v = 0$). After losing $\Delta m$: $(M - \Delta m)a = B - (M - \Delta m)g = \Delta m\,g$, so $a = \Delta m\,g/(M - \Delta m)$ upwards. Losing mass this way changes the forces' balance, not the momentum of what stays behind.`,
      trap: R`Zero thrust does not mean zero effect: the weight drops while the buoyancy does not.` },
    { id: 'vms-r4-10', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'collecting mass',
      q: R`A 1000 kg probe coasts (engine off) at $1.0\times10^4$ m/s into a cloud of dust at rest, of density $2\times10^{-9}$ kg/m³. Its frontal area is 5 m² and every grain it meets sticks to it. The time it takes for its speed to fall to half is ______ days (to the nearest day).`,
      answer: 174, tol: 1, unit: 'days', calc: () => { const k = 2e-9 * 5, x = 1000 / k; return (x / 1e4 + (k * x * x) / (2 * 1000 * 1e4)) / 86400; },
      sol: R`No external force, so momentum is conserved: $mv = m_0v_0$, with $m = m_0 + \rho Ax$ after a distance $x$. Speed halves when $m = 2m_0$, i.e. $x_1 = m_0/(\rho A) = 1000/10^{-8} = 10^{11}$ m. Time: $dt = dx/v = \dfrac{(m_0 + \rho Ax)\,dx}{m_0v_0}$, so $t = \dfrac{x_1}{v_0} + \dfrac{\rho Ax_1^2}{2m_0v_0} = \dfrac{1.5x_1}{v_0} = 1.5\times10^7$ s $\approx 174$ days.`,
      trap: R`Dividing the distance by the starting speed (116 days) ignores the slowing down on the way.` },
  ],
  gens: [
    { id: 'vms-r4g1', type: 'nat', level: 2, exams: ['jam'], sub: 'thrust',
      make(r) {
        const m0 = pick(r, 100, 600, 50), mu = pick(r, 2, 5, 0.5), u = pick(r, 1500, 3000, 250), k = choose(r, [0.1, 0.15, 0.2, 0.25, 0.3]);
        const answer = round((mu * u) / m0 - k * g, 2);
        return { q: R`A ${m0} kg rocket sled on a level track (coefficient of kinetic friction ${k}) burns ${mu} kg/s of propellant and throws the exhaust backwards horizontally at ${u} m/s relative to the sled. Find its acceleration (m/s²) just after it starts to move ($g = 9.8$ m/s²).`,
          answer, tol: Math.max(0.02, Math.abs(answer) * 0.01), unit: 'm/s²', m0, mu, u, k,
          sol: R`Thrust $= ${mu}\times${u} = ${mu * u}$ N; friction $= ${k}\times${m0}\times9.8 = ${round(k * m0 * g, 2)}$ N. $a = (${mu * u} - ${round(k * m0 * g, 2)})/${m0} = ${answer}$ m/s².`,
          trap: 'Subtract friction before dividing by the mass.' };
      },
      verify: (p) => (p.mu * p.u) / p.m0 - p.k * g },
    { id: 'vms-r4g2', type: 'nat', level: 3, exams: ['jam'], sub: 'rockets in gravity',
      make(r) {
        const m0 = pick(r, 2000, 9000, 500), tw = choose(r, [1.2, 1.25, 1.5, 1.6, 2, 2.4]), n = choose(r, [2, 3]), mu = pick(r, 10, 50, 5);
        const T = round((tw * m0 * g) / 1000, 2), ms = (T * 1000) / ((n + 1) * g), answer = round((m0 - ms) / mu, 1);
        return { q: R`A rocket of launch mass ${m0} kg rises vertically with a constant thrust of ${T} kN while burning ${mu} kg/s ($g = 9.8$ m/s², no drag, enough fuel). How many seconds after ignition does its upward acceleration reach $${n}g$?`,
          answer, tol: Math.max(0.5, answer * 0.01), unit: 's', m0, T, n, mu,
          sol: R`With mass $m$: $a = F/m - g$. Setting $a = ${n}g$ gives $m = \dfrac{F}{${n + 1}g} = \dfrac{${round(T * 1000)}}{${round((n + 1) * g, 1)}} = ${round(ms, 1)}$ kg. Fuel burnt $= ${m0} - ${round(ms, 1)}$ kg, at ${mu} kg/s: $t = ${answer}$ s.`,
          trap: 'The acceleration grows because the mass falls; the thrust itself stays the same.' };
      },
      verify: (p) => (p.m0 - (p.T * 1000) / ((p.n + 1) * g)) / p.mu },
    { id: 'vms-r4g3', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'collecting mass',
      make(r) {
        const m0 = pick(r, 500, 3000, 250), rho = choose(r, [1, 2, 4, 5]), A = int(r, 2, 10), v0 = int(r, 5, 20);
        const [word, f] = choose(r, [['half', 1 / 2], ['one third', 1 / 3], ['one quarter', 1 / 4], ['two thirds', 2 / 3]]);
        const k = rho * 1e-9 * A, x = (m0 * (1 / f - 1)) / k, t = x / (v0 * 1e3) + (k * x * x) / (2 * m0 * v0 * 1e3), answer = round(t / 86400, 1);
        return { q: R`A ${m0} kg probe coasts with its engine off at ${v0} km/s into a cloud of dust at rest, of density $${rho}\times10^{-9}$ kg/m³. Its frontal area is ${A} m² and all the dust it meets sticks to it. How many days does it take for its speed to fall to ${word} of the starting value?`,
          answer, tol: Math.max(0.1, answer * 0.01), unit: 'days', m0, rho, A, v0, f,
          sol: R`Momentum is conserved: $(m_0 + \rho Ax)v = m_0v_0$. The speed is $f v_0$ when $\rho Ax = m_0(1/f - 1)$, i.e. $x = ${round(x / 1e9, 3)}\times10^{9}$ m. Integrating $dt = (m_0 + \rho Ax)\,dx/(m_0v_0)$: $t = \dfrac{x}{v_0} + \dfrac{\rho Ax^2}{2m_0v_0} = ${round(t / 1e6, 3)}\times10^{6}$ s $= ${answer}$ days.`,
          trap: 'The probe slows all the way, so distance divided by the starting speed underestimates the time.' };
      },
      verify: (p) => { const k = p.rho * 1e-9 * p.A, x = (p.m0 * (1 / p.f - 1)) / k; return (x / (p.v0 * 1e3) + (k * x * x) / (2 * p.m0 * p.v0 * 1e3)) / 86400; } },
  ],
};
