// Partial sums of a series, one term at a time. Pick a series and press Play (or slide n): the dots are the partial
// sums Sₙ. A geometric series with |r| < 1 settles on a / (1 − r); the harmonic series 1 + ½ + ⅓ + … creeps up
// forever; the alternating harmonic series wobbles in to ln 2. A converging series has terms that go to 0, but that
// alone is not enough (the harmonic series is the warning).
import { canvas, axes, row, slider, choice, readout, loop, dot, line, text } from '../kit.js';
import { f2 } from './_math.js';

export default function (host) {
  let kind = 'geo', r = 0.6, N = 1, tm = 0;
  const cv = canvas(host, { aspect: 0.66, max: 380, min: 250, label: 'Partial sums of a series plotted against the number of terms' });
  const c1 = row(host), c2 = row(host);
  const SER = {
    geo: ['Geometric a=1', (k) => r ** (k - 1)], harm: ['Harmonic 1/k', (k) => 1 / k], alt: ['Alternating 1/k', (k) => ((-1) ** (k - 1)) / k],
    p2: ['1/k²', (k) => 1 / (k * k)], dv: ['(−1)ᵏ⁻¹ (diverges)', (k) => (-1) ** (k - 1) * 1],
  };
  choice(c1, 'Series', Object.entries(SER).map(([id, v]) => [id, v[0]]), kind, (v) => { kind = v; N = 1; sl.set(1); re(); });
  const anim = loop(host, (dt) => { tm += dt; if (tm > 0.12) { tm = 0; N = N >= 40 ? 1 : N + 1; sl.set(N); re(); } }, { autoplay: false });
  anim.button(c1);
  const sl = slider(c2, { label: 'terms n', min: 1, max: 40, step: 1, value: N, fmt: (v) => v, oninput: (v) => { N = v; re(); } });
  slider(c2, { label: 'ratio r', min: -1.2, max: 1.2, step: 0.05, value: r, fmt: (v) => f2(v), oninput: (v) => { r = v; re(); } });
  const out = readout(host);
  const S = (n) => { let s = 0; for (let k = 1; k <= n; k++) s += SER[kind][1](k); return s; };
  const limit = () => (kind === 'geo' ? (Math.abs(r) < 1 ? 1 / (1 - r) : null) : kind === 'harm' ? null : kind === 'alt' ? Math.LN2 : kind === 'p2' ? (Math.PI ** 2) / 6 : null);
  const re = () => { cv.redraw(); const L = limit(); out.innerHTML = `After n = ${N} terms: S<sub>n</sub> = <b>${f2(S(N), 4)}</b>. Last term = ${f2(SER[kind][1](N), 4)}. ${L !== null ? `The sums are closing in on <b>${f2(L, 4)}</b>${kind === 'geo' ? ' = a/(1 − r)' : kind === 'alt' ? ' = ln 2' : ' = π²/6'}: the series <b>converges</b>.` : kind === 'harm' ? 'The terms go to 0 yet the sums keep growing (about ln n + 0.58): it <b>diverges</b>.' : kind === 'geo' ? '|r| ≥ 1: the terms do not shrink, so it <b>diverges</b>.' : 'The terms never go to 0, so the sums bounce between 1 and 0: it <b>diverges</b> (no limit).'}`; };
  cv.draw = (ctx, w, h, col) => {
    const vals = Array.from({ length: 40 }, (_, i) => S(i + 1)), L = limit();
    let hi = Math.max(...vals, L ?? -9), lo = Math.min(0, ...vals); if (hi - lo > 40) hi = lo + 40; if (hi - lo < 1) hi = lo + 1;
    const A = axes(ctx, w, h, col, { x: [0, 41], y: [lo, hi * 1.08], l: 36, b: 40, t: 22, r: 10, xlabel: 'number of terms n', ylabel: 'Sₙ', xt: [0, 10, 20, 30, 40] });
    ctx.save(); ctx.beginPath(); ctx.rect(A.L, A.T, A.R - A.L, A.B - A.T); ctx.clip();
    if (L !== null) { line(ctx, [[A.L, A.Y(L)], [A.R, A.Y(L)]], col.s[2], 1.5, [6, 4]); }
    for (let n = 1; n <= N; n++) dot(ctx, A.X(n), A.Y(vals[n - 1]), n === N ? 5 : 3, n === N ? col.s[1] : col.s[0]);
    ctx.restore();
    if (L !== null) text(ctx, `limit ${f2(L, 3)}`, A.R - 4, A.Y(L) - 8, { color: col.s[2], size: 11, weight: 600, align: 'right' });
  };
  re();
}
