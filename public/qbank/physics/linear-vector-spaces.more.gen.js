// Extra question shapes for linear-vector-spaces (templates lvs-m31..m35). Imported by linear-vector-spaces.js.
import { int, choose, mcqOptions, shuffle } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, matchOne } from './_odd.js';

export default [
  { id: 'lvs-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'projectors', format: 'statements',
    make(r) {
      const n = int(r, 3, 6), k = int(r, 1, n - 1), not = r() < 0.5;
      const m = msqOf(r, [
        [`$\\text{tr}\\,\\hat P = ${k}$`, true, 'The eigenvalues are 1 (on the subspace) and 0 (on its complement), so the trace counts the dimension of the subspace.'],
        [`$\\text{tr}\\,\\hat P = ${n}$`, false, `The trace is the rank, ${k}, not the dimension of the whole space.`],
        ['every eigenvalue of $\\hat P$ is 0 or 1', true, 'From $\\hat P^2 = \\hat P$, an eigenvalue obeys $\\lambda^2 = \\lambda$.'],
        ['$\\det\\hat P = 0$', true, `Since $${k} \\lt ${n}$, the eigenvalue 0 occurs (${n - k} times), so the determinant vanishes.`],
        ['$\\hat P$ has an inverse', false, 'A projector onto a proper subspace kills the complement, so it is not invertible.'],
        [`$\\hat 1 - \\hat P$ is a projector onto a subspace of dimension ${n - k}`, true, '$(\\hat 1 - \\hat P)^2 = \\hat 1 - 2\\hat P + \\hat P^2 = \\hat 1 - \\hat P$, and its trace is $n - k$.'],
        [`the eigenvalue 1 of $\\hat P$ occurs ${n - k} times`, n - k === k, `The eigenvalue 1 occurs as often as the dimension of the subspace, ${k} times.`],
        ['$\\hat P\\,(\\hat 1 - \\hat P) = 0$', true, '$\\hat P - \\hat P^2 = 0$.'],
        ['$\\langle\\psi|\\hat P|\\psi\\rangle \\ge 0$ for every $|\\psi\\rangle$', true, '$\\langle\\psi|\\hat P|\\psi\\rangle = \\langle\\psi|\\hat P^\\dagger\\hat P|\\psi\\rangle = \\|\\hat P\\psi\\|^2 \\ge 0$.'],
        ['$\\hat P$ is unitary', false, 'A unitary operator has every eigenvalue on the unit circle; 0 is not, so $\\hat P$ is not unitary.'],
      ], { not });
      return { q: `$\\hat P$ is the orthogonal projector ($\\hat P^2 = \\hat P = \\hat P^\\dagger$) onto a ${k}-dimensional subspace of $\\mathbb C^{${n}}$. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'The trace of a projector is its rank (the dimension of the subspace), not the dimension of the space.' };
    } },
  { id: 'lvs-m32', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'vector space axioms', format: 'which is NOT',
    make(r) {
      const n = int(r, 2, 4), a = int(r, 1, 3), c = int(r, 1, 5), not = r() < 0.5;
      const m = oneOf(r, [
        [`real polynomials of degree at most ${n}`, true, 'Sums and multiples of such polynomials stay of degree at most ' + n + ', and 0 is included.'],
        [`real symmetric $${n}\\times${n}$ matrices`, true, 'The sum of symmetric matrices is symmetric, and so is any real multiple.'],
        [`real solutions of $y'' + ${a * a}y = 0$`, true, 'The equation is linear and homogeneous, so solutions add and scale to solutions.'],
        [`real functions on $[0, ${a}]$ with $f(${a}) = 0$`, true, 'If $f(' + a + ') = g(' + a + ') = 0$ then $(\\alpha f + \\beta g)(' + a + ') = 0$.'],
        [`vectors $(x, y, z)$ with $x + ${a === 1 ? '' : a}y - z = 0$`, true, 'A plane through the origin: closed under addition and scaling.'],
        [`real polynomials of degree exactly ${n}`, false, `The sum of $x^{${n}}$ and $-x^{${n}}$ has lower degree, and the zero polynomial is missing.`],
        [`real functions on $[0, ${a}]$ with $f(${a}) = ${c}$`, false, `The sum of two such functions has $f(${a}) = ${2 * c}$, and the zero function is missing.`],
        [`vectors $(x, y, z)$ with $x + y + z = ${c}$`, false, 'A plane not through the origin: it does not contain the zero vector.'],
        [`invertible real $${n}\\times${n}$ matrices`, false, 'The zero matrix is not invertible, and $A + (-A) = 0$ leaves the set.'],
        [`unit vectors in $\\mathbb R^{${n}}$`, false, 'Twice a unit vector is not a unit vector; 0 is missing.'],
      ], not);
      return { q: `With the usual addition and multiplication by real numbers, which of these sets is ${not ? '<b>NOT</b> a real vector space' : 'a real vector space'}?`, ...m,
        trap: 'Quick test: does the set contain the zero vector? Every vector space must.' };
    } },
  { id: 'lvs-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'dimension',
    make(r) {
      const n = int(r, 2, 5);
      const C = choose(r, [
        [`$${n}\\times${n}$ complex Hermitian matrices, as a vector space over the reals`, n * n, `The ${n} diagonal entries are real (${n} numbers) and each of the ${n * (n - 1) / 2} entries above the diagonal is complex (2 real numbers), giving $${n} + ${n * (n - 1)} = ${n * n}$.`],
        [`real symmetric $${n}\\times${n}$ matrices`, (n * (n + 1)) / 2, `Choose the diagonal and the upper triangle freely: $n(n + 1)/2 = ${(n * (n + 1)) / 2}$.`],
        [`real antisymmetric $${n}\\times${n}$ matrices`, (n * (n - 1)) / 2, `The diagonal is zero and the upper triangle fixes the lower: $n(n - 1)/2 = ${(n * (n - 1)) / 2}$.`],
        [`traceless complex $${n}\\times${n}$ matrices, over the complex numbers`, n * n - 1, `$n^2$ entries minus one linear condition (trace zero): $${n * n - 1}$.`],
        [`$\\mathbb C^{${n}}$ regarded as a vector space over the reals`, 2 * n, `Each complex component carries a real and an imaginary part: $2n = ${2 * n}$.`],
        [`real polynomials in $x$ of degree at most ${n + 1}`, n + 2, `A basis is $1, x, \\dots, x^{${n + 1}}$: ${n + 2} elements.`],
        [`the symmetric subspace of $\\mathbb C^{${n}}\\otimes\\mathbb C^{${n}}$`, (n * (n + 1)) / 2, `Symmetric combinations of pairs: $n$ of the form $|ii\\rangle$ plus $\\binom{n}{2}$ of the form $|ij\\rangle + |ji\\rangle$, total $${(n * (n + 1)) / 2}$.`],
      ]);
      const o = mcqOptions(r, C[1], shuffle(r, [n * n, (n * (n + 1)) / 2, (n * (n - 1)) / 2, n * n - 1, 2 * n, n + 1, 2 * n * n].filter((v) => v !== C[1])));
      return { q: `The dimension of the space of ${C[0]} is`, ...o, sol: C[2],
        trap: 'Count real or complex parameters according to the field the space is taken over.' };
    } },
  { id: 'lvs-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'tensor products', format: 'which is',
    make(r) {
      const p = int(r, 1, 3), q = int(r, 1, 3), s = int(r, 1, 3), t = choose(r, [-2, -1, 1, 2]);
      const coef = [p * s, p * t, q * s, q * t];
      const show = (c) => {
        const k = ['|00\\rangle', '|01\\rangle', '|10\\rangle', '|11\\rangle'];
        let out = '';
        c.forEach((v, i) => { if (v === 0) return; const a = Math.abs(v), b = (a === 1 ? '' : a) + k[i]; out += out ? (v < 0 ? ' - ' : ' + ') + b : (v < 0 ? '-' : '') + b; });
        return `$${out}$`;
      };
      const w1 = coef.slice(); w1[0] += 1;
      const w2 = coef.slice(); w2[3] = -w2[3];
      const w3 = coef.slice(); w3[1] = -w3[1];
      const w4 = [1, 0, 0, 1];
      const o = mcqOptions(r, show(coef), [w1, w2, w3, w4].map(show).filter((x) => x !== show(coef)));
      return { q: 'Which of these (unnormalised) two-qubit states is a product state $|a\\rangle\\otimes|b\\rangle$, that is, NOT entangled?', ...o,
        sol: `A state $c_{00}|00\\rangle + c_{01}|01\\rangle + c_{10}|10\\rangle + c_{11}|11\\rangle$ is a product exactly when the coefficient matrix has determinant zero, $c_{00}c_{11} = c_{01}c_{10}$. The answer ${show(coef)} has $(${coef[0]})(${coef[3]}) = (${coef[1]})(${coef[2]})$; indeed it equals $(${p === 1 ? '' : p}|0\\rangle + ${q === 1 ? '' : q}|1\\rangle)\\otimes(${s === 1 ? '' : s}|0\\rangle ${t < 0 ? '-' : '+'} ${Math.abs(t) === 1 ? '' : Math.abs(t)}|1\\rangle)$. Each other option has $c_{00}c_{11} \\ne c_{01}c_{10}$, so it is entangled.`,
        trap: 'Having all four coefficients non-zero does not make a state entangled; check $c_{00}c_{11} - c_{01}c_{10}$.' };
    } },
  { id: 'lvs-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'eigenvalues of special operators', format: 'match',
    make(r) {
      const k = int(r, 3, 6);
      const L = { real: 'real numbers', imag: 'purely imaginary numbers (or 0)', unit: 'numbers of modulus 1', proj: 'only 0 and 1', pm: 'only $+1$ and $-1$', zero: 'only 0', root: `roots of unity of order ${k}` };
      const cas = choose(r, [
        ['$\\hat A^\\dagger = \\hat A$', 'real', 'A Hermitian operator: $\\lambda\\langle v|v\\rangle = \\langle v|\\hat A v\\rangle = \\langle\\hat A v|v\\rangle = \\lambda^*\\langle v|v\\rangle$, so $\\lambda$ is real.'],
        ['$\\hat A^\\dagger = -\\hat A$', 'imag', 'Anti-Hermitian: $i\\hat A$ is Hermitian with real eigenvalues, so the eigenvalues of $\\hat A$ are $i\\times$(real).'],
        ['$\\hat A^\\dagger\\hat A = \\hat 1$', 'unit', 'Unitary: $\\|\\hat Av\\| = \\|v\\|$ gives $|\\lambda| = 1$.'],
        ['$\\hat A^2 = \\hat A = \\hat A^\\dagger$', 'proj', 'A projector: $\\lambda^2 = \\lambda$ gives $\\lambda = 0$ or 1.', ['real']],
        ['$\\hat A^2 = \\hat 1$ and $\\hat A^\\dagger = \\hat A$', 'pm', '$\\lambda^2 = 1$, so $\\lambda = \\pm1$ (for example a parity operator).', ['real', 'unit']],
        [`$\\hat A^{${k}} = 0$`, 'zero', `Nilpotent: $\\lambda^{${k}} = 0$, so every eigenvalue is 0.`, ['real', 'imag', 'proj']],
        [`$\\hat A^{${k}} = \\hat 1$`, 'root', `$\\lambda^{${k}} = 1$, so each eigenvalue is a ${k}th root of unity, $e^{2\\pi i m/${k}}$.`, ['unit']],
      ]);
      return { q: `A linear operator on a finite-dimensional complex inner-product space satisfies ${cas[0]}. Its eigenvalues must be`, ...matchOne(r, L, cas),
        trap: 'Apply the defining relation to an eigenvector: the same relation then holds for the number $\\lambda$.' };
    } },
];
