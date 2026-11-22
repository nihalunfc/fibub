// Live problems for GATE Physics lessons (lesson kit). Each make(rand) returns { q, answer, unit, tol (relative),
// abs?, hint, solution } as HTML; verify(p) works the answer out another way for tests/exam-physics.mjs.
// Placed in a lesson as <div class="problem" data-problem="id"></div>. Exam-style practice uses the question bank instead.
const int = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  // ---- 1.1 Linear vector spaces (gate-math writer) ----
  'lvs-expectation': {
    title: 'an expectation value in Dirac notation',
    make(r) {
      const l = [int(r, -2, 0), int(r, 1, 2), int(r, 3, 5)], c = [int(r, 1, 3), int(r, 1, 2), int(r, 1, 3)];
      const N2 = c[0] ** 2 + c[1] ** 2 + c[2] ** 2, num = l[0] * c[0] ** 2 + l[1] * c[1] ** 2 + l[2] * c[2] ** 2;
      return {
        q: `<p>An observable is Â = ${l[0]}|1⟩⟨1| + ${l[1]}|2⟩⟨2| + ${l[2]}|3⟩⟨3| in an orthonormal basis. A system is in the (unnormalised) state |ψ⟩ = ${c[0]}|1⟩ + ${c[1]}i|2⟩ − ${c[2]}|3⟩. Find the expectation value ⟨Â⟩ = ⟨ψ|Â|ψ⟩ / ⟨ψ|ψ⟩.</p>`,
        answer: num / N2, unit: '', tol: 0.01,
        hint: 'Â is diagonal in this basis, so ⟨Â⟩ is a weighted average of its eigenvalues with weights |cₙ|². Remember to divide by ⟨ψ|ψ⟩.',
        solution: steps(`⟨ψ|ψ⟩ = ${c[0]}² + ${c[1]}² + ${c[2]}² = ${N2} (the i and the minus sign drop out of |cₙ|²).`, `⟨ψ|Â|ψ⟩ = ${l[0]}·${c[0] ** 2} + ${l[1]}·${c[1] ** 2} + ${l[2]}·${c[2] ** 2} = ${num}.`, `⟨Â⟩ = ${num}/${N2} ≈ <b>${(num / N2).toFixed(3)}</b>.`),
        l, c,
      };
    },
    verify: (p) => { let n = 0, d = 0; p.l.forEach((x, i) => { n += x * p.c[i] ** 2; d += p.c[i] ** 2; }); return n / d; },
  },
  // ---- 1.2 Matrices ----
  'mev-hermitian': {
    title: 'eigenvalues of a 2 × 2 Hermitian matrix',
    make(r) {
      const p = int(r, -2, 4), s = int(r, -3, 3), q = int(r, 1, 3), w = int(r, 0, 3);
      const t = p + s, D = p * s - (q * q + w * w), big = (t + Math.sqrt(t * t - 4 * D)) / 2;
      const off = w === 0 ? `${q}` : `${q} − ${w === 1 ? '' : w}i`, offc = w === 0 ? `${q}` : `${q} + ${w === 1 ? '' : w}i`;
      return {
        q: `<p>Find the larger eigenvalue of the Hermitian matrix H = [[${p}, ${off}], [${offc}, ${s}]] (rows in brackets).</p>`,
        answer: big, unit: '', tol: 0.005,
        hint: 'Use trace and determinant. For the determinant, the off-diagonal entries multiply to |b|² = (real part)² + (imaginary part)², not b².',
        solution: steps(`Trace = ${p} + ${s} = ${t}. Determinant = (${p})(${s}) − |${off}|² = ${p * s} − ${q * q + w * w} = ${D}.`, `λ² − ${t}λ + ${D} = 0, so λ = [${t} ± √(${t * t} − 4·(${D}))]/2 = [${t} ± √${t * t - 4 * D}]/2.`, `Larger: <b>${big.toFixed(3)}</b>. Both roots are real, as they must be for a Hermitian matrix: the discriminant (p − s)² + 4|b|² can never be negative.`),
        p, s, re: q, w,
      };
    },
    verify: (p) => { const a0 = (p.p + p.s) / 2, az = (p.p - p.s) / 2; return a0 + Math.sqrt(az * az + p.re * p.re + p.w * p.w); },
  },
  // ---- 1.3 Complex analysis ----
  'cax-cauchy': {
    title: "Cauchy's integral formula with a derivative",
    make(r) {
      const a = int(r, 1, 3), b = int(r, -1, 1), n = int(r, 1, 3), R = Math.abs(b) + 2;
      let fct = 1; for (let i = 2; i <= n; i++) fct *= i;
      const k = (2 * a ** n * Math.exp(a * b)) / fct;
      const den = b === 0 ? 'z' : b > 0 ? `(z − ${b})` : `(z + ${-b})`;
      return {
        q: `<p>The integral ∮ e<sup>${a === 1 ? '' : a}z</sup> / ${den}<sup>${n + 1}</sup> dz, taken anticlockwise round the circle |z| = ${R}, equals kπi. Find k.</p>`,
        answer: k, unit: '', tol: 0.005,
        hint: `Use ∮ f(z)/(z − z₀)ⁿ⁺¹ dz = (2πi/n!) f⁽ⁿ⁾(z₀) with f(z) = e^(${a}z). Is z₀ = ${b} inside the circle?`,
        solution: steps(`z₀ = ${b} is inside |z| = ${R}, and f(z) = e^(${a}z) is entire.`, `f⁽${n}⁾(z) = ${a}${n > 1 ? '^' + n : ''} e^(${a}z), so f⁽${n}⁾(${b}) = ${a ** n} e^(${a * b}).`, `∮ = (2πi/${n}!) · ${a ** n} e^(${a * b}) = ${(2 * a ** n / fct).toFixed(4)} e^(${a * b}) πi, so k ≈ <b>${k.toFixed(4)}</b>.`),
        a, b, n,
      };
    },
    verify: (p) => { // numerical contour integral on |z - b| = 1 (same value by Cauchy), divided by pi i
      const N = 4000; let re = 0, im = 0;
      for (let j = 0; j < N; j++) {
        const t = ((j + 0.5) / N) * 2 * Math.PI, zr = p.b + Math.cos(t), zi = Math.sin(t);
        const er = Math.exp(p.a * zr) * Math.cos(p.a * zi), ei = Math.exp(p.a * zr) * Math.sin(p.a * zi);
        // (z - b)^{-(n+1)} = e^{-i(n+1)t}; dz = i e^{it} dt
        const ang = -(p.n + 1) * t + t + Math.PI / 2, cr = Math.cos(ang), ci = Math.sin(ang);
        re += (er * cr - ei * ci) * (2 * Math.PI / N); im += (er * ci + ei * cr) * (2 * Math.PI / N);
      }
      return im / Math.PI; // integral = k pi i, so k = Im / pi
    },
  },
  // ---- 1.4 Residues ----
  'res-two-poles': {
    title: 'a real integral by residues',
    make(r) {
      const a = int(r, 1, 3), b = a + int(r, 1, 3);
      const ans = Math.PI / (a * b * (a + b));
      return {
        q: `<p>Use the residue theorem to find ∫ dx / [(x² + ${a * a})(x² + ${b * b})] from −∞ to ∞.</p>`,
        answer: ans, unit: '', tol: 0.005,
        hint: `Close in the upper half-plane. Two simple poles are inside: z = ${a}i and z = ${b}i.`,
        solution: steps(`The integrand falls like 1/x⁴, so the big semicircle contributes nothing.`, `Res at ${a}i: 1/[(2·${a}i)(${b * b} − ${a * a})] = 1/(${2 * a * (b * b - a * a)}i). Res at ${b}i: 1/[(${a * a} − ${b * b})(2·${b}i)] = −1/(${2 * b * (b * b - a * a)}i).`, `2πi × (sum) = π[1/${a * (b * b - a * a)} − 1/${b * (b * b - a * a)}] = π/[${a}·${b}·(${a} + ${b})] = π/${a * b * (a + b)} ≈ <b>${ans.toFixed(4)}</b>.`),
        a, b,
      };
    },
    verify: (p) => { let s = 0; const N = 200000; for (let i = 0; i < N; i++) { const t = -Math.PI / 2 + (Math.PI * (i + 0.5)) / N, x = Math.tan(t); s += 1 / ((x * x + p.a * p.a) * (x * x + p.b * p.b)) / Math.cos(t) ** 2; } return (s * Math.PI) / N; },
  },
  // ---- 1.5 Fourier and Laplace ----
  'flt-damped': {
    title: 'a damped oscillator by Laplace transform',
    make(r) {
      const w = int(r, 1, 3), t0 = [0.5, 1, 1.5, 2][int(r, 0, 3)];
      const y = Math.exp(-t0) * (Math.cos(w * t0) + Math.sin(w * t0) / w);
      return {
        q: `<p>Solve y″ + 2y′ + ${1 + w * w}y = 0 with y(0) = 1 and y′(0) = 0 using the Laplace transform, and give y(${t0}).</p>`,
        answer: y, unit: '', tol: 0.01, abs: 0.002,
        hint: 'L{y″} = s²Y − s·y(0) − y′(0) and L{y′} = sY − y(0). Then complete the square in the denominator: s² + 2s + c = (s + 1)² + (c − 1).',
        solution: steps(`(s² + 2s + ${1 + w * w})Y = s + 2, so Y = (s + 2)/[(s + 1)² + ${w * w}] = (s + 1)/[(s + 1)² + ${w * w}] + 1/[(s + 1)² + ${w * w}].`, `The shift s → s + 1 means a factor e^(−t): y = e^(−t)[cos ${w}t + (1/${w}) sin ${w}t].`, `y(${t0}) = e^(−${t0})[cos ${w * t0} + sin ${w * t0}/${w}] ≈ <b>${y.toFixed(4)}</b> (angles in radians).`),
        w, t0,
      };
    },
    verify: (p) => { // RK4
      let y = 1, v = 0; const n = 4000, h = p.t0 / n, c = 1 + p.w * p.w, f = (y, v) => [v, -2 * v - c * y];
      for (let i = 0; i < n; i++) { const k1 = f(y, v), k2 = f(y + (h / 2) * k1[0], v + (h / 2) * k1[1]), k3 = f(y + (h / 2) * k2[0], v + (h / 2) * k2[1]), k4 = f(y + h * k3[0], v + h * k3[1]); y += (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); v += (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]); }
      return y;
    },
  },
};
