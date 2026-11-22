// Round 4 extras for poisson-brackets: original questions, written 2026-11-22.
import { int, choose, mcqOptions } from '../_util.js';
const R = String.raw;
const DEF = R`Use $\{f, g\} = \sum_i\left(\dfrac{\partial f}{\partial q_i}\dfrac{\partial g}{\partial p_i} - \dfrac{\partial f}{\partial p_i}\dfrac{\partial g}{\partial q_i}\right)$.`;

export default {
  items: [
    { id: 'pbr-r4-01', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'bracket algebra',
      q: R`${DEF} The bracket $\{q, \sin p\}$ equals`,
      options: [R`$\cos p$`, R`$-\cos p$`, R`$\sin q$`, R`$0$`], answer: 0,
      sol: R`$\dfrac{\partial q}{\partial q}\dfrac{\partial(\sin p)}{\partial p} - \dfrac{\partial q}{\partial p}\dfrac{\partial(\sin p)}{\partial q} = 1\times\cos p - 0 = \cos p$. In general $\{q, f(p)\} = f'(p)$: the bracket with $q$ acts as $\partial/\partial p$.`,
      trap: R`With this sign convention $\{q, \cdot\}$ differentiates with respect to $p$ with a plus sign; $\{p, \cdot\}$ gives $-\partial/\partial q$.` },
    { id: 'pbr-r4-02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'bracket algebra',
      q: R`${DEF} The value of $\{q^2p, qp^2\}$ at $q = 1$, $p = 2$ is ______.`,
      answer: 12, tol: 0, calc: () => 3 * 1 * 4,
      sol: R`$f = q^2p$: $f_q = 2qp$, $f_p = q^2$. $g = qp^2$: $g_q = p^2$, $g_p = 2qp$. $\{f, g\} = (2qp)(2qp) - (q^2)(p^2) = 3q^2p^2$. At $q = 1$, $p = 2$: $3\times1\times4 = 12$.`,
      trap: R`Taking the cross products in the wrong order gives $-12$; the first factor's $q$-derivative goes with the second factor's $p$-derivative.` },
    { id: 'pbr-r4-03', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'bracket algebra', format: 'statements',
      q: R`${DEF} For one degree of freedom and any Hamiltonian $H(q, p)$, which brackets are zero for all $q$ and $p$?`,
      options: [R`$\{q^2, q^5\}$`, R`$\{H, H^3\}$`, R`$\{q, p\}$`, R`$\{qp, q/p\}$`], answer: [0, 1],
      sol: R`Functions of $q$ alone have no $p$-derivatives, so $\{q^2, q^5\} = 0$. By the chain rule $\{H, H^3\} = 3H^2\{H, H\} = 0$; any two functions of the same function commute. $\{q, p\} = 1$. For $f = qp$, $g = q/p$: $f_qg_p - f_pg_q = p\left(-\dfrac{q}{p^2}\right) - q\cdot\dfrac1p = -\dfrac{2q}{p}$, not zero.`,
      trap: R`$qp$ and $q/p$ are built from the same two variables, but that does not make them commute.` },
    { id: 'pbr-r4-04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'bracket algebra',
      q: R`${DEF} For a particle in the plane, the value of $\{xp_y, yp_x\}$ at $(x, y) = (2, 1)$, $(p_x, p_y) = (3, 4)$ is ______.`,
      answer: -2, tol: 0, calc: () => 1 * 4 - 2 * 3,
      sol: R`$f = xp_y$, $g = yp_x$. The $x$ pair: $\dfrac{\partial f}{\partial x}\dfrac{\partial g}{\partial p_x} - \dfrac{\partial f}{\partial p_x}\dfrac{\partial g}{\partial x} = p_y\cdot y - 0 = yp_y$. The $y$ pair: $\dfrac{\partial f}{\partial y}\dfrac{\partial g}{\partial p_y} - \dfrac{\partial f}{\partial p_y}\dfrac{\partial g}{\partial y} = 0 - x\cdot p_x$. So $\{f, g\} = yp_y - xp_x = 4 - 6 = -2$.`,
      trap: R`Each coordinate pair contributes separately; mixing $x$ with $p_y$ in one term is the usual slip.` },
    { id: 'pbr-r4-05', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'canonical transformations',
      q: R`One step of the explicit Euler method for the oscillator $H = \tfrac12(p^2 + q^2)$ with time step $\epsilon$ maps $(q, p) \to (Q, P) = (q + \epsilon p,\ p - \epsilon q)$. Which statement is correct?`,
      options: [R`It is canonical for every $\epsilon$, since it comes from Hamilton's equations`, R`It is canonical exactly whenever $\epsilon < 1$`, R`It is canonical only for $\epsilon = 1$`, R`It is not canonical for any $\epsilon \ne 0$: $\{Q, P\} = 1 + \epsilon^2$, so every step multiplies phase-space area by $1 + \epsilon^2$`], answer: 3,
      sol: R`$\{Q, P\} = Q_qP_p - Q_pP_q = (1)(1) - (\epsilon)(-\epsilon) = 1 + \epsilon^2$. The Jacobian determinant is also $1 + \epsilon^2 > 1$, so areas grow and the numerical orbit spirals outwards: the energy $\tfrac12(Q^2 + P^2) = (1 + \epsilon^2)\tfrac12(q^2 + p^2)$ rises every step. The exact flow is canonical, but this map agrees with it only to first order in $\epsilon$. (Symplectic methods, such as updating $p$ first and then using the new $p$ to update $q$, keep $\{Q, P\} = 1$ exactly.)`,
      trap: R`Being built from Hamilton's equations does not make an approximate step canonical; the error shows up at order $\epsilon^2$.` },
    { id: 'pbr-r4-06', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'generating functions',
      q: R`For a time-independent generating function of type 4, $F_4(p, P)$ (obtained from $F_1(q, Q)$ by adding $QP - qp$), the transformation equations are`,
      options: [R`$q = \partial F_4/\partial p$, $Q = -\partial F_4/\partial P$`, R`$q = \partial F_4/\partial p$, $Q = \partial F_4/\partial P$`, R`$q = -\partial F_4/\partial p$, $Q = \partial F_4/\partial P$`, R`$q = -\partial F_4/\partial p$, $Q = -\partial F_4/\partial P$`], answer: 2,
      sol: R`Type 1 satisfies $p\,dq - P\,dQ = dF_1$. With $F_4 = F_1 + QP - qp$: $dF_4 = p\,dq - P\,dQ + Q\,dP + P\,dQ - q\,dp - p\,dq = -q\,dp + Q\,dP$. Reading off the coefficients: $q = -\partial F_4/\partial p$ and $Q = \partial F_4/\partial P$. Example: $F_4 = -pP$ gives $q = P$, $Q = -p$, a swap of coordinate and momentum with a sign, which is canonical.`,
      trap: R`The signs follow from $dF$; memorising "minus for the old variable" works for types 3 and 4 only because both have $q = -\partial F/\partial p$.` },
    { id: 'pbr-r4-07', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'generators', format: 'statements',
      q: R`A function $G$ generates the infinitesimal canonical transformation $\delta q_i = \epsilon\,\partial G/\partial p_i$, $\delta p_i = -\epsilon\,\partial G/\partial q_i$. For a particle in three dimensions, which statements are correct?`,
      options: [R`$G = p_z$ shifts every point by $\epsilon$ along $z$ and leaves the momenta unchanged`, R`$G = L_z = xp_y - yp_x$ rotates positions and momenta by the angle $\epsilon$ about $z$`, R`$G = \mathbf r\cdot\mathbf p$ stretches positions by $1 + \epsilon$ and shrinks momenta by $1 - \epsilon$`, R`$G = p_x^2$ shifts every point by the same distance along $x$`], answer: [0, 1, 2],
      sol: R`$p_z$: $\delta z = \epsilon$, all else zero, a translation. $L_z$: $\delta x = -\epsilon y$, $\delta y = \epsilon x$, $\delta p_x = -\epsilon p_y$, $\delta p_y = \epsilon p_x$, a rotation of both vectors. $\mathbf r\cdot\mathbf p$: $\delta\mathbf r = \epsilon\mathbf r$, $\delta\mathbf p = -\epsilon\mathbf p$, a dilation that keeps each $q_ip_i$ fixed. $p_x^2$: $\delta x = 2\epsilon p_x$, a shift that depends on the momentum (this is how free motion moves points), not a uniform translation.`,
      trap: R`Any function of $p_x$ alone moves $x$, but only $p_x$ itself moves every point by the same amount.` },
    { id: 'pbr-r4-08', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'constants of motion', format: 'statements',
      q: R`A particle moves in a uniform force field with $H = \dfrac{p^2}{2m} - Fq$. Using $\dfrac{df}{dt} = \{f, H\} + \dfrac{\partial f}{\partial t}$, which quantities are constants of the motion?`,
      options: [R`$mq - pt$`, R`$mq - pt + \tfrac12Ft^2$`, R`$p - Ft$`, R`$H$`], answer: [1, 2, 3],
      sol: R`$\{q, H\} = p/m$ and $\{p, H\} = F$. For $mq - pt$: $\{\cdot, H\} = p - Ft$ and $\partial/\partial t = -p$, total $-Ft \ne 0$. Adding $\tfrac12Ft^2$ adds $Ft$ to the time derivative, so $mq - pt + \tfrac12Ft^2$ is conserved (it equals $mq(0)$). $p - Ft$: $F - F = 0$, conserved (it is $p(0)$). $H$ has no explicit $t$, so $\{H, H\} = 0$: conserved. A conserved quantity may depend on $t$ explicitly.`,
      trap: R`$mq - pt$ is the conserved boost for a free particle; the force adds the $\tfrac12Ft^2$ term.` },
    { id: 'pbr-r4-09', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'angular momentum',
      q: R`With $\{L_i, L_j\} = \varepsilon_{ijk}L_k$, the value of $\{L_xL_y, L_z\}$ at a point where $\mathbf L = (1, 2, 3)$ is ______.`,
      answer: -3, tol: 0, calc: () => 1 * 1 - 2 * 2,
      sol: R`Product rule: $\{L_xL_y, L_z\} = L_x\{L_y, L_z\} + L_y\{L_x, L_z\} = L_x\cdot L_x + L_y\cdot(-L_y) = L_x^2 - L_y^2$. At $\mathbf L = (1, 2, 3)$: $1 - 4 = -3$.`,
      trap: R`$\{L_x, L_z\} = -L_y$ (anticyclic order); taking it as $+L_y$ gives $+5$.` },
    { id: 'pbr-r4-10', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'canonical transformations',
      q: R`The change of variables $Q = 2q$, $P = p$ is applied. For any two functions $f$ and $g$, the bracket computed in the old variables, $\{f, g\}_{q, p}$, equals`,
      options: [R`$2\{f, g\}_{Q, P}$`, R`$\tfrac12\{f, g\}_{Q, P}$`, R`$\{f, g\}_{Q, P}$`, R`$4\{f, g\}_{Q, P}$`], answer: 0,
      sol: R`$\partial/\partial q = 2\,\partial/\partial Q$ and $\partial/\partial p = \partial/\partial P$. So $f_qg_p - f_pg_q = 2f_Qg_P - f_P\cdot2g_Q = 2\{f, g\}_{Q, P}$. In particular $\{Q, P\}_{q, p} = 2$: the map is not canonical. It still keeps Hamilton's form if the new Hamiltonian is $K = 2H$ (check: $\dot Q = 2\dot q = 2\partial H/\partial P$), a scale transformation.`,
      trap: R`Brackets are unchanged only by canonical transformations; a stretch of one variable rescales them.` },
    { id: 'pbr-r4-11', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'canonical transformations',
      q: R`For $q > 0$ the new coordinate is $Q = q^2$. Which new momentum makes $(Q, P)$ canonical?`,
      options: [R`$P = 2qp$`, R`$P = \dfrac{p}{2q}$`, R`$P = \dfrac{p}{q^2}$`, R`$P = pq^2$`], answer: 1,
      sol: R`Need $\{Q, P\} = Q_qP_p - Q_pP_q = 2q\,P_p = 1$, so $P_p = 1/2q$ and $P = \dfrac{p}{2q}$ (plus any function of $q$). This is the general rule for a point transformation: $P = p/(dQ/dq)$, so that $P\,dQ = p\,dq$. Check another way: $\{Q, 2qp\} = 2q\cdot2q = 4q^2 \ne 1$.`,
      trap: R`Velocities transform with $dQ/dq$, momenta with its inverse.` },
    { id: 'pbr-r4-12', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: "Poisson's theorem",
      q: R`Two functions $f(q, p, t)$ and $g(q, p, t)$, both depending on time explicitly, are constants of the motion ($df/dt = dg/dt = 0$). Then their bracket $\{f, g\}$`,
      options: [R`is conserved only if neither depends on $t$ explicitly`, R`is always zero`, R`is also a constant of the motion`, R`equals $\partial f/\partial t - \partial g/\partial t$`], answer: 2,
      sol: R`$\dfrac{d}{dt}\{f, g\} = \{\{f, g\}, H\} + \dfrac{\partial}{\partial t}\{f, g\}$. The Jacobi identity gives $\{\{f, g\}, H\} = \{\{f, H\}, g\} + \{f, \{g, H\}\}$, and $\partial_t\{f, g\} = \{\partial_tf, g\} + \{f, \partial_tg\}$. Together: $\{df/dt, g\} + \{f, dg/dt\} = 0$. Example: for a free particle, $mq - pt$ and $p$ are conserved, and their bracket is the constant $m$.`,
      trap: R`Poisson's theorem needs only that $f$ and $g$ are conserved, not that they are time-independent.` },
  ],
  gens: [
    { id: 'pbr-r4g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'bracket algebra',
      make(r) {
        const a = int(r, 0, 3), b = int(r, 1, 3), c = int(r, 1, 3), d = int(r, 0, 2), q = int(r, 1, 3), p = int(r, 1, 3);
        const mono = (m, n) => `${m === 0 ? '' : m === 1 ? 'q' : `q^{${m}}`}${n === 0 ? '' : n === 1 ? 'p' : `p^{${n}}`}` || '1';
        const k = a * d - b * c, answer = k * q ** (a + c - 1) * p ** (b + d - 1);
        return { q: R`${DEF} Find $\{${mono(a, b)}, ${mono(c, d)}\}$ at $q = ${q}$, $p = ${p}$.`,
          answer, tol: 0, a, b, c, d, qv: q, pv: p,
          sol: R`For monomials, $\{q^ap^b, q^cp^d\} = (aq^{a-1}p^b)(dq^cp^{d-1}) - (bq^ap^{b-1})(cq^{c-1}p^d) = (ad - bc)\,q^{a+c-1}p^{b+d-1}$. Here $ad - bc = ${a}\times${d} - ${b}\times${c} = ${k}$, so the bracket is $${k}\,q^{${a + c - 1}}p^{${b + d - 1}} = ${answer}$ at $q = ${q}$, $p = ${p}$.`,
          trap: 'The sign comes from $ad - bc$: the first function\'s $q$-power times the second\'s $p$-power comes first.' };
      },
      verify: (p) => (p.a * p.d - p.b * p.c) * p.qv ** (p.a + p.c - 1) * p.pv ** (p.b + p.d - 1) },
    { id: 'pbr-r4g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'angular momentum',
      make(r) {
        const names = ['x', 'y', 'z'];
        const eps = (i, j, k) => (i === j || j === k || i === k ? 0 : ((j - i + 3) % 3 === 1 ? 1 : -1));
        const L = [int(r, -3, 3), int(r, -3, 3), int(r, 1, 3)];
        const br = (i, j) => [0, 1, 2].reduce((s, k) => s + eps(i, j, k) * L[k], 0);
        const a = int(r, 0, 2), b = (a + int(r, 1, 2)) % 3, c = choose(r, [0, 1, 2]);
        const answer = L[a] * br(b, c) + L[b] * br(a, c);
        return { q: R`With $\{L_i, L_j\} = \varepsilon_{ijk}L_k$, find $\{L_${names[a]}L_${names[b]}, L_${names[c]}\}$ at a point where $\mathbf L = (${L.join(', ')})$.`,
          answer, tol: 0, L, a, b, c,
          sol: R`Product rule: $\{L_${names[a]}L_${names[b]}, L_${names[c]}\} = L_${names[a]}\{L_${names[b]}, L_${names[c]}\} + L_${names[b]}\{L_${names[a]}, L_${names[c]}\}$. Here $\{L_${names[b]}, L_${names[c]}\} = ${br(b, c)}$ and $\{L_${names[a]}, L_${names[c]}\} = ${br(a, c)}$ at this point, so the result is $${L[a]}\times(${br(b, c)}) + ${L[b]}\times(${br(a, c)}) = ${answer}$.`,
          trap: 'Cyclic order $(x, y, z)$ gives $+$, anticyclic gives $-$, and a component commutes with itself.' };
      },
      verify: (p) => { const e = (i, j, k) => (i === j || j === k || i === k ? 0 : ((j - i + 3) % 3 === 1 ? 1 : -1)); const br = (i, j) => [0, 1, 2].reduce((s, k) => s + e(i, j, k) * p.L[k], 0); return p.L[p.a] * br(p.b, p.c) + p.L[p.b] * br(p.a, p.c); } },
    { id: 'pbr-r4g3', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'canonical transformations',
      make(r) {
        const n = int(r, 2, 4);
        const [Q, dQ, right, wrongs] = choose(r, [
          [`q^{${n}}`, `${n}q^{${n - 1}}`, `\\dfrac{p}{${n}q^{${n - 1}}}`, [`${n}q^{${n - 1}}p`, `\\dfrac{p}{q^{${n}}}`, `pq^{${n}}`]],
          ['e^{q}', 'e^{q}', 'pe^{-q}', ['pe^{q}', 'p\\ln q', 'qe^{-p}']],
          ['\\ln q', '1/q', 'qp', ['\\dfrac pq', 'p\\ln q', 'pe^{q}']],
          ['\\sqrt q', '\\dfrac{1}{2\\sqrt q}', '2p\\sqrt q', ['\\dfrac{p}{2\\sqrt q}', 'p\\sqrt q', 'p^2\\sqrt q']]]);
        const o = mcqOptions(r, right, wrongs, (v) => `$P = ${v}$`);
        return { q: R`For $q > 0$ the new coordinate is $Q = ${Q}$. Which new momentum makes $(Q, P)$ canonical?`, ...o,
          sol: R`A point transformation $Q = Q(q)$ is canonical when $P = p/(dQ/dq)$ (plus any function of $q$), because then $\{Q, P\} = \dfrac{dQ}{dq}\dfrac{\partial P}{\partial p} = 1$. Here $dQ/dq = ${dQ}$, so $P = ${right}$.`,
          trap: 'Momenta transform with the inverse of $dQ/dq$, not with $dQ/dq$ itself.' };
      } },
  ],
};
