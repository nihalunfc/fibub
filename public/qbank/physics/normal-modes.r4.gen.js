// Round 4 extras for normal-modes: original questions, written 2026-11-22.
import { pick, choose, round } from '../_util.js';
const R = String.raw;
const g = 9.8;

export default {
  items: [
    { id: 'nm-r4-01', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'counting modes',
      q: R`The ozone molecule O₃ is bent (its three atoms are not on one line). Counting only vibrations (no translations or rotations), the number of its normal modes is ______.`,
      answer: 3, tol: 0, calc: () => 3 * 3 - 6,
      sol: R`Three atoms have $3\times3 = 9$ coordinates. A non-linear body has 3 translations and 3 rotations (all zero-frequency modes). That leaves $9 - 6 = 3$ vibrations: a symmetric stretch, an antisymmetric stretch and a bend.`,
      trap: R`$3N - 5$ is for linear molecules, which have only two rotations; ozone is bent.` },
    { id: 'nm-r4-02', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'superposition of modes',
      q: R`Two coupled oscillators with normal-mode angular frequencies $\omega_1$ and $\omega_2$ are started from a general initial position, so that both modes are excited. The resulting motion is`,
      options: [R`always periodic, with the period of the lower mode`, R`periodic only if $\omega_1/\omega_2$ is a rational number`, R`never periodic`, R`periodic only if the two modes have equal amplitudes`], answer: 1,
      sol: R`The motion is $\mathbf a_1C_1\cos(\omega_1t + \phi_1) + \mathbf a_2C_2\cos(\omega_2t + \phi_2)$. It repeats only if there is a time $T$ that is a whole number of periods of both modes, $\omega_1T = 2\pi n_1$ and $\omega_2T = 2\pi n_2$, which needs $\omega_1/\omega_2 = n_1/n_2$, a rational number. Otherwise the motion is quasi-periodic: it never repeats exactly. Amplitudes play no part.`,
      trap: R`Each mode on its own is periodic; their sum is periodic only for commensurate frequencies.` },
    { id: 'nm-r4-03', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'coupled circuits',
      q: R`Two identical LC circuits (inductance $L$, capacitance $C$) are coupled only by a mutual inductance $M$ between their coils ($0 < M < L$). The normal-mode angular frequencies are`,
      options: [R`$1/\sqrt{(L + M)C}$ and $1/\sqrt{(L - M)C}$`, R`$1/\sqrt{LC}$ and $1/\sqrt{(L + 2M)C}$`, R`$1/\sqrt{LC}$ only, since the coupling is magnetic`, R`$\sqrt{(L + M)/C}$ and $\sqrt{(L - M)/C}$`], answer: 0,
      sol: R`Kirchhoff's rule for each loop: $L\ddot q_1 + M\ddot q_2 + q_1/C = 0$ and $L\ddot q_2 + M\ddot q_1 + q_2/C = 0$. Adding: $(L + M)(\ddot q_1 + \ddot q_2) + (q_1 + q_2)/C = 0$, so the in-phase mode has $\omega = 1/\sqrt{(L + M)C}$. Subtracting: the out-of-phase mode has $\omega = 1/\sqrt{(L - M)C}$. Here the coupling is in the "kinetic" (inductive) term, so the in-phase mode is the slower one.`,
      trap: R`$\sqrt{(L \pm M)/C}$ has the wrong dimensions; check that $1/\sqrt{LC}$ is a frequency.` },
    { id: 'nm-r4-04', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'mode shapes',
      q: R`Blocks of mass $m$ and $2m$ on a smooth table are joined by a spring and nothing else. In the vibrating (non-zero frequency) normal mode, the displacement of the $2m$ block divided by that of the $m$ block is`,
      options: [R`$-2$`, R`$\tfrac12$`, R`$-1$`, R`$-\tfrac12$`], answer: 3,
      sol: R`No external horizontal force acts, so in the vibrating mode the centre of mass stays still: $mx_1 + 2mx_2 = 0$, giving $x_2/x_1 = -\tfrac12$. The heavier block moves half as far, in the opposite direction. (The other mode, $x_1 = x_2$, is the zero-frequency drift.)`,
      trap: R`$-2$ swaps the blocks: the heavier one moves less.` },
    { id: 'nm-r4-05', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'properties of modes',
      q: R`A system is oscillating in exactly one of its normal modes. Which statement is NOT true in general?`,
      options: ['Every coordinate oscillates at the same frequency', 'All coordinates pass through their equilibrium values at the same instant', 'The ratios of the coordinates\' amplitudes are fixed by the mode', 'The energy is shared equally among the coordinates'], answer: 3,
      sol: R`In a single mode $\mathbf q(t) = \mathbf aC\cos(\omega t + \phi)$: one frequency, one phase (so all coordinates cross zero together, or in exact antiphase, which also crosses zero together), and the shape $\mathbf a$ fixes the amplitude ratios. But the energy in each coordinate depends on its mass and amplitude: for blocks $m$ and $2m$ on a spring the light block carries twice the kinetic energy of the heavy one.`,
      trap: R`Equipartition is a statement about thermal averages, not about a single mechanical mode.` },
    { id: 'nm-r4-06', type: 'msq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'driven systems', format: 'statements',
      q: R`Two equal masses $m$ sit between walls: wall, spring $k$, mass, spring $k'$, mass, spring $k$, wall. Equal forces $F_0\cos\omega t$ push both masses in the same direction (ignore damping; consider the steady state). Which statements are correct?`,
      options: [R`The response blows up (resonance) at $\omega = \sqrt{k/m}$`, R`The response blows up at $\omega = \sqrt{(k + 2k')/m}$`, R`At every driving frequency the two masses have equal displacements`, R`Each mass moves exactly like a single mass $m$ on a spring $k$ driven by $F_0\cos\omega t$`], answer: [0, 2, 3],
      sol: R`The force vector $(1, 1)F_0$ is the shape of the in-phase mode and is orthogonal to the out-of-phase mode $(1, -1)$, so only the in-phase mode is driven. In it $x_1 = x_2$, the middle spring is never stretched, and each mass obeys $m\ddot x = -kx + F_0\cos\omega t$. The only resonance is at $\sqrt{k/m}$; the out-of-phase mode at $\sqrt{(k + 2k')/m}$ is never excited by this force.`,
      trap: R`A system resonates at a normal frequency only if the drive has a component along that mode.` },
    { id: 'nm-r4-07', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'unequal masses', format: 'numeric',
      q: R`Masses of 1 kg and 2 kg sit in a line between two walls, joined wall-1 kg-2 kg-wall by three identical springs. The ratio of the higher to the lower normal-mode angular frequency is ______ (to two decimal places).`,
      answer: 1.93, tol: 0.01, calc: () => Math.sqrt((6 + Math.sqrt(12)) / (6 - Math.sqrt(12))),
      sol: R`With $x = \omega^2m_0/k$ ($m_0 = 1$ kg): $\begin{vmatrix}2 - x & -1\\ -1 & 2 - 2x\end{vmatrix} = 2x^2 - 6x + 3 = 0$, so $x = \dfrac{6 \pm \sqrt{12}}{4} = 2.366$ or $0.634$. The ratio of angular frequencies is $\sqrt{2.366/0.634} = \sqrt{3.732} = 1.93$.`,
      trap: R`Answering the ratio of $\omega^2$ values (3.73) instead of $\omega$.` },
    { id: 'nm-r4-08', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'variational estimates',
      q: R`For small oscillations with mass matrix $M$ and stiffness matrix $K$ (both symmetric, positive definite), the Rayleigh quotient $\rho(\mathbf a) = \dfrac{\mathbf a^TK\mathbf a}{\mathbf a^TM\mathbf a}$ of any non-zero trial vector $\mathbf a$ is`,
      options: [R`never more than the lowest $\omega^2$`, R`equal to the mean of all the $\omega^2$ values`, R`never less than the lowest $\omega^2$, and equal to it only when $\mathbf a$ is the lowest mode`, R`never less than the highest $\omega^2$`], answer: 2,
      sol: R`Expand $\mathbf a = \sum c_i\mathbf a_i$ in the modes, normalised so that $\mathbf a_i^TM\mathbf a_j = \delta_{ij}$ and $\mathbf a_i^TK\mathbf a_j = \omega_i^2\delta_{ij}$. Then $\rho = \dfrac{\sum c_i^2\omega_i^2}{\sum c_i^2}$, a weighted average of the $\omega_i^2$, which lies between the lowest and highest values. So a guessed shape always over-estimates the lowest $\omega^2$ (useful for quick estimates). Example: $K = \begin{pmatrix}2 & -1\\ -1 & 2\end{pmatrix}$, $M = I$, trial $(1, 0)$ gives $\rho = 2 \ge 1$.`,
      trap: R`It is an upper bound on the lowest $\omega^2$ (and a lower bound on the highest), not a lower bound.` },
    { id: 'nm-r4-09', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'kinetic coupling', format: 'statements',
      q: R`A system has $L = \tfrac12(\dot x^2 + \dot y^2) + \alpha\dot x\dot y - \tfrac12(x^2 + y^2)$ with $0 < \alpha < 1$ (unit mass and stiffness). Which statements are correct?`,
      options: [R`The normal modes have $x = y$ and $x = -y$`, R`The mode with $x = y$ has $\omega = 1/\sqrt{1 + \alpha}$`, R`The mode with $x = -y$ has the higher frequency`, R`Since the potential has no $xy$ term, a motion started with only $x$ displaced keeps $y = 0$`], answer: [0, 1, 2],
      sol: R`Equations: $\ddot x + \alpha\ddot y + x = 0$ and $\ddot y + \alpha\ddot x + y = 0$. Adding: $(1 + \alpha)(\ddot x + \ddot y) + (x + y) = 0$, so $x = y$ oscillates at $1/\sqrt{1 + \alpha}$. Subtracting: $x = -y$ at $1/\sqrt{1 - \alpha}$, higher. A start with only $x$ displaced is a sum of both modes, which drift out of step, so $y$ gets energy: coupling through the kinetic term is just as real as coupling through the potential.`,
      trap: R`Coupling can sit in $T$ (an off-diagonal mass matrix), not only in $V$.` },
    { id: 'nm-r4-10', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'double pendulum', format: 'numeric',
      q: R`A double pendulum has two equal bobs; the upper light rod is 1.0 m long and the lower one 0.5 m. Take $g = 9.8$ m/s². Its lower small-oscillation angular frequency is ______ rad/s (to two decimal places).`,
      answer: 2.74, tol: 0.02, calc: () => Math.sqrt(9.8 * (1.5 - Math.sqrt(1.25)) / 0.5), unit: 'rad/s',
      sol: R`With equal masses $m$: $T = \tfrac12m(2l_1^2\dot\theta_1^2 + 2l_1l_2\dot\theta_1\dot\theta_2 + l_2^2\dot\theta_2^2)$, $V = \tfrac12mg(2l_1\theta_1^2 + l_2\theta_2^2)$. The determinant condition simplifies to $l_1l_2\omega^4 - 2g(l_1 + l_2)\omega^2 + 2g^2 = 0$, so $\omega^2 = \dfrac{g\left[(l_1 + l_2) \pm \sqrt{l_1^2 + l_2^2}\right]}{l_1l_2}$. With $l_1 = 1$, $l_2 = 0.5$: $\omega^2 = 9.8(1.5 - 1.118)/0.5 = 7.49$, so $\omega = 2.74$ rad/s. (Check: $l_1 = l_2 = l$ gives the familiar $(2 \mp \sqrt2)g/l$.)`,
      trap: R`$\sqrt{g/l}$ of either rod alone (3.13 or 4.43 rad/s) ignores the coupling, which pulls the lower mode below both.` },
    { id: 'nm-r4-11', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'variational estimates',
      q: R`In a network of masses and springs at a stable equilibrium, one spring is replaced by a stiffer one (the masses and everything else stay the same). The normal-mode frequencies`,
      options: ['all stay the same or increase: none of them decreases', 'all increase by the same factor', 'the lowest increases and the highest decreases, keeping their sum fixed', 'may move in either direction, depending on the mode'], answer: 0,
      sol: R`The extra stiffness adds $\tfrac12\Delta k\,(\text{extension})^2 \ge 0$ to $V$, so the new stiffness matrix is $K + \Delta K$ with $\mathbf a^T\Delta K\mathbf a \ge 0$ for every $\mathbf a$. Every Rayleigh quotient can only rise, and by the min-max characterisation each $\omega_n^2$ (counted in order) can only rise or stay. A mode in which that spring is never stretched keeps its frequency exactly. (Likewise adding mass can only lower frequencies.)`,
      trap: R`Changing one spring changes the mode shapes, but it still cannot push any frequency down.` },
    { id: 'nm-r4-12', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'weak coupling', format: 'numeric',
      q: R`Two pendulums with slightly different lengths, $g/l_1 = 10.0$ s⁻² and $g/l_2 = 10.4$ s⁻², are joined by a weak spring with $k/m = 0.15$ s⁻² (equal bobs). Pendulum 1 is pulled aside and released with pendulum 2 at rest. The largest fraction of the initial energy that ever reaches pendulum 2 is about ______ (to two decimal places).`,
      answer: 0.36, tol: 0.02, calc: () => 0.09 / (0.16 + 0.09),
      sol: R`The equations $\ddot x_1 = -(10 + 0.15)x_1 + 0.15x_2$, $\ddot x_2 = -(10.4 + 0.15)x_2 + 0.15x_1$ have the matrix $\begin{pmatrix}10.15 & -0.15\\ -0.15 & 10.55\end{pmatrix}$. Its eigenvectors are rotated from the axes by $\theta$ with $\tan2\theta = \dfrac{2\times0.15}{10.55 - 10.15} = 0.75$. Starting from $(1, 0)$, $x_2 = \sin\theta\cos\theta(\cos\omega_at - \cos\omega_bt)$, whose largest value is $\sin2\theta$. The energy fraction is $\sin^22\theta = \dfrac{0.3^2}{0.4^2 + 0.3^2} = 0.36$ (the two frequencies differ by only 2%, so energy goes as amplitude squared).`,
      trap: R`Complete transfer happens only for identical pendulums; detuning larger than the coupling blocks most of it.` },
  ],
  gens: [
    { id: 'nm-r4g1', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'unequal masses',
      make(r) {
        const m = pick(r, 0.5, 2, 0.5), mu = choose(r, [1.5, 2, 2.5, 3, 4]), k = pick(r, 10, 60, 5), high = choose(r, [true, false]);
        const s = Math.sqrt((1 + mu) ** 2 - 3 * mu), x = ((1 + mu) + (high ? s : -s)) / mu, answer = round(Math.sqrt(x * k / m), 3);
        return { q: R`Blocks of ${m} kg and ${round(mu * m, 3)} kg sit in a line between two walls, joined wall-block-block-wall by three identical springs of ${k} N/m on a smooth floor. Find the ${high ? 'higher' : 'lower'} normal-mode angular frequency (rad/s).`,
          answer, tol: Math.max(0.01, answer * 0.01), unit: 'rad/s', m, mu, k, high,
          sol: R`Write $x = \omega^2m/k$ and $\mu = ${mu}$ for the mass ratio: $\begin{vmatrix}2 - x & -1\\ -1 & 2 - \mu x\end{vmatrix} = \mu x^2 - 2(1 + \mu)x + 3 = 0$, so $x = \dfrac{(1 + \mu) \pm \sqrt{(1 + \mu)^2 - 3\mu}}{\mu} = ${round(((1 + mu) - s) / mu, 4)}$ or $${round(((1 + mu) + s) / mu, 4)}$. Then $\omega = \sqrt{xk/m} = ${answer}$ rad/s.`,
          trap: 'The heavier block enters the mass matrix; the stiffness matrix is the same as for equal masses.' };
      },
      verify: (p) => { const s = Math.sqrt((1 + p.mu) ** 2 - 3 * p.mu); return Math.sqrt(((1 + p.mu) + (p.high ? s : -s)) / p.mu * p.k / p.m); } },
    { id: 'nm-r4g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'double pendulum',
      make(r) {
        const l1 = pick(r, 0.4, 1.6, 0.2), l2 = pick(r, 0.2, 1.2, 0.2), high = choose(r, [true, false]);
        const root = Math.sqrt(l1 * l1 + l2 * l2), w2 = g * ((l1 + l2) + (high ? root : -root)) / (l1 * l2), answer = round(Math.sqrt(w2), 3);
        return { q: R`A double pendulum has two equal bobs; the upper light rod is ${l1} m long and the lower one ${l2} m. Find its ${high ? 'higher' : 'lower'} small-oscillation angular frequency in rad/s ($g = 9.8$ m/s²).`,
          answer, tol: Math.max(0.01, answer * 0.01), unit: 'rad/s', l1, l2, high,
          sol: R`For equal bobs the determinant gives $l_1l_2\omega^4 - 2g(l_1 + l_2)\omega^2 + 2g^2 = 0$, so $\omega^2 = \dfrac{g\left[(l_1 + l_2) \pm \sqrt{l_1^2 + l_2^2}\right]}{l_1l_2} = \dfrac{9.8\,[${round(l1 + l2, 2)} ${high ? '+' : '-'} ${round(root, 4)}]}{${round(l1 * l2, 4)}} = ${round(w2, 3)}$ s⁻², and $\omega = ${answer}$ rad/s.`,
          trap: 'The lower bob\'s rod length enters both modes; neither frequency is $\\sqrt{g/l}$ of one rod.' };
      },
      verify: (p) => { const s = Math.sqrt(p.l1 * p.l1 + p.l2 * p.l2); return Math.sqrt(g * ((p.l1 + p.l2) + (p.high ? s : -s)) / (p.l1 * p.l2)); } },
    { id: 'nm-r4g3', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'weak coupling',
      make(r) {
        const w1 = choose(r, [9, 10, 12, 16]), d = pick(r, 0.1, 0.6, 0.1), kap = pick(r, 0.02, 0.3, 0.02);
        const answer = round(4 * kap * kap / (d * d + 4 * kap * kap), 3);
        return { q: R`Two pendulums with $g/l_1 = ${w1}$ s⁻² and $g/l_2 = ${round(w1 + d, 2)}$ s⁻² are joined by a weak spring with $k/m = ${kap}$ s⁻² (equal bobs). Pendulum 1 is released with pendulum 2 at rest. Estimate the largest fraction of the energy that ever reaches pendulum 2.`,
          answer, tol: Math.max(0.01, answer * 0.02), d, kap,
          sol: R`The coupling mixes the pendulums through an angle $\theta$ with $\tan2\theta = \dfrac{2k/m}{\Delta}$, where $\Delta = ${d}$ s⁻² is the difference of the $g/l$ values. Pendulum 2's largest amplitude is $\sin2\theta$ times the initial one, so the energy fraction is $\sin^22\theta = \dfrac{(2\times${kap})^2}{${d}^2 + (2\times${kap})^2} = ${answer}$.`,
          trap: 'Full transfer needs identical pendulums; when the detuning beats the coupling, little energy crosses.' };
      },
      verify: (p) => 4 * p.kap * p.kap / (p.d * p.d + 4 * p.kap * p.kap) },
  ],
};
