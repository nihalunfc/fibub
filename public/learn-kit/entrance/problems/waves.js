// Live problems for Waves and sound.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  'wv-string-fundamental': {
    title: 'fundamental frequency of a stretched string',
    make(r) {
      const L = pick(r, 0.4, 1.2, 0.1), T = pick(r, 40, 200, 10), mu = pick(r, 1, 10, 1); // g/m
      const v = Math.sqrt(T / (mu / 1000)), answer = v / (2 * L);
      return { L, T, mu,
        q: `<p>A wire ${L} m long between two fixed supports has a mass of ${mu} g per metre and is under a tension of ${T} N. What is its fundamental frequency?</p>`,
        answer, unit: 'Hz', tol: 0.01,
        hint: 'Wave speed v = √(T/μ) with μ in kg/m. In the fundamental the string is half a wavelength long, so f = v/2L.',
        solution: steps(`μ = ${mu} g/m = ${mu / 1000} kg/m.`, `v = √(${T}/${mu / 1000}) = ${n(v, 4)} m/s.`, `f = v/2L = ${n(v, 4)}/${n(2 * L)} = <b>${n(answer)} Hz</b>.`) };
    },
    verify: (x) => (1 / (2 * x.L)) * Math.sqrt(x.T / (x.mu / 1000)),
  },
  'wv-doppler': {
    title: 'pitch heard from a moving source',
    make(r) {
      const f = pick(r, 300, 1000, 50), vs = pick(r, 10, 40, 5), towards = r() < 0.5, v = 340;
      const answer = (f * v) / (towards ? v - vs : v + vs);
      return { f, vs, towards, v,
        q: `<p>An ambulance siren sounds at ${f} Hz. The ambulance drives ${towards ? 'towards' : 'away from'} a person standing still at ${vs} m/s. What frequency does the person hear? (speed of sound 340 m/s, still air)</p>`,
        answer, unit: 'Hz', tol: 0.005,
        hint: `Moving source: f' = f v/(v ${towards ? '−' : '+'} v_s). ${towards ? 'Approaching crowds the waves together: higher pitch.' : 'Moving away stretches the waves: lower pitch.'}`,
        solution: steps(`f' = f × v/(v ${towards ? '−' : '+'} v_s) = ${f} × 340/(340 ${towards ? '−' : '+'} ${vs}).`, `f' = ${f} × 340/${towards ? 340 - vs : 340 + vs} = <b>${n(answer, 4)} Hz</b>.`) };
    },
    verify: (x) => { // wavelength in front of (or behind) the source, then f = v/λ
      const lam = (x.v + (x.towards ? -x.vs : x.vs)) / x.f; return x.v / lam;
    },
  },
  'wv-closed-pipe': {
    title: 'length of a closed pipe for a given note',
    make(r) {
      const f = pick(r, 200, 600, 20), k = [1, 3, 5][Math.floor(r() * 3)], v = 340;
      const answer = ((k * v) / (4 * f)) * 100;
      return { f, k, v,
        q: `<p>A pipe closed at one end sounds its ${['', 'fundamental (1st harmonic)', '', '3rd harmonic', '', '5th harmonic'][k]} at ${f} Hz. How long is the pipe, in cm? (speed of sound 340 m/s; ignore end correction)</p>`,
        answer, unit: 'cm', tol: 0.01,
        hint: 'A closed pipe has a node at the closed end and an antinode at the open end, so f = k v/4L with k odd.',
        solution: steps(`f = k v/(4L) with k = ${k}.`, `L = ${k} × 340/(4 × ${f}) = ${n(answer / 100, 4)} m.`, `L = <b>${n(answer)} cm</b>.`) };
    },
    verify: (x) => { // the pipe holds k quarter-wavelengths
      const lam = x.v / x.f; return ((x.k * lam) / 4) * 100;
    },
  },
};
