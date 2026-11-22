// Extra question shapes for matrices-eigenvalues (templates mev-m31..m35). Imported by matrices-eigenvalues.js.
import { int, choose, mcqOptions, shuffle } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, matchOne } from './_odd.js';

export default [
  { id: 'mev-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'real symmetric matrices', format: 'statements',
    make(r) {
      const a = int(r, -3, 4), d = int(r, -3, 4), b = int(r, 1, 3), not = r() < 0.5;
      const T = a + d, D = a * d - b * b, pd = a > 0 && D > 0;
      const m = msqOf(r, [
        ['both eigenvalues are real', true, 'The matrix is real and symmetric (Hermitian), so its eigenvalues are real; here the discriminant $T^2 - 4D = (a - d)^2 + 4b^2 > 0$.'],
        [`the sum of the eigenvalues is ${T}`, true, `The sum is the trace, $${a} + ${d < 0 ? `(${d})` : d} = ${T}$.`],
        [`the product of the eigenvalues is ${a * d}`, false, `The product is the determinant, $${a}\\cdot${d < 0 ? `(${d})` : d} - ${b * b} = ${D}$, not just the product of the diagonal entries.`],
        [`the eigenvalues are ${a} and ${d}`, false, `That would need $b = 0$; with $b = ${b}$ the eigenvalues are $\\tfrac12\\left(${T} \\pm \\sqrt{${(a - d) ** 2 + 4 * b * b}}\\right)$.`],
        [`the larger eigenvalue is bigger than ${Math.max(a, d)}`, true, `$\\lambda_+ = \\tfrac{a + d}{2} + \\sqrt{\\tfrac{(a - d)^2}{4} + b^2} \\gt \\tfrac{a + d}{2} + \\tfrac{|a - d|}{2} = \\max(a, d)$ because $b \\ne 0$ (off-diagonal coupling pushes the levels apart).`],
        ['the matrix is positive definite', pd, pd ? `$a = ${a} \\gt 0$ and $\\det = ${D} \\gt 0$, so both eigenvalues are positive.` : `Positive definite needs $a \\gt 0$ and $\\det \\gt 0$; here $a = ${a}$ and $\\det = ${D}$.`],
        ['the matrix is invertible', D !== 0, D !== 0 ? `$\\det = ${D} \\ne 0$.` : 'Its determinant is zero.'],
        [`$\\text{tr}(A^2) = ${a * a + d * d + 2 * b * b}$`, true, `$\\text{tr}(A^2) = a^2 + d^2 + 2b^2 = \\lambda_1^2 + \\lambda_2^2$.`],
        ['eigenvectors belonging to its two eigenvalues are orthogonal', true, 'For a symmetric matrix, eigenvectors of distinct eigenvalues are orthogonal; the eigenvalues here are distinct because $b \\ne 0$.'],
      ], { not });
      return { q: `For $A = \\begin{pmatrix} ${a} & ${b} \\\\ ${b} & ${d} \\end{pmatrix}$, which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'The determinant is $ad - b^2$, not $ad$; and off-diagonal elements always push the eigenvalues outside the diagonal entries.' };
    } },
  { id: 'mev-m32', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'special matrices', format: 'which is NOT',
    make(r) {
      const n = int(r, 2, 4), not = r() < 0.6;
      const K = choose(r, [
        ['unitary matrix $U$', [
          ['$|\\det U| = 1$', true, '$|\\det U|^2 = \\det(U^\\dagger U) = 1$.'],
          ['the columns of $U$ are orthonormal', true, '$U^\\dagger U = I$ says exactly that.'],
          ['$U^{-1} = U^\\dagger$', true, 'This is the definition.'],
          ['$\\|Ux\\| = \\|x\\|$ for every vector $x$', true, '$\\|Ux\\|^2 = x^\\dagger U^\\dagger Ux = \\|x\\|^2$.'],
          ['every eigenvalue of $U$ is real', false, 'Eigenvalues have modulus 1 but may be complex, e.g. $\\text{diag}(i, 1)$.'],
          ['$\\det U = 1$', false, 'Only $|\\det U| = 1$; $\\text{diag}(-1, 1, \\dots)$ is unitary with determinant $-1$.'],
          ['$U$ is Hermitian', false, 'A unitary matrix such as $\\text{diag}(i, 1)$ is not Hermitian.'],
        ]],
        ['Hermitian matrix $H$', [
          ['every eigenvalue of $H$ is real', true, 'Standard result for $H = H^\\dagger$.'],
          ['the diagonal entries of $H$ are real', true, '$H_{ii} = H_{ii}^*$.'],
          ['$e^{iH}$ is unitary', true, '$(e^{iH})^\\dagger = e^{-iH}$, its inverse.'],
          ['$\\det H$ is real', true, 'It is the product of the real eigenvalues.'],
          ['every eigenvalue of $H$ is positive', false, '$-I$ is Hermitian with negative eigenvalues.'],
          ['every entry of $H$ is real', false, 'Off-diagonal entries may be complex, e.g. $\\sigma_y$.'],
          ['$H^2 = I$', false, 'Only for special ones such as the Pauli matrices; $2I$ is Hermitian with $H^2 = 4I$.'],
        ]],
        ['real orthogonal matrix $O$', [
          ['$O^TO = I$', true, 'This is the definition.'],
          ['$\\det O = \\pm1$', true, '$(\\det O)^2 = \\det(O^TO) = 1$.'],
          ['$O$ preserves dot products: $(Ox)\\cdot(Oy) = x\\cdot y$', true, '$(Ox)^T(Oy) = x^TO^TOy = x^Ty$.'],
          ['the rows of $O$ are orthonormal', true, '$OO^T = I$ as well, since $O^T = O^{-1}$.'],
          ['every eigenvalue of $O$ is real', false, 'A rotation by $90^\\circ$ in a plane has eigenvalues $\\pm i$.'],
          ['$O$ is symmetric', false, 'A rotation matrix by $90^\\circ$ is antisymmetric, not symmetric.'],
          ['$\\det O = +1$', false, 'A reflection is orthogonal with determinant $-1$.'],
        ]],
      ]);
      const m = oneOf(r, K[1], not);
      return { q: `Which statement is ${not ? '<b>NOT</b> always true' : 'always true'} for every $${n}\\times${n}$ ${K[0]}?`, ...m,
        trap: 'A property that holds for the familiar examples (real eigenvalues, determinant 1) need not hold for every member of the class.' };
    } },
  { id: 'mev-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'two-level systems', format: 'limiting case',
    make(r) {
      const weak = r() < 0.5;
      const D = weak ? int(r, 40, 90) : int(r, 1, 3), V = weak ? int(r, 1, 3) : int(r, 40, 90), E2 = int(r, 0, 5), E1 = E2 + D;
      const L = {
        w: 'eigenvectors close to $(1, 0)$ and $(0, 1)$; splitting close to $|E_1 - E_2|$',
        s: 'eigenvectors close to $(1, 1)/\\sqrt2$ and $(1, -1)/\\sqrt2$; splitting close to $2|V|$',
        x: 'eigenvectors close to $(1, 0)$ and $(0, 1)$; splitting close to $2|V|$',
        y: 'eigenvectors close to $(1, 1)/\\sqrt2$ and $(1, -1)/\\sqrt2$; splitting close to $|E_1 - E_2|$',
      };
      const exact = Math.sqrt(D * D + 4 * V * V);
      const o = mcqOptions(r, L[weak ? 'w' : 's'], shuffle(r, [weak ? L.s : L.w, L.x, L.y]));
      return { q: `A two-level Hamiltonian (energies in meV) is $H = \\begin{pmatrix} E_1 & V \\\\ V & E_2 \\end{pmatrix}$ with $E_1 = ${E1}$, $E_2 = ${E2}$ and $V = ${V}$. Which description of its eigenvectors and eigenvalue splitting is right?`, ...o,
        sol: `The exact eigenvalues are $\\tfrac{E_1 + E_2}{2} \\pm \\tfrac12\\sqrt{(E_1 - E_2)^2 + 4V^2}$, so the splitting is $\\sqrt{${D}^2 + 4\\cdot${V}^2} = ${exact.toFixed(2)}$ meV. ${weak ? `Here $|V| = ${V} \\ll |E_1 - E_2| = ${D}$: the splitting is $\\approx |E_1 - E_2| + 2V^2/|E_1 - E_2| = ${(D + (2 * V * V) / D).toFixed(2)}$, and the mixing angle $\\tan 2\\theta = 2V/(E_1 - E_2) = ${((2 * V) / D).toFixed(3)}$ is small, so the eigenvectors are nearly the basis states (weak coupling, second-order perturbation theory).` : `Here $|V| = ${V} \\gg |E_1 - E_2| = ${D}$: the splitting is $\\approx 2|V| + (E_1 - E_2)^2/(4|V|) = ${(2 * V + (D * D) / (4 * V)).toFixed(2)}$, and $\\tan 2\\theta = 2V/(E_1 - E_2) = ${((2 * V) / D).toFixed(1)}$ is large, so $\\theta \\to \\pi/4$: the eigenvectors are the equal mixtures (strong coupling, as for degenerate levels).`}`,
        trap: 'Which limit applies is set by the ratio $|V|/|E_1 - E_2|$, not by the size of $V$ alone.' };
    } },
  { id: 'mev-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'matrix exponential', format: 'match',
    make(r) {
      const a = int(r, 1, 4), b = int(r, 1, 4) + 4, w = int(r, 1, 5), c = int(r, 1, 3);
      const L = {
        in: 'decays to zero while rotating (spirals in)',
        out: 'spirals outwards, growing without bound',
        ctr: 'goes round closed loops for ever with constant amplitude',
        sad: 'grows along one direction while decaying along another',
        node: 'decays to zero without oscillating',
        cst: 'settles to a non-zero constant vector',
      };
      const M = (p, q, s, t) => `\\begin{pmatrix} ${p} & ${q} \\\\ ${s} & ${t} \\end{pmatrix}`;
      const cas = choose(r, [
        [M(-a, w, -w, -a), 'in', `Eigenvalues $-${a} \\pm ${w}i$: negative real part (decay) and non-zero imaginary part (rotation).`],
        [M(a, w, -w, a), 'out', `Eigenvalues $${a} \\pm ${w}i$: positive real part (growth) with rotation.`],
        [M(0, w, -w, 0), 'ctr', `Eigenvalues $\\pm ${w}i$: purely imaginary, so $x(t)$ is a combination of $\\cos ${w}t$ and $\\sin ${w}t$ (a centre).`],
        [M(a, 0, 0, -b), 'sad', `Eigenvalues $${a}$ and $-${b}$ of opposite sign: a saddle. The first component grows as $e^{${a}t}$, the second decays.`],
        [M(-a, c, 0, -b), 'node', `Triangular, so the eigenvalues are the diagonal entries $-${a}$ and $-${b}$: both real and negative (a stable node).`],
        [M(0, 0, 0, -b), 'cst', `Eigenvalues 0 and $-${b}$: the first component stays at its initial value and the second decays as $e^{-${b}t}$.`],
      ]);
      return { q: `For $\\dfrac{d\\mathbf x}{dt} = A\\mathbf x$ with $A = ${cas[0]}$ and a generic starting vector, $\\mathbf x(t) = e^{At}\\mathbf x(0)$ as $t \\to \\infty$`, ...matchOne(r, L, cas),
        sol: `${cas[2]} The behaviour of $e^{At}$ is fixed by the eigenvalues: real parts give growth or decay, imaginary parts give rotation.`,
        trap: 'Look at the eigenvalues, not at the signs of individual entries.' };
    } },
  { id: 'mev-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'determinant tricks',
    make(r) {
      const n = int(r, 3, 6), c = int(r, 1, 3), d = int(r, 1, 3);
      const ans = d ** (n - 1) * (d + n * c);
      const o = mcqOptions(r, ans, shuffle(r, [(d + c) ** n, d ** n, d ** (n - 1) * (d + c), d * (d + n * c) ** (n - 1), d ** n + n * c]));
      return { q: `Let $J$ be the $${n}\\times${n}$ matrix with every entry equal to 1. The determinant of $${c === 1 ? '' : c}J + ${d === 1 ? '' : d}I$ is`, ...o,
        sol: `$J$ has rank 1: $J\\mathbf u = ${n}\\mathbf u$ for $\\mathbf u = (1, \\dots, 1)$, and $J\\mathbf v = 0$ for the ${n - 1} independent vectors orthogonal to $\\mathbf u$. So $${c === 1 ? '' : c}J + ${d === 1 ? '' : d}I$ has eigenvalues $${d} + ${n}\\cdot${c} = ${d + n * c}$ (once) and $${d}$ (${n - 1} times), and $\\det = ${d}^{${n - 1}}\\times${d + n * c} = ${ans}$.`,
        trap: 'Adding $dI$ shifts every eigenvalue by $d$; the determinant is the product of the shifted eigenvalues, not $d^n$ plus something.' };
    } },
];
