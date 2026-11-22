// Live problems for CSIR NET Physics lessons (lesson kit). Each make(rand) returns { q, answer, unit, tol (relative),
// abs?, hint, solution } as HTML; verify(p) works the answer out another way for tests/exam-physics.mjs.
// Placed in a lesson as <div class="problem" data-problem="id"></div>. Exam-style practice uses the question bank instead.
const int = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

const KB = 8.617333e-5, HPL = 6.62607015e-34, QE = 1.602176634e-19, EPS0 = 8.8541878128e-12, ME = 9.1093837e-31, HBAR = 1.054571817e-34, CL = 2.99792458e8;
const HC = 197.327, MUNP = 469.46;
// S-wave square-well depth that binds at -B (MeV) for range R (fm): solve k cot kR = -kappa on (pi/2R, pi/R)
const wellDepth = (R, B) => {
  const ka = Math.sqrt(2 * MUNP * B) / HC;
  let lo = Math.PI / (2 * R), hi = Math.PI / R - 1e-12;
  for (let i = 0; i < 100; i++) { const k = (lo + hi) / 2; if (k / Math.tan(k * R) + ka > 0) lo = k; else hi = k; }
  return { k: lo, ka, V0: (HC * lo) ** 2 / (2 * MUNP) + B };
};

export default {
  // ---- 9.2 to 9.4 solid state (CSIR NET) ----
  'vacancy-ppm': {
    title: 'equilibrium vacancy fraction from the formation energy',
    make(r) {
      const E = int(r, 8, 14) / 10, T = int(r, 18, 26) * 50;
      const x = Math.exp(-E / (KB * T)), answer = 1e6 * x;
      return {
        q: `<p>The vacancy formation energy in a metal is E<sub>v</sub> = ${E} eV. Ignoring the formation entropy, find the equilibrium fraction of vacant lattice sites at T = ${T} K, in parts per million.</p>`,
        answer, unit: 'ppm', tol: 0.01,
        hint: 'Minimising F = nE<sub>v</sub> − TS with S = k ln[N!/(n!(N−n)!)] gives n/N ≈ exp(−E<sub>v</sub>/kT) when n ≪ N.',
        solution: steps(`kT = 8.617×10⁻⁵ × ${T} = ${(KB * T).toFixed(5)} eV.`, `E<sub>v</sub>/kT = ${(E / (KB * T)).toFixed(3)}.`, `n/N = exp(−${(E / (KB * T)).toFixed(3)}) = ${x.toExponential(3)} = <b>${answer.toPrecision(3)} ppm</b>.`),
        E, T,
      };
    },
    verify(p) { return 1e6 * 10 ** (-p.E / (KB * p.T) / Math.LN10); },
  },
  'taylor-density': {
    title: 'dislocation density from the Taylor hardening law',
    make(r) {
      const G = int(r, 25, 80), b = int(r, 25, 29) / 100, al = [0.2, 0.3, 0.4, 0.5][int(r, 0, 3)], tau = int(r, 10, 60);
      const rho = (tau * 1e6 / (al * G * 1e9 * b * 1e-9)) ** 2, answer = rho / 1e12;
      return {
        q: `<p>A cold-worked metal has shear modulus G = ${G} GPa and Burgers vector b = ${b} nm. Its flow stress follows Taylor's law τ = αGb√ρ with α = ${al}. If the measured shear flow stress is τ = ${tau} MPa, find the dislocation density ρ in units of 10¹² m⁻².</p>`,
        answer, unit: '10¹² m⁻²', tol: 0.01,
        hint: 'Invert the law: ρ = (τ/αGb)². Keep every quantity in SI units (Pa and m).',
        solution: steps(`αGb = ${al} × ${G}×10⁹ Pa × ${b}×10⁻⁹ m = ${(al * G * b).toFixed(3)} Pa·m.`, `√ρ = τ/(αGb) = ${tau}×10⁶ / ${(al * G * b).toFixed(3)} = ${(tau * 1e6 / (al * G * b)).toExponential(3)} m⁻¹.`, `ρ = ${rho.toExponential(3)} m⁻² = <b>${answer.toPrecision(3)} × 10¹² m⁻²</b>.`),
        G, b, al, tau,
      };
    },
    verify(p) { return Math.exp(2 * (Math.log(p.tau * 1e6) - Math.log(p.al * p.G * 1e9 * p.b * 1e-9))) / 1e12; },
  },
  'clausius-polarisability': {
    title: 'molecular polarisability from the Clausius-Mossotti relation',
    make(r) {
      const er = int(r, 105, 300) / 100, N = int(r, 15, 60) / 10;
      const ratio = (er - 1) / (er + 2), alpha = 3 * EPS0 * ratio / (N * 1e28), answer = alpha / 1e-40;
      return {
        q: `<p>A non-polar solid has N = ${N} × 10²⁸ molecules per m³ and relative permittivity ε<sub>r</sub> = ${er}. Using the Lorentz local field, find the molecular polarisability α in units of 10⁻⁴⁰ F m².</p>`,
        answer, unit: '10⁻⁴⁰ F m²', tol: 0.01,
        hint: 'Clausius-Mossotti: (ε<sub>r</sub> − 1)/(ε<sub>r</sub> + 2) = Nα/3ε₀.',
        solution: steps(`(ε<sub>r</sub> − 1)/(ε<sub>r</sub> + 2) = ${(er - 1).toFixed(2)}/${(er + 2).toFixed(2)} = ${ratio.toFixed(4)}.`, `α = 3ε₀ × ${ratio.toFixed(4)} / N = 3 × 8.854×10⁻¹² × ${ratio.toFixed(4)} / ${N}×10²⁸.`, `α = <b>${answer.toPrecision(3)} × 10⁻⁴⁰ F m²</b>.`),
        er, N,
      };
    },
    verify(p) { const x = p.N * 1e28 * 1e-40 / (3 * EPS0); /* x·a = (er-1)/(er+2) */ return (p.er - 1) / ((p.er + 2) * x); },
  },
  'drude-reflect': {
    title: 'plasma wavelength of a free-electron metal',
    make(r) {
      const n = int(r, 8, 60) / 10;
      const wp = Math.sqrt(n * 1e28 * QE * QE / (EPS0 * ME)), answer = 2 * Math.PI * CL / wp * 1e9;
      return {
        q: `<p>A metal has n = ${n} × 10²⁸ free electrons per m³ (take the free-electron mass and neglect damping and core polarisation). Below what wavelength, in nm, does it become transparent?</p>`,
        answer, unit: 'nm', tol: 0.01,
        hint: 'ε(ω) = 1 − ω<sub>p</sub>²/ω² with ω<sub>p</sub>² = ne²/ε₀m. Waves propagate when ε > 0, that is ω > ω<sub>p</sub>, so λ < λ<sub>p</sub> = 2πc/ω<sub>p</sub>.',
        solution: steps(`ω<sub>p</sub> = √(ne²/ε₀m) = ${wp.toExponential(3)} rad/s (ħω<sub>p</sub> = ${(HBAR * wp / QE).toFixed(2)} eV).`, `λ<sub>p</sub> = 2πc/ω<sub>p</sub> = <b>${answer.toPrecision(3)} nm</b>.`, 'Shorter wavelengths (higher frequencies) pass through: the ultraviolet transparency of the alkali metals.'),
        n,
      };
    },
    verify(p) { return 2 * Math.PI * CL * Math.sqrt(EPS0 * ME / (p.n * 1e28)) / QE * 1e9; },
  },
  'hall-plateau-field': {
    title: 'magnetic field at the centre of a quantum Hall plateau',
    make(r) {
      const n = int(r, 10, 60) / 10, nu = int(r, 1, 6);
      const answer = n * 1e15 * HPL / (QE * nu);
      return {
        q: `<p>A two-dimensional electron gas has sheet density n = ${n} × 10¹⁵ m⁻². At what magnetic field, in tesla, is the filling factor exactly ν = ${nu}? What is the Hall resistance there?</p>`,
        answer, unit: 'T', tol: 0.01,
        hint: 'Each (spin-resolved) Landau level holds eB/h states per unit area, so ν = nh/(eB).',
        solution: steps(`eB/h per level; ν = nh/(eB) gives B = nh/(eν).`, `B = ${n}×10¹⁵ × 6.626×10⁻³⁴ / (1.602×10⁻¹⁹ × ${nu}) = <b>${answer.toPrecision(3)} T</b>.`, `There R<sub>xy</sub> = h/(νe²) = 25 812.8/${nu} = ${(25812.807 / nu).toFixed(1)} Ω.`),
        n, nu,
      };
    },
    verify(p) { return (p.n * 1e15 / p.nu) / (QE / HPL); },
  },
  'well-subbands': {
    title: 'subband spacing in a quantum well',
    make(r) {
      const L = int(r, 5, 20), m = [0.067, 0.023, 0.19][int(r, 0, 2)], name = { 0.067: 'GaAs', 0.023: 'InAs', 0.19: 'Si (along the confinement)' }[m];
      const E1 = (Math.PI * HBAR / (L * 1e-9)) ** 2 / (2 * m * ME) / QE * 1000, answer = 3 * E1;
      return {
        q: `<p>Electrons in a ${L} nm wide ${name} quantum well have effective mass m* = ${m} m<sub>e</sub>. Treating the well as infinitely deep, find the energy gap between the first two subbands, E₂ − E₁, in meV.</p>`,
        answer, unit: 'meV', tol: 0.01,
        hint: 'E<sub>n</sub> = n²π²ħ²/(2m*L²), so E₂ − E₁ = 3E₁.',
        solution: steps(`E₁ = π²ħ²/(2m*L²) = ${E1.toFixed(2)} meV (π²ħ²/2m<sub>e</sub> = 0.376 eV nm², divided by ${m} × ${L}²).`, `E₂ − E₁ = 3E₁ = <b>${answer.toPrecision(3)} meV</b>.`, 'If this is much larger than kT, only the lowest subband is filled and the electrons move in two dimensions.'),
        L, m,
      };
    },
    verify(p) { return 3 * HPL * HPL / (8 * p.m * ME * (p.L * 1e-9) ** 2) / QE * 1000; },
  },
  // ---- 10.2 to 10.4 nuclear and particle (CSIR NET) ----
  'deuteron-depth': {
    title: 'square-well depth that binds the deuteron',
    make(r) {
      const R = int(r, 15, 28) / 10, B = [2.2246, 2.2246, 1.5, 3.0][int(r, 0, 3)];
      const s = wellDepth(R, B), answer = s.V0;
      return {
        q: `<p>Model the neutron-proton force as an attractive square well of range R = ${R} fm. What depth V₀, in MeV, gives a single S-wave bound state at E = −${B} MeV? (ħc = 197.33 MeV fm, reduced mass μc² = 469.46 MeV.)</p>`,
        answer, unit: 'MeV', tol: 0.01,
        hint: 'Inside u = sin kr with k = √(2μ(V₀ − B))/ħ; outside u ∝ e<sup>−κr</sup> with κ = √(2μB)/ħ. Matching u′/u at R gives k cot kR = −κ, with kR a little above π/2. Solve it numerically.',
        solution: steps(`κ = √(2 × 469.46 × ${B})/197.33 = ${s.ka.toFixed(4)} fm⁻¹.`, `Solve k cot(k × ${R}) = −${s.ka.toFixed(4)}: k = ${s.k.toFixed(4)} fm⁻¹, kR = ${(s.k * R).toFixed(4)} (just above π/2).`, `V₀ = (ħck)²/(2μc²) + B = ${((HC * s.k) ** 2 / (2 * MUNP)).toFixed(2)} + ${B} = <b>${answer.toFixed(2)} MeV</b>.`),
        R, B,
      };
    },
    verify(p) {
      // Newton on x = kR for x cot x = -kappa R, then depth
      const ka = Math.sqrt(2 * MUNP * p.B) / HC, c = ka * p.R; let x = Math.PI / 2 + 0.3;
      for (let i = 0; i < 60; i++) { const f = x / Math.tan(x) + c, d = 1 / Math.tan(x) - x / Math.sin(x) ** 2; x -= f / d; }
      return (HC * x / p.R) ** 2 / (2 * MUNP) + p.B;
    },
  },
  'np-scattering-length': {
    title: 'low-energy neutron-proton cross section from the scattering lengths',
    make(r) {
      const at = int(r, 530, 550) / 100, as = -int(r, 2300, 2400) / 100;
      const sig = Math.PI * (3 * at * at + as * as) / 100, answer = sig;
      return {
        q: `<p>The triplet and singlet neutron-proton scattering lengths are a<sub>t</sub> = ${at} fm and a<sub>s</sub> = ${as} fm. Find the zero-energy np cross section for unpolarised beams, in barns.</p>`,
        answer, unit: 'b', tol: 0.01,
        hint: 'At zero energy σ = 4πa² for each spin channel. Unpolarised: 3/4 of pairs are triplet, 1/4 singlet.',
        solution: steps(`σ = 4π[(3/4)a<sub>t</sub>² + (1/4)a<sub>s</sub>²] = π(3a<sub>t</sub>² + a<sub>s</sub>²).`, `= π(3 × ${(at * at).toFixed(3)} + ${(as * as).toFixed(2)}) fm² = ${(sig * 100).toFixed(1)} fm².`, `1 b = 100 fm², so σ = <b>${answer.toFixed(2)} b</b>: far above 4πa<sub>t</sub>² = ${(4 * Math.PI * at * at / 100).toFixed(2)} b, proof that the singlet state has a large (virtual) scattering length.`),
        at, as,
      };
    },
    verify(p) { return 4 * Math.PI * (0.75 * p.at ** 2 + 0.25 * p.as ** 2) / 100; },
  },
  'rotor-gamma-ladder': {
    title: 'gamma-ray energy in a ground-state rotational band',
    make(r) {
      const E2 = int(r, 40, 110), I = 2 * int(r, 2, 6);
      const A = E2 / 6, answer = A * (4 * I - 2);
      return {
        q: `<p>An even-even deformed nucleus has its first 2⁺ state at ${E2} keV. Treating its ground band as a rigid rotor, find the energy of the E2 gamma ray from the ${I}⁺ level to the ${I - 2}⁺ level, in keV.</p>`,
        answer, unit: 'keV', tol: 0.005,
        hint: 'E(I) = (ħ²/2𝓘) I(I+1), so E(2⁺) = 6ħ²/2𝓘. The I → I − 2 gamma ray has energy (ħ²/2𝓘)(4I − 2).',
        solution: steps(`ħ²/2𝓘 = ${E2}/6 = ${A.toFixed(3)} keV.`, `E(${I}) − E(${I - 2}) = ${A.toFixed(3)} × [${I * (I + 1)} − ${(I - 2) * (I - 1)}] = ${A.toFixed(3)} × ${4 * I - 2}.`, `E<sub>γ</sub> = <b>${answer.toFixed(1)} keV</b>.`),
        E2, I,
      };
    },
    verify(p) { const A = p.E2 / 6; return A * p.I * (p.I + 1) - A * (p.I - 2) * (p.I - 1); },
  },
  'spectroscopic-q': {
    title: 'spectroscopic quadrupole moment from the intrinsic moment',
    make(r) {
      const I = [1.5, 2.5, 3.5, 4.5][int(r, 0, 3)], Q0 = int(r, 20, 90) / 10;
      const answer = Q0 * (3 * I * I - I * (I + 1)) / ((I + 1) * (2 * I + 3));
      return {
        q: `<p>An odd-A deformed nucleus has intrinsic quadrupole moment Q₀ = ${Q0} b. Its ground state is the band head with I = K = ${I * 2}/2. Find the spectroscopic quadrupole moment Q measured in the lab, in barns.</p>`,
        answer, unit: 'b', tol: 0.005,
        hint: 'Q = Q₀ [3K² − I(I+1)] / [(I+1)(2I+3)]. With I = K this is Q₀ I(2I − 1)/[(I+1)(2I+3)].',
        solution: steps(`3K² − I(I+1) = ${(3 * I * I).toFixed(2)} − ${(I * (I + 1)).toFixed(2)} = ${(3 * I * I - I * (I + 1)).toFixed(2)}.`, `(I+1)(2I+3) = ${(I + 1).toFixed(1)} × ${2 * I + 3} = ${((I + 1) * (2 * I + 3)).toFixed(2)}.`, `Q = ${Q0} × ${(3 * I * I - I * (I + 1)).toFixed(2)}/${((I + 1) * (2 * I + 3)).toFixed(2)} = <b>${answer.toFixed(3)} b</b>, smaller than Q₀ because the rotation averages the shape.`),
        I, Q0,
      };
    },
    verify(p) { return p.Q0 * p.I * (2 * p.I - 1) / ((p.I + 1) * (2 * p.I + 3)); },
  },
  'gmo-predict': {
    title: 'Gell-Mann–Okubo prediction of the Λ mass',
    make(r) {
      const N = 939 + int(r, -3, 3), Xi = 1318 + int(r, -4, 4), Sig = 1193 + int(r, -4, 4);
      const answer = (2 * (N + Xi) - Sig) / 3;
      return {
        q: `<p>Take the baryon-octet masses as M<sub>N</sub> = ${N} MeV, M<sub>Ξ</sub> = ${Xi} MeV and M<sub>Σ</sub> = ${Sig} MeV. Use the Gell-Mann–Okubo formula to predict M<sub>Λ</sub> in MeV.</p>`,
        answer, unit: 'MeV', tol: 0.002,
        hint: 'For the octet the mass formula M = a + bY + c[I(I+1) − Y²/4] leads to 2(M<sub>N</sub> + M<sub>Ξ</sub>) = 3M<sub>Λ</sub> + M<sub>Σ</sub>.',
        solution: steps(`2(M<sub>N</sub> + M<sub>Ξ</sub>) = 2 × ${N + Xi} = ${2 * (N + Xi)} MeV.`, `3M<sub>Λ</sub> = ${2 * (N + Xi)} − ${Sig} = ${2 * (N + Xi) - Sig} MeV.`, `M<sub>Λ</sub> = <b>${answer.toFixed(1)} MeV</b> (measured 1115.7 MeV).`),
        N, Xi, Sig,
      };
    },
    verify(p) {
      // fit a, b, c from N (Y=1,I=1/2), Sig (Y=0,I=1), Xi (Y=-1,I=1/2), then evaluate Lambda (Y=0,I=0)
      const b = (p.N - p.Xi) / 2, c = (p.Sig - (p.N + p.Xi) / 2) / (2 - 0.5), a = p.Sig - 2 * c;
      return a + 0 * b; // b (the hypercharge term) drops out for Y = 0
    },
  },
  'kaon-threshold': {
    title: 'threshold pion energy for associated strangeness production',
    make(r) {
      const R = [['π⁻ p → K⁰ Λ', 139.57, 497.61, 1115.68], ['π⁻ p → K⁺ Σ⁻', 139.57, 493.68, 1197.45], ['π⁺ p → K⁺ Σ⁺', 139.57, 493.68, 1189.37], ['π⁻ p → K⁰ Σ⁰', 139.57, 497.61, 1192.64]][int(r, 0, 3)];
      const [rx, mpi, mK, mY] = R, mp = 938.27, M = mK + mY;
      const answer = (M * M - (mpi + mp) ** 2) / (2 * mp);
      return {
        q: `<p>A pion beam hits protons at rest and makes strange particles through ${rx}. Find the threshold kinetic energy of the pion, in MeV. (m<sub>π</sub> = ${mpi}, m<sub>p</sub> = ${mp}, m<sub>K</sub> = ${mK}, m<sub>Y</sub> = ${mY} MeV.) Check that strangeness is conserved.</p>`,
        answer, unit: 'MeV', tol: 0.005,
        hint: 'At threshold the products are at rest in the centre-of-mass frame: s = (m<sub>K</sub> + m<sub>Y</sub>)². In the lab s = m<sub>π</sub>² + m<sub>p</sub>² + 2E<sub>π</sub>m<sub>p</sub>.',
        solution: steps(`Strangeness: 0 + 0 → (+1) + (−1). The strong interaction conserves S, so the kaon and the hyperon are made together.`, `√s at threshold = ${M.toFixed(2)} MeV; initial rest masses add to ${(mpi + mp).toFixed(2)} MeV.`, `T<sub>π</sub> = [(${M.toFixed(2)})² − (${(mpi + mp).toFixed(2)})²]/(2 × ${mp}) = <b>${answer.toFixed(1)} MeV</b>.`),
        mpi, mK, mY, mp,
      };
    },
    verify(p) { const s = (p.mK + p.mY) ** 2, E = (s - p.mpi ** 2 - p.mp ** 2) / (2 * p.mp); return E - p.mpi; },
  },
};
