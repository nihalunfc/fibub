// Class 9 Science, Chapter 10 Sound Waves: live problems (original fibub questions). Ids start with c9s-snd-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c9s-snd-vfl': {
    title: 'speed from frequency and wavelength',
    make(r) {
      const f = pick(r, 100, 900, 50), lam = pick(r, 0.4, 3, 0.2), answer = f * lam;
      return { f, lam, q: `<p>A sound wave in a medium has frequency ${f} Hz and wavelength ${n(lam, 2)} m. Find the speed of the wave.</p>`, answer, unit: 'm/s', tol: 0.01,
        hint: 'Use v = f × λ.', solution: steps(`v = f × λ = ${f} × ${n(lam, 2)}.`, `= <b>${n(answer, 4)} m/s</b>.`) };
    },
    verify: (x) => x.lam / (1 / x.f),
  },
  'c9s-snd-lambda': {
    title: 'wavelength of a note in air',
    make(r) {
      const f = pick(r, 100, 2000, 50), answer = 343 / f;
      return { f, q: `<p>A note of frequency ${f} Hz travels in air, where sound moves at 343 m/s. What is its wavelength?</p>`, answer, unit: 'm', tol: 0.01,
        hint: 'Use the wave equation v = f × λ and solve it for the wavelength.', solution: steps(`λ = v ÷ f = 343 ÷ ${f}.`, `= <b>${n(answer, 3)} m</b>.`) };
    },
    verify: (x) => 343 / x.f,
  },
  'c9s-snd-freq': {
    title: 'frequency from vibrations counted',
    make(r) {
      const T = choose(r, [2, 4, 5, 10]), cnt = pick(r, 200, 900, 50) * T / 2, answer = cnt / T;
      return { T, cnt, q: `<p>A tuning fork makes ${cnt} vibrations in ${T} seconds. What is its frequency?</p>`, answer, unit: 'Hz', tol: 0.01,
        hint: 'Frequency is the number of vibrations in one second.', solution: steps(`f = number of vibrations ÷ time = ${cnt} ÷ ${T}.`, `= <b>${n(answer, 4)} Hz</b>.`) };
    },
    verify: (x) => 1 / (x.T / x.cnt),
  },
  'c9s-snd-echo': {
    title: 'distance to a cliff from the echo time',
    make(r) {
      const t = pick(r, 0.2, 2, 0.1), answer = 343 * t / 2;
      return { t, q: `<p>You shout and hear the echo from a cliff after ${n(t, 2)} s. Taking the speed of sound in air as 343 m/s, how far away is the cliff?</p>`, answer, unit: 'm', tol: 0.01,
        hint: 'The sound goes to the cliff and back, so the total path is 2d = v × t.', solution: steps(`Total distance = v × t = 343 × ${n(t, 2)} = ${n(343 * t, 4)} m.`, `That is there and back, so d = ${n(343 * t, 4)} ÷ 2 = <b>${n(answer, 4)} m</b>.`) };
    },
    verify: (x) => x.t * 171.5,
  },
  'c9s-snd-sonar': {
    title: 'sea depth from a SONAR echo',
    make(r) {
      const t = pick(r, 0.4, 6, 0.2), answer = 1500 * t / 2;
      return { t, q: `<p>A ship’s SONAR pulse returns from the sea bed after ${n(t, 2)} s. The speed of sound in sea water is 1500 m/s. How deep is the sea?</p>`, answer, unit: 'm', tol: 0.01,
        hint: 'The pulse travels down and back up: depth = v × t ÷ 2.', solution: steps(`Distance travelled = 1500 × ${n(t, 2)} = ${n(1500 * t, 4)} m.`, `Depth = half of that = <b>${n(answer, 4)} m</b>.`) };
    },
    verify: (x) => 750 * x.t,
  },
};
