// Extra question shapes for poisson-brackets (templates pbr-m31..m35). Imported by poisson-brackets.js.
import { int, choose, mcqOptions, shuffle } from '../_util.js';
import { msqOf } from './_more.js';
import { matchOne } from './_odd.js';

const PB = 'With $\\{f, g\\} = \\sum_i\\left(\\dfrac{\\partial f}{\\partial q_i}\\dfrac{\\partial g}{\\partial p_i} - \\dfrac{\\partial f}{\\partial p_i}\\dfrac{\\partial g}{\\partial q_i}\\right)$,';

export default [
  { id: 'pbr-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'computing brackets', format: 'statements',
    make(r) {
      const m = int(r, 2, 4), n = int(r, 2, 4), not = r() < 0.5;
      const s = msqOf(r, [
        [`$\\{q^{${m}}, p\\} = ${m}q^{${m - 1 === 1 ? '' : m - 1}}$`.replace('q^{}', 'q'), true, `$\\partial_q(q^{${m}})\\cdot1 - 0 = ${m}q^{${m - 1}}$.`],
        [`$\\{q, p^{${n}}\\} = ${n}p^{${n - 1 === 1 ? '' : n - 1}}$`.replace('p^{}', 'p'), true, `$1\\cdot\\partial_p(p^{${n}}) = ${n}p^{${n - 1}}$.`],
        ['$\\{qp, q\\} = -q$', true, '$\\partial_q(qp)\\partial_pq - \\partial_p(qp)\\partial_qq = 0 - q$.'],
        ['$\\{qp, p\\} = p$', true, '$\\partial_q(qp)\\cdot1 - 0 = p$.'],
        [`$\\{q^2, p^2\\} = 4qp$`, true, '$2q\\cdot2p - 0$.'],
        ['$\\{f, g\\} = \\{g, f\\}$ for all $f, g$', false, 'The bracket is antisymmetric: $\\{f, g\\} = -\\{g, f\\}$.'],
        ['$\\{L_x, L_y\\} = L_z$', true, 'The angular momentum algebra $\\{L_i, L_j\\} = \\varepsilon_{ijk}L_k$.'],
        ['$\\{L_z, x\\} = y$', true, `$L_z = xp_y - yp_x$, so $\\{L_z, x\\} = -\\partial L_z/\\partial p_x = y$.`],
        ['$\\{L_z, y\\} = x$', false, '$\\{L_z, y\\} = -\\partial L_z/\\partial p_y = -x$.'],
        [`$\\{q^{${m}}, p\\} = q^{${m}}$`, false, `The bracket differentiates: $${m}q^{${m - 1}}$.`],
      ], { not });
      return { q: `${PB} which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...s,
        trap: 'Watch the order: $\\{f, g\\}$ has $\\partial f/\\partial q$ first; swapping the arguments flips the sign.' };
    } },
  { id: 'pbr-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'canonical transformations',
    make(r) {
      const lam = int(r, 2, 5), n = int(r, 2, 4);
      const C = choose(r, [
        [`$Q = ${lam}q$`, `$P = p/${lam}$`, [`$P = ${lam}p$`, `$P = p$`, `$P = -p/${lam}$`, `$P = p/${lam * lam}$`], `$\\{Q, P\\} = ${lam}\\cdot\\tfrac{1}{${lam}} = 1$. Stretching $q$ must be compensated by shrinking $p$ (phase-space area is kept).`],
        [`$Q = q^{${n}}$`, `$P = \\dfrac{p}{${n}q^{${n - 1}}}$`, [`$P = ${n}q^{${n - 1}}p$`, `$P = p/q^{${n}}$`, `$P = pq^{${n}}$`, `$P = \\dfrac{p}{q^{${n - 1}}}$`], `$\\{Q, P\\} = \\partial_qQ\\,\\partial_pP - \\partial_pQ\\,\\partial_qP = ${n}q^{${n - 1}}\\cdot\\dfrac{1}{${n}q^{${n - 1}}} - 0 = 1$. For a point transformation $Q = f(q)$, always $P = p/f'(q)$.`],
        ['$Q = \\ln q$', '$P = qp$', ['$P = p/q$', '$P = p\\ln q$', '$P = e^{p}$', '$P = -qp$'], '$\\{Q, P\\} = \\tfrac1q\\cdot q = 1$ (again $P = p/f\'(q)$ with $f\' = 1/q$).'],
        [`$Q = e^{${lam}q}$`, `$P = \\dfrac{p}{${lam}}e^{-${lam}q}$`, [`$P = pe^{-${lam}q}$`, `$P = ${lam}pe^{${lam}q}$`, `$P = pe^{${lam}q}$`, `$P = \\dfrac{p}{${lam}}e^{${lam}q}$`], `$\\{Q, P\\} = ${lam}e^{${lam}q}\\cdot\\dfrac{e^{-${lam}q}}{${lam}} = 1$.`],
        ['$Q = p$', '$P = -q$', ['$P = q$', '$P = p$', '$P = -p$', '$P = 1/q$'], '$\\{Q, P\\} = \\partial_qp\\,\\partial_p(-q) - \\partial_pp\\,\\partial_q(-q) = 0 - (1)(-1) = 1$. Exchanging coordinate and momentum needs a sign.'],
      ]);
      const o = mcqOptions(r, C[1], shuffle(r, C[2]));
      return { q: `For one degree of freedom, the new coordinate is ${C[0]}. Which new momentum makes the transformation canonical?`, ...o, sol: `A transformation is canonical when $\\{Q, P\\}_{q,p} = 1$. ${C[3]}`,
        trap: 'Check $\\{Q, P\\} = 1$ directly; for $Q = f(q)$ the partner is $P = p/f\'(q)$.' };
    } },
  { id: 'pbr-m33', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'virial theorem',
    make(r) {
      const n = choose(r, [-1, 1, 2, 4, 6]);
      const vals = { '-1': '-\\tfrac12', 1: '\\tfrac12', 2: '1', 4: '2', 6: '3' };
      const ans = `$\\langle T\\rangle = ${vals[n]}\\langle V\\rangle$`;
      const ws = ['-\\tfrac12', '\\tfrac12', '1', '2', '3', '-2'].filter((v) => v !== vals[n]).map((v) => `$\\langle T\\rangle = ${v}\\langle V\\rangle$`);
      const o = mcqOptions(r, ans, shuffle(r, ws));
      const V = n === -1 ? '-\\dfrac{k}{|q|}' : `k|q|^{${n}}`;
      return { q: `For $H = \\dfrac{p^2}{2m} + V(q)$ with $V = ${V}$ ($k \\gt 0$), the bracket $\\{qp, H\\}$ has zero time average over a bounded motion. This gives`, ...o,
        sol: `$\\dfrac{d}{dt}(qp) = \\{qp, H\\} = \\dfrac{p^2}{m} - qV'(q) = 2T - qV'$. For $V \\propto |q|^{${n}}$, $qV' = ${n}V$. The time average of a derivative of a bounded quantity vanishes, so $2\\langle T\\rangle = ${n}\\langle V\\rangle$, i.e. $\\langle T\\rangle = ${vals[n]}\\langle V\\rangle$.${n === -1 ? ' For the Kepler-like potential $V \\lt 0$, so $T = -V/2 \\gt 0$ and $E = V/2 \\lt 0$.' : ''}`,
        trap: 'The virial gives $2\\langle T\\rangle = n\\langle V\\rangle$ for $V \\propto r^n$; for the oscillator ($n = 2$) the averages are equal.' };
    } },
  { id: 'pbr-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'angular momentum brackets',
    make(r) {
      const C = choose(r, [
        ['\\{L_y, L_z\\}', 'L_x', 'Cyclic order $x \\to y \\to z$: $\\{L_y, L_z\\} = L_x$.'],
        ['\\{L_z, L_x\\}', 'L_y', 'Cyclic order: $\\{L_z, L_x\\} = L_y$.'],
        ['\\{L_x, L_y^2\\}', '2L_yL_z', '$\\{L_x, L_y^2\\} = 2L_y\\{L_x, L_y\\} = 2L_yL_z$.'],
        ['\\{L_x, L_z^2\\}', '-2L_yL_z', '$\\{L_x, L_z^2\\} = 2L_z\\{L_x, L_z\\} = 2L_z(-L_y)$.'],
        ['\\{L_z, L^2\\}', '0', '$L^2$ is a scalar under rotations, so it has zero bracket with every $L_i$.'],
        ['\\{L_z, p_x\\}', 'p_y', '$\\{L_z, p_x\\} = \\partial L_z/\\partial x = p_y$.'],
        ['\\{L_z, p_y\\}', '-p_x', '$\\{L_z, p_y\\} = \\partial L_z/\\partial y = -p_x$.'],
        ['\\{L_z, x^2 + y^2\\}', '0', 'The distance from the $z$-axis does not change under rotations about $z$.'],
      ]);
      const pool = ['L_x', 'L_y', '-L_x', '-L_y', '2L_yL_z', '-2L_yL_z', '0', 'p_y', '-p_x', 'p_x', '-p_y', 'L_z'];
      const o = mcqOptions(r, `$${C[1]}$`, shuffle(r, pool.filter((x) => x !== C[1]).map((x) => `$${x}$`)));
      return { q: `With $\\vec L = \\vec r\\times\\vec p$ and the canonical Poisson bracket, $${C[0]}$ equals`, ...o, sol: `${C[2]} (Recall $L_z = xp_y - yp_x$ and $\\{L_i, L_j\\} = \\varepsilon_{ijk}L_k$.)`,
        trap: 'Use the Leibniz rule $\\{A, BC\\} = B\\{A, C\\} + \\{A, B\\}C$ and keep the cyclic signs straight.' };
    } },
  { id: 'pbr-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'generating functions', format: 'match',
    make(r) {
      const lam = int(r, 2, 5), e = int(r, 1, 4), a = int(r, 1, 3);
      const L = {
        id: '$Q = q,\\ P = p$ (identity)',
        sc: `$Q = ${lam}q,\\ P = p/${lam}$`,
        sh: `$Q = q + ${e},\\ P = p$`,
        ex: '$Q = p,\\ P = -q$',
        gp: `$Q = q,\\ P = p - ${2 * a}q$`,
      };
      const cas = choose(r, [
        ['F_2(q, P) = qP', 'id', '$p = \\partial F_2/\\partial q = P$ and $Q = \\partial F_2/\\partial P = q$.'],
        [`F_2(q, P) = ${lam}qP`, 'sc', `$p = ${lam}P$ and $Q = ${lam}q$.`],
        [`F_2(q, P) = (q + ${e})P`, 'sh', `$p = P$ and $Q = q + ${e}$: a translation.`],
        ['F_1(q, Q) = qQ', 'ex', '$p = \\partial F_1/\\partial q = Q$ and $P = -\\partial F_1/\\partial Q = -q$.'],
        [`F_2(q, P) = qP + ${a === 1 ? '' : a}q^2`, 'gp', `$p = P + ${2 * a}q$ and $Q = q$: a shift of momentum by a gradient (like a gauge change).`],
      ]);
      return { q: `Which canonical transformation does the generating function $${cas[0]}$ produce? (Type 1: $p = \\partial F_1/\\partial q$, $P = -\\partial F_1/\\partial Q$; type 2: $p = \\partial F_2/\\partial q$, $Q = \\partial F_2/\\partial P$.)`, ...matchOne(r, L, cas),
        trap: 'Apply the right pair of rules for the type of generating function, and mind the minus sign in $P = -\\partial F_1/\\partial Q$.' };
    } },
];
