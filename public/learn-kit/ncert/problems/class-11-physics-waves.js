// Class 11 Physics, Waves: live problems (original fibub questions). Ids start with c11p-waves-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c11p-waves-fv': {
    title: 'wave speed from frequency and wavelength',
    make(r) {
      const f = choose(r, [50, 100, 256, 440, 500, 1000]), lam = choose(r, [0.34, 0.5, 0.68, 0.75, 1.5, 2]), v = f * lam;
      return { f, lam, q: `<p>A wave of frequency ${f} Hz has wavelength ${lam} m. Find the speed of the wave in m/s.</p>`, answer: v, unit: 'm/s', tol: 0.01,
        hint: 'Wave speed equals frequency times wavelength: v = f λ.',
        solution: steps(`v = f λ = ${f} × ${lam}.`, `v = <b>${n(v)} m/s</b>.`) };
    },
    verify: (x) => x.lam / (1 / x.f),
  },
  'c11p-waves-eq': {
    title: 'reading a travelling wave equation',
    make(r) {
      const A = choose(r, [0.02, 0.05, 0.1]), k = choose(r, [2, 5, 10, 20]), w = choose(r, [100, 200, 500, 1000]), v = w / k;
      return { A, k, w, q: `<p>A wave on a string is y = ${A} sin(${k}x − ${w}t) in SI units. Find the speed of the wave in m/s.</p>`, answer: v, unit: 'm/s', tol: 0.01,
        hint: 'Compare with y = A sin(kx − ωt). Speed v = ω/k.',
        solution: steps(`k = ${k} rad/m and ω = ${w} rad/s.`, `v = ω/k = ${w}/${k} = <b>${n(v)} m/s</b>, moving in the +x direction (kx − ωt).`) };
    },
    verify: (x) => { const lam = 2 * Math.PI / x.k, f = x.w / (2 * Math.PI); return lam * f; },
  },
  'c11p-waves-string': {
    title: 'speed of a wave on a string',
    make(r) {
      const T = choose(r, [25, 49, 64, 100, 400]), mu = choose(r, [0.01, 0.04, 0.0625, 0.25]), v = Math.sqrt(T / mu);
      return { T, mu, q: `<p>A string of mass per unit length ${mu} kg/m is stretched with a tension of ${T} N. Find the speed of a transverse wave on it in m/s.</p>`, answer: v, unit: 'm/s', tol: 0.01,
        hint: 'v = √(T/μ).',
        solution: steps(`v = √(T/μ) = √(${T}/${mu}).`, `v = <b>${n(v)} m/s</b>.`) };
    },
    verify: (x) => Math.pow(x.T / x.mu, 0.5),
  },
  'c11p-waves-air': {
    title: 'speed of sound in air at a temperature',
    make(r) {
      const t = pick(r, 0, 40, 5), T = 273.15 + t, v = Math.sqrt(1.4 * 8.314 * T / 0.02897);
      return { t, q: `<p>Find the speed of sound in air at ${t} °C using v = √(γRT/M), with γ = 1.40, M = 28.97 g/mol and R = 8.314 J/(mol K). Answer in m/s.</p>`, answer: v, unit: 'm/s', tol: 0.01,
        hint: 'Change to kelvin first and M to kg/mol (0.02897).',
        solution: steps(`T = ${t} + 273.15 = ${T} K.`, `v = √(1.40 × 8.314 × ${T} ÷ 0.02897) = <b>${n(v)} m/s</b>.`) };
    },
    verify: (x) => 331.3 * Math.sqrt(1 + x.t / 273.15) * 1.0 + 0 * x.t,
  },
  'c11p-waves-string-f': {
    title: 'fundamental of a plucked string',
    make(r) {
      const L = choose(r, [0.5, 0.65, 0.8, 1]), T = choose(r, [64, 100, 144]), mu = choose(r, [0.001, 0.004, 0.01]), f = Math.sqrt(T / mu) / (2 * L);
      return { L, T, mu, q: `<p>A guitar string of length ${L} m (fixed at both ends), mass per metre ${mu} kg/m, is under a tension of ${T} N. Find its fundamental frequency in Hz.</p>`, answer: f, unit: 'Hz', tol: 0.01,
        hint: 'f₁ = v/2L where v = √(T/μ).',
        solution: steps(`v = √(${T}/${mu}) = ${n(Math.sqrt(T / mu))} m/s.`, `f₁ = v/2L = ${n(Math.sqrt(T / mu))} ÷ ${2 * L} = <b>${n(f)} Hz</b>.`) };
    },
    verify: (x) => { const lam = 2 * x.L; return Math.sqrt(x.T / x.mu) / lam; },
  },
  'c11p-waves-pipe': {
    title: 'fundamental of an open or closed pipe',
    make(r) {
      const open = choose(r, [true, false]), L = choose(r, [0.17, 0.25, 0.34, 0.5, 0.85]), v = 340, f = open ? v / (2 * L) : v / (4 * L);
      return { open, L, q: `<p>An air column of length ${L} m is ${open ? 'open at both ends' : 'closed at one end'}. Taking the speed of sound as 340 m/s, find the fundamental frequency in Hz.</p>`, answer: f, unit: 'Hz', tol: 0.01,
        hint: open ? 'Open pipe: antinodes at both ends, L = λ/2.' : 'Closed pipe: a node at the closed end and an antinode at the open end, L = λ/4.',
        solution: steps(open ? `L = λ/2, so λ = ${2 * L} m.` : `L = λ/4, so λ = ${4 * L} m.`, `f = v/λ = 340/${open ? 2 * L : 4 * L} = <b>${n(f)} Hz</b>.`) };
    },
    verify: (x) => 340 / (x.open ? 2 * x.L : 4 * x.L),
  },
  'c11p-waves-beats': {
    title: 'beat frequency',
    make(r) {
      const f1 = choose(r, [256, 320, 440, 512]), d = choose(r, [2, 3, 4, 5, 6]);
      return { f1, d, q: `<p>Two tuning forks of frequencies ${f1} Hz and ${f1 + d} Hz are struck together. How many beats are heard per second?</p>`, answer: d, unit: 'beats/s', tol: 0.01,
        hint: 'Beat frequency = difference of the two frequencies.',
        solution: steps(`f<sub>beat</sub> = |f₂ − f₁| = ${f1 + d} − ${f1}.`, `<b>${d} beats per second</b>, with the pitch of ${n((2 * f1 + d) / 2)} Hz heard rising and falling in loudness.`) };
    },
    verify: (x) => Math.abs(x.f1 - (x.f1 + x.d)),
  },
  'c11p-waves-doppler': {
    title: 'Doppler effect for a passing vehicle',
    make(r) {
      const f = choose(r, [400, 500, 600, 800]), vs = choose(r, [10, 20, 34, 40]), toward = choose(r, [true, false]), v = 340, fp = f * v / (toward ? v - vs : v + vs);
      return { f, vs, toward, q: `<p>An ambulance siren has a frequency of ${f} Hz. It moves at ${vs} m/s ${toward ? 'towards' : 'away from'} a person standing at rest. Taking the speed of sound as 340 m/s, find the frequency the person hears, in Hz.</p>`, answer: fp, unit: 'Hz', tol: 0.01,
        hint: toward ? 'Source approaching: f′ = f v/(v − v_s).' : 'Source receding: f′ = f v/(v + v_s).',
        solution: steps(toward ? 'Approaching: f′ = f v/(v − v<sub>s</sub>).' : 'Receding: f′ = f v/(v + v<sub>s</sub>).', `f′ = ${f} × 340 ÷ ${toward ? 340 - vs : 340 + vs} = <b>${n(fp)} Hz</b>.`) };
    },
    verify: (x) => { const lam = (340 + (x.toward ? -x.vs : x.vs)) / x.f; return 340 / lam; },
  },
};
