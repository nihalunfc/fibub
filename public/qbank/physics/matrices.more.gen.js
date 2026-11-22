// Extra question shapes for matrices (templates mx-t21..t26). Imported by matrices.js.
import { int, choose, mcqOptions, round } from '../_util.js';
import { msqOf, gcd } from './_more.js';

const nz = (r, lo, hi) => { const v = int(r, lo, hi - 1); return v >= 0 ? v + 1 : v; };
const mat = (M) => `\\begin{pmatrix} ${M.map((row) => row.join(' & ')).join(' \\\\ ')} \\end{pmatrix}`;
function rank(M0) {
  const M = M0.map((row) => row.slice()); let rk = 0; const n = M.length, m = M[0].length;
  for (let c = 0; c < m && rk < n; c++) {
    let piv = -1; for (let i = rk; i < n; i++) if (Math.abs(M[i][c]) > 1e-9) { piv = i; break; }
    if (piv < 0) continue;
    [M[rk], M[piv]] = [M[piv], M[rk]];
    for (let i = 0; i < n; i++) if (i !== rk) { const f = M[i][c] / M[rk][c]; for (let j = 0; j < m; j++) M[i][j] -= f * M[rk][j]; }
    rk++;
  }
  return rk;
}
function detGauss(M0) {
  const M = M0.map((row) => row.slice()), n = M.length; let d = 1;
  for (let c = 0; c < n; c++) {
    let piv = c; for (let i = c + 1; i < n; i++) if (Math.abs(M[i][c]) > Math.abs(M[piv][c])) piv = i;
    if (Math.abs(M[piv][c]) < 1e-12) return 0;
    if (piv !== c) { [M[c], M[piv]] = [M[piv], M[c]]; d = -d; }
    d *= M[c][c];
    for (let i = c + 1; i < n; i++) { const f = M[i][c] / M[c][c]; for (let j = c; j < n; j++) M[i][j] -= f * M[c][j]; }
  }
  return d;
}

export default [
  { id: 'mx-t21', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'hermitian matrices',
    make(r) {
      const C = choose(r, [
        ['Hermitian ($A^\\dagger = A$)', [
          ['All eigenvalues of $A$ are real', true, 'From $Av = \\lambda v$: $v^\\dagger Av = \\lambda|v|^2$ is real because $A^\\dagger = A$.'],
          ['Eigenvectors of $A$ for different eigenvalues are orthogonal', true, 'A standard property of Hermitian (normal) matrices.'],
          ['$\\det A$ is real', true, 'It is the product of the real eigenvalues.'],
          ['$A$ can be diagonalised by a unitary matrix', true, 'The spectral theorem for Hermitian matrices.'],
          ['All eigenvalues of $A$ have modulus 1', false, 'That is a property of unitary matrices; $\\mathrm{diag}(2, 3)$ is Hermitian.'],
          ['The diagonal entries of $A$ are purely imaginary', false, '$A_{ii} = \\overline{A_{ii}}$, so they are real.'],
          ['$A^2 = I$', false, '$\\mathrm{diag}(2, 3)$ is Hermitian but its square is not $I$.']]],
        ['unitary ($A^\\dagger A = I$)', [
          ['Every eigenvalue of $A$ has modulus 1', true, '$|Av| = |v|$ forces $|\\lambda| = 1$.'],
          ['$|\\det A| = 1$', true, '$|\\det A|^2 = \\det(A^\\dagger A) = 1$.'],
          ['$|Ax| = |x|$ for every vector $x$', true, '$|Ax|^2 = x^\\dagger A^\\dagger Ax = |x|^2$.'],
          ['$A^{-1} = A^\\dagger$', true, 'This is the definition rearranged.'],
          ['All eigenvalues of $A$ are real', false, '$\\mathrm{diag}(i, 1)$ is unitary with eigenvalue $i$.'],
          ['$\\det A = 1$', false, '$\\mathrm{diag}(i, 1)$ is unitary with determinant $i$.'],
          ['$A = A^\\dagger$', false, '$\\mathrm{diag}(i, 1)$ is unitary but not Hermitian.']]],
        ['real orthogonal ($A^TA = I$, $A$ real)', [
          ['$\\det A = \\pm1$', true, '$(\\det A)^2 = \\det(A^TA) = 1$ and $\\det A$ is real.'],
          ['The columns of $A$ are orthonormal', true, '$A^TA = I$ says exactly that.'],
          ['Every eigenvalue of $A$ has modulus 1', true, 'Orthogonal matrices preserve lengths.'],
          ['All eigenvalues of $A$ are real', false, 'A $90^\\circ$ rotation in the plane has eigenvalues $\\pm i$.'],
          ['$\\det A = 1$', false, 'A reflection is orthogonal with determinant $-1$.'],
          ['$A$ is symmetric', false, 'A rotation by $90^\\circ$ is orthogonal but antisymmetric.']]],
        ['real antisymmetric $3\\times3$ ($A^T = -A$)', [
          ['All diagonal entries of $A$ are zero', true, '$A_{ii} = -A_{ii}$.'],
          ['$\\det A = 0$', true, '$\\det A = \\det(A^T) = \\det(-A) = (-1)^3\\det A$.'],
          ['Every eigenvalue of $A$ is zero or purely imaginary', true, '$iA$ is Hermitian, so $i\\lambda$ is real.'],
          ['$x^TAx = 0$ for every real vector $x$', true, '$x^TAx$ is a number equal to its own transpose $x^TA^Tx = -x^TAx$.'],
          ['$A$ is invertible', false, 'Its determinant is zero.'],
          ['$A^2$ is antisymmetric', false, '$(A^2)^T = (A^T)^2 = A^2$: it is symmetric.']]],
        ['nilpotent ($A^k = 0$ for some $k$, but $A\\ne0$)', [
          ['All eigenvalues of $A$ are zero', true, '$Av = \\lambda v$ gives $0 = A^kv = \\lambda^kv$.'],
          ['$\\operatorname{tr}A = 0$ and $\\det A = 0$', true, 'Both are built from the eigenvalues, which are all zero.'],
          ['$I + A$ is invertible', true, 'Its eigenvalues are all $1$ (indeed $(I + A)^{-1} = I - A + A^2 - \\dots$, a finite sum).'],
          ['$A$ is diagonalisable', false, 'A diagonalisable matrix with all eigenvalues zero is the zero matrix, which is excluded.'],
          ['$A$ is invertible', false, 'Its determinant is zero.'],
          ['$A$ must be the zero matrix', false, '$\\begin{pmatrix}0&1\\\\0&0\\end{pmatrix}$ squares to zero but is not zero.']]],
      ]);
      const not = r() < 0.4;
      const m = msqOf(r, C[1], { not });
      return { q: `$A$ is a ${C[0]} matrix. Which of the following statements ${not ? '<b>need NOT</b> be true' : 'must be true'}?`, ...m,
        sol: m.sol.replace('statements that are true', 'statements that must hold (marked true)').replace('statements that are false', 'statements that can fail (marked false)'),
        trap: 'Hermitian means real eigenvalues; unitary means eigenvalues of modulus 1. Students often swap them.' };
    } },
  { id: 'mx-t22', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'determinants',
    make(r) {
      const n = int(r, 2, 4), a = nz(r, -3, 3), b = nz(r, -3, 4);
      const M = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => a + (i === j ? b : 0)));
      const v = b ** (n - 1) * (b + n * a);
      return { q: `The determinant of the $${n}\\times${n}$ matrix $${mat(M)}$ is ______.`,
        answer: v, tol: 0, M,
        sol: `The matrix is $${a}J + ${b}I$, where $J$ is the all-ones matrix. $J$ has eigenvalues $${n}$ (eigenvector $(1, \\dots, 1)$) and $0$ (${n - 1} times). So the matrix has eigenvalues $${b} + ${n}\\times${a} = ${b + n * a}$ once and $${b}$ ${n - 1} time${n - 1 > 1 ? 's' : ''}. The determinant is their product: $${b + n * a}\\times(${b})^{${n - 1}} = ${v}$.`,
        trap: 'Expanding a 4×4 determinant by hand is slow and error-prone; use the eigenvalues of the all-ones matrix.' };
    },
    verify: (p) => Math.round(detGauss(p.M)) },
  { id: 'mx-t23', type: 'mcq', level: 2, exams: ['jam'], sub: 'rank',
    make(r) {
      const target = int(r, 1, 3);
      const v = [nz(r, -3, 3), int(r, -3, 3), int(r, -3, 3)], w = [int(r, -3, 3), nz(r, -3, 3), int(r, -3, 3)];
      let M;
      if (target === 1) { const c = [1, nz(r, -3, 3), nz(r, -3, 3)]; M = c.map((k) => v.map((x) => k * x)); }
      else if (target === 2) { const al = nz(r, -2, 2), be = nz(r, -2, 2); M = [v, w, v.map((x, i) => al * x + be * w[i])]; }
      else { M = [v, w, [int(r, -3, 3), int(r, -3, 3), nz(r, -3, 3)]]; if (detGauss(M) === 0) M[2][2] += 1; if (Math.abs(detGauss(M)) < 1e-9) M[2][0] += 1; }
      M = M.map((row) => row.map((x) => x + 0));
      const rk = rank(M);
      const o = mcqOptions(r, rk, [0, 1, 2, 3].filter((x) => x !== rk), (x) => `$${x}$`);
      return { q: `The rank of $${mat(M)}$ is`, ...o,
        sol: rk === 1 ? 'Every row is a multiple of the first row, so only one row is independent: rank 1.'
          : rk === 2 ? 'The determinant is $0$, so the rows are dependent, but two of them are not multiples of each other, so exactly two are independent: rank 2.'
          : `The determinant is $${round(detGauss(M), 6)}\\ne0$, so all three rows are independent: rank 3.`,
        trap: 'A zero determinant only says the rank is below 3; check whether two rows are still independent.' };
    } },
  { id: 'mx-t24', type: 'nat', level: 2, exams: ['jam'], sub: 'linear equations',
    make(r) {
      const a = nz(r, -4, 4), b = int(r, -4, 4), c = int(r, -4, 4); let d = nz(r, -4, 4); if (a * d - b * c === 0) d += d > 0 ? 1 : -1;
      const e = int(r, -9, 9), f = int(r, -9, 9), det = a * d - b * c, askX = r() < 0.5;
      const x = (e * d - b * f) / det, y = (a * f - c * e) / det;
      const t = (p, q, s) => `${p === 1 ? '' : p === -1 ? '-' : p}x ${q < 0 ? '-' : '+'} ${Math.abs(q) === 1 ? '' : Math.abs(q)}y = ${s}`.replace(/ [+-] 0y/, '');
      return { q: `Solve $${t(a, b, e)}$ and $${t(c, d, f)}$`.replace(/\$0x [+] /g, '$').replace(/\$0x - /g, '$-') + `. The value of $${askX ? 'x' : 'y'}$ is ______ (to three decimal places).`,
        answer: round(askX ? x : y, 3), tol: 0.002, a, b, c, d, e, f, askX,
        sol: `Cramer's rule with $\\Delta = (${a})(${d}) - (${b})(${c}) = ${det}$: $x = \\dfrac{(${e})(${d}) - (${b})(${f})}{${det}} = ${round(x, 4)}$, $y = \\dfrac{(${a})(${f}) - (${c})(${e})}{${det}} = ${round(y, 4)}$.`,
        trap: 'In Cramer\'s rule replace the column of the unknown you want, not its row.' };
    },
    verify: (p) => { const y = (p.f - (p.c * p.e) / p.a) / (p.d - (p.c * p.b) / p.a); return p.askX ? (p.e - p.b * y) / p.a : y; } },
  { id: 'mx-t25', type: 'mcq', level: 2, exams: ['jam'], sub: 'eigenvectors',
    make(r) {
      const V = (x, y) => `$(${x}, ${y})^T$`;
      if (r() < 0.5) {
        const a = int(r, -3, 5), b = nz(r, -4, 4), plus = r() < 0.5, lam = plus ? a + b : a - b;
        const o = mcqOptions(r, plus ? V(1, 1) : V(1, -1), [plus ? V(1, -1) : V(1, 1), V(1, 0), V(0, 1), V(1, 2), V(2, 1)]);
        return { q: `An eigenvector of $${mat([[a, b], [b, a]])}$ with eigenvalue $${lam}$ is`, ...o,
          sol: `For $\\begin{pmatrix} a & b \\\\ b & a \\end{pmatrix}$: acting on $(1, 1)^T$ gives $(a + b)(1, 1)^T$ and on $(1, -1)^T$ gives $(a - b)(1, -1)^T$. Here $a + b = ${a + b}$ and $a - b = ${a - b}$, so the eigenvalue $${lam}$ goes with ${plus ? V(1, 1) : V(1, -1)}.`,
          trap: 'Check by multiplying out: $A v$ must be a multiple of $v$.' };
      }
      const l1 = int(r, -3, 3); let l2 = int(r, -3, 2); if (l2 >= l1) l2 += 1; const c = nz(r, -3, 3);
      const first = r() < 0.4, g = gcd(c, l2 - l1);
      let ex = c / g, ey = (l2 - l1) / g; if (ex < 0) { ex = -ex; ey = -ey; }
      const right = first ? V(1, 0) : V(ex, ey);
      const [rx, ry] = first ? [1, 0] : [ex, ey];
      const wr = [first ? [ex, ey] : [1, 0], [0, 1], [ey, ex], [ex, -ey], [1, 1]].filter(([x, y]) => x * ry - y * rx !== 0).map(([x, y]) => V(x, y));
      const o = mcqOptions(r, right, wr);
      return { q: `An eigenvector of $${mat([[l1, c], [0, l2]])}$ with eigenvalue $${first ? l1 : l2}$ is`, ...o,
        sol: `The matrix is triangular, so its eigenvalues are the diagonal entries $${l1}$ and $${l2}$. ${first ? `$(1, 0)^T$ gives $(${l1}, 0)^T = ${l1}(1, 0)^T$.` : `Solve $(A - ${l2}I)v = 0$: the first row gives $(${l1 - l2})v_1 + (${c})v_2 = 0$, so $v \\propto (${c}, ${l2 - l1})^T$, that is ${V(ex, ey)}.`}`,
        trap: 'For a triangular matrix the eigenvalues are on the diagonal, but only one eigenvector is a coordinate axis.' };
    } },
  { id: 'mx-t26', type: 'msq', level: 2, exams: ['jam'], sub: 'eigenvalues',
    make(r) {
      const p = int(r, -3, 4), q = int(r, -3, 4), t = int(r, -3, 4), sym = r() < 0.5, s = sym ? q : int(r, -3, 4);
      const T = p + t, D = p * t - q * s, disc = (p - t) ** 2 + 4 * q * s;
      const cands = [
        ['$A$ is invertible', D !== 0, `$\\det A = ${p}\\times${t} - (${q})(${s}) = ${D}$.`],
        ['$A$ is symmetric', q === s, `The off-diagonal entries are $${q}$ and $${s}$.`],
        ['Both eigenvalues of $A$ are real', disc >= 0, `The eigenvalues solve $\\lambda^2 - ${T}\\lambda + ${D} = 0$, with discriminant $T^2 - 4D = ${disc}$.`],
        [`The eigenvalues of $A$ add up to $${T}$`, true, 'Their sum is the trace.'],
        [`The eigenvalues of $A$ add up to $${T + 1}$`, false, `Their sum is the trace, $${T}$.`],
        [`The eigenvalues of $A$ multiply to $${D}$`, true, 'Their product is the determinant.'],
        [`$\\operatorname{tr}(A^2) = ${T * T - 2 * D}$`, true, `$\\operatorname{tr}(A^2) = \\lambda_1^2 + \\lambda_2^2 = (\\lambda_1 + \\lambda_2)^2 - 2\\lambda_1\\lambda_2 = ${T * T} - ${2 * D}$.`],
      ];
      if (q * s !== 0) cands.push([`$\\det A = ${p * t + q * s}$`, false, `The determinant is $ad - bc = ${D}$, with a minus sign.`]);
      const m = msqOf(r, cands);
      return { q: `For $A = ${mat([[p, q], [s, t]])}$, which of the following statements are correct?`, ...m,
        trap: 'The trace is the sum of eigenvalues and the determinant their product; no need to find them.' };
    } },
];
