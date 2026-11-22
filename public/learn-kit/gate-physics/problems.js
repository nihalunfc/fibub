// Live problems for GATE Physics lessons (lesson kit). Each make(rand) returns { q, answer, unit, tol (relative),
// abs?, hint, solution } as HTML; verify(p) works the answer out another way for tests/exam-physics.mjs.
// Placed in a lesson as <div class="problem" data-problem="id"></div>. Exam-style practice uses the question bank instead.
const int = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  // ---- 7.1 to 7.5 Solid state: lattices, diffraction, bonding, phonons, heat capacity ----
  'bz-volume': {
    title: 'volume of the first Brillouin zone',
    make(r) {
      const [name, n] = [['simple cubic', 1], ['body-centred cubic', 2], ['face-centred cubic', 4]][int(r, 0, 2)];
      const a = int(r, 280, 620) / 100, Vc = a ** 3 / n, answer = (2 * Math.PI) ** 3 / Vc;
      return {
        q: `<p>A ${name} crystal has conventional cube edge ${a} Å. Find the volume of its first Brillouin zone, in Å⁻³.</p>`,
        answer, unit: 'Å⁻³', tol: 0.005,
        hint: 'The zone volume is (2π)³ divided by the volume of a primitive cell, not of the cube. How many lattice points does the cube hold?',
        solution: steps(`The cube holds ${n} lattice point${n > 1 ? 's' : ''}, so the primitive cell has volume a³/${n} = ${Vc.toFixed(3)} Å³.`, `V_BZ = (2π)³/V_c = 248.05/${Vc.toFixed(3)} = <b>${answer.toFixed(3)} Å⁻³</b>.`),
        a, n,
      };
    },
    verify: (p) => (2 * Math.PI) ** 3 * p.n / p.a ** 3,
  },
  'zone-boundary-energy': {
    title: 'free-electron energy at a zone boundary',
    make(r) {
      const a = int(r, 25, 55) / 10, [where, m] = [['the centre of a face (X)', 1], ['the midpoint of an edge (M)', 2], ['a corner (R)', 3]][int(r, 0, 2)];
      const answer = 3.80998 * m * (Math.PI / a) ** 2;
      return {
        q: `<p>A simple cubic lattice has a = ${a} Å. A free electron has its wave vector ending at ${where} of the first Brillouin zone. Find its kinetic energy in eV (ħ²/2m = 3.810 eV Å²).</p>`,
        answer, unit: 'eV', tol: 0.005,
        hint: 'The zone is the cube |kₓ|, |k_y|, |k_z| ≤ π/a. Write the point as (π/a)(1,0,0), (1,1,0) or (1,1,1).',
        solution: steps(`k² = ${m}(π/a)² = ${(m * (Math.PI / a) ** 2).toFixed(4)} Å⁻².`, `E = (ħ²/2m)k² = 3.810 × ${(m * (Math.PI / a) ** 2).toFixed(4)} = <b>${answer.toFixed(3)} eV</b>.`),
        a, m,
      };
    },
    verify: (p) => 3.80998 * p.m * (Math.PI / p.a) ** 2,
  },
  'structure-factor-ab': {
    title: 'structure factor of a two-ion crystal',
    make(r) {
      const st = int(r, 0, 2), fA = int(r, 10, 50), fB = int(r, 5, 40);
      const lists = [[[1, 1, 1], [2, 0, 0], [2, 2, 0], [3, 1, 1]], [[1, 0, 0], [1, 1, 0], [1, 1, 1], [2, 0, 0]], [[1, 1, 1], [2, 0, 0], [2, 2, 0], [3, 1, 1]]];
      const [h, k, l] = lists[st][int(r, 0, 3)], s = h + k + l;
      let F2;
      if (st === 0) F2 = 16 * (fA + (s % 2 ? -1 : 1) * fB) ** 2; // rock salt, unmixed indices
      else if (st === 1) F2 = (fA + (s % 2 ? -1 : 1) * fB) ** 2; // CsCl
      else { const m = s % 4; F2 = m === 0 ? 16 * (fA + fB) ** 2 : m === 2 ? 16 * (fA - fB) ** 2 : 16 * (fA * fA + fB * fB); } // zinc blende
      const name = ['rock-salt (A on the fcc sites, B shifted by (½,½,½)a)', 'CsCl (A at the corner, B at the body centre)', 'zinc blende (A on the fcc sites, B shifted by (¼,¼,¼)a)'][st];
      // second, independent route: the explicit sum over the atoms of the conventional cell
      const FCC = [[0, 0, 0], [0, 0.5, 0.5], [0.5, 0, 0.5], [0.5, 0.5, 0]];
      const sites = st === 1 ? [[fA, [0, 0, 0]], [fB, [0.5, 0.5, 0.5]]] : [...FCC.map((p) => [fA, p]), ...FCC.map((p) => [fB, p.map((x) => x + (st === 0 ? 0.5 : 0.25))])];
      return {
        q: `<p>A crystal has the ${name} structure, with form factors f<sub>A</sub> = ${fA} and f<sub>B</sub> = ${fB}. Find |F<sub>${h}${k}${l}</sub>|².</p>`,
        answer: F2, unit: '', tol: 0.001,
        hint: st === 1 ? 'Two atoms: F = f_A + f_B e^{iπ(h+k+l)}.' : 'The four fcc translations give a factor 4 for unmixed indices. Then add the second atom with its phase e^{2πi(hx+ky+lz)}.',
        solution: steps(st === 0 ? `F = 4[f_A + f_B e^{iπ(h+k+l)}]; h+k+l = ${s} is ${s % 2 ? 'odd' : 'even'}, so F = 4(${fA} ${s % 2 ? '−' : '+'} ${fB}).` : st === 1 ? `F = f_A + f_B(−1)^{h+k+l}; h+k+l = ${s}, so F = ${fA} ${s % 2 ? '−' : '+'} ${fB}.` : `F = 4[f_A + f_B e^{iπ(h+k+l)/2}]; h+k+l = ${s}, so the phase factor of B is ${s % 4 === 0 ? '+1' : s % 4 === 2 ? '−1' : s % 4 === 1 ? '+i' : '−i'}.`, `|F|² = <b>${F2}</b>.`),
        hkl: [h, k, l], sites,
      };
    },
    verify: (p) => { let re = 0, im = 0; for (const [f, x] of p.sites) { const ph = 2 * Math.PI * (p.hkl[0] * x[0] + p.hkl[1] * x[1] + p.hkl[2] * x[2]); re += f * Math.cos(ph); im += f * Math.sin(ph); } return re * re + im * im; },
  },
  'debye-waller-loss': {
    title: 'Debye-Waller attenuation',
    make(r) {
      const u2 = int(r, 4, 30) / 1000, d = int(r, 7, 25) / 10, G = 2 * Math.PI / d, answer = Math.exp(-G * G * u2 / 3);
      return {
        q: `<p>Atoms vibrate with ⟨u²⟩ = ${u2} Å² (all directions together). What fraction of the static intensity survives in the reflection from planes ${d} Å apart? Use I/I₀ = exp(−G²⟨u²⟩/3).</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'G = 2π/d for the reflecting planes.',
        solution: steps(`G = 2π/${d} = ${G.toFixed(4)} Å⁻¹, G² = ${(G * G).toFixed(3)} Å⁻².`, `Exponent G²⟨u²⟩/3 = ${(G * G * u2 / 3).toFixed(4)}.`, `I/I₀ = <b>${answer.toFixed(4)}</b>.`),
        u2, d,
      };
    },
    verify: (p) => Math.exp(-((2 * Math.PI / p.d) ** 2) * p.u2 / 3),
  },
  'born-lande': {
    title: 'Born-Landé lattice energy',
    make(r) {
      const [name, al] = [['NaCl', 1.7476], ['CsCl', 1.7627], ['ZnS', 1.6381]][int(r, 0, 2)], r0 = int(r, 200, 360) / 100, n = int(r, 6, 12);
      const answer = 1389.35 * al / r0 * (1 - 1 / n);
      return {
        q: `<p>An ionic crystal with the ${name} structure (α = ${al}) has nearest-neighbour distance ${r0} Å and Born exponent n = ${n}. Find its lattice energy in kJ/mol (N<sub>A</sub>e²/4πε₀ = 1389.35 kJ Å/mol).</p>`,
        answer, unit: 'kJ/mol', tol: 0.005,
        hint: 'At the minimum the repulsion cancels a fraction 1/n of the Madelung energy.',
        solution: steps(`Madelung energy per mole: 1389.35 × ${al}/${r0} = ${(1389.35 * al / r0).toFixed(1)} kJ/mol.`, `Times (1 − 1/n) = ${(1 - 1 / n).toFixed(4)}: <b>${answer.toFixed(1)} kJ/mol</b>.`),
        al, r0, n,
      };
    },
    verify: (p) => { const B = p.al * p.r0 ** (p.n - 1) / p.n; return -1389.35 * (-p.al / p.r0 + B / p.r0 ** p.n); },
  },
  'lj-stiffness': {
    title: 'Lennard-Jones spacing and spring constant',
    make(r) {
      const eps = int(r, 30, 250) / 10, sig = int(r, 260, 420) / 100, ask = int(r, 0, 1);
      const r0 = 2 ** (1 / 6) * sig, k = 72 * eps * 1e-3 / (2 ** (1 / 3) * sig * sig) * 16.0218;
      const answer = ask ? k : r0;
      return {
        q: `<p>Two atoms interact through a Lennard-Jones potential with ε = ${eps} meV and σ = ${sig} Å. Find ${ask ? 'the force constant U″(r₀) at the minimum, in N/m' : 'the separation r₀ at the minimum, in Å'}.</p>`,
        answer, unit: ask ? 'N/m' : 'Å', tol: 0.005,
        hint: ask ? 'At r₀, (σ/r₀)⁶ = ½. Differentiate twice: U″(r₀) = 72ε/r₀². Then 1 eV/Å² = 16.02 N/m.' : 'Set dU/dr = 0: r⁶ = 2σ⁶.',
        solution: ask ? steps(`r₀ = 2^{1/6}σ = ${r0.toFixed(4)} Å.`, `U″(r₀) = 72ε/r₀² = 72 × ${eps}×10⁻³/${(r0 * r0).toFixed(4)} = ${(k / 16.0218).toFixed(5)} eV/Å².`, `× 16.02 = <b>${k.toFixed(4)} N/m</b>.`) : steps('dU/dr = 4ε(−12σ¹²/r¹³ + 6σ⁶/r⁷) = 0 gives r⁶ = 2σ⁶.', `r₀ = 1.1225 × ${sig} = <b>${r0.toFixed(4)} Å</b>.`),
        eps, sig, ask,
      };
    },
    // independent check: numerical second derivative / numerical minimum of 4ε[(σ/r)^12 − (σ/r)^6]
    verify: (p) => {
      const U = (x) => 4 * p.eps * 1e-3 * ((p.sig / x) ** 12 - (p.sig / x) ** 6);
      let lo = p.sig, hi = 2 * p.sig; for (let i = 0; i < 80; i++) { const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3; U(m1) < U(m2) ? hi = m2 : lo = m1; }
      const r0 = (lo + hi) / 2, h = 1e-4; return p.ask ? (U(r0 + h) - 2 * U(r0) + U(r0 - h)) / (h * h) * 16.0218 : r0;
    },
  },
  'chain-mode': {
    title: 'frequency of a mode on a monatomic chain',
    make(r) {
      const M = int(r, 10, 200), K = int(r, 5, 60), f = int(r, 1, 10) / 10, mu = 1.66054e-27;
      const answer = 2 * Math.sqrt(K / (M * mu)) * Math.sin(f * Math.PI / 2) / (2 * Math.PI) / 1e12;
      return {
        q: `<p>A chain of atoms of mass ${M} u is joined by springs of ${K} N/m. Find the frequency ν (in THz) of the wave with k = ${f} π/a.</p>`,
        answer, unit: 'THz', tol: 0.005,
        hint: 'ω = 2√(K/m)|sin(ka/2)|, and ν = ω/2π. Convert u to kg (1 u = 1.6605×10⁻²⁷ kg).',
        solution: steps(`√(K/m) = ${(Math.sqrt(K / (M * mu)) / 1e12).toFixed(4)}×10¹² s⁻¹.`, `ka/2 = ${(f * 90).toFixed(1)}°, sin = ${Math.sin(f * Math.PI / 2).toFixed(4)}.`, `ω = ${(2 * Math.sqrt(K / (M * mu)) * Math.sin(f * Math.PI / 2) / 1e12).toFixed(4)}×10¹² rad/s, so ν = <b>${answer.toFixed(3)} THz</b>.`),
        M, K, f,
      };
    },
    verify: (p) => Math.sqrt(2 * p.K / (p.M * 1.66054e-27) * (1 - Math.cos(p.f * Math.PI))) / (2 * Math.PI) / 1e12,
  },
  'diatomic-branches': {
    title: 'diatomic chain: optical frequency and gap',
    make(r) {
      const M2 = int(r, 6, 40), M1 = M2 + int(r, 6, 100), K = int(r, 10, 80), ask = int(r, 0, 1), mu = 1.66054e-27;
      const w0 = Math.sqrt(2 * K * (1 / (M1 * mu) + 1 / (M2 * mu))), lo = Math.sqrt(2 * K / (M1 * mu)), hi = Math.sqrt(2 * K / (M2 * mu));
      const answer = (ask ? hi - lo : w0) / 1e13;
      return {
        q: `<p>A diatomic chain has atoms of ${M1} u and ${M2} u joined alternately by springs of ${K} N/m. Find ${ask ? 'the width of the frequency gap at the zone boundary' : 'the optical-branch frequency at k = 0'}, in units of 10¹³ rad/s.</p>`,
        answer, unit: '×10¹³ rad/s', tol: 0.005,
        hint: ask ? 'At k = π/a only one kind of atom moves in each branch: ω = √(2K/M₁) and √(2K/M₂).' : 'At k = 0 the two atoms of a cell move against each other: ω² = 2K(1/M₁ + 1/M₂).',
        solution: ask ? steps(`√(2K/M₁) = ${(lo / 1e13).toFixed(4)}, √(2K/M₂) = ${(hi / 1e13).toFixed(4)} (×10¹³ rad/s).`, `Gap = <b>${answer.toFixed(4)}×10¹³ rad/s</b>.`) : steps(`1/M₁ + 1/M₂ = ${(1 / (M1 * mu) + 1 / (M2 * mu)).toExponential(4)} kg⁻¹.`, `ω = √(2K × that) = <b>${answer.toFixed(4)}×10¹³ rad/s</b>.`),
        M1, M2, K, ask,
      };
    },
    // independent check: roots of the full diatomic dispersion relation at ka = 0 and ka = π
    verify: (p) => {
      const mu = 1.66054e-27, m1 = p.M1 * mu, m2 = p.M2 * mu, s = 1 / m1 + 1 / m2;
      const w = (ka, sg) => Math.sqrt(p.K * (s + sg * Math.sqrt(Math.max(0, s * s - 4 * Math.sin(ka / 2) ** 2 / (m1 * m2)))));
      return (p.ask ? w(Math.PI, 1) - w(Math.PI, -1) : w(0, 1)) / 1e13;
    },
  },
  'einstein-debye-c': {
    title: 'heat capacity: Einstein or Debye T³',
    make(r) {
      const model = int(r, 0, 1), th = int(r, 10, 60) * 10;
      const T = model ? int(r, 2, Math.max(3, Math.floor(th / 40))) : int(r, Math.floor(th / 6), th * 2);
      const R = 8.314462618, x = th / T;
      const answer = model ? 12 * Math.PI ** 4 / 5 * R * (T / th) ** 3 * 1000 : 3 * R * x * x * Math.exp(x) / Math.expm1(x) ** 2;
      return {
        q: model ? `<p>A monatomic insulator has θ<sub>D</sub> = ${th} K. Using the Debye T³ law, find its molar heat capacity at ${T} K in mJ mol⁻¹ K⁻¹.</p>` : `<p>A monatomic solid has Einstein temperature θ<sub>E</sub> = ${th} K. Find its molar heat capacity at ${T} K in J mol⁻¹ K⁻¹ (Einstein model).</p>`,
        answer, unit: model ? 'mJ/(mol K)' : 'J/(mol K)', tol: 0.005,
        hint: model ? 'C = (12π⁴/5) R (T/θ_D)³, and 12π⁴R/5 = 1944 J mol⁻¹ K⁻¹.' : 'C = 3R x²eˣ/(eˣ − 1)² with x = θ_E/T.',
        solution: model ? steps(`(T/θ_D)³ = (${T}/${th})³ = ${((T / th) ** 3).toExponential(4)}.`, `C = 1944 × that = <b>${answer.toFixed(4)} mJ mol⁻¹ K⁻¹</b>.`) : steps(`x = ${th}/${T} = ${x.toFixed(4)}.`, `x²eˣ/(eˣ − 1)² = ${(x * x * Math.exp(x) / Math.expm1(x) ** 2).toFixed(4)}.`, `C = 24.94 × that = <b>${answer.toFixed(3)} J mol⁻¹ K⁻¹</b>.`),
        model, th, T,
      };
    },
    // independent check: Einstein as the temperature derivative of the mean energy; Debye T³ from 234 N k (T/θ)³
    verify: (p) => {
      const R = 8.314462618;
      if (p.model) return 233.78 * R * (p.T / p.th) ** 3 * 1000;
      const E = (T) => 3 * R * p.th / Math.expm1(p.th / T), h = 1e-3 * p.T; return (E(p.T + h) - E(p.T - h)) / (2 * h);
    },
  },
};
