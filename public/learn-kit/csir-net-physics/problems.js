// Live problems for CSIR NET Physics lessons (lesson kit). Each make(rand) returns { q, answer, unit, tol (relative),
// abs?, hint, solution } as HTML; verify(p) works the answer out another way for tests/exam-physics.mjs.
// Placed in a lesson as <div class="problem" data-problem="id"></div>. Exam-style practice uses the question bank instead.
const int = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  // ---- 7.2 to 7.4 experimental methods, 8.2 and 8.3 molecular spectroscopy ----
  'ls-slope-error': {
    title: 'least-squares slope and its standard error',
    make(r) {
      const N = int(r, 4, 7), dx = [0.5, 1, 2][int(r, 0, 2)], s = [0.1, 0.2, 0.3, 0.5][int(r, 0, 3)];
      const x = Array.from({ length: N }, (_, i) => (i + 1) * dx);
      const xm = x.reduce((a, b) => a + b, 0) / N, Sxx = x.reduce((a, b) => a + (b - xm) ** 2, 0);
      const answer = s / Math.sqrt(Sxx);
      return {
        q: `<p>A straight line is fitted by least squares to ${N} points at x = ${x.join(', ')}. Every y value has the same standard error σ = ${s}. Find the standard error of the fitted slope.</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'The slope is a linear combination of the y values, b = Σ(xᵢ − x̄)yᵢ / Σ(xᵢ − x̄)². Propagate σ through it: σ_b = σ/√Σ(xᵢ − x̄)².',
        solution: steps(`x̄ = ${xm.toFixed(3)}.`, `Σ(xᵢ − x̄)² = ${Sxx.toFixed(4)}.`, `σ_b = ${s}/√${Sxx.toFixed(4)} = <b>${answer.toFixed(4)}</b>. The y values themselves never enter: only σ and the spread of x.`),
        x, s,
      };
    },
    verify(p) { const N = p.x.length, Sx = p.x.reduce((a, b) => a + b, 0), Sxx = p.x.reduce((a, b) => a + b * b, 0); return p.s * Math.sqrt(N / (N * Sxx - Sx * Sx)); },
  },
  'propagate-power': {
    title: 'relative uncertainty of a product of powers',
    make(r) {
      const a = int(r, 1, 3), b = int(r, 1, 2), px = int(r, 1, 5) / 2, py = int(r, 1, 6) / 2;
      const answer = Math.sqrt((a * px) ** 2 + (b * py) ** 2);
      return {
        q: `<p>A result is f = x<sup>${a}</sup>/y<sup>${b}</sup>, with independent relative uncertainties ${px}% in x and ${py}% in y. Find the relative uncertainty of f in percent.</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'For f = xᵃ yᵇ (b may be negative), (σ_f/f)² = (a σ_x/x)² + (b σ_y/y)². Dividing counts the same as multiplying.',
        solution: steps(`Power-weighted terms: ${a} × ${px}% = ${a * px}% and ${b} × ${py}% = ${b * py}%.`, `In quadrature: √(${(a * px) ** 2} + ${(b * py) ** 2}) = <b>${answer.toFixed(3)}%</b>.`),
        a, b, px, py,
      };
    },
    verify(p) { return Math.hypot(p.a * p.px, p.b * p.py); },
  },
  'gm-dead-time': {
    title: 'true count rate from a dead-time-limited counter',
    make(r) {
      const tau = [50, 100, 200, 300][int(r, 0, 3)], m = int(r, 2, 20) * 100;
      const answer = m / (1 - m * tau * 1e-6);
      return {
        q: `<p>A Geiger counter with a non-paralysable dead time of ${tau} μs records ${m} counts per second. Find the true rate in counts per second.</p>`,
        answer, unit: 's⁻¹', tol: 0.005,
        hint: 'After each count the tube is dead for τ, so it is live only for a fraction 1 − mτ of the time. The true rate n satisfies m = n(1 − mτ).',
        solution: steps(`Dead fraction mτ = ${m} × ${tau}×10⁻⁶ = ${(m * tau * 1e-6).toFixed(4)}.`, `n = m/(1 − mτ) = ${m}/${(1 - m * tau * 1e-6).toFixed(4)} = <b>${answer.toFixed(1)} s⁻¹</b>.`),
        tau, m,
      };
    },
    verify(p) { return p.m / (1 - p.m * p.tau * 1e-6); },
  },
  'bridge-output': {
    title: 'strain-gauge bridge output',
    make(r) {
      const arms = [1, 2, 4][int(r, 0, 2)], Vs = [2, 5, 10][int(r, 0, 2)], GF = [2, 2.1][int(r, 0, 1)], eps = int(r, 1, 10) * 100;
      const answer = Vs * GF * eps * 1e-6 * arms / 4 * 1000;
      return {
        q: `<p>A Wheatstone bridge with ${Vs} V supply has ${arms === 1 ? 'one active gauge' : arms === 2 ? 'two active gauges with opposite strains in adjacent arms' : 'four active gauges arranged so that their changes add'} (gauge factor ${GF}, strain magnitude ${eps} microstrain). Find the output voltage in mV (small-signal approximation).</p>`,
        answer, unit: 'mV', tol: 0.01,
        hint: 'Each active arm contributes V_s·GF·ε/4 when the strains are arranged to add.',
        solution: steps(`ΔR/R = GF·ε = ${GF} × ${eps}×10⁻⁶ = ${(GF * eps * 1e-6).toExponential(2)}.`, `V_out = ${arms}/4 × V_s × ΔR/R = ${arms}/4 × ${Vs} × ${(GF * eps * 1e-6).toExponential(2)} V = <b>${answer.toFixed(3)} mV</b>.`),
        arms, Vs, GF, eps,
      };
    },
    verify(p) { return p.arms * p.Vs * p.GF * p.eps * 1e-6 / 4 * 1000; },
  },
  'johnson-noise': {
    title: 'Johnson noise of a resistor',
    make(r) {
      const R = [1e3, 1e4, 1e5, 1e6][int(r, 0, 3)], T = [77, 300][int(r, 0, 1)], B = [100, 1e3, 1e4][int(r, 0, 2)];
      const answer = Math.sqrt(4 * 1.380649e-23 * T * R * B) * 1e6;
      return {
        q: `<p>Find the rms Johnson noise voltage, in μV, of a ${R >= 1e6 ? R / 1e6 + ' MΩ' : R / 1e3 + ' kΩ'} resistor at ${T} K measured in a ${B} Hz bandwidth. (k_B = 1.381×10⁻²³ J/K.)</p>`,
        answer, unit: 'μV', tol: 0.01,
        hint: 'v_rms = √(4 k_B T R B). Every factor enters under the square root.',
        solution: steps(`4 k_B T R B = 4 × 1.381×10⁻²³ × ${T} × ${R} × ${B} = ${(4 * 1.380649e-23 * T * R * B).toExponential(3)} V².`, `v_rms = <b>${answer.toFixed(3)} μV</b>.`),
        R, T, B,
      };
    },
    verify(p) { return Math.sqrt(4 * 1.380649e-23 * p.T * p.R * p.B) * 1e6; },
  },
  'lockin-snr': {
    title: 'signal-to-noise ratio after a lock-in',
    make(r) {
      const sig = int(r, 1, 10), dens = int(r, 1, 20) * 5, tau = [0.1, 0.3, 1, 3, 10][int(r, 0, 4)];
      const B = 1 / (4 * tau), noise = dens * Math.sqrt(B), answer = sig * 1000 / noise;
      return {
        q: `<p>A ${sig} μV signal at the reference frequency sits in white noise of ${dens} nV/√Hz. The lock-in has a single-pole output filter with time constant ${tau} s. Find the signal-to-noise ratio of the output.</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'A single RC section of time constant τ has noise-equivalent bandwidth 1/(4τ). Output noise = density × √bandwidth.',
        solution: steps(`ENBW = 1/(4 × ${tau}) = ${B.toFixed(4)} Hz.`, `Noise = ${dens} nV/√Hz × √${B.toFixed(4)} = ${noise.toFixed(3)} nV.`, `SNR = ${sig * 1000} nV / ${noise.toFixed(3)} nV = <b>${answer.toFixed(1)}</b>.`),
        sig, dens, tau,
      };
    },
    verify(p) { return p.sig * 1000 / (p.dens * Math.sqrt(1 / (4 * p.tau))); },
  },
  'nmr-pulse': {
    title: 'length of a 90° or 180° pulse',
    make(r) {
      const nuc = [['¹H', 42.577], ['¹³C', 10.708], ['¹⁹F', 40.078], ['³¹P', 17.235]][int(r, 0, 3)], th = [90, 180][int(r, 0, 1)], B1 = [0.1, 0.2, 0.5, 1, 2][int(r, 0, 4)];
      const answer = (th / 360) / (nuc[1] * 1e6 * B1 * 1e-3) * 1e6;
      return {
        q: `<p>An on-resonance RF field of amplitude B₁ = ${B1} mT (rotating frame) acts on ${nuc[0]} nuclei (γ/2π = ${nuc[1]} MHz/T). How long, in μs, is a ${th}° pulse?</p>`,
        answer, unit: 'μs', tol: 0.01,
        hint: 'In the rotating frame the magnetisation turns about B₁ at frequency (γ/2π)B₁ turns per second. A 90° pulse is a quarter turn.',
        solution: steps(`Nutation frequency (γ/2π)B₁ = ${nuc[1]}×10⁶ × ${B1}×10⁻³ = ${(nuc[1] * B1 * 1e3).toFixed(1)} Hz.`, `One full turn takes ${(1e6 / (nuc[1] * B1 * 1e3)).toFixed(3)} μs; ${th}° is ${th / 360} of it: <b>${answer.toFixed(3)} μs</b>.`),
        g: nuc[1], th, B1,
      };
    },
    verify(p) { return (p.th * Math.PI / 180) / (2 * Math.PI * p.g * 1e6 * p.B1 * 1e-3) * 1e6; },
  },
  'esr-lines': {
    title: 'number of ESR hyperfine lines',
    make(r) {
      const n1 = int(r, 1, 4), n2 = int(r, 0, 2), I2 = [1, 0.5][int(r, 0, 1)];
      const answer = (n1 + 1) * (2 * n2 * I2 + 1);
      return {
        q: `<p>An unpaired electron couples to ${n1} equivalent proton${n1 > 1 ? 's' : ''}${n2 ? ` and to ${n2} equivalent ${I2 === 1 ? '¹⁴N (I = 1)' : '¹⁹F (I = 1/2)'} nucle${n2 > 1 ? 'i' : 'us'}, with a different coupling constant` : ''}. How many ESR lines appear (none overlapping)?</p>`,
        answer, unit: '', tol: 0, abs: 0.01,
        hint: 'A set of n equivalent nuclei of spin I splits each line into 2nI + 1. Different sets multiply.',
        solution: steps(`Protons: 2 × ${n1} × ½ + 1 = ${n1 + 1}.`, n2 ? `Second set: 2 × ${n2} × ${I2 === 1 ? 1 : '½'} + 1 = ${2 * n2 * I2 + 1}.` : 'No second set.', `Total <b>${answer}</b> lines.`),
        n1, n2, I2,
      };
    },
    verify(p) { return (2 * p.n1 * 0.5 + 1) * (2 * p.n2 * p.I2 + 1); },
  },
  'fc-poisson': {
    title: 'Franck-Condon factor for displaced oscillators',
    make(r) {
      const S = int(r, 2, 30) / 10, v = int(r, 0, 4);
      let f = 1; for (let k = 2; k <= v; k++) f *= k;
      const answer = Math.exp(-S) * S ** v / f;
      return {
        q: `<p>Two electronic states have harmonic potentials of equal frequency, displaced so that the Huang-Rhys factor is S = ${S}. What fraction of the absorption from v″ = 0 goes into the ${v} ← 0 band?</p>`,
        answer, unit: '', tol: 0.01,
        hint: "For equal frequencies, |⟨v′|0⟩|² = e^(−S) S^v′ / v′!: a Poisson distribution with mean S.",
        solution: steps(`e^(−${S}) = ${Math.exp(-S).toFixed(4)}.`, `S^${v}/${v}! = ${(S ** v).toFixed(4)}/${f} = ${(S ** v / f).toFixed(4)}.`, `Product: <b>${answer.toFixed(4)}</b>.`),
        S, v,
      };
    },
    verify(p) { let f = 1; for (let k = 2; k <= p.v; k++) f *= k; return Math.exp(-p.S) * p.S ** p.v / f; },
  },
  'vibronic-band': {
    title: 'position of a vibronic band',
    make(r) {
      const Te = int(r, 150, 300) * 100, w1 = int(r, 50, 150) * 10, x1 = int(r, 3, 15), w2 = int(r, 100, 250) * 10, x2 = int(r, 5, 20), v1 = int(r, 0, 3), v2 = int(r, 0, 1);
      const G = (w, x, v) => w * (v + 0.5) - x * (v + 0.5) ** 2;
      const answer = Te + G(w1, x1, v1) - G(w2, x2, v2);
      return {
        q: `<p>An upper state has T_e = ${Te} cm⁻¹, ω′ = ${w1} cm⁻¹, ω′x′ = ${x1} cm⁻¹; the ground state has ω″ = ${w2} cm⁻¹, ω″x″ = ${x2} cm⁻¹. Find the wavenumber of the ${v1} ← ${v2} band in cm⁻¹.</p>`,
        answer, unit: 'cm⁻¹', tol: 0.0001, abs: 0.5,
        hint: 'ν = T_e + G′(v′) − G″(v″), with G(v) = ω(v + ½) − ωx(v + ½)², each measured from its own potential minimum.',
        solution: steps(`G′(${v1}) = ${w1}×${v1 + 0.5} − ${x1}×${(v1 + 0.5) ** 2} = ${G(w1, x1, v1)}.`, `G″(${v2}) = ${w2}×${v2 + 0.5} − ${x2}×${(v2 + 0.5) ** 2} = ${G(w2, x2, v2)}.`, `ν = ${Te} + ${G(w1, x1, v1)} − ${G(w2, x2, v2)} = <b>${answer.toFixed(2)} cm⁻¹</b>.`),
        Te, w1, x1, w2, x2, v1, v2,
      };
    },
    verify(p) { const G = (w, x, v) => w * (v + 0.5) - x * (v + 0.5) ** 2; return p.Te + G(p.w1, p.x1, p.v1) - G(p.w2, p.x2, p.v2); },
  },
};
