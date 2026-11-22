// Live problems for GATE Physics lessons (lesson kit). Each make(rand) returns { q, answer, unit, tol (relative),
// abs?, hint, solution } as HTML; verify(p) works the answer out another way for tests/exam-physics.mjs.
// Placed in a lesson as <div class="problem" data-problem="id"></div>. Exam-style practice uses the question bank instead.
const int = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  // ---------- Module 6: atomic and molecular physics ----------
  'fs-splitting': {
    title: 'fine-structure splitting of a hydrogen-like level',
    make(r) {
      const Z = int(r, 1, 3), n = int(r, 2, 4), l = int(r, 1, n - 1);
      const answer = 5.8437 * Z ** 4 / (n ** 3 * l * (l + 1));
      return {
        q: `<p>Find the separation, in cm⁻¹, between the j = l + ½ and j = l − ½ levels of the ${n}${'spdf'[l]} state of a hydrogen-like ion with Z = ${Z}. Use the Dirac shift −(R∞α²Z⁴/n⁴)(n/(j + ½) − ¾) with R∞α² = 5.8437 cm⁻¹.</p>`,
        answer, unit: 'cm⁻¹', tol: 0.005,
        hint: 'Only the n/(j + ½) term differs between the two levels; 1/l − 1/(l + 1) = 1/[l(l + 1)].',
        solution: steps(`j = ${l + 0.5} and ${l - 0.5} give n/(j + ½) = ${n}/${l + 1} and ${n}/${l}.`, `ΔE = (5.8437 × ${Z ** 4}/${n ** 4}) × ${n} × (1/${l} − 1/${l + 1}) = 5.8437 × ${Z ** 4}/(${n ** 3} × ${l * (l + 1)}).`, `<b>${answer.toPrecision(4)} cm⁻¹</b>.`),
        Z, n, l,
      };
    },
    verify: (p) => 5.8437 * p.Z ** 4 / p.n ** 3 * (1 / p.l - 1 / (p.l + 1)),
  },
  'dirac-shift': {
    title: 'fine-structure shift of a hydrogen level',
    make(r) {
      const n = int(r, 1, 4), j = int(r, 0, n - 1) + 0.5;
      const answer = -(724.52 / n ** 4) * (n / (j + 0.5) - 0.75);
      return {
        q: `<p>By how much (in μeV, with sign) does fine structure shift the hydrogen level n = ${n}, j = ${2 * j}/2 from its Bohr energy? Use R∞hcα² = 724.52 μeV.</p>`,
        answer, unit: 'μeV', tol: 0.005,
        hint: 'ΔE = −(R∞hcα²/n⁴)(n/(j + ½) − ¾). It is always negative.',
        solution: steps(`n/(j + ½) − ¾ = ${n}/${j + 0.5} − 0.75 = ${(n / (j + 0.5) - 0.75).toFixed(4)}.`, `724.52/${n ** 4} = ${(724.52 / n ** 4).toFixed(4)} μeV.`, `ΔE = <b>${answer.toFixed(2)} μeV</b>.`),
        n, j,
      };
    },
    verify: (p) => -(724.52 / p.n ** 4) * (p.n / (p.j + 0.5) - 0.75),
  },
  'lande-interval': {
    title: 'Landé interval rule',
    make(r) {
      const S = [0.5, 1, 1.5, 2][int(r, 0, 3)], L = int(r, Math.max(1, Math.ceil(S)), 4), A = int(r, 5, 80);
      const Jmax = L + S, Jmin = Math.abs(L - S), J = Jmin + int(r, 1, Math.round(Jmax - Jmin));
      const answer = A * J;
      const fr = (x) => (Number.isInteger(x) ? String(x) : `${Math.round(2 * x)}/2`);
      return {
        q: `<p>A term with S = ${fr(S)} and L = ${L} has spin-orbit constant A = ${A} cm⁻¹. By how many cm⁻¹ does the J = ${fr(J)} level lie above the J = ${fr(J - 1)} level?</p>`,
        answer, unit: 'cm⁻¹', tol: 0.001,
        hint: 'E<sub>J</sub> = (A/2)[J(J + 1) − L(L + 1) − S(S + 1)]; subtract two neighbours.',
        solution: steps('E<sub>J</sub> − E<sub>J−1</sub> = (A/2)[J(J + 1) − (J − 1)J] = AJ.', `= ${A} × ${fr(J)} = <b>${answer} cm⁻¹</b>.`),
        A, J,
      };
    },
    verify: (p) => p.A * p.J,
  },
  'helium-like-energy': {
    title: 'ionisation energy of a two-electron ion (variational)',
    make(r) {
      const Z = int(r, 2, 8);
      const answer = 2 * (Z - 5 / 16) ** 2 * 13.6 - 13.6 * Z * Z;
      return {
        q: `<p>With the variational trial function e<sup>−Z′(r₁+r₂)/a₀</sup>, a two-electron ion of nuclear charge Z = ${Z} has Z′ = Z − 5/16 and E = −2Z′² × 13.6 eV. Find the energy (eV) needed to remove one electron, leaving the one-electron ion in its ground state.</p>`,
        answer, unit: 'eV', tol: 0.005,
        hint: 'Ionisation energy = E(one-electron ion) − E(two-electron ion), with E(one-electron ion) = −13.6 Z² eV.',
        solution: steps(`Z′ = ${Z - 0.3125}; E = −2 × ${((Z - 0.3125) ** 2).toFixed(4)} × 13.6 = ${(-2 * (Z - 0.3125) ** 2 * 13.6).toFixed(2)} eV.`, `One-electron ion: −13.6 × ${Z * Z} = ${(-13.6 * Z * Z).toFixed(1)} eV.`, `Difference: <b>${answer.toFixed(2)} eV</b>.`),
        Z,
      };
    },
    verify: (p) => -13.6 * p.Z ** 2 + 2 * (p.Z - 0.3125) ** 2 * 13.6,
  },
  'lande-g': {
    title: 'Landé g factor and sublevel spacing',
    make(r) {
      const lv = [[0.5, 1, 0.5], [0.5, 1, 1.5], [0.5, 2, 1.5], [0.5, 2, 2.5], [1, 1, 1], [1, 1, 2], [1, 2, 1], [1, 2, 3], [1.5, 3, 1.5], [2, 2, 4], [1, 0, 1], [0, 2, 2]][int(r, 0, 11)];
      const [S, L, J] = lv, B = int(r, 2, 20) / 10;
      const g = 1 + (J * (J + 1) + S * (S + 1) - L * (L + 1)) / (2 * J * (J + 1));
      const answer = g * 13.996 * B;
      const fr = (x) => (Number.isInteger(x) ? String(x) : `${Math.round(2 * x)}/2`);
      return {
        q: `<p>A level with S = ${fr(S)}, L = ${L}, J = ${fr(J)} sits in a weak field of ${B} T. Find the frequency spacing, in GHz, between adjacent Zeeman sublevels. Use μ<sub>B</sub>/h = 13.996 GHz/T.</p>`,
        answer, unit: 'GHz', tol: 0.005,
        hint: 'Spacing = g<sub>J</sub>μ<sub>B</sub>B, with g<sub>J</sub> = 1 + [J(J+1) + S(S+1) − L(L+1)]/[2J(J+1)].',
        solution: steps(`g<sub>J</sub> = 1 + (${J * (J + 1)} + ${S * (S + 1)} − ${L * (L + 1)})/${2 * J * (J + 1)} = ${g.toFixed(4)}.`, `Spacing = ${g.toFixed(4)} × 13.996 × ${B} = <b>${answer.toFixed(3)} GHz</b>.`),
        S, L, J, B,
      };
    },
    verify: (p) => (1 + (p.J * (p.J + 1) + p.S * (p.S + 1) - p.L * (p.L + 1)) / (2 * p.J * (p.J + 1))) * 13.996 * p.B,
  },
  'zeeman-normal': {
    title: 'normal Zeeman splitting in wavelength',
    make(r) {
      const lam = int(r, 4000, 7000) / 10, B = int(r, 5, 30) / 10;
      const answer = (lam * 1e-7) ** 2 * 0.46686 * B * 1e10;
      return {
        q: `<p>A singlet line at ${lam} nm is placed in a ${B} T field. Find the wavelength spacing, in pm, between adjacent components of the normal Zeeman triplet. Use μ<sub>B</sub>/hc = 0.46686 cm⁻¹/T.</p>`,
        answer, unit: 'pm', tol: 0.005,
        hint: 'Δν̃ = μ<sub>B</sub>B/hc, and Δλ = λ²Δν̃ (λ in cm when ν̃ is in cm⁻¹).',
        solution: steps(`Δν̃ = 0.46686 × ${B} = ${(0.46686 * B).toFixed(4)} cm⁻¹.`, `Δλ = (${lam}×10⁻⁷ cm)² × ${(0.46686 * B).toFixed(4)} cm⁻¹ = ${(answer / 1e10).toExponential(3)} cm = <b>${answer.toFixed(2)} pm</b>.`),
        lam, B,
      };
    },
    verify: (p) => (p.lam * 1e-7) ** 2 * 0.46686 * p.B * 1e10,
  },
  'rotor-bond': {
    title: 'bond length from rotational line spacing',
    make(r) {
      const mols = [['¹H³⁵Cl', 1.007825, 34.968853], ['¹²C¹⁶O', 12, 15.994915], ['¹H¹⁹F', 1.007825, 18.998403], ['¹H⁷⁹Br', 1.007825, 78.918338], ['¹⁴N¹⁶O', 14.003074, 15.994915], ['⁷Li¹H', 7.016004, 1.007825]];
      const [name, m1, m2] = mols[int(r, 0, mols.length - 1)];
      const mu = m1 * m2 / (m1 + m2), rr = int(r, 900, 1700) / 10;
      const sp = +(2 * 16.8576 / (mu * (rr / 100) ** 2)).toFixed(3);
      const answer = Math.sqrt(16.8576 / ((sp / 2) * mu)) * 100;
      return {
        q: `<p>Adjacent lines in the far-infrared rotational spectrum of ${name} (atomic masses ${m1.toFixed(3)} u and ${m2.toFixed(3)} u) are ${sp} cm⁻¹ apart (a practice value, not the real one). Find the bond length in pm. Use I (u Å²) = 16.8576/B (cm⁻¹).</p>`,
        answer, unit: 'pm', tol: 0.005,
        hint: 'The spacing is 2B. Then I = 16.8576/B and r = √(I/μ) with μ = m₁m₂/(m₁ + m₂).',
        solution: steps(`B = ${sp}/2 = ${(sp / 2).toFixed(4)} cm⁻¹.`, `μ = ${mu.toFixed(4)} u; I = 16.8576/${(sp / 2).toFixed(4)} = ${(16.8576 / (sp / 2)).toFixed(4)} u Å².`, `r = √(I/μ) = ${(answer / 100).toFixed(4)} Å = <b>${answer.toFixed(1)} pm</b>.`),
        sp, mu,
      };
    },
    verify: (p) => Math.sqrt(16.8576 / ((p.sp / 2) * p.mu)) * 100,
  },
  'rotor-jmax': {
    title: 'most populated rotational level',
    make(r) {
      const B = int(r, 5, 200) / 10, T = [100, 200, 300, 500, 1000][int(r, 0, 4)];
      const f = (J) => (2 * J + 1) * Math.exp(-1.438777 * B * J * (J + 1) / T);
      let answer = 0; for (let J = 1; J < 200; J++) if (f(J) > f(answer)) answer = J;
      return {
        q: `<p>A diatomic molecule has B = ${B} cm⁻¹. Which rotational level J is most populated at ${T} K? Use hc/k = 1.4388 cm K.</p>`,
        answer, unit: '', tol: 0, abs: 1e-9,
        hint: 'Population ∝ (2J + 1)e<sup>−hcBJ(J+1)/kT</sup>; start from J ≈ √(kT/2hcB) − ½ and compare the neighbouring integers.',
        solution: steps(`kT/hc = ${T}/1.4388 = ${(T / 1.438777).toFixed(1)} cm⁻¹.`, `√(kT/2hcB) − ½ = ${(Math.sqrt(T / (2 * 1.438777 * B)) - 0.5).toFixed(2)}.`, `Comparing (2J + 1)e<sup>−BJ(J+1)hc/kT</sup> at the integers nearby: <b>J = ${answer}</b>.`),
        B, T,
      };
    },
    verify: (p) => { const f = (J) => (2 * J + 1) * Math.exp(-1.438777 * p.B * J * (J + 1) / p.T); let b = 0; for (let J = 1; J < 200; J++) if (f(J) > f(b)) b = J; return b; },
  },
  'vib-anharmonic': {
    title: 'ω̃e and the Morse well depth from two bands',
    make(r) {
      const we = int(r, 1000, 4000), x = int(r, 40, 250) / 10;
      const n1 = +(we - 2 * x).toFixed(1), n2 = +(2 * we - 6 * x).toFixed(1);
      const W = 3 * n1 - n2, X = (W - n1) / 2;
      const answer = W * W / (4 * X) * 1.239842e-4;
      return {
        q: `<p>A diatomic molecule shows its fundamental at ${n1} cm⁻¹ and first overtone at ${n2} cm⁻¹. Find ω̃e and ω̃e·xe from G(v) = ω̃e(v + ½) − ω̃e·xe(v + ½)², then the Morse well depth De = ω̃e²/(4ω̃e·xe) in eV (1 cm⁻¹ = 1.2398×10⁻⁴ eV).</p>`,
        answer, unit: 'eV', tol: 0.005,
        hint: 'Fundamental = ω̃e − 2ω̃e·xe; overtone = 2ω̃e − 6ω̃e·xe. So 3 × fundamental − overtone = ω̃e.',
        solution: steps(`ω̃e = 3(${n1}) − ${n2} = ${W.toFixed(1)} cm⁻¹.`, `ω̃e·xe = (${W.toFixed(1)} − ${n1})/2 = ${X.toFixed(2)} cm⁻¹.`, `De = ${W.toFixed(1)}²/(4 × ${X.toFixed(2)}) = ${(W * W / (4 * X)).toFixed(0)} cm⁻¹ = <b>${answer.toFixed(3)} eV</b>.`),
        n1, n2,
      };
    },
    verify: (p) => { const W = 3 * p.n1 - p.n2, X = (W - p.n1) / 2; return W * W / (4 * X) * 1.239842e-4; },
  },
  'raman-stokes': {
    title: 'wavelength of a Raman line',
    make(r) {
      const lams = [532, 514.5, 488, 632.8, 785, 355], lam = lams[int(r, 0, 5)], sh = int(r, 200, 3500), stokes = r() < 0.7;
      const answer = 1e7 / (1e7 / lam + (stokes ? -sh : sh));
      return {
        q: `<p>A sample is excited at ${lam} nm. At what wavelength (nm) does the ${stokes ? 'Stokes' : 'anti-Stokes'} line of a ${sh} cm⁻¹ vibration appear?</p>`,
        answer, unit: 'nm', tol: 0.0005,
        hint: 'Work in wavenumbers: ν̃ = 10⁷/λ(nm). Stokes lines are lower by the shift, anti-Stokes higher.',
        solution: steps(`ν̃₀ = 10⁷/${lam} = ${(1e7 / lam).toFixed(1)} cm⁻¹.`, `${stokes ? 'Stokes' : 'Anti-Stokes'}: ${(1e7 / lam).toFixed(1)} ${stokes ? '−' : '+'} ${sh} = ${(1e7 / answer).toFixed(1)} cm⁻¹.`, `λ = 10⁷/${(1e7 / answer).toFixed(1)} = <b>${answer.toFixed(2)} nm</b>.`),
        lam, sh, stokes,
      };
    },
    verify: (p) => 1e7 / (1e7 / p.lam + (p.stokes ? -p.sh : p.sh)),
  },
  'raman-temp': {
    title: 'temperature from the anti-Stokes to Stokes ratio',
    make(r) {
      const sh = int(r, 200, 1500), T = int(r, 250, 1200);
      const ratio = +Math.exp(-1.438777 * sh / T).toPrecision(3);
      const answer = 1.438777 * sh / Math.log(1 / ratio);
      return {
        q: `<p>The anti-Stokes to Stokes intensity ratio of a ${sh} cm⁻¹ Raman band, already corrected for the ν⁴ factor, is ${ratio}. Find the temperature in K (hc/k = 1.4388 cm K).</p>`,
        answer, unit: 'K', tol: 0.005,
        hint: 'After the ν⁴ correction the ratio is the Boltzmann factor e<sup>−hcν̃/kT</sup>.',
        solution: steps(`ln(1/${ratio}) = ${Math.log(1 / ratio).toFixed(4)}.`, `T = 1.4388 × ${sh}/${Math.log(1 / ratio).toFixed(4)} = <b>${answer.toFixed(0)} K</b>.`),
        sh, ratio,
      };
    },
    verify: (p) => 1.438777 * p.sh / Math.log(1 / p.ratio),
  },
  'laser-threshold': {
    title: 'threshold gain of a laser',
    make(r) {
      const R1 = [1, 0.999, 0.99][int(r, 0, 2)], R2 = int(r, 50, 99) / 100, L = int(r, 5, 100) / 100, a = int(r, 0, 20) / 10;
      const answer = a + Math.log(1 / (R1 * R2)) / (2 * L);
      return {
        q: `<p>A ${L} m gain medium with internal loss ${a} m⁻¹ sits between mirrors of reflectance ${R1} and ${R2}. Find the threshold gain coefficient in m⁻¹.</p>`,
        answer, unit: 'm⁻¹', tol: 0.005,
        hint: 'One round trip multiplies the intensity by R₁R₂e<sup>2(g − α)L</sup>; set that equal to 1.',
        solution: steps(`ln(1/R₁R₂) = ln(1/${(R1 * R2).toFixed(4)}) = ${Math.log(1 / (R1 * R2)).toFixed(5)}.`, `Divide by 2L = ${+(2 * L).toFixed(2)}: ${(Math.log(1 / (R1 * R2)) / (2 * L)).toFixed(4)} m⁻¹.`, `Add α: g<sub>th</sub> = <b>${answer.toFixed(4)} m⁻¹</b>.`),
        R1, R2, L, a,
      };
    },
    verify: (p) => p.a + Math.log(1 / (p.R1 * p.R2)) / (2 * p.L),
  },
  'laser-modes': {
    title: 'longitudinal mode spacing of a laser',
    make(r) {
      const L = int(r, 10, 150) / 100, n = [1, 1, 1.5, 1.82][int(r, 0, 3)];
      const answer = 2.99792458e8 / (2 * n * L) / 1e6;
      return {
        q: `<p>A laser cavity is ${L} m long and filled with a medium of refractive index ${n}. Find the frequency spacing of its longitudinal modes in MHz.</p>`,
        answer, unit: 'MHz', tol: 0.003,
        hint: 'Standing waves need a whole number of half-wavelengths in the optical length nL, so Δν = c/(2nL).',
        solution: steps(`Δν = c/(2nL) = 2.998×10⁸/(2 × ${n} × ${L}).`, `= <b>${answer.toFixed(1)} MHz</b>. Divide the gain bandwidth by this to estimate how many modes can lase.`),
        L, n,
      };
    },
    verify: (p) => 2.99792458e8 / (2 * p.n * p.L) / 1e6,
  },
};
