// Sequences and series: the terms of an AP or a GP as bars, with the running sum Sₙ as a line. An AP grows by
// adding d, so its bars climb in a straight line and its sum grows like n². A GP grows by multiplying by r; when
// |r| < 1 the bars shrink and the running sum levels off at a/(1 − r).
import { canvas, axes, line, dot, row, slider, choice, readout, fmt } from '../../kit.js';

export default function (host) {
  let kind = 'gp', a = 4, d = 1.5, r = 0.6, n = 10;
  const cv = canvas(host, { aspect: 0.6, max: 360, min: 250, label: 'Bars of the terms of a progression and a line of its running sum' });
  const ctl = row(host), ctl2 = row(host);
  const re = () => { cv.redraw(); show(); };
  choice(ctl, 'Progression', [['ap', 'AP (add d)'], ['gp', 'GP (multiply by r)']], kind, (v) => { kind = v; build(); re(); });
  slider(ctl, { label: 'first term a', min: -5, max: 10, step: 0.5, value: a, fmt: (v) => fmt(v, 3), oninput: (v) => { a = v; re(); } });
  slider(ctl, { label: 'n terms', min: 3, max: 20, step: 1, value: n, oninput: (v) => { n = Math.round(v); re(); } });
  const build = () => {
    ctl2.innerHTML = '';
    if (kind === 'ap') slider(ctl2, { label: 'common difference d', min: -3, max: 3, step: 0.25, value: d, fmt: (v) => fmt(v, 3), oninput: (v) => { d = v; re(); } });
    else slider(ctl2, { label: 'common ratio r', min: -1.5, max: 1.5, step: 0.05, value: r, fmt: (v) => fmt(v, 3), oninput: (v) => { r = v; re(); } });
  };
  build();
  const out = readout(host);
  const term = (k) => (kind === 'ap' ? a + (k - 1) * d : a * r ** (k - 1));
  const sums = () => { const s = []; let t = 0; for (let k = 1; k <= n; k++) { t += term(k); s.push(t); } return s; };
  const show = () => {
    const S = sums()[n - 1];
    if (kind === 'ap') out.innerHTML = `aₙ = a + (n − 1)d = ${fmt(term(n), 4)}. Sₙ = n/2 [2a + (n − 1)d] = n/2 (first + last) = <b>${fmt(S, 5)}</b>. The terms rise by the same step each time, so the bars form a straight ramp.`;
    else {
      const inf = Math.abs(r) < 1 ? ` Because |r| < 1, the sum to infinity is a/(1 − r) = <b>${fmt(a / (1 - r), 5)}</b> (dashed line), and Sₙ creeps towards it.` : ' Because |r| ≥ 1, the terms do not shrink and there is no sum to infinity.';
      out.innerHTML = `aₙ = arⁿ⁻¹ = ${fmt(term(n), 4)}. Sₙ = a(1 − rⁿ)/(1 − r) = <b>${fmt(S, 5)}</b>.${r === 1 ? ' (For r = 1, Sₙ = na.)' : ''}${inf}`;
    }
  };
  cv.draw = (ctx, w, h, col) => {
    const s = sums(), ts = Array.from({ length: n }, (_, i) => term(i + 1));
    const all = [...s, ...ts, 0];
    if (kind === 'gp' && Math.abs(r) < 1) all.push(a / (1 - r));
    let lo = Math.min(...all), hi = Math.max(...all); if (hi - lo < 1) { hi += 0.5; lo -= 0.5; }
    const pad = (hi - lo) * 0.08;
    const { X, Y, L, R } = axes(ctx, w, h, col, { x: [0.3, n + 0.7], y: [lo - pad, hi + pad], xt: Array.from({ length: n }, (_, i) => i + 1).filter((k) => n <= 12 || k % 2 === 1), fx: (v) => String(v), xlabel: 'term number k', ylabel: 'value' });
    line(ctx, [[L, Y(0)], [R, Y(0)]], col.muted, 1);
    const bw = Math.max(3, (X(2) - X(1)) * 0.55);
    ts.forEach((t, i) => { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.75; const y0 = Y(0), y1 = Y(t); ctx.fillRect(X(i + 1) - bw / 2, Math.min(y0, y1), bw, Math.abs(y1 - y0)); ctx.globalAlpha = 1; });
    line(ctx, s.map((v, i) => [X(i + 1), Y(v)]), col.s[1], 2.2);
    s.forEach((v, i) => dot(ctx, X(i + 1), Y(v), 3.5, col.s[1]));
    if (kind === 'gp' && Math.abs(r) < 1) line(ctx, [[L, Y(a / (1 - r))], [R, Y(a / (1 - r))]], col.s[2], 1.5, [6, 4]);
  };
  re();
}
