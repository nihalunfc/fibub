// Live problems for Matrices and determinants.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const mat = (M) => '<table class="mat" style="display:inline-table;border-left:2px solid;border-right:2px solid;padding:0 4px">' + M.map((r) => '<tr>' + r.map((v) => `<td style="padding:0 6px;text-align:right">${v}</td>`).join('') + '</tr>').join('') + '</table>';
const det2 = (a, b, c, d) => a * d - b * c;
// determinant by the sum over all 6 permutations (the "other way")
const detPerm = (M) => { const P = [[0, 1, 2, 1], [1, 2, 0, 1], [2, 0, 1, 1], [0, 2, 1, -1], [1, 0, 2, -1], [2, 1, 0, -1]]; return P.reduce((s, [i, j, k, sg]) => s + sg * M[0][i] * M[1][j] * M[2][k], 0); };

export default {
  'mat-det3': {
    title: 'a 3 × 3 determinant',
    make(r) {
      const M = [0, 1, 2].map((i) => [0, 1, 2].map((j) => pick(() => (r() * 7.31 * (i * 3 + j + 1)) % 1, -4, 6)));
      const [a, b, c] = M[0];
      const m1 = det2(M[1][1], M[1][2], M[2][1], M[2][2]), m2 = det2(M[1][0], M[1][2], M[2][0], M[2][2]), m3 = det2(M[1][0], M[1][1], M[2][0], M[2][1]);
      const answer = a * m1 - b * m2 + c * m3;
      return { M,
        q: `<p>Find the determinant ${mat(M)}.</p>`,
        answer, unit: '', tol: 0, abs: 0.4,
        hint: 'Expand along the first row with signs + − +: a(ei − fh) − b(di − fg) + c(dh − eg). Or make zeros first with row operations.',
        solution: steps(`Minors of the first row: ${m1}, ${m2}, ${m3}.`, `Δ = ${a}(${m1}) − (${b})(${m2}) + (${c})(${m3}) = <b>${answer}</b>.`) };
    },
    verify: (x) => detPerm(x.M),
  },
  'mat-adj': {
    title: 'determinant of adj(kA)',
    make(r) {
      const ord = pick(r, 2, 3), k = pick(r, 2, 3), d = pick(r, -3, 4) || 5;
      const kA = k ** ord * d, answer = kA ** (ord - 1);
      return { ord, k, d,
        q: `<p>A is a square matrix of order ${ord} with |A| = ${d}. Find |adj(${k}A)|.</p>`,
        answer, unit: '', tol: 0, abs: 0.4,
        hint: 'For order n: |kA| = kⁿ|A| and |adj M| = |M|ⁿ⁻¹.',
        solution: steps(`|${k}A| = ${k}<sup>${ord}</sup> × ${d} = ${kA}.`, `|adj(${k}A)| = |${k}A|<sup>${ord - 1}</sup> = ${kA}<sup>${ord - 1}</sup> = <b>${answer}</b>.`) };
    },
    // adj(kA) = kⁿ⁻¹ adj A, so |adj(kA)| = k^{n(n−1)} |adj A| = k^{n(n−1)} |A|^{n−1}
    verify: (x) => x.k ** (x.ord * (x.ord - 1)) * x.d ** (x.ord - 1),
  },
  'mat-cramer': {
    title: 'solve three equations by Cramer’s rule',
    make(r) {
      const a = pick(r, 2, 5), b = pick(r, 2, 5), c = pick(r, 2, 5);
      const x = pick(r, -3, 4), y = pick(r, -3, 4), z = pick(r, -3, 4);
      const A = [[a, 1, 1], [1, b, 1], [1, 1, c]], B = A.map((row) => row[0] * x + row[1] * y + row[2] * z);
      const D = detPerm(A), Dx = detPerm(A.map((row, i) => [B[i], row[1], row[2]]));
      const answer = Dx / D;
      const eq = (row, rhs) => `${row[0] === 1 ? '' : row[0]}x + ${row[1] === 1 ? '' : row[1]}y + ${row[2] === 1 ? '' : row[2]}z = ${rhs}`;
      return { A, B,
        q: `<p>Solve for x:<br>${eq(A[0], B[0])}<br>${eq(A[1], B[1])}<br>${eq(A[2], B[2])}</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'x = Δₓ/Δ, where Δ is the determinant of the coefficients and Δₓ has the first column replaced by the right-hand sides.',
        solution: steps(`Δ = ${D} (not zero, so there is exactly one solution).`, `Δₓ = ${Dx}.`, `x = ${Dx}/${D} = <b>${n(answer)}</b>.`) };
    },
    // Gaussian elimination instead of determinants
    verify: (p) => { const M = p.A.map((r, i) => [...r, p.B[i]]); for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) { const f = M[j][i] / M[i][i]; for (let k = i; k < 4; k++) M[j][k] -= f * M[i][k]; } const s = [0, 0, 0]; for (let i = 2; i >= 0; i--) { let v = M[i][3]; for (let k = i + 1; k < 3; k++) v -= M[i][k] * s[k]; s[i] = v / M[i][i]; } return s[0]; },
  },
};
