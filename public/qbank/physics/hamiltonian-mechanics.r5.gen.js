// Round 5 extras for hamiltonian-mechanics: original questions, written 2026-11-22.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'ham-r5-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: "Hamilton's equations",
      q: R`For $N$ unconstrained point particles moving in three dimensions, the number of first-order Hamilton's equations is`,
      options: [R`$6N$`, R`$3N$`, R`$9N$`, R`$2N$`], answer: 0,
      sol: R`There are $3N$ coordinates and $3N$ momenta. Each gets one first-order equation ($\dot q_i = \partial H/\partial p_i$, $\dot p_i = -\partial H/\partial q_i$), so $6N$ in all. They replace the $3N$ second-order Lagrange equations.`,
      trap: R`$3N$ counts the Lagrange equations, which are second order.` },
    { id: 'ham-r5-02', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Legendre transform',
      q: R`A system has $L = \tfrac12m\dot x^2 + a\dot x - V(x)$ with $a$ a constant. Its Hamiltonian is`,
      options: [R`$\dfrac{p^2}{2m} + V(x)$`, R`$\dfrac{(p + a)^2}{2m} + V(x)$`, R`$\dfrac{(p - a)^2}{2m} + V(x)$`, R`$\dfrac{(p - a)^2}{2m} - V(x)$`], answer: 2,
      sol: R`$p = \partial L/\partial\dot x = m\dot x + a$, so $\dot x = (p - a)/m$. Then $H = p\dot x - L = \dfrac{p(p - a)}{m} - \dfrac{(p - a)^2}{2m} - \dfrac{a(p - a)}{m} + V = \dfrac{(p - a)^2}{2m} + V$. The term $a\dot x$ is a total derivative, so the motion is unchanged; only the meaning of $p$ shifts.`,
      trap: R`Writing $p^2/2m$ treats $p$ as $m\dot x$; here the canonical momentum differs from $m\dot x$ by $a$.` },
    { id: 'ham-r5-03', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'phase space',
      q: R`An oscillator with $H = \dfrac{p^2}{2m} + \tfrac12kq^2$, $m = 0.5$ kg and $k = 8$ N/m, has energy 4 J. Its phase-plane orbit crosses the $p$ axis at $p = \pm$ ______ kg m/s.`,
      answer: 2, tol: 0.02, calc: () => Math.sqrt(2 * 0.5 * 4), unit: 'kg m/s',
      sol: R`On the $p$ axis $q = 0$, so all the energy is kinetic: $p^2/2m = E$, $p = \sqrt{2mE} = \sqrt{2\times0.5\times4} = 2$ kg m/s. (It crosses the $q$ axis at $q = \pm\sqrt{2E/k} = \pm1$ m.)`,
      trap: R`Using $\sqrt{2E/k}$ gives the turning point on the $q$ axis, not the $p$ axis.` },
    { id: 'ham-r5-04', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'fixed points',
      q: R`A system has $H = \tfrac12(p^2 + q^2) + \epsilon p$ with $\epsilon$ a constant. Its only fixed point in the $(q, p)$ plane is at`,
      options: [R`$(0, \epsilon)$`, R`$(\epsilon, 0)$`, R`$(-\epsilon, 0)$`, R`$(0, -\epsilon)$`], answer: 3,
      sol: R`$\dot q = \partial H/\partial p = p + \epsilon$ and $\dot p = -\partial H/\partial q = -q$. Both vanish at $q = 0$, $p = -\epsilon$. Completing the square, $H = \tfrac12q^2 + \tfrac12(p + \epsilon)^2 - \tfrac12\epsilon^2$, so the orbits are circles about $(0, -\epsilon)$.`,
      trap: R`A sign slip in $\dot q = p + \epsilon = 0$ gives $(0, \epsilon)$.` },
    { id: 'ham-r5-05', type: 'msq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'phase portraits',
      q: R`For a particle with $H = \dfrac{p^2}{2m} + V(q)$, which statements about its phase portrait are true?`,
      options: [R`It is symmetric under reflection $p \to -p$`, R`Separatrices pass through points $(q_0, 0)$ where $V$ has a local maximum`, R`Two orbits may cross at a point where $\dot p \ne 0$`, R`On the upper half plane ($p > 0$) the motion is towards smaller $q$`], answer: [0, 1],
      sol: R`$H$ depends on $p$ only through $p^2$, so the level curves are symmetric in $p$. A local maximum of $V$ with $p = 0$ is a saddle (eigenvalues $\pm\sqrt{-V''/m}$), and the orbits with exactly its energy form the separatrix through it. Orbits of an autonomous system never cross except at fixed points, where both $\dot q$ and $\dot p$ vanish. With $p > 0$, $\dot q = p/m > 0$: the flow goes to larger $q$ (clockwise round a minimum).`,
      trap: R`Mixing up the sense of rotation: with $q$ across and $p$ up, motion round a potential minimum is clockwise.` },
    { id: 'ham-r5-06', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'time-dependent Hamiltonians', format: 'statements',
      q: R`A body whose mass is changed by an outside agent in a prescribed way has $H = \dfrac{p^2}{2m(t)} + V(q)$. Which statements are true?`,
      options: [R`$\dfrac{dH}{dt} = -\dfrac{\dot m}{m}\,\dfrac{p^2}{2m}$`, R`At each instant $H$ equals kinetic plus potential energy`, R`$H$ is conserved because it has no explicit $q$ dependence beyond $V$`, R`Liouville's theorem fails because $H$ depends on $t$`], answer: [0, 1],
      sol: R`Along a trajectory $dH/dt = \partial H/\partial t = -\dfrac{\dot m p^2}{2m^2}$, which is the first option. Since $p = m\dot q$, $H = \tfrac12m\dot q^2 + V$ at each instant, but it changes as $m$ changes. Liouville's theorem only needs Hamilton's equations, which hold for time-dependent $H$ too: the flow still preserves phase-space area.`,
      trap: R`Thinking Liouville's theorem needs energy conservation: it needs only Hamiltonian flow.` },
    { id: 'ham-r5-07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: "Hamilton's equations",
      q: R`A system has $H = \tfrac12q^2p^2$ with $q(0) = 1$ and $p(0) = 0.5$. The value of $q$ at $t = 2$ is ______.`,
      answer: 2.718, tol: 0.03, calc: () => Math.exp(1),
      sol: R`$\dot q = q^2p$ and $\dot p = -qp^2$. Then $\dfrac{d}{dt}(qp) = \dot qp + q\dot p = q^2p^2 - q^2p^2 = 0$, so $qp = c = 0.5$. Hence $\dot q = cq$ and $q = e^{ct} = e^{0.5\times2} = e = 2.718$.`,
      trap: R`Treating $p$ as constant: it falls as $q$ grows, keeping $qp$ fixed.` },
    { id: 'ham-r5-08', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Legendre transform',
      q: R`A system has $L = \tfrac12(\dot q_1 - \dot q_2)^2 - V(q_1, q_2)$. A student cannot write $H(q, p)$ in the usual way. Why?`,
      options: [R`$L$ depends on velocities only through squares`, R`The momenta obey $p_1 + p_2 = 0$, so the velocities cannot be solved for from the momenta`, R`$L$ has no explicit time dependence`, R`$V$ depends on two coordinates`], answer: 1,
      sol: R`$p_1 = \dot q_1 - \dot q_2$ and $p_2 = -(\dot q_1 - \dot q_2)$, so $p_1 + p_2 = 0$ whatever the motion: a constraint among the momenta. The matrix $\partial^2L/\partial\dot q_i\partial\dot q_j = \begin{pmatrix}1 & -1\\ -1 & 1\end{pmatrix}$ has zero determinant, so the map from velocities to momenta cannot be inverted and $\dot q_1 + \dot q_2$ is not fixed by $p$. Such singular Lagrangians need Dirac's constrained-Hamiltonian method.`,
      trap: R`Squares of velocities are normal; what matters is whether the kinetic matrix can be inverted.` },
    { id: 'ham-r5-09', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'virial theorem',
      q: R`A particle oscillates with $H = \dfrac{p^2}{2m} + \lambda q^4$ and energy 6 J. Using $\dfrac{d}{dt}(qp)$ averaged over a period, the time-averaged potential energy is ______ J.`,
      answer: 2, tol: 0.02, calc: () => 6 * 2 / (4 + 2), unit: 'J',
      sol: R`$\dfrac{d}{dt}(qp) = \dot qp + q\dot p = \dfrac{p^2}{m} - 4\lambda q^4 = 2T - 4V$. For bounded periodic motion the average of a time derivative of a bounded quantity is zero, so $\langle T\rangle = 2\langle V\rangle$. Then $E = \langle T\rangle + \langle V\rangle = 3\langle V\rangle$, giving $\langle V\rangle = 2$ J.`,
      trap: R`Splitting the energy equally (3 J) holds only for the quadratic potential.` },
    { id: 'ham-r5-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'constants of motion',
      q: R`A system has $H = p_1p_2 + q_1q_2$. Besides $H$, which quantity is conserved?`,
      options: [R`$p_1^2 + q_1^2$`, R`$q_1q_2$`, R`$p_1^2 + q_2^2$`, R`$p_1 + p_2$`], answer: 2,
      sol: R`Hamilton's equations: $\dot q_1 = p_2$, $\dot q_2 = p_1$, $\dot p_1 = -q_2$, $\dot p_2 = -q_1$. Then $\dfrac{d}{dt}(p_1^2 + q_2^2) = 2p_1(-q_2) + 2q_2p_1 = 0$. For the others: $\dfrac{d}{dt}(p_1^2 + q_1^2) = -2p_1q_2 + 2q_1p_2$, $\dfrac{d}{dt}(q_1q_2) = p_2q_2 + q_1p_1$ and $\dfrac{d}{dt}(p_1 + p_2) = -q_2 - q_1$, none zero in general. (Each coordinate obeys $\ddot q_i = -q_i$.)`,
      trap: R`Pairing each coordinate with its own momentum by habit: here $q_1$ moves with $p_2$ and $q_2$ with $p_1$.` },
  ],
  gens: [
    { id: 'ham-r5g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: "Hamilton's equations",
      make(r) {
        const q0 = pick(r, 0.5, 2, 0.5), p0 = pick(r, 0.2, 1, 0.1), t = pick(r, 0.5, 2, 0.5);
        const c = q0 * p0, answer = round(q0 * Math.exp(c * t), 3);
        return { q: R`A system has $H = \tfrac12q^2p^2$ with $q(0) = ${q0}$ and $p(0) = ${p0}$. Find $q$ at $t = ${t}$.`,
          answer, tol: Math.max(0.01, answer * 0.01), q0, p0, t,
          sol: R`$\dot q = q^2p$, $\dot p = -qp^2$, so $qp$ is constant $= ${round(c, 4)}$. Then $\dot q = ${round(c, 4)}q$ and $q = ${q0}e^{${round(c, 4)}\times${t}} = ${answer}$.`,
          trap: '$p$ is not constant; the product $qp$ is.' };
      },
      verify: (p) => p.q0 * Math.exp(p.q0 * p.p0 * p.t) },
    { id: 'ham-r5g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'virial theorem',
      make(r) {
        const n = choose(r, [1, 2, 4, 6]), E = int(r, 2, 20), answer = round(2 * E / (n + 2), 3);
        const V = n === 1 ? R`\lambda|q|` : n === 2 ? R`\lambda q^2` : R`\lambda q^{${n}}`;
        return { q: R`A particle oscillates with $H = \dfrac{p^2}{2m} + ${V}$ ($\lambda > 0$) and energy ${E} J. Find its time-averaged potential energy in J.`,
          answer, tol: Math.max(0.01, answer * 0.01), unit: 'J', n, E,
          sol: R`Averaging $\dfrac{d}{dt}(qp) = 2T - nV$ over a period gives $2\langle T\rangle = n\langle V\rangle$. With $E = \langle T\rangle + \langle V\rangle = (n/2 + 1)\langle V\rangle$: $\langle V\rangle = \dfrac{2E}{n + 2} = ${answer}$ J.`,
          trap: 'Equal sharing of energy holds only for $n = 2$.' };
      },
      verify: (p) => 2 * p.E / (p.n + 2) },
    { id: 'ham-r5g3', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Legendre transform',
      make(r) {
        const m = int(r, 2, 5), a = int(r, 1, 6), k = int(r, 2, 9);
        const H = (s, vs) => R`$H = \dfrac{(p ${s} ${a})^2}{${2 * m}} ${vs} \tfrac{${k}}{2}x^2$`;
        const right = H('-', '+'), wrongs = [H('+', '+'), R`$H = \dfrac{p^2}{${2 * m}} + \tfrac{${k}}{2}x^2$`, H('-', '-')];
        const o = mcqOptions(r, right, wrongs);
        return { q: R`A system has $L = \tfrac{${m}}{2}\dot x^2 + ${a}\dot x - \tfrac{${k}}{2}x^2$. Its Hamiltonian is`,
          ...o,
          sol: R`$p = ${m}\dot x + ${a}$, so $\dot x = (p - ${a})/${m}$ and $H = p\dot x - L = \dfrac{(p - ${a})^2}{${2 * m}} + \tfrac{${k}}{2}x^2$.`,
          trap: 'The canonical momentum includes the constant $a$; $H$ is not $p^2/2m + V$ here.' };
      } },
  ],
};
