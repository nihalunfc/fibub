// 1.9 Multiplying by z = r e^{iθ} turns by θ and scales by r. Powers z, z², z³ ... walk round a spiral (a circle when
// r = 1). Switch to roots of unity to see the n solutions of zⁿ = 1 as a regular polygon.
import { canvas, text, arrow, line, dot, row, slider, choice, readout, fmt, title } from '../../kit.js';

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';

export default function (host) {
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 260, label: 'Powers of a complex number, or roots of unity, on the complex plane' });
  let mode = 'pow', r = 1.05, th = 40, n = 6;
  const ctl = row(host);
  choice(ctl, 'Show', [['pow', 'Powers zᵏ'], ['roots', 'Roots of zⁿ = 1']], mode, (v) => { mode = v; cv.redraw(); show(); });
  slider(ctl, { label: 'r = |z|', min: 0.8, max: 1.2, step: 0.01, value: r, fmt: (v) => fmt(v, 3), oninput: (v) => { r = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'θ = arg z', min: 0, max: 180, step: 1, value: th, fmt: (v) => v + '°', oninput: (v) => { th = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'n (roots)', min: 2, max: 12, step: 1, value: n, fmt: (v) => String(v), oninput: (v) => { n = v; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    if (mode === 'pow') {
      const k = 8;
      out.innerHTML = `z = ${fmt(r, 3)}·e<sup>i${th}°</sup> = ${fmt(r * Math.cos(th * Math.PI / 180), 3)} + ${fmt(r * Math.sin(th * Math.PI / 180), 3)}i. Each multiplication by z turns by ${th}° and scales by ${fmt(r, 3)}, so z<sup>${k}</sup> has modulus ${fmt(r ** k, 3)} and angle ${(k * th) % 360}° (De Moivre). ${Math.abs(r - 1) < 0.005 ? 'With r = 1 the powers stay on the unit circle.' : r > 1 ? 'With r &gt; 1 they spiral out.' : 'With r &lt; 1 they spiral in.'}`;
    } else {
      out.innerHTML = `The ${n} roots of z<sup>${n}</sup> = 1 are e<sup>2πik/${n}</sup>, k = 0 … ${n - 1}: equally spaced by ${fmt(360 / n, 4)}° round the unit circle. They add up to 0 and multiply to ${n % 2 ? '+1' : '−1'}.`;
    }
  };
  cv.draw = (ctx, w, h, col) => {
    const S = Math.min(w, h) / 5.2, cx = w / 2, cy = h / 2 + 8;
    const P = (x, y) => [cx + x * S, cy - y * S];
    title(ctx, mode === 'pow' ? 'Powers z, z², z³, … on the complex plane' : `The ${n} roots of zⁿ = 1`, col);
    line(ctx, [P(-2.3, 0), P(2.3, 0)], col.line, 1); line(ctx, [P(0, -2.1), P(0, 2.1)], col.line, 1);
    text(ctx, 'Re', ...P(2.2, -0.15), { color: col.muted, size: 11, align: 'right' });
    text(ctx, 'Im', ...P(0.08, 2.0), { color: col.muted, size: 11 });
    const circ = []; for (let k = 0; k <= 96; k++) { const t = (k / 96) * 2 * Math.PI; circ.push(P(Math.cos(t), Math.sin(t))); }
    line(ctx, circ, col.muted, 1.2, [3, 3]);
    if (mode === 'pow') {
      const pts = [P(1, 0)];
      for (let k = 1; k <= 12; k++) { const m = r ** k, a = (k * th * Math.PI) / 180; pts.push(P(m * Math.cos(a), m * Math.sin(a))); }
      line(ctx, pts, col.s[2], 1.5);
      pts.forEach(([x, y], k) => { dot(ctx, x, y, k === 1 ? 6 : 4, k === 1 ? col.s[0] : col.s[2]); if (k > 0 && k <= 6) text(ctx, k === 1 ? 'z' : `z${SUP[k]}`, x + 8, y - 8, { color: col.ink, size: 12, halo: col.panel }); });
      arrow(ctx, ...P(0, 0), ...pts[1], col.s[0], 2.5, 9);
    } else {
      const pts = [];
      for (let k = 0; k <= n; k++) { const a = (2 * Math.PI * k) / n; pts.push(P(Math.cos(a), Math.sin(a))); }
      line(ctx, pts, col.s[2], 1.5);
      pts.slice(0, n).forEach(([x, y], k) => dot(ctx, x, y, 5, k === 0 ? col.s[0] : col.s[3]));
      text(ctx, '1', pts[0][0] + 8, pts[0][1] - 10, { color: col.ink, size: 12, halo: col.panel });
    }
  };
  cv.redraw(); show();
}
