// Live problems for CSIR NET Physics lessons (lesson kit). Each make(rand) returns { q, answer, unit, tol (relative),
// abs?, hint, solution } as HTML; verify(p) works the answer out another way for tests/exam-physics.mjs.
// Placed in a lesson as <div class="problem" data-problem="id"></div>. Exam-style practice uses the question bank instead.
const int = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  // ---- 4.2, 4.3 electromagnetic theory ----
  'larmor-power': {
    title: 'Larmor power of an electron circling in a magnetic field',
    make(r) {
      const B = [0.5, 1, 1.5, 2, 3, 5][int(r, 0, 5)], v7 = int(r, 1, 3);
      const e = 1.602176634e-19, me = 9.1093837e-31, eps0 = 8.8541878128e-12, c = 2.99792458e8;
      const v = v7 * 1e7, a = e * B * v / me, P = e * e * a * a / (6 * Math.PI * eps0 * c ** 3), answer = P / e;
      return {
        q: `<p>An electron moves at ${v7} × 10⁷ m/s on a circle perpendicular to a uniform field B = ${B} T. Using the non-relativistic Larmor formula, find the power it radiates, in eV per second.</p>`,
        answer, unit: 'eV/s', tol: 0.01,
        hint: 'The acceleration is centripetal, a = v²/r with r = mv/eB, so a = eBv/m. Then P = e²a²/(6πε₀c³).',
        solution: steps(`a = eBv/m = 1.7588 × 10¹¹ × ${B} × ${v.toExponential(1)} = ${a.toExponential(3)} m/s².`, `P = e²a²/(6πε₀c³) = 5.71 × 10⁻⁵⁴ × a² = ${P.toExponential(3)} W.`, `Divide by e = 1.602 × 10⁻¹⁹ J/eV: P = <b>${answer.toFixed(1)} eV/s</b>. The kinetic energy is ${(0.5 * me * v * v / e).toFixed(0)} eV, so the energy decays on a time scale KE/P = ${(0.5 * me * v * v / P).toPrecision(2)} s (in general 3πε₀m³c³/e⁴B² ≈ 2.6/B² s, whatever the speed).`),
        B, v,
      };
    },
    verify(p) {
      const e = 1.602176634e-19, k = 8.9875517923e9, c = 2.99792458e8, a = (e / 9.1093837e-31) * p.B * p.v;
      return (2 / 3) * k * e * a * a / c ** 3;
    },
  },
  'plasma-cutoff': {
    title: 'cutoff and group velocity of a radio wave in a plasma',
    make(r) {
      const n11 = int(r, 2, 30), n = n11 * 1e11;
      const e = 1.602176634e-19, me = 9.1093837e-31, eps0 = 8.8541878128e-12;
      const fp = Math.sqrt(n * e * e / (eps0 * me)) / (2 * Math.PI) / 1e6;
      const f = Math.ceil(fp) + int(r, 1, 6), answer = Math.sqrt(1 - (fp / f) ** 2);
      return {
        q: `<p>A layer of the ionosphere has electron density ${n11} × 10¹¹ m⁻³. A pulse at ${f} MHz crosses it. Find the group velocity of the pulse in the layer, as a fraction of c (ignore collisions and the Earth's field).</p>`,
        answer, unit: 'c', tol: 0.005,
        hint: 'Plasma frequency f<sub>p</sub> = (1/2π)√(ne²/ε₀m), about 8.98√n Hz with n in m⁻³. From ω² = ω<sub>p</sub>² + c²k², v<sub>g</sub> = dω/dk = c√(1 − ω<sub>p</sub>²/ω²).',
        solution: steps(`f<sub>p</sub> = 8.98 × √(${n.toExponential(1)}) Hz = ${fp.toFixed(3)} MHz, below ${f} MHz, so the wave gets through.`, `(f<sub>p</sub>/f)² = ${((fp / f) ** 2).toFixed(4)}.`, `v<sub>g</sub>/c = √(1 − ${((fp / f) ** 2).toFixed(4)}) = <b>${answer.toFixed(4)}</b>. The phase velocity is c²/v<sub>g</sub>, faster than light, and v<sub>p</sub>v<sub>g</sub> = c².`),
        n, f,
      };
    },
    verify(p) {
      const wp2 = p.n * 3182.6, w = 2 * Math.PI * p.f * 1e6; // e²/(ε₀m) = 3182.6 m³ s⁻²
      return Math.sqrt(1 - wp2 / (w * w));
    },
  },
  // ---- 5.2, 5.3 quantum mechanics ----
  'partial-wave-sigma': {
    title: 'total cross-section from s- and p-wave phase shifts',
    make(r) {
      const k = [0.2, 0.3, 0.4, 0.5, 0.8][int(r, 0, 4)], d0 = int(r, 10, 80), d1 = int(r, 2, 30);
      const s0 = Math.sin(d0 * Math.PI / 180) ** 2, s1 = Math.sin(d1 * Math.PI / 180) ** 2;
      const answer = (4 * Math.PI / (k * k)) * (s0 + 3 * s1);
      return {
        q: `<p>Neutrons scatter off a nucleus at wave number k = ${k} fm⁻¹. Only two partial waves matter: δ₀ = ${d0}° and δ₁ = ${d1}°. Find the total elastic cross-section in fm² (1 fm² = 10 mb).</p>`,
        answer, unit: 'fm²', tol: 0.01,
        hint: 'σ = (4π/k²) Σ (2l + 1) sin²δ<sub>l</sub>. The p wave carries weight 3.',
        solution: steps(`4π/k² = ${(4 * Math.PI / (k * k)).toFixed(2)} fm².`, `sin²δ₀ = ${s0.toFixed(4)}, 3 sin²δ₁ = ${(3 * s1).toFixed(4)}.`, `σ = ${(4 * Math.PI / (k * k)).toFixed(2)} × ${(s0 + 3 * s1).toFixed(4)} = <b>${answer.toFixed(1)} fm²</b> = ${(answer / 100).toFixed(3)} b. Unitarity caps the s-wave part at 4π/k².`),
        k, d0, d1,
      };
    },
    verify(p) {
      const t = (x) => (1 - Math.cos(2 * x * Math.PI / 180)) / 2;
      return 4 * Math.PI / (p.k * p.k) * (t(p.d0) + 3 * t(p.d1));
    },
  },
  'dirac-binding': {
    title: 'exact Dirac fine-structure splitting of the n = 2 level',
    make(r) {
      const Z = [5, 10, 20, 26, 30, 40, 50, 60, 70, 80, 92][int(r, 0, 10)], a = 1 / 137.035999, mc2 = 510998.95;
      const E = (n, j) => { const k = j + 0.5, za = Z * a; return mc2 / Math.sqrt(1 + (za / (n - k + Math.sqrt(k * k - za * za))) ** 2); };
      const answer = E(2, 1.5) - E(2, 0.5), lead = mc2 * (Z * a) ** 4 / 32;
      return {
        q: `<p>For a hydrogen-like ion with Z = ${Z} (point nucleus, no Lamb shift, no recoil), use the exact Dirac energy formula to find the splitting E(2p<sub>3/2</sub>) − E(2p<sub>1/2</sub>) in eV.</p>`,
        answer, unit: 'eV', tol: 0.01,
        hint: 'E<sub>nj</sub> = mc² [1 + (Zα/(n − δ))²]<sup>−1/2</sup> with δ = j + ½ − √((j + ½)² − Z²α²). The leading term of the splitting is mc²(Zα)⁴/32, but at large Z the exact result is larger.',
        solution: steps(`Zα = ${(Z * a).toFixed(5)}. For j = 1/2: δ = 1 − √(1 − Z²α²) = ${(1 - Math.sqrt(1 - (Z * a) ** 2)).toFixed(6)}; for j = 3/2: δ = 2 − √(4 − Z²α²) = ${(2 - Math.sqrt(4 - (Z * a) ** 2)).toFixed(6)}.`, `E(2p<sub>1/2</sub>) = ${E(2, 0.5).toFixed(3)} eV and E(2p<sub>3/2</sub>) = ${E(2, 1.5).toFixed(3)} eV (rest energy included).`, `Splitting = <b>${answer.toPrecision(4)} eV</b>. The leading-order estimate mc²(Zα)⁴/32 gives ${lead.toPrecision(4)} eV.`),
        Z,
      };
    },
    verify(p) {
      const a = 1 / 137.035999, za = p.Z * a, mc2 = 510998.95;
      const E = (j) => { const d = j + 0.5 - Math.sqrt((j + 0.5) ** 2 - za * za); return mc2 * (1 + (za / (2 - d)) ** 2) ** -0.5; };
      return E(1.5) - E(0.5);
    },
  },
  // ---- 6.2 to 6.4 statistical physics ----
  'stokes-einstein-rms': {
    title: 'rms Brownian displacement from the Stokes-Einstein relation',
    make(r) {
      const a = [0.25, 0.5, 1, 2][int(r, 0, 3)], T = [293, 298, 310][int(r, 0, 2)], eta = { 293: 1.0, 298: 0.89, 310: 0.69 }[T], t = [1, 5, 10, 30, 60][int(r, 0, 4)];
      const kB = 1.380649e-23, D = kB * T / (6 * Math.PI * eta * 1e-3 * a * 1e-6), answer = Math.sqrt(2 * D * t) * 1e6;
      return {
        q: `<p>A sphere of radius ${a} μm drifts in water at ${T} K (viscosity ${eta} mPa s). Find the rms displacement along one axis after ${t} s, in μm.</p>`,
        answer, unit: 'μm', tol: 0.01,
        hint: 'D = k<sub>B</sub>T/(6πηa) (Stokes-Einstein), and along one axis ⟨x²⟩ = 2Dt.',
        solution: steps(`D = 1.381 × 10⁻²³ × ${T} / (6π × ${eta} × 10⁻³ × ${a} × 10⁻⁶) = ${D.toExponential(3)} m²/s.`, `⟨x²⟩ = 2Dt = ${(2 * D * t).toExponential(3)} m².`, `x<sub>rms</sub> = <b>${answer.toFixed(2)} μm</b>. In three dimensions the rms distance is √3 times larger.`),
        a, T, eta, t,
      };
    },
    verify(p) {
      const R = 8.314462618, NA = 6.02214076e23;
      return 1e6 * Math.sqrt(R * p.T * p.t / (3 * Math.PI * NA * p.eta * 1e-3 * p.a * 1e-6));
    },
  },
  'ising-ring': {
    title: 'nearest-neighbour correlation on a short Ising ring',
    make(r) {
      const N = int(r, 3, 8), K = [0.2, 0.4, 0.5, 0.75, 1, 1.5][int(r, 0, 5)], t = Math.tanh(K);
      const answer = (t + t ** (N - 1)) / (1 + t ** N);
      return {
        q: `<p>N = ${N} Ising spins sit on a ring (periodic boundary) with energy E = −J Σ s<sub>i</sub>s<sub>i+1</sub>, no field, and K = J/k<sub>B</sub>T = ${K}. Find the nearest-neighbour correlation ⟨s<sub>i</sub>s<sub>i+1</sub>⟩.</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'The transfer matrix has eigenvalues 2cosh K and 2sinh K, so Z = (2cosh K)<sup>N</sup> + (2sinh K)<sup>N</sup>. Then ⟨s<sub>i</sub>s<sub>i+1</sub>⟩ = (1/N) ∂ ln Z/∂K.',
        solution: steps(`Z = (2cosh K)<sup>${N}</sup> + (2sinh K)<sup>${N}</sup>; with t = tanh K = ${t.toFixed(4)}, (1/N)∂ ln Z/∂K = (t + t<sup>N−1</sup>)/(1 + t<sup>N</sup>).`, `t<sup>${N - 1}</sup> = ${(t ** (N - 1)).toFixed(4)}, t<sup>${N}</sup> = ${(t ** N).toFixed(4)}.`, `⟨s<sub>i</sub>s<sub>i+1</sub>⟩ = <b>${answer.toFixed(4)}</b>, slightly above the infinite-chain value tanh K = ${t.toFixed(4)}: closing the ring gives a second path that correlates neighbours.`),
        N, K,
      };
    },
    verify(p) {
      let Z = 0, S = 0;
      for (let m = 0; m < 1 << p.N; m++) {
        const s = (i) => ((m >> (i % p.N)) & 1 ? 1 : -1);
        let b = 0; for (let i = 0; i < p.N; i++) b += s(i) * s(i + 1);
        const w = Math.exp(p.K * b); Z += w; S += w * b;
      }
      return S / Z / p.N;
    },
  },
  'gas-viscosity': {
    title: 'Chapman-Enskog viscosity of a hard-sphere gas',
    make(r) {
      const g = [['helium', 4.0026, 0.218], ['neon', 20.18, 0.259], ['argon', 39.95, 0.364], ['nitrogen', 28.01, 0.375], ['carbon dioxide', 44.01, 0.459]][int(r, 0, 4)];
      const T = [200, 250, 300, 400, 500, 600][int(r, 0, 5)], kB = 1.380649e-23, m = g[1] * 1.66053907e-27, d = g[2] * 1e-9;
      const answer = 1e6 * (5 / 16) * Math.sqrt(Math.PI * m * kB * T) / (Math.PI * d * d);
      return {
        q: `<p>Treat ${g[0]} (molar mass ${g[1]} g/mol) as hard spheres of diameter ${g[2]} nm. Using the Chapman-Enskog result for hard spheres, find its viscosity at ${T} K in μPa s.</p>`,
        answer, unit: 'μPa s', tol: 0.01,
        hint: 'η = (5/16) √(πmk<sub>B</sub>T) / (πd²). It does not depend on pressure, and grows as √T.',
        solution: steps(`m = ${g[1]} × 1.6605 × 10⁻²⁷ kg = ${m.toExponential(3)} kg; πd² = ${(Math.PI * d * d).toExponential(3)} m².`, `√(πmk<sub>B</sub>T) = ${Math.sqrt(Math.PI * m * kB * T).toExponential(3)} kg m/s.`, `η = (5/16) × that / πd² = <b>${answer.toFixed(1)} μPa s</b>. The elementary mean-free-path estimate ⅓nm v̄λ comes out about 1.5 times too small.`),
        M: g[1], d: g[2], T,
      };
    },
    verify(p) {
      const m = p.M * 1e-3 / 6.02214076e23, d = p.d * 1e-9;
      return 1e6 * (5 / 16) * Math.sqrt(m * 1.380649e-23 * p.T / Math.PI) / (d * d);
    },
  },
};
