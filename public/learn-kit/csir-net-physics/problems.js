// Live problems for CSIR NET Physics lessons (lesson kit). Each make(rand) returns { q, answer, unit, tol (relative),
// abs?, hint, solution } as HTML; verify(p) works the answer out another way for tests/exam-physics.mjs.
// Placed in a lesson as <div class="problem" data-problem="id"></div>. Exam-style practice uses the question bank instead.
const int = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const ord = (k) => `${k + 1}${['st', 'nd', 'rd'][k] || 'th'}`;

export default {
  // ---- 2.2 to 2.4 group theory, probability, numerical methods; 3.2 to 3.4 Hamilton-Jacobi, phase space, chaos ----
  'c3v-reduce': {
    title: 'reduce a representation of C3v with the character table',
    make(r) {
      const a = int(r, 0, 3), b = int(r, 0, 2), c = int(r, 1, 3), w = ['A₁', 'A₂', 'E'][int(r, 0, 2)];
      const chi = [a + b + 2 * c, a + b - c, a - b], row = { 'A₁': [1, 1, 1], 'A₂': [1, 1, -1], E: [2, -1, 0] }[w];
      const sum = chi[0] * row[0] + 2 * chi[1] * row[1] + 3 * chi[2] * row[2], answer = sum / 6;
      return {
        q: `<p>The group C<sub>3v</sub> has classes E (1 element), 2C₃ (2 elements) and 3σ<sub>v</sub> (3 elements), and irreps A₁ = (1, 1, 1), A₂ = (1, 1, −1), E = (2, −1, 0). A representation has characters (${chi.join(', ')}). How many times does ${w} appear in it?</p>`,
        answer, unit: '', tol: 0.001, abs: 0.01,
        hint: 'Use n = (1/|G|) Σ over classes of (class size) × χ(class) × χ<sub>irrep</sub>(class), with |G| = 6.',
        solution: steps('Weights: class sizes 1, 2, 3 and |G| = 6.', `n = (1/6)[1·${chi[0]}·${row[0]} + 2·${chi[1]}·${row[1]} + 3·${chi[2]}·${row[2]}] = ${sum}/6 = <b>${answer}</b>.`, `Full decomposition: ${a}A₁ + ${b}A₂ + ${c}E; check the dimension ${a} + ${b} + 2·${c} = ${chi[0]}.`),
        chi, row,
      };
    },
    verify: (p) => (p.chi[0] * p.row[0] + 2 * p.chi[1] * p.row[1] + 3 * p.chi[2] * p.row[2]) / 6,
  },
  'su2-product': {
    title: 'dimension of a multiplet in a product of SU(2) representations',
    make(r) {
      const j1 = int(r, 1, 6) / 2, j2 = int(r, 1, 4) / 2, k = int(r, 0, Math.round(2 * Math.min(j1, j2)));
      const J = Math.abs(j1 - j2) + k, answer = 2 * J + 1;
      const s = (j) => (Number.isInteger(j) ? String(j) : `${2 * j}/2`);
      return {
        q: `<p>Angular momenta j₁ = ${s(j1)} and j₂ = ${s(j2)} are combined. List the total J values that appear, and give the number of states in the ${ord(k)} smallest multiplet.</p>`,
        answer, unit: '', tol: 0.001,
        hint: 'J runs from |j₁ − j₂| to j₁ + j₂ in steps of 1; a multiplet with total J has 2J + 1 states.',
        solution: steps(`J = ${s(Math.abs(j1 - j2))}, ..., ${s(j1 + j2)}: ${2 * Math.min(j1, j2) + 1} multiplets.`, `The ${ord(k)} smallest is J = ${s(J)}, with 2J + 1 = <b>${answer}</b> states.`, `Check: all the dimensions add up to (2j₁ + 1)(2j₂ + 1) = ${(2 * j1 + 1) * (2 * j2 + 1)}.`),
        j1, j2, k,
      };
    },
    verify: (p) => { const js = []; for (let j = Math.abs(p.j1 - p.j2); j <= p.j1 + p.j2 + 1e-9; j++) js.push(j); return 2 * js[p.k] + 1; },
  },
  'poisson-count': {
    title: 'Poisson probability of a number of counts',
    make(r) {
      const lam = [0.5, 1, 1.5, 2, 3, 4, 5][int(r, 0, 6)], k = int(r, 0, 5);
      let f = 1; for (let i = 2; i <= k; i++) f *= i;
      const answer = lam ** k * Math.exp(-lam) / f;
      return {
        q: `<p>A weak source gives on average ${lam} counts per second. Find the probability of exactly ${k} counts in a one-second window.</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'Independent rare events: P(k) = λ<sup>k</sup> e<sup>−λ</sup> / k!.',
        solution: steps(`λ = ${lam}, k = ${k}.`, `P(${k}) = ${lam}<sup>${k}</sup> × e<sup>−${lam}</sup> / ${k}! = ${(lam ** k).toFixed(4)} × ${Math.exp(-lam).toFixed(5)} / ${f} = <b>${answer.toFixed(4)}</b>.`),
        lam, k,
      };
    },
    verify: (p) => { let t = Math.exp(-p.lam); for (let i = 1; i <= p.k; i++) t *= p.lam / i; return t; },
  },
  'gauss-window': {
    title: 'probability that a Gaussian measurement falls in a window',
    make(r) {
      const z = [0.5, 1, 1.5, 2, 2.5, 3][int(r, 0, 5)], mu = int(r, 10, 90), s = int(r, 1, 6);
      const x = z / Math.SQRT2, t = 1 / (1 + 0.3275911 * x);
      const answer = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
      return {
        q: `<p>A quantity is Gaussian with mean ${mu} and standard deviation ${s}. Find the probability that one measurement lies between ${mu - z * s} and ${mu + z * s}.</p>`,
        answer, unit: '', tol: 0.005,
        hint: `The window is ±${z}σ about the mean, so P = erf(${z}/√2). Remember 68%, 95% and 99.7% for 1σ, 2σ and 3σ.`,
        solution: steps(`Standardise: the limits are ${mu} ± ${z}×${s}, i.e. z = ±${z}.`, `P(|z| < ${z}) = erf(${z}/√2) = <b>${answer.toFixed(4)}</b>.`),
        z,
      };
    },
    verify: (p) => { const N = 2000, a = -p.z, h = 2 * p.z / N; let s = 0; for (let i = 0; i <= N; i++) s += Math.exp(-((a + i * h) ** 2) / 2) * (i === 0 || i === N ? 1 : i % 2 ? 4 : 2); return s * h / 3 / Math.sqrt(2 * Math.PI); },
  },
  'newton-root': {
    title: 'two Newton-Raphson steps for a square root',
    make(r) {
      const c = [2, 3, 5, 6, 7, 8, 10, 11, 13][int(r, 0, 8)], x0 = Math.max(1, Math.round(Math.sqrt(c)) + int(r, -1, 1));
      const x1 = (x0 + c / x0) / 2, x2 = (x1 + c / x1) / 2;
      return {
        q: `<p>Use Newton-Raphson on f(x) = x² − ${c}, starting from x₀ = ${x0}. Find x₂.</p>`,
        answer: x2, unit: '', tol: 0.0002,
        hint: 'x<sub>n+1</sub> = x<sub>n</sub> − f(x<sub>n</sub>)/f′(x<sub>n</sub>) = (x<sub>n</sub> + c/x<sub>n</sub>)/2 for f = x² − c.',
        solution: steps(`x₁ = (${x0} + ${c}/${x0})/2 = ${x1.toFixed(6)}.`, `x₂ = (${x1.toFixed(6)} + ${c}/${x1.toFixed(6)})/2 = <b>${x2.toFixed(6)}</b>.`, `Compare √${c} = ${Math.sqrt(c).toFixed(6)}: the error is roughly squared at each step.`),
        c, x0,
      };
    },
    verify: (p) => { let x = p.x0; for (let i = 0; i < 2; i++) x -= (x * x - p.c) / (2 * x); return x; },
  },
  'simpson-pi': {
    title: 'Simpson and trapezoid estimates of an integral',
    make(r) {
      const n = [2, 4, 6, 8][int(r, 0, 3)], rule = ['Simpson', 'trapezoid'][int(r, 0, 1)], f = (x) => 4 / (1 + x * x), h = 1 / n;
      let s;
      if (rule === 'Simpson') { s = f(0) + f(1); for (let i = 1; i < n; i++) s += f(i * h) * (i % 2 ? 4 : 2); s *= h / 3; } else { s = (f(0) + f(1)) / 2; for (let i = 1; i < n; i++) s += f(i * h); s *= h; }
      return {
        q: `<p>The integral of 4/(1 + x²) from 0 to 1 is π. Estimate it with the composite ${rule} rule and ${n} equal sub-intervals.</p>`,
        answer: s, unit: '', tol: 0.0001,
        hint: rule === 'Simpson' ? 'S = (h/3)[f₀ + 4f₁ + 2f₂ + 4f₃ + ... + f<sub>n</sub>] with h = 1/n.' : 'T = h[f₀/2 + f₁ + ... + f<sub>n−1</sub> + f<sub>n</sub>/2] with h = 1/n.',
        solution: steps(`h = ${h.toFixed(4)}; the values f(x<sub>i</sub>) are ${Array.from({ length: n + 1 }, (_, i) => f(i * h).toFixed(5)).join(', ')}.`, `${rule} sum: <b>${s.toFixed(6)}</b>.`, `Error: ${(s - Math.PI).toExponential(2)}; Simpson's error falls as h⁴, the trapezoid's as h².`),
        n, rule,
      };
    },
    verify: (p) => { const f = (x) => 4 / (1 + x * x), h = 1 / p.n; let s = 0; if (p.rule === 'Simpson') for (let i = 0; i < p.n; i += 2) s += h / 3 * (f(i * h) + 4 * f((i + 1) * h) + f((i + 2) * h)); else for (let i = 0; i < p.n; i++) s += (f(i * h) + f((i + 1) * h)) * h / 2; return s; },
  },
  'pendulum-adiabatic': {
    title: 'a pendulum whose string is changed slowly',
    make(r) {
      const l1 = [0.5, 1, 1.5, 2, 3][int(r, 0, 4)], f = [0.25, 0.5, 2, 4][int(r, 0, 3)], th = int(r, 2, 6), l2 = l1 * f;
      const answer = th * f ** -0.75;
      return {
        q: `<p>A pendulum of length ${l1} m swings with amplitude ${th}°. Its length is changed very slowly to ${l2} m. Find the new amplitude in degrees (small angles).</p>`,
        answer, unit: '°', tol: 0.005,
        hint: 'The action E/ν is an adiabatic invariant; ν ∝ l<sup>−1/2</sup> and E = ½ m g l θ₀².',
        solution: steps('E/ν constant with ν ∝ l<sup>−1/2</sup> gives E ∝ l<sup>−1/2</sup>.', 'θ₀² ∝ E/l ∝ l<sup>−3/2</sup>, so θ₀ ∝ l<sup>−3/4</sup>.', `θ₀ = ${th}° × (${l1}/${l2})<sup>3/4</sup> = <b>${answer.toFixed(3)}°</b>.`),
        th, f,
      };
    },
    verify: (p) => p.th * Math.sqrt(p.f ** -0.5 / p.f),
  },
  'action-oscillator': {
    title: 'action of an oscillator from J = ∮ p dq',
    make(r) {
      const m = [0.5, 1, 2, 4][int(r, 0, 3)], k = int(r, 1, 20), E = int(r, 1, 10);
      const w = Math.sqrt(k / m), answer = 2 * Math.PI * E / w;
      return {
        q: `<p>A mass of ${m} kg on a spring of constant ${k} N/m oscillates with energy ${E} J. Find its action J = ∮ p dq in J s.</p>`,
        answer, unit: 'J s', tol: 0.005,
        hint: 'The orbit is an ellipse with semi-axes √(2E/k) and √(2mE); its area is π times their product.',
        solution: steps(`Semi-axes: √(2E/k) = ${Math.sqrt(2 * E / k).toFixed(4)} m and √(2mE) = ${Math.sqrt(2 * m * E).toFixed(4)} kg m/s.`, `J = π × ${Math.sqrt(2 * E / k).toFixed(4)} × ${Math.sqrt(2 * m * E).toFixed(4)} = 2πE/ω = <b>${answer.toFixed(4)} J s</b>, with ω = ${w.toFixed(4)} rad/s.`),
        m, k, E,
      };
    },
    verify: (p) => Math.PI * Math.sqrt(2 * p.E / p.k) * Math.sqrt(2 * p.m * p.E),
  },
  'linear-eigen': {
    title: 'eigenvalues and type of a planar fixed point',
    make(r) {
      const a = int(r, -3, 3), b = int(r, 1, 4), c = -int(r, 1, 4), d = int(r, -3, 3) || 1;
      const t = a + d, D = a * d - b * c, disc = t * t - 4 * D;
      const answer = disc >= 0 ? (t + Math.sqrt(disc)) / 2 : t / 2;
      const kind = D < 0 ? 'saddle' : t === 0 ? 'centre' : disc >= 0 ? (t < 0 ? 'stable node' : 'unstable node') : (t < 0 ? 'stable spiral' : 'unstable spiral');
      return {
        q: `<p>For ẋ = ${a}x + ${b}y, ẏ = ${c}x + ${d}y, find the largest real part among the eigenvalues at the origin. What kind of fixed point is it?</p>`,
        answer, unit: '', tol: 0.001, abs: 0.001,
        hint: 'λ = ½[τ ± √(τ² − 4Δ)] with τ = a + d and Δ = ad − bc; if τ² < 4Δ the real part is τ/2.',
        solution: steps(`τ = ${t}, Δ = ${D}, τ² − 4Δ = ${disc}.`, disc >= 0 ? `Real eigenvalues ${((t + Math.sqrt(disc)) / 2).toFixed(4)} and ${((t - Math.sqrt(disc)) / 2).toFixed(4)}; the largest is <b>${answer.toFixed(4)}</b>.` : `Complex eigenvalues ${(t / 2).toFixed(3)} ± ${(Math.sqrt(-disc) / 2).toFixed(3)}i; real part <b>${(t / 2).toFixed(4)}</b>.`, `The origin is a <b>${kind}</b>.`),
        a, b, c, d,
      };
    },
    verify: (p) => { const t = p.a + p.d, D = p.a * p.d - p.b * p.c, disc = t * t - 4 * D; return disc >= 0 ? Math.max((t + Math.sqrt(disc)) / 2, (t - Math.sqrt(disc)) / 2) : t / 2; },
  },
  'separatrix-speed': {
    title: 'speed on the pendulum separatrix',
    make(r) {
      const l = [0.25, 0.5, 1, 2, 4][int(r, 0, 4)], th = [0, 30, 60, 90, 120, 150][int(r, 0, 5)];
      const w0 = Math.sqrt(9.8 / l), answer = 2 * w0 * Math.cos(th * Math.PI / 360);
      return {
        q: `<p>A pendulum of length ${l} m (g = 9.8 m/s²) moves on its separatrix: it just reaches the upright position. Find its angular speed in rad/s when it is ${th}° from the bottom.</p>`,
        answer, unit: 'rad/s', tol: 0.005,
        hint: 'On the separatrix the energy equals that of the pendulum at rest upright: ½θ̇² − ω₀² cos θ = ω₀².',
        solution: steps(`ω₀ = √(g/l) = ${w0.toFixed(4)} rad/s.`, '½θ̇² = ω₀²(1 + cos θ) = 2ω₀² cos²(θ/2), so θ̇ = 2ω₀ cos(θ/2).', `θ̇ = 2 × ${w0.toFixed(4)} × cos ${th / 2}° = <b>${answer.toFixed(4)} rad/s</b>.`),
        l, th,
      };
    },
    verify: (p) => Math.sqrt(2 * (9.8 / p.l) * (1 + Math.cos(p.th * Math.PI / 180))),
  },
  'logistic-cycle': {
    title: 'the stable 2-cycle of the logistic map',
    make(r) {
      const rr = 3.05 + 0.01 * int(r, 0, 39), up = int(r, 0, 1) === 1;
      const s = Math.sqrt((rr - 3) * (rr + 1)), answer = (rr + 1 + (up ? s : -s)) / (2 * rr);
      return {
        q: `<p>For the logistic map x → ${rr.toFixed(2)} x(1 − x) the attractor is a 2-cycle. Find its ${up ? 'larger' : 'smaller'} point.</p>`,
        answer, unit: '', tol: 0.001,
        hint: 'Solve f(f(x)) = x and divide out the fixed points x = 0 and 1 − 1/r: r²x² − r(r + 1)x + (r + 1) = 0.',
        solution: steps(`x = [(r + 1) ± √((r − 3)(r + 1))]/(2r) with r = ${rr.toFixed(2)}.`, `√(${(rr - 3).toFixed(2)} × ${(rr + 1).toFixed(2)}) = ${s.toFixed(4)}.`, `x = (${(rr + 1).toFixed(2)} ${up ? '+' : '−'} ${s.toFixed(4)})/${(2 * rr).toFixed(2)} = <b>${answer.toFixed(4)}</b>.`),
        rr, up,
      };
    },
    verify: (p) => { let x = 0.3; for (let i = 0; i < 8000; i++) x = p.rr * x * (1 - x); const y = p.rr * x * (1 - x); return p.up ? Math.max(x, y) : Math.min(x, y); },
  },
  'chaos-horizon': {
    title: 'how far ahead a chaotic system can be predicted',
    make(r) {
      const lam = [0.2, 0.5, 0.9, 1.2, 2][int(r, 0, 4)], e0 = int(r, 4, 12), e1 = int(r, 0, 2);
      const answer = (e0 - e1) * Math.LN10 / lam;
      return {
        q: `<p>A chaotic system has Lyapunov exponent ${lam} per second. The initial state is known to 10<sup>−${e0}</sup>, and predictions are useful while the error is below 10<sup>−${e1}</sup>. For how many seconds can it be predicted?</p>`,
        answer, unit: 's', tol: 0.005,
        hint: 'The error grows as δ₀ e<sup>λt</sup>.',
        solution: steps(`10<sup>−${e0}</sup> e<sup>${lam}t</sup> = 10<sup>−${e1}</sup>.`, `t = ${e0 - e1} ln 10 / ${lam} = <b>${answer.toFixed(3)} s</b>.`, 'A thousand times better initial data adds only ln(1000)/λ to this.'),
        lam, e0, e1,
      };
    },
    verify: (p) => Math.log(10 ** (p.e0 - p.e1)) / p.lam,
  },
};
