// The n-th roots of a complex number z = r(cos θ + i sin θ) sit on a circle of radius r^(1/n), spaced 360°/n apart,
// the first at angle θ/n. Change n and θ and watch the regular polygon turn. Press "Add them up" to lay the roots
// head to tail: they always close into a loop, so the sum of all n roots is 0 (for n ≥ 2).
import { canvas, axes, row, slider, button, readout, arrow, dot, line, text, loop, ease } from '../kit.js';
import { f2 } from './_math.js';

export default function (host) {
  let n = 5, th = 60, rr = 1.5, k = 0, play = false, t0 = 0;
  const cv = canvas(host, { aspect: 0.92, max: 400, min: 280, label: 'The n-th roots of a complex number on a circle' });
  const c1 = row(host), c2 = row(host);
  const re = () => { cv.redraw(); show(); };
  slider(c1, { label: 'n', min: 2, max: 12, step: 1, value: n, fmt: (v) => v, oninput: (v) => { n = v; k = 0; re(); } });
  slider(c1, { label: 'arg z (°)', min: 0, max: 360, step: 5, value: th, fmt: (v) => v + '°', oninput: (v) => { th = v; re(); } });
  slider(c1, { label: '|z|', min: 0.5, max: 4, step: 0.1, value: rr, fmt: (v) => f2(v, 1), oninput: (v) => { rr = v; re(); } });
  button(c2, 'Add them up (head to tail)', () => { play = true; t0 = 0; k = 0; });
  button(c2, 'Reset', () => { play = false; k = 0; re(); });
  loop(host, (dt) => { if (!play) return; t0 += dt / 3.5; k = Math.min(1, t0); if (t0 >= 1) play = false; cv.redraw(); });
  const out = readout(host);
  const roots = () => Array.from({ length: n }, (_, j) => { const a = ((th + 360 * j) / n) * Math.PI / 180, m = Math.pow(rr, 1 / n); return [m * Math.cos(a), m * Math.sin(a)]; });
  function show() { const m = Math.pow(rr, 1 / n); out.innerHTML = `z has modulus ${f2(rr, 1)} and argument ${th}°. Its ${n} roots have modulus ${f2(rr, 1)}^(1/${n}) = <b>${f2(m, 3)}</b>, first argument ${th}°/${n} = <b>${f2(th / n, 1)}°</b>, then add ${f2(360 / n, 1)}° each time. Product of the roots has argument ${f2((th + 360 * (n - 1) / 2) % 360, 1)}°; sum of the roots = <b>0</b>.`; }
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [-2.4, 2.4], y: [-2.4, 2.4], l: 24, b: 20, t: 22, r: 10, xt: [-2, -1, 0, 1, 2], yt: [-2, -1, 0, 1, 2] });
    const R = roots(), m = Math.pow(rr, 1 / n), s = A.X(1) - A.X(0);
    ctx.save(); ctx.beginPath(); ctx.rect(A.L, A.T, A.R - A.L, A.B - A.T); ctx.clip();
    ctx.beginPath(); ctx.arc(A.X(0), A.Y(0), m * s, 0, 7); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
    if (k === 0) {
      line(ctx, [...R, R[0]].map(([x, y]) => [A.X(x), A.Y(y)]), col.muted, 1.5);
      R.forEach(([x, y], j) => { arrow(ctx, A.X(0), A.Y(0), A.X(x), A.Y(y), col.s[j % 2 ? 3 : 0], 1.8, 6); dot(ctx, A.X(x), A.Y(y), 4.5, col.s[j === 0 ? 1 : 0], col.ink); });
    } else {
      // head-to-tail chain, drawn up to fraction k of the n arrows
      let px = 0, py = 0; const upto = k * n;
      R.forEach(([x, y], j) => { const f = Math.max(0, Math.min(1, upto - j)); if (f <= 0) return; const qx = px + x * f, qy = py + y * f; arrow(ctx, A.X(px), A.Y(py), A.X(qx), A.Y(qy), col.s[j % 8], 2.4, 7); px += x; py += y; });
      dot(ctx, A.X(0), A.Y(0), 4, col.ink);
    }
    ctx.restore();
    text(ctx, k ? 'the chain closes: sum = 0' : `${n} roots, ${f2(360 / n, 1)}° apart`, A.L + 6, A.T + 10, { color: col.ink, size: 12, weight: 600 });
  };
  re();
}
