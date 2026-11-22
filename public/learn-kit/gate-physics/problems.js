// Live problems for GATE Physics lessons (lesson kit). Each make(rand) returns { q, answer, unit, tol (relative),
// abs?, hint, solution } as HTML; verify(p) works the answer out another way for tests/exam-physics.mjs.
// Placed in a lesson as <div class="problem" data-problem="id"></div>. Exam-style practice uses the question bank instead.
const int = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  // ---- module 5: statistical physics ----
  'stat-boltzmann-ratio': {
    title: 'population ratio of two degenerate levels',
    make(r) {
      const g1 = int(r, 1, 3), g2 = int(r, 1, 5), dE = int(r, 5, 60), T = [100, 200, 300, 500][int(r, 0, 3)];
      const kT = 8.617333e-5 * T * 1000, answer = (g2 / g1) * Math.exp(-dE / kT);
      return {
        q: `<p>A lower level (degeneracy ${g1}) and an upper level (degeneracy ${g2}) are ${dE} meV apart. Find N<sub>upper</sub>/N<sub>lower</sub> in equilibrium at ${T} K.</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'Canonical ensemble: each microstate has weight e<sup>−E/kT</sup>, and a level contains g microstates.',
        solution: steps(`kT = 8.617×10⁻⁵ × ${T} eV = ${kT.toFixed(3)} meV.`, `Boltzmann factor e<sup>−${dE}/${kT.toFixed(3)}</sup> = ${Math.exp(-dE / kT).toFixed(5)}.`, `Multiply by g₂/g₁ = ${g2}/${g1}: ratio = <b>${answer.toFixed(5)}</b>.`),
        g1, g2, dE, T,
      };
    },
    verify: (p) => (p.g2 / p.g1) * Math.exp(-p.dE / (8.617333e-5 * p.T * 1000)),
  },
  'stat-schottky': {
    title: 'heat capacity of a two-level system',
    make(r) {
      const eps = int(r, 2, 40), T = int(r, 5, 200);
      const x = eps / (8.617333e-5 * T * 1000), answer = (x * x * Math.exp(x)) / (1 + Math.exp(x)) ** 2;
      return {
        q: `<p>Paramagnetic ions have two non-degenerate levels ${eps} meV apart. Find the heat capacity per ion, in units of k, at ${T} K.</p>`,
        answer, unit: 'k', tol: 0.01, abs: 1e-4,
        hint: 'Z = 1 + e<sup>−x</sup> with x = ε/kT. Find U = ε/(e<sup>x</sup> + 1), then C = dU/dT.',
        solution: steps(`x = ε/kT = ${eps}/${(8.617333e-5 * T * 1000).toFixed(3)} = ${x.toFixed(4)}.`, `C/k = x²eˣ/(1 + eˣ)² = ${(x * x).toFixed(4)} × ${Math.exp(x).toFixed(4)} / ${((1 + Math.exp(x)) ** 2).toFixed(4)}.`, `C/k = <b>${answer.toFixed(4)}</b>. The largest possible value is 0.439, at x = 2.40.`),
        eps, T,
      };
    },
    verify: (p) => { const x = p.eps / (8.617333e-5 * p.T * 1000); return (x * x * Math.exp(x)) / (1 + Math.exp(x)) ** 2; },
  },
  'stat-sackur-tetrode': {
    title: 'Sackur-Tetrode entropy of a noble gas',
    make(r) {
      const [name, M] = [['helium', 4.0026], ['neon', 20.18], ['argon', 39.948], ['krypton', 83.798], ['xenon', 131.29]][int(r, 0, 4)];
      const T = [100, 200, 300, 500, 1000][int(r, 0, 4)], P = [0.1, 1, 10][int(r, 0, 2)];
      const k = 1.380649e-23, h = 6.62607015e-34, m = M * 1.66053906660e-27;
      const lam = h / Math.sqrt(2 * Math.PI * m * k * T), vN = k * T / (P * 1e5), answer = 8.314462618 * (Math.log(vN / lam ** 3) + 2.5);
      return {
        q: `<p>Find the molar entropy of ${name} (m = ${M} u) at ${T} K and ${P} bar, treating it as a classical ideal gas.</p>`,
        answer, unit: 'J mol⁻¹ K⁻¹', tol: 0.005,
        hint: 'S = Nk[ln(V/Nλ³) + 5/2] with λ = h/√(2πmkT) and V/N = kT/P.',
        solution: steps(`λ = h/√(2πmkT) = ${lam.toExponential(4)} m.`, `V/N = kT/P = ${vN.toExponential(4)} m³.`, `ln(V/Nλ³) = ${Math.log(vN / lam ** 3).toFixed(4)}; add 2.5 and multiply by R: S = <b>${answer.toFixed(2)}</b> J mol⁻¹ K⁻¹.`),
        M, T, P,
      };
    },
    verify: (p) => { const k = 1.380649e-23, lam = 6.62607015e-34 / Math.sqrt(2 * Math.PI * p.M * 1.66053906660e-27 * k * p.T); return 8.314462618 * (Math.log((k * p.T / (p.P * 1e5)) / lam ** 3) + 2.5); },
  },
  'stat-occupation': {
    title: 'Fermi-Dirac and Bose-Einstein occupations',
    make(r) {
      const fd = r() < 0.5, x = [0.25, 0.5, 1, 1.5, 2, 3][int(r, 0, 5)] * (fd && r() < 0.4 ? -1 : 1);
      const answer = fd ? 1 / (Math.exp(x) + 1) : 1 / (Math.exp(Math.abs(x)) - 1);
      const xx = fd ? x : Math.abs(x);
      return {
        q: `<p>A single-particle state lies ${xx < 0 ? `${-xx} kT below` : `${xx} kT above`} the chemical potential of an ideal ${fd ? 'Fermi' : 'Bose'} gas. Find its mean occupation.</p>`,
        answer, unit: '', tol: 0.005, abs: 1e-4,
        hint: fd ? 'Fermi-Dirac: 1/(e<sup>(ε−μ)/kT</sup> + 1); it is 1/2 at ε = μ.' : 'Bose-Einstein: 1/(e<sup>(ε−μ)/kT</sup> − 1); it can exceed 1.',
        solution: steps(`(ε − μ)/kT = ${xx}, e<sup>${xx}</sup> = ${Math.exp(xx).toFixed(4)}.`, `⟨n⟩ = 1/(${Math.exp(xx).toFixed(4)} ${fd ? '+' : '−'} 1) = <b>${answer.toFixed(4)}</b>.`, `Maxwell-Boltzmann would give e<sup>${-xx}</sup> = ${Math.exp(-xx).toFixed(4)}.`),
        fd, xx,
      };
    },
    verify: (p) => (p.fd ? 1 / (Math.exp(p.xx) + 1) : 1 / (Math.exp(p.xx) - 1)),
  },
  'stat-photon-gas': {
    title: 'photon number and energy in a cavity',
    make(r) {
      const T = [3, 300, 1000, 3000, 6000][int(r, 0, 4)], what = r() < 0.5 ? 'n' : 'E';
      const k = 1.380649e-23, hb = 1.054571817e-34, c = 2.99792458e8;
      const n = (2 * 1.2020569 / Math.PI ** 2) * (k * T / (hb * c)) ** 3, answer = what === 'n' ? n : 2.701 * k * T / 1.602176634e-19;
      return {
        q: what === 'n' ? `<p>How many photons per cubic metre are there in blackbody radiation at ${T} K?</p>` : `<p>What is the mean energy, in eV, of a photon in blackbody radiation at ${T} K?</p>`,
        answer, unit: what === 'n' ? 'm⁻³' : 'eV', tol: 0.01,
        hint: what === 'n' ? 'n = (2ζ(3)/π²)(kT/ħc)³ with ζ(3) = 1.202.' : 'Divide u = aT⁴ by n: the mean is π⁴kT/(30ζ(3)) = 2.70 kT.',
        solution: what === 'n' ? steps(`kT/ħc = ${(k * T / (hb * c)).toFixed(2)} m⁻¹.`, `Cube it and multiply by 2×1.202/π² = 0.2436: n = <b>${n.toExponential(3)}</b> m⁻³.`) : steps(`kT = ${(k * T / 1.602176634e-19).toExponential(4)} eV.`, `Mean energy = 2.701 kT = <b>${answer.toExponential(4)}</b> eV.`),
        T, what,
      };
    },
    verify: (p) => { const k = 1.380649e-23; return p.what === 'n' ? (2 * 1.2020569 / Math.PI ** 2) * (k * p.T / (1.054571817e-34 * 2.99792458e8)) ** 3 : 2.701 * k * p.T / 1.602176634e-19; },
  },
  'stat-bec': {
    title: 'Bose-Einstein condensation temperature',
    make(r) {
      const [name, M] = [['⁸⁷Rb', 86.909], ['²³Na', 22.99], ['⁷Li', 7.016], ['¹³³Cs', 132.905]][int(r, 0, 3)], e = int(r, 18, 20), a = [1, 2, 5][int(r, 0, 2)];
      const n = a * 10 ** e, m = M * 1.66053906660e-27, hb = 1.054571817e-34, k = 1.380649e-23;
      const answer = (2 * Math.PI * hb * hb / (m * k)) * (n / 2.612) ** (2 / 3) * 1e9;
      return {
        q: `<p>A uniform gas of ${name} atoms (m = ${M} u) has density ${a}×10<sup>${e}</sup> m⁻³. At what temperature (in nK) would it Bose-condense if ideal?</p>`,
        answer, unit: 'nK', tol: 0.01,
        hint: 'Condensation starts when nλ³ = ζ(3/2) = 2.612, with λ = h/√(2πmkT).',
        solution: steps(`Solve n(h²/2πmkT)<sup>3/2</sup> = 2.612 for T: T<sub>c</sub> = (2πħ²/mk)(n/2.612)<sup>2/3</sup>.`, `2πħ²/mk = ${(2 * Math.PI * hb * hb / (m * k)).toExponential(4)} m² K; (n/2.612)<sup>2/3</sup> = ${((n / 2.612) ** (2 / 3)).toExponential(4)} m⁻².`, `T<sub>c</sub> = <b>${answer.toFixed(1)}</b> nK.`),
        M, n,
      };
    },
    verify: (p) => (2 * Math.PI * 1.054571817e-34 ** 2 / (p.M * 1.66053906660e-27 * 1.380649e-23)) * (p.n / 2.612) ** (2 / 3) * 1e9,
  },
  'stat-fermi-energy': {
    title: 'Fermi energy and electronic heat capacity of a metal',
    make(r) {
      const [name, n] = [['sodium', 2.65e28], ['potassium', 1.40e28], ['copper', 8.47e28], ['silver', 5.86e28], ['aluminium', 18.1e28]][int(r, 0, 4)], T = [10, 77, 300][int(r, 0, 2)];
      const hb = 1.054571817e-34, me = 9.1093837015e-31, kF = (3 * Math.PI ** 2 * n) ** (1 / 3), EF = (hb * kF) ** 2 / (2 * me), TF = EF / 1.380649e-23;
      const answer = (Math.PI ** 2 / 2) * T / TF;
      return {
        q: `<p>${name[0].toUpperCase() + name.slice(1)} has ${(n / 1e28).toFixed(2)}×10²⁸ free electrons per m³. Find its electronic heat capacity per electron, in units of k, at ${T} K.</p>`,
        answer, unit: 'k', tol: 0.01, abs: 1e-6,
        hint: 'First E<sub>F</sub> = ħ²(3π²n)<sup>2/3</sup>/2m and T<sub>F</sub> = E<sub>F</sub>/k; then C/Nk = (π²/2)(T/T<sub>F</sub>).',
        solution: steps(`k<sub>F</sub> = (3π²n)<sup>1/3</sup> = ${kF.toExponential(4)} m⁻¹; E<sub>F</sub> = ${(EF / 1.602176634e-19).toFixed(3)} eV; T<sub>F</sub> = ${TF.toExponential(4)} K.`, `C/Nk = 4.935 × ${T}/${TF.toExponential(4)} = <b>${answer.toExponential(4)}</b>.`, 'Tiny: only electrons within about kT of the Fermi level can take up heat.'),
        n, T,
      };
    },
    verify: (p) => { const kF = (3 * Math.PI ** 2 * p.n) ** (1 / 3), EF = (1.054571817e-34 * kF) ** 2 / (2 * 9.1093837015e-31); return (Math.PI ** 2 / 2) * p.T / (EF / 1.380649e-23); },
  },
  'stat-mean-field': {
    title: 'mean-field magnetisation',
    make(r) {
      const z = [4, 6, 8][int(r, 0, 2)], J = [1, 2, 3][int(r, 0, 2)], t = [0.3, 0.5, 0.7, 0.8, 0.9][int(r, 0, 4)];
      const Tc = z * J * 1e-3 / 8.617333e-5, T = t * Tc;
      let m = 1; for (let i = 0; i < 3000; i++) m = Math.tanh(m / t);
      return {
        q: `<p>An Ising ferromagnet has z = ${z} neighbours per spin and J = ${J} meV. In mean-field theory, find the spontaneous magnetisation per spin (between 0 and 1) at T = ${T.toFixed(1)} K.</p>`,
        answer: m, unit: '', tol: 0.005,
        hint: 'kT<sub>c</sub> = zJ. Then solve m = tanh(m T<sub>c</sub>/T) by iteration, starting from m = 1.',
        solution: steps(`T<sub>c</sub> = zJ/k = ${(z * J)} meV / k = ${Tc.toFixed(1)} K, so T/T<sub>c</sub> = ${t}.`, `Iterate m → tanh(m/${t}): 1 → ${Math.tanh(1 / t).toFixed(4)} → ${Math.tanh(Math.tanh(1 / t) / t).toFixed(4)} → …`, `It settles at m = <b>${m.toFixed(4)}</b>.`),
        t,
      };
    },
    verify: (p) => { let m = 1; for (let i = 0; i < 3000; i++) m = Math.tanh(m / p.t); return m; },
  },
  'stat-clapeyron': {
    title: 'vapour pressure from the Clausius-Clapeyron equation',
    make(r) {
      const [liq, L, Tb] = [['water', 40.7, 373.15], ['ethanol', 38.6, 351.4], ['benzene', 30.7, 353.2], ['nitrogen', 5.57, 77.36]][int(r, 0, 3)], dT = [-15, -10, -5, 5, 10][int(r, 0, 4)];
      const T2 = Tb + dT, answer = Math.exp(-(L * 1000 / 8.314462618) * (1 / T2 - 1 / Tb));
      return {
        q: `<p>${liq[0].toUpperCase() + liq.slice(1)} boils at ${Tb} K at 1 atm, with molar latent heat ${L} kJ/mol. Estimate its vapour pressure (in atm) at ${T2.toFixed(2)} K.</p>`,
        answer, unit: 'atm', tol: 0.005,
        hint: 'With an ideal vapour and v<sub>liquid</sub> ≪ v<sub>vapour</sub>, d ln P/dT = L/RT².',
        solution: steps(`Integrate: ln(P₂/P₁) = −(L/R)(1/T₂ − 1/T₁).`, `= −(${L * 1000}/8.314)(1/${T2.toFixed(2)} − 1/${Tb}) = ${Math.log(answer).toFixed(4)}.`, `P₂ = e<sup>${Math.log(answer).toFixed(4)}</sup> atm = <b>${answer.toFixed(4)}</b> atm.`),
        L, Tb, T2,
      };
    },
    verify: (p) => Math.exp(-(p.L * 1000 / 8.314462618) * (1 / p.T2 - 1 / p.Tb)),
  },
};
