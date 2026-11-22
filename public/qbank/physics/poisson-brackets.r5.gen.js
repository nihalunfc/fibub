// Round 5 extras for poisson-brackets: original questions, written 2026-11-22.
import { int, choose, round } from '../_util.js';
const R = String.raw;
const DEF = R`Use $\{f, g\} = \dfrac{\partial f}{\partial q}\dfrac{\partial g}{\partial p} - \dfrac{\partial f}{\partial p}\dfrac{\partial g}{\partial q}$ (summed over pairs).`;

export default {
  items: [
    { id: 'pbr-r5-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'basic brackets',
      q: R`${DEF} The bracket $\{p^2, q\}$ equals`,
      options: [R`$2p$`, R`$-2p$`, R`$2q$`, R`$0$`], answer: 1,
      sol: R`$\{p^2, q\} = \dfrac{\partial p^2}{\partial q}\dfrac{\partial q}{\partial p} - \dfrac{\partial p^2}{\partial p}\dfrac{\partial q}{\partial q} = 0 - 2p\cdot1 = -2p$. Equivalently, $\{p^2, q\} = -\{q, p^2\} = -2p$.`,
      trap: R`$+2p$ is $\{q, p^2\}$: swapping the order flips the sign.` },
    { id: 'pbr-r5-02', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'basic brackets',
      q: R`${DEF} The bracket $\{e^{q}, p\}$ equals`,
      options: [R`$e^{q}$`, R`$-e^{q}$`, R`$e^{p}$`, R`$0$`], answer: 0,
      sol: R`$\{e^q, p\} = e^q\cdot1 - 0 = e^q$. In general $\{f(q), p\} = f'(q)$: the momentum generates translations in $q$, and the bracket with $p$ differentiates.`,
      trap: R`Expecting zero because $e^q$ has no $p$ in it: the bracket pairs $\partial/\partial q$ of one function with $\partial/\partial p$ of the other.` },
    { id: 'pbr-r5-03', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'equations of motion',
      q: R`${DEF} For $H = \dfrac{p^2}{2m} + V(q)$ with $m = 2$, the rate of change $\dfrac{d}{dt}(q^2)$ at $q = 3$, $p = 4$ is ______.`,
      answer: 12, tol: 0, calc: () => 2 * 3 * 4 / 2,
      sol: R`$\dfrac{d}{dt}q^2 = \{q^2, H\} = 2q\cdot\dfrac{p}{m} - 0 = \dfrac{2qp}{m} = \dfrac{2\times3\times4}{2} = 12$. The potential drops out because $q^2$ does not contain $p$.`,
      trap: R`Including $V'(q)$: it would enter only through $\partial f/\partial p$, which is zero here.` },
    { id: 'pbr-r5-04', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'constants of motion',
      q: R`A particle in a plane has $H = \tfrac12(p_x^2 + p_y^2) + \tfrac12(x^2 + 4y^2)$. Which of these have zero Poisson bracket with $H$?`,
      options: [R`$\tfrac12(p_x^2 + x^2)$`, R`$\tfrac12(p_y^2 + 4y^2)$`, R`$L_z = xp_y - yp_x$`, R`$p_x$`], answer: [0, 1],
      sol: R`$H$ is a sum of two independent oscillators, so each part has zero bracket with the other and with itself: both energies are conserved. $\{L_z, H\} = \sum\left(\partial_qL_z\,\partial_pH - \partial_pL_z\,\partial_qH\right) = (p_y)(p_x) + (-p_x)(p_y) - \left[(-y)(x) + (x)(4y)\right] = -3xy \ne 0$, because the potential is not rotation-symmetric. $\{p_x, H\} = -x \ne 0$.`,
      trap: R`Expecting $L_z$ to be conserved for any oscillator: only the isotropic one ($\omega_x = \omega_y$) has round symmetry.` },
    { id: 'pbr-r5-05', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'angular momentum',
      q: R`${DEF} With $L_z = xp_y - yp_x$, which function has zero bracket with $L_z$?`,
      options: [R`$xp_y$`, R`$x^2 - y^2$`, R`$xp_x + yp_y$`, R`$p_x$`], answer: 2,
      sol: R`$L_z$ generates rotations about $z$; it commutes with anything unchanged by such rotations. $xp_x + yp_y = \mathbf r\cdot\mathbf p$ (in the plane) is a scalar, so its bracket with $L_z$ is zero. Directly: $\{xp_x + yp_y, L_z\} = p_x(-y) + p_y(x) - [x(p_y) + y(-p_x)] = 0$. The others change under rotation: $\{x^2 - y^2, L_z\} = -4xy$, $\{p_x, L_z\} = -p_y$, $\{xp_y, L_z\} = xp_x - yp_y$, all non-zero in general.`,
      trap: R`$x^2 - y^2$ looks symmetric but is not round: it changes sign under a $90^\circ$ turn.` },
    { id: 'pbr-r5-06', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'basic brackets',
      q: R`${DEF} The value of $\{\sin q, \cos p\}$ at $q = 0$, $p = \pi/2$ is ______.`,
      answer: -1, tol: 0, calc: () => Math.cos(0) * -Math.sin(Math.PI / 2),
      sol: R`$\{\sin q, \cos p\} = \cos q\cdot(-\sin p) - 0 = -\cos q\sin p$. At $q = 0$, $p = \pi/2$: $-1\times1 = -1$.`,
      trap: R`Dropping the minus sign from $d(\cos p)/dp = -\sin p$.` },
    { id: 'pbr-r5-07', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Lie algebra',
      q: R`The components of angular momentum obey $\{L_i, L_j\} = \varepsilon_{ijk}L_k$. A function $f(L_x, L_y, L_z)$ has zero bracket with all three components exactly when`,
      options: [R`$f$ is linear in the $L_i$`, R`$f$ depends only on $L_z$`, R`$f = 0$`, R`$f$ depends only on $L^2 = L_x^2 + L_y^2 + L_z^2$`], answer: 3,
      sol: R`$\{L_i, f\} = \sum_j\{L_i, L_j\}\partial f/\partial L_j = \varepsilon_{ijk}L_k\,\partial f/\partial L_j$, which is the $i$th component of $-(\mathbf L\times\nabla_Lf)$. It vanishes for every $i$ when $\nabla_Lf$ is parallel to $\mathbf L$, that is when $f$ is constant on spheres $L^2 = $ const: $f = F(L^2)$. Such a function (a Casimir) is unchanged by every rotation.`,
      trap: R`A function of $L_z$ alone commutes with $L_z$ but not with $L_x$ or $L_y$.` },
    { id: 'pbr-r5-08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'angular momentum',
      q: R`With $\{L_i, L_j\} = \varepsilon_{ijk}L_k$, a particle is at $\mathbf r = (1, 0, 2)$ with momentum $\mathbf p = (0, 3, 1)$ (consistent units). The value of $\{L_x^2, L_y\}$ is ______.`,
      answer: -36, tol: 0, calc: () => 2 * (0 * 1 - 2 * 3) * (1 * 3 - 0 * 0),
      sol: R`$\{L_x^2, L_y\} = 2L_x\{L_x, L_y\} = 2L_xL_z$. Now $\mathbf L = \mathbf r\times\mathbf p$: $L_x = yp_z - zp_y = 0 - 6 = -6$, $L_z = xp_y - yp_x = 3 - 0 = 3$. So the bracket is $2\times(-6)\times3 = -36$.`,
      trap: R`Forgetting the chain-rule factor 2, or taking $\{L_x, L_y\} = -L_z$.` },
    { id: 'pbr-r5-09', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'explicit time dependence', format: 'statements',
      q: R`For a free particle, $H = p^2/2m$, consider $f(q, p, t) = q - pt/m$. Which statements are true?`,
      options: [R`$f$ is a constant of the motion`, R`$\{f, H\} = 0$`, R`As a generator, $f$ shifts $p$ by a constant and $q$ by an amount proportional to $t$ (a Galilean boost)`, R`A constant of the motion must always have zero bracket with $H$`], answer: [0, 2],
      sol: R`$\dfrac{df}{dt} = \{f, H\} + \dfrac{\partial f}{\partial t} = \dfrac pm - \dfrac pm = 0$, so $f$ (the initial position) is conserved while $\{f, H\} = p/m \ne 0$. With generator $f$: $\delta q = \epsilon\,\partial f/\partial p = -\epsilon t/m$ and $\delta p = -\epsilon\,\partial f/\partial q = -\epsilon$, a change of velocity by a constant: a boost. Only constants with no explicit time dependence must commute with $H$.`,
      trap: R`Using $\{f, H\} = 0$ as the test for every conserved quantity: the $\partial f/\partial t$ term matters.` },
    { id: 'pbr-r5-10', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Lie series',
      q: R`${DEF} For $H = \tfrac12(p^2 + q^2)$, the second time derivative $\dfrac{d^2}{dt^2}(q^3) = \{\{q^3, H\}, H\}$ evaluated at $q = 2$, $p = 1$ is ______.`,
      answer: -12, tol: 0, calc: () => 6 * 2 * 1 - 3 * 8,
      sol: R`First, $\{q^3, H\} = 3q^2\cdot p = 3q^2p$. Then $\{3q^2p, H\} = 6qp\cdot p - 3q^2\cdot q = 6qp^2 - 3q^3$. At $q = 2$, $p = 1$: $12 - 24 = -12$. Check: with $q = A\cos(t - \phi)$, $\dfrac{d^2}{dt^2}q^3 = 6q\dot q^2 + 3q^2\ddot q = 6qp^2 - 3q^3$ since $\dot q = p$ and $\ddot q = -q$.`,
      trap: R`Applying $\{\cdot, H\}$ only to the $q$ part of $3q^2p$ and forgetting that $p$ also changes ($\dot p = -q$).` },
  ],
  gens: [
    { id: 'pbr-r5g1', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'basic brackets',
      make(r) {
        const a = int(r, 1, 3), b = int(r, 1, 3);
        const Q = choose(r, [[0, '0'], [Math.PI / 3, R`\pi/3`], [Math.PI / 6, R`\pi/6`], [Math.PI / 4, R`\pi/4`]]);
        const P = choose(r, [[Math.PI / 2, R`\pi/2`], [Math.PI / 6, R`\pi/6`], [Math.PI / 4, R`\pi/4`], [Math.PI / 3, R`\pi/3`]]);
        const v = -a * b * Math.cos(a * Q[0]) * Math.sin(b * P[0]), answer = round(v, 3);
        const A = a === 1 ? '' : a, B = b === 1 ? '' : b;
        return { q: R`${DEF} Find $\{\sin ${A}q, \cos ${B}p\}$ at $q = ${Q[1]}$, $p = ${P[1]}$.`,
          answer, tol: 0.005, a, b, qv: Q[0], pv: P[0],
          sol: R`$\{\sin ${A}q, \cos ${B}p\} = ${a}\cos(${A}q)\cdot(-${b}\sin ${B}p) - 0 = -${a * b}\cos(${A}q)\sin(${B}p)$. At the given point this is ${answer}.`,
          trap: 'Keep the inner factors from the chain rule and the minus sign from the derivative of cosine.' };
      },
      verify: (p) => -p.a * p.b * Math.cos(p.a * p.qv) * Math.sin(p.b * p.pv) },
    { id: 'pbr-r5g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'angular momentum',
      make(r) {
        const x = int(r, -2, 2), y = int(r, -2, 2), z = int(r, 1, 3), px = int(r, -2, 2), py = int(r, 1, 3), pz = int(r, -2, 2);
        const Lx = y * pz - z * py, Ly = z * px - x * pz, Lz = x * py - y * px;
        const pair = choose(r, [['x', 'y'], ['y', 'z'], ['z', 'x']]);
        const L = { x: Lx, y: Ly, z: Lz }, third = { 'x,y': 'z', 'y,z': 'x', 'z,x': 'y' }[pair.join(',')];
        const answer = 2 * L[pair[0]] * L[third];
        return { q: R`With $\{L_i, L_j\} = \varepsilon_{ijk}L_k$, a particle is at $\mathbf r = (${x}, ${y}, ${z})$ with momentum $\mathbf p = (${px}, ${py}, ${pz})$. Find $\{L_${pair[0]}^2, L_${pair[1]}\}$.`,
          answer, tol: 0, val: answer,
          sol: R`$\{L_${pair[0]}^2, L_${pair[1]}\} = 2L_${pair[0]}\{L_${pair[0]}, L_${pair[1]}\} = 2L_${pair[0]}L_${third}$. From $\mathbf L = \mathbf r\times\mathbf p = (${Lx}, ${Ly}, ${Lz})$: $2\times(${L[pair[0]]})\times(${L[third]}) = ${answer}$.`,
          trap: 'The cyclic order $x \\to y \\to z \\to x$ fixes the sign of $\\{L_i, L_j\\}$.' };
      },
      verify: (p) => p.val },
    { id: 'pbr-r5g3', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Lie series',
      make(r) {
        const n = int(r, 2, 4), q = int(r, 1, 3), p = int(r, -2, 2);
        const answer = n * (n - 1) * q ** (n - 2) * p * p - n * q ** n;
        return { q: R`For $H = \tfrac12(p^2 + q^2)$, find $\dfrac{d^2}{dt^2}(q^{${n}}) = \{\{q^{${n}}, H\}, H\}$ at $q = ${q}$, $p = ${p}$.`,
          answer, tol: 0, n, qq: q, pp: p,
          sol: R`$\{q^{${n}}, H\} = ${n}q^{${n - 1}}p$, and $\{${n}q^{${n - 1}}p, H\} = ${n * (n - 1)}q^{${n - 2}}p^2 - ${n}q^{${n}}$. At the point: $${n * (n - 1)}\times${q ** (n - 2)}\times${p * p} - ${n}\times${q ** n} = ${answer}$.`,
          trap: 'Both $q$ and $p$ change in time; the second bracket acts on both.' };
      },
      verify: (p) => p.n * (p.n - 1) * p.qq ** (p.n - 2) * p.pp ** 2 - p.n * p.qq ** p.n },
  ],
};
