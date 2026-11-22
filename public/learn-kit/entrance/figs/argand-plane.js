// Complex numbers on the Argand plane. Choose z by its modulus and argument and see z, its conjugate, the product zw
// (moduli multiply, arguments add, so multiplying is a stretch and a turn), the powers of z (De Moivre) or the n
// nth roots of z, which sit evenly on a circle.
import { canvas, axes, line, dot, text, row, slider, choice, readout, fmt } from '../../kit.js';

export default function (host) {
  let mode = 'product', r = 1.2, th = 30, r2 = 1.3, th2 = 50, nn = 5;
  const cv = canvas(host, { aspect: 0.75, max: 400, min: 280, label: 'Argand plane showing complex numbers as points and arrows' });
  const ctl = row(host), ctl2 = row(host);
  const re = () => { cv.redraw(); show(); };
  choice(ctl, 'Show', [['product', 'z × w'], ['powers', 'powers of z'], ['roots', 'nth roots of z']], mode, (v) => { mode = v; build(); re(); });
  slider(ctl, { label: '|z|', min: 0.3, max: 2, step: 0.05, value: r, fmt: (v) => fmt(v, 3), oninput: (v) => { r = v; re(); } });
  slider(ctl, { label: 'arg z (degrees)', min: -180, max: 180, step: 5, value: th, fmt: (v) => v + '°', oninput: (v) => { th = v; re(); } });
  const build = () => {
    ctl2.innerHTML = '';
    if (mode === 'product') {
      slider(ctl2, { label: '|w|', min: 0.3, max: 1.6, step: 0.05, value: r2, fmt: (v) => fmt(v, 3), oninput: (v) => { r2 = v; re(); } });
      slider(ctl2, { label: 'arg w (degrees)', min: -180, max: 180, step: 5, value: th2, fmt: (v) => v + '°', oninput: (v) => { th2 = v; re(); } });
    } else slider(ctl2, { label: 'n', min: 2, max: 8, step: 1, value: nn, oninput: (v) => { nn = v; re(); } });
  };
  build();
  const out = readout(host);
  const D = Math.PI / 180;
  const cx = (m, a) => [m * Math.cos(a * D), m * Math.sin(a * D)];
  const s = ([x, y]) => `${fmt(x, 3)} ${y < 0 ? '−' : '+'} ${fmt(Math.abs(y), 3)}i`.replace(/^-/, '−');
  const principal = (a) => { let v = ((a + 180) % 360 + 360) % 360 - 180; if (v === -180) v = 180; return v; };
  const show = () => {
    const z = cx(r, th);
    if (mode === 'product') {
      const w = cx(r2, th2), p = cx(r * r2, th + th2);
      out.innerHTML = `z = ${s(z)}, w = ${s(w)}. zw = <b>${s(p)}</b>: |zw| = ${fmt(r, 3)} × ${fmt(r2, 3)} = ${fmt(r * r2, 3)}, arg(zw) = ${th}° + ${th2}° = ${th + th2}°${principal(th + th2) !== th + th2 ? ` (principal value ${principal(th + th2)}°)` : ''}. The conjugate z̄ = ${s([z[0], -z[1]])} is the mirror image in the real axis.`;
    } else if (mode === 'powers') {
      out.innerHTML = `zⁿ = rⁿ(cos nθ + i sin nθ) (De Moivre). z^${nn} = ${fmt(r, 3)}^${nn}(cos ${nn * th}° + i sin ${nn * th}°) = <b>${s(cx(r ** nn, nn * th))}</b>. If |z| > 1 the powers spiral out, if |z| < 1 they spiral in, and if |z| = 1 they stay on the unit circle.`;
    } else {
      const m = r ** (1 / nn);
      out.innerHTML = `The ${nn} solutions of wⁿ = z have modulus |z|^(1/${nn}) = <b>${fmt(m, 4)}</b> and arguments (${th}° + 360°k)/${nn}, k = 0 to ${nn - 1}: they are ${fmt(360 / nn, 4)}° apart and form a regular ${nn}-gon. Their sum is 0.`;
    }
  };
  cv.draw = (ctx, w, h, col) => {
    const L = 2.6, Lx = (L * (w - 48)) / (h - 50);
    const { X, Y } = axes(ctx, w, h, col, { x: [-Lx, Lx], y: [-L, L], l: 34, r: 14, t: 22, b: 28, xlabel: '', ylabel: '' });
    line(ctx, [[X(-10), Y(0)], [X(10), Y(0)]], col.muted, 1.2);
    line(ctx, [[X(0), Y(-L)], [X(0), Y(L)]], col.muted, 1.2);
    text(ctx, 'Re', X(Lx) - 16, Y(0) - 10, { color: col.muted, size: 11 });
    text(ctx, 'Im', X(0) + 6, Y(L) + 10, { color: col.muted, size: 11 });
    const circ = (m, c, dash) => { ctx.save(); ctx.beginPath(); ctx.arc(X(0), Y(0), X(m) - X(0), 0, 2 * Math.PI); ctx.strokeStyle = c; ctx.lineWidth = 1; if (dash) ctx.setLineDash(dash); ctx.stroke(); ctx.restore(); };
    circ(1, col.line, [4, 4]);
    const arrowTo = (p, c, label) => { line(ctx, [[X(0), Y(0)], [X(p[0]), Y(p[1])]], c, 2.2); dot(ctx, X(p[0]), Y(p[1]), 5, c); if (label) text(ctx, label, X(p[0]) + 8, Y(p[1]) - 10, { color: c, weight: 700, halo: col.panel }); };
    const z = cx(r, th);
    if (mode === 'product') {
      const wv = cx(r2, th2), p = cx(r * r2, th + th2);
      line(ctx, [[X(z[0]), Y(z[1])], [X(z[0]), Y(-z[1])]], col.line, 1, [3, 3]);
      dot(ctx, X(z[0]), Y(-z[1]), 4, col.muted); text(ctx, 'z̄', X(z[0]) + 8, Y(-z[1]) + 10, { color: col.muted, halo: col.panel });
      arrowTo(z, col.s[0], 'z'); arrowTo(wv, col.s[1], 'w'); arrowTo(p, col.s[2], 'zw');
    } else if (mode === 'powers') {
      const pts = []; for (let k = 1; k <= nn; k++) { const p = cx(r ** k, k * th); if (Math.hypot(...p) < 6) pts.push(p); }
      line(ctx, [[X(0), Y(0)], ...pts.map((p) => [X(p[0]), Y(p[1])])], col.line, 1, [3, 3]);
      pts.forEach((p, i) => { dot(ctx, X(p[0]), Y(p[1]), 4.5, i === 0 ? col.s[0] : col.s[2]); text(ctx, i === 0 ? 'z' : 'z' + '²³⁴⁵⁶⁷⁸'[i - 1], X(p[0]) + 7, Y(p[1]) - 9, { color: col.ink, size: 11, halo: col.panel }); });
    } else {
      const m = r ** (1 / nn); circ(m, col.s[1]);
      arrowTo(z, col.s[0], 'z');
      const pts = []; for (let k = 0; k < nn; k++) pts.push(cx(m, (th + 360 * k) / nn));
      line(ctx, [...pts, pts[0]].map((p) => [X(p[0]), Y(p[1])]), col.s[2], 1.5);
      pts.forEach((p) => dot(ctx, X(p[0]), Y(p[1]), 4.5, col.s[2]));
    }
  };
  re();
}
