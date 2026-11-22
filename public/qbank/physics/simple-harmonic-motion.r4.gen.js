// Round 4 extras for simple-harmonic-motion: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;
const g = 9.8;

export default {
  items: [
    { id: 'shm-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'spring-mass',
      q: R`A block oscillating on a horizontal spring on a smooth table is taken to the Moon (where $g$ is about one sixth of Earth's) and set oscillating the same way. Its period`,
      options: ['stays the same', 'increases by about 2.5 times', 'decreases by about 2.5 times', 'increases by about 6 times'], answer: 0,
      sol: R`For a mass on a spring, $T = 2\pi\sqrt{m/k}$: only the mass and the spring constant matter, and neither changes on the Moon. (Even hung vertically, gravity only shifts the equilibrium point.) A simple pendulum, $T = 2\pi\sqrt{L/g}$, would slow down by $\sqrt6 \approx 2.45$.`,
      trap: R`$g$ sets the period of a pendulum, not of a spring.` },
    { id: 'shm-r4-02', type: 'msq', level: 2, exams: ['jam'], sub: 'spring-mass', format: 'statements',
      q: R`A block of mass $m$ hangs from two vertical springs of constants $k_1$ and $k_2$ attached side by side to the ceiling and both to the block, which stays level. Which statements are correct?`,
      options: [R`The combination acts as one spring of constant $k_1 + k_2$`, 'Both springs stretch by the same amount', 'The stiffer spring pulls on the block with the larger force', R`The period is $2\pi\sqrt{m(k_1 + k_2)/(k_1k_2)}$`], answer: [0, 1, 2],
      sol: R`Side by side (in parallel), the springs share the same extension $x$, so the forces $k_1x$ and $k_2x$ add: $k = k_1 + k_2$, and the stiffer spring supplies more of the force. The period is $2\pi\sqrt{m/(k_1 + k_2)}$. The expression with $k_1k_2/(k_1 + k_2)$ belongs to springs joined end to end (in series).`,
      trap: R`In parallel the extensions are equal; in series the forces are equal.` },
    { id: 'shm-r4-03', type: 'mcq', level: 2, exams: ['jam'], sub: 'pendulum',
      q: R`A simple pendulum of length $L$ has a small bob of mass $m$ carrying charge $+q$. A uniform electric field $E$ pointing vertically downwards is switched on. Its period for small swings becomes`,
      options: ['unchanged, since the period of a pendulum does not depend on the bob', R`$2\pi\sqrt{\dfrac{L}{g - qE/m}}$`, R`$2\pi\sqrt{\dfrac{L}{g + qE/m}}$`, R`$2\pi\sqrt{\dfrac{L}{g + qE}}$`], answer: 2,
      sol: R`The bob now feels a constant downward force $mg + qE$, which acts just like a stronger gravity $g_{\rm eff} = g + qE/m$. So $T = 2\pi\sqrt{L/g_{\rm eff}}$, shorter than before. The mass no longer cancels, because the electric force does not grow with $m$ the way weight does.`,
      trap: R`Adding $qE$ (a force) to $g$ (an acceleration) is dimensionally wrong; divide by $m$ first.` },
    { id: 'shm-r4-04', type: 'msq', level: 3, exams: ['jam'], sub: 'graphs', format: 'statements',
      q: R`For a particle in simple harmonic motion, which of these plots are straight lines?`,
      options: ['acceleration against displacement', 'velocity against displacement', R`$v^2$ against $x^2$`, 'potential energy against time', R`kinetic energy against $x^2$`], answer: [0, 2, 4],
      sol: R`$a = -\omega^2x$: a straight line of slope $-\omega^2$. $v^2 = \omega^2(A^2 - x^2)$: straight against $x^2$, and so is $K = \tfrac12m\omega^2(A^2 - x^2)$. Velocity against displacement is an ellipse ($v^2/\omega^2 + x^2 = A^2$), and potential energy against time is a $\sin^2$ curve.`,
      trap: R`Change the variable on the axis and a curve can become a line: $x^2$, not $x$.` },
    { id: 'shm-r4-05', type: 'nat', level: 3, exams: ['jam'], sub: 'pendulum',
      q: R`A simple pendulum 1.0 m long hangs from the roof of a trolley that runs freely (no friction) down a straight $30^\circ$ incline. Its period for small swings about its equilibrium position is ______ s ($g = 9.8$ m/s², two decimal places).`,
      answer: 2.16, tol: 0.01, unit: 's', calc: () => 2 * Math.PI * Math.sqrt(1 / (9.8 * Math.cos(Math.PI / 6))),
      sol: R`The trolley accelerates at $g\sin30^\circ$ down the slope. In its frame the bob feels gravity plus a fictitious force $-m\vec a$; their sum is $g\cos30^\circ$, at right angles to the incline (the string hangs perpendicular to the slope). So $g_{\rm eff} = 9.8\times0.866 = 8.49$ m/s², and $T = 2\pi\sqrt{1/8.49} = 2.16$ s.`,
      trap: R`$g\sin\theta$ is the trolley's acceleration, not the effective gravity; the bob feels $g\cos\theta$.` },
    { id: 'shm-r4-06', type: 'mcq', level: 4, exams: ['jam'], sub: 'phase',
      q: R`Two particles do SHM with the same amplitude $A$ and the same frequency along parallel lines, about the same mean position. At one instant both are at $x = +A/2$, moving in opposite directions. The phase difference between them is`,
      options: [R`$60^\circ$`, R`$120^\circ$`, R`$90^\circ$`, R`$180^\circ$`], answer: 1,
      sol: R`Write $x = A\sin\phi$. At $x = A/2$, $\sin\phi = \tfrac12$, so $\phi = 30^\circ$ (moving towards $+x$, since $\cos\phi > 0$) or $\phi = 150^\circ$ (moving towards $-x$). The difference is $120^\circ$. On the reference circle the two points sit at the same height, mirrored about the vertical axis.`,
      trap: R`$60^\circ$ comes from thinking of $x = A/2$ as half of a $120^\circ$ angle; draw the reference circle.` },
    { id: 'shm-r4-07', type: 'nat', level: 4, exams: ['jam'], sub: 'other oscillators',
      q: R`A closed horizontal cylinder of cross-section 10 cm² is split by a 2.0 kg frictionless piston into two equal gas columns, each 20 cm long at $1.0\times10^5$ Pa. The piston is nudged along the axis. Assuming the gas stays at constant temperature, its period of small oscillation is ______ s (three decimal places).`,
      answer: 0.281, tol: 0.002, unit: 's', calc: () => 2 * Math.PI * Math.sqrt(2 / ((2 * 1e5 * 10e-4) / 0.2)),
      sol: R`Move the piston by $x$. Isothermally, one side's pressure becomes $\dfrac{PL}{L - x} \approx P(1 + x/L)$ and the other's $P(1 - x/L)$. Net restoring force $\approx -\dfrac{2PA}{L}x$, so $k = \dfrac{2PA}{L} = \dfrac{2\times(1.0\times10^5)\times(10\times10^{-4})}{0.20} = 1000$ N/m. $T = 2\pi\sqrt{m/k} = 2\pi\sqrt{2/1000} = 0.281$ s. (If the gas were adiabatic, $k$ would gain a factor $\gamma$.)`,
      trap: R`Both columns push back; counting only one gives $k = 500$ N/m.` },
    { id: 'shm-r4-08', type: 'mcq', level: 4, exams: ['jam'], sub: 'pendulum',
      q: R`A pendulum's bob is a hollow sphere filled with water, which slowly drains out through a small hole at the bottom of the sphere. As the sphere empties, the period of small swings`,
      options: ['stays the same, since the period does not depend on the mass', 'keeps increasing', 'keeps decreasing', 'first increases, then decreases back to its starting value'], answer: 3,
      sol: R`The period depends on the distance from the pivot to the centre of mass. Full or empty, the centre of mass is at the sphere's centre. In between, the water lies in the lower part of the sphere, so the combined centre of mass is lower: the effective length, and the period, grow at first, then return to the original value as the last water leaves.`,
      trap: R`The mass does cancel, but the position of the centre of mass does not.` },
    { id: 'shm-r4-09', type: 'nat', level: 3, exams: ['jam'], sub: 'physical pendulum',
      q: R`A uniform rod 1.2 m long swings about a horizontal pivot through one of its ends. Its period is the same as when it swings about a pivot through another point at a distance ______ m from its centre (other than 0.6 m).`,
      answer: 0.2, tol: 0.002, unit: 'm', calc: () => 1.2 ** 2 / 12 / 0.6,
      sol: R`About a pivot a distance $d$ from the centre, $T = 2\pi\sqrt{\dfrac{k^2 + d^2}{gd}}$ with $k^2 = L^2/12 = 0.12$ m². The same period means $\dfrac{k^2}{d} + d$ is the same; its two solutions satisfy $d_1d_2 = k^2$. With $d_1 = 0.6$: $d_2 = 0.12/0.6 = 0.2$ m. (Check: $(0.12 + 0.04)/0.2 = 0.8 = (0.12 + 0.36)/0.6$.)`,
      trap: R`Pivoting at the centre ($d = 0$) never oscillates; the conjugate point lies between the centre and the end.` },
    { id: 'shm-r4-10', type: 'nat', level: 5, exams: ['jam'], sub: 'spring-mass',
      q: R`A 0.5 kg pan rests on a vertical spring ($k = 200$ N/m). A 0.5 kg lump of putty falls from 20 cm above the pan, hits it and sticks. The amplitude of the resulting oscillation is ______ cm ($g = 9.8$ m/s², two decimal places).`,
      answer: 7.42, tol: 0.03, unit: 'cm', calc: () => { const v = 0.5 * Math.sqrt(2 * 9.8 * 0.2) / 1, x0 = (0.5 * 9.8) / 200, w = Math.sqrt(200 / 1); return 100 * Math.hypot(x0, v / w); },
      sol: R`Speed of the putty on arrival: $\sqrt{2\times9.8\times0.2} = 1.98$ m/s. Momentum is kept in the brief collision: $v = 0.5\times1.98/1.0 = 0.99$ m/s. The new equilibrium is lower by $mg/k = 0.0245$ m, so the motion starts 2.45 cm above it, moving at 0.99 m/s, with $\omega = \sqrt{200/1.0} = 14.14$ rad/s. $A = \sqrt{x_0^2 + (v/\omega)^2} = \sqrt{0.0245^2 + 0.0700^2} = 0.0742$ m $= 7.42$ cm.`,
      trap: R`Forgetting that the equilibrium moves down gives 7.00 cm; using energy across the sticky collision ignores the energy lost in it.` },
  ],
  gens: [
    { id: 'shm-r4g1', type: 'nat', level: 3, exams: ['jam'], sub: 'pendulum',
      make(r) {
        const th = choose(r, [15, 20, 30, 37, 45, 53, 60]), L = pick(r, 0.4, 2, 0.1);
        const answer = round(2 * Math.PI * Math.sqrt(L / (g * Math.cos((th * Math.PI) / 180))), 3);
        return { q: R`A simple pendulum ${L} m long hangs in a trolley running freely (no friction) down a straight $${th}^\circ$ incline. Find its period (s) for small swings ($g = 9.8$ m/s²).`,
          answer, tol: Math.max(0.005, answer * 0.005), unit: 's', L, th,
          sol: R`In the trolley's frame the effective gravity is $g\cos${th}^\circ = ${round(g * Math.cos((th * Math.PI) / 180), 3)}$ m/s², perpendicular to the incline. $T = 2\pi\sqrt{${L}/${round(g * Math.cos((th * Math.PI) / 180), 3)}} = ${answer}$ s.`,
          trap: 'The effective gravity is $g\\cos\\theta$, not $g$ or $g\\sin\\theta$.' };
      },
      verify: (p) => 2 * Math.PI * Math.sqrt(p.L / (g * Math.cos((p.th * Math.PI) / 180))) },
    { id: 'shm-r4g2', type: 'nat', level: 4, exams: ['jam'], sub: 'other oscillators',
      make(r) {
        const m = pick(r, 0.5, 4, 0.5), A = choose(r, [5, 10, 20, 25]), L = pick(r, 10, 40, 5), P = choose(r, [1, 1.5, 2]), adi = r() < 0.5;
        const gam = adi ? 1.4 : 1, k = (2 * gam * P * 1e5 * A * 1e-4) / (L / 100), answer = round(2 * Math.PI * Math.sqrt(m / k), 4);
        return { q: R`A closed horizontal cylinder of cross-section ${A} cm² is split by a frictionless piston of mass ${m} kg into two equal gas columns, each ${L} cm long at $${P}\times10^5$ Pa. The piston is nudged along the axis. ${adi ? 'Treating the gas as adiabatic with $\\gamma = 1.4$' : 'Assuming the gas stays at constant temperature'}, find its period of small oscillation in seconds.`,
          answer, tol: Math.max(0.0005, answer * 0.005), unit: 's', m, A, L, P, gam,
          sol: R`A displacement $x$ changes each side's pressure by about $\mp ${adi ? '\\gamma ' : ''}Px/L$, both pushing back: $k = \dfrac{2${adi ? '\\gamma ' : ''}PA}{L} = ${round(k, 2)}$ N/m. $T = 2\pi\sqrt{${m}/${round(k, 2)}} = ${answer}$ s.`,
          trap: 'Both gas columns contribute to the restoring force.' };
      },
      verify: (p) => 2 * Math.PI * Math.sqrt(p.m / ((2 * p.gam * p.P * 1e5 * p.A * 1e-4) / (p.L / 100))) },
    { id: 'shm-r4g3', type: 'nat', level: 5, exams: ['jam'], sub: 'spring-mass',
      make(r) {
        const M = pick(r, 0.2, 1, 0.1), m = pick(r, 0.1, 1, 0.1), k = pick(r, 50, 400, 50), h = pick(r, 0.05, 0.5, 0.05);
        const v = (m * Math.sqrt(2 * g * h)) / (M + m), x0 = (m * g) / k, w = Math.sqrt(k / (M + m)), answer = round(100 * Math.hypot(x0, v / w), 2);
        return { q: R`A ${M} kg pan rests on a vertical spring ($k = ${k}$ N/m). A ${m} kg lump of putty falls from ${h} m above the pan and sticks to it. Find the amplitude (cm) of the oscillation that follows ($g = 9.8$ m/s²).`,
          answer, tol: Math.max(0.02, answer * 0.005), unit: 'cm', M, m, k, h,
          sol: R`Just after sticking: $v = \dfrac{${m}\sqrt{2g\times${h}}}{${round(M + m, 2)}} = ${round(v, 4)}$ m/s. New equilibrium is $mg/k = ${round(x0 * 100, 3)}$ cm lower; $\omega = \sqrt{${k}/${round(M + m, 2)}} = ${round(w, 3)}$ rad/s. $A = \sqrt{x_0^2 + (v/\omega)^2} = ${answer}$ cm.`,
          trap: 'The motion starts away from the new equilibrium, so both the offset and the speed set the amplitude.' };
      },
      verify: (p) => { const v = (p.m * Math.sqrt(2 * g * p.h)) / (p.M + p.m), x0 = (p.m * g) / p.k, w = Math.sqrt(p.k / (p.M + p.m)); return 100 * Math.hypot(x0, v / w); } },
  ],
};
