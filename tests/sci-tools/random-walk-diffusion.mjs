// #922 random walk and diffusion: track MSD and fits checked against an independent NumPy script (array
// differences per lag, numpy.linalg.lstsq and polyfit); simulations checked against D = a²/(2 d dt).
import * as W from '../../src/lib/sci/phwalk.ts';
import { parseTable } from '../../src/lib/sci/num.ts';

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.abs(b);
  const p = W.parseTracks(parseTable(W.exampleTracks()), 2, true);
  check('walk: example tracks parse (10 tracks of 100 frames, header skipped)', !p.error && p.tracks.length === 10 && p.tracks.every((t) => t.t.length === 100));
  const m = W.trackMSD(p.tracks, 15);
  check('walk: time-averaged MSD matches NumPy', near(m.dt, 0.1, 1e-12) && [0.200712157374, 0.394610015714, 0.579027378938, 0.764578517667, 0.9441977888].every((v, i) => near(m.msd[i], v, 1e-10)) && near(m.msd[14], 2.832648634129412, 1e-10) && m.n[0] === 990 && !m.irregular);
  const L = m.lag.slice(0, 10), M = m.msd.slice(0, 10);
  { const f = W.fitD(L, M, 2); check('walk: D through the origin matches numpy lstsq', near(f.D, 0.4716078395018255, 1e-10)); }
  { const f = W.fitD(L, M, 2, true); check('walk: D with an offset, its error and the offset match numpy', near(f.D, 0.46579061692138424, 1e-10) && near(f.c, 0.016288223225235716, 1e-8) && near(f.Dse, 0.0018123590842145907, 1e-8)); }
  check('walk: anomalous exponent matches numpy polyfit', near(W.alphaFit(L, M).alpha, 0.9694971955404009, 1e-10));
  for (const [dim, kind] of [[1, 'lattice'], [2, 'lattice'], [3, 'gaussian'], [2, 'gaussian']]) {
    const s = W.simulate({ dim, walkers: 2000, steps: 400, a: 1, dt: 1, kind, seed: 3 }), f = W.fitD(s.t, s.msd, dim);
    check(`walk: ${dim}D ${kind} walk gives D close to a²/(2 d dt) (${f.D.toFixed(4)} vs ${s.Dtheory})`, near(f.D, s.Dtheory, 0.06) && s.paths.length === 10 && s.finals.length === 2000);
  }
  { const s = W.simulate({ dim: 1, walkers: 1, steps: 50, a: 2, dt: 1, kind: 'lattice', seed: 1 }); check('walk: lattice steps are exactly ±a', s.paths[0].every((q, i) => i === 0 || Math.abs(Math.abs(q[0] - s.paths[0][i - 1][0]) - 2) < 1e-12)); }
  { const s1 = W.simulate({ dim: 2, walkers: 50, steps: 20, a: 1, dt: 1, kind: 'gaussian', seed: 9 }), s2 = W.simulate({ dim: 2, walkers: 50, steps: 20, a: 1, dt: 1, kind: 'gaussian', seed: 9 }); check('walk: the same seed repeats the run', s1.msd.every((v, i) => v === s2.msd[i])); }
  { const t = [0, 1, 2, 3, 4], f = W.fitD(t, t.map((x) => 6 * x), 3); check('walk: exact straight line gives D and R² = 1', near(f.D, 1, 1e-12) && near(f.r2, 1, 1e-12)); }
  { const m2 = W.trackMSD([{ id: 'a', t: [0, 1, 3, 4], r: [[0], [1], [3], [4]] }], 3); check('walk: missing frames are matched by time', m2.lag.length === 3 && m2.n[0] === 2 && m2.msd[0] === 1 && m2.msd[2] === 9); }
  check('walk: bad rows give messages', !!W.parseTracks([['a', '0', '1', '2'], ['a', '1', '1', 'x']], 2, true).error && !!W.parseTracks([['a', '0', '1', 'x']], 2, true).error && !!W.parseTracks([['a', '0', '1', '2'], ['a', '0', '1', '2']], 2, true).error && !!W.parseTracks([['t', 'x'], ['0', '1'], ['1', 'q']], 1, false).error);
  // New with the blog article short-track-msd-anomalous-exponent-bias-correction (Appl. Sci. 15, 8000, 2025):
  // the lag geometry of a 4-lag log-log fit, and the short-track bias of the exponent for pure Brownian motion.
  {
    const logs = [1, 2, 3, 4].map(Math.log), ml = logs.reduce((a, b) => a + b, 0) / 4;
    check('walk: lag geometry for τ = 1..4 gives Σ(log τ − mean)² = 1.0842075 (paper quotes 1.08434)', near(logs.reduce((s2, x) => s2 + (x - ml) ** 2, 0), 1.0842074932562769, 1e-12));
    const r = W.rng(4242), SD = Math.sqrt(2 * 0.5 * 1), a = [];
    for (let k = 0; k < 2000; k++) {
      const t = [], q = []; let x = 0, y = 0;
      for (let f = 0; f <= 10; f++) { if (f) { x += SD * r.n(); y += SD * r.n(); } t.push(f); q.push([x, y]); }
      const mm = W.trackMSD([{ id: '1', t, r: q }], 4);
      a.push(W.alphaFit(mm.lag, mm.msd).alpha);
    }
    const mean = a.reduce((x, y) => x + y, 0) / a.length, v = a.reduce((s2, x) => s2 + (x - mean) ** 2, 0) / (a.length - 1);
    check('walk: 2000 ten-step Brownian tracks read α̂ = 0.9208 on average (true 1) with Var[α̂] × T = 1.2025', near(mean, 0.9207721853761648, 1e-9) && near(v * 10, 1.2025320220742508, 1e-9));
  }
};
