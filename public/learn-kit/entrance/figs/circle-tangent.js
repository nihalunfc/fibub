// Circles: a circle and a point P. S₁ (the circle's equation evaluated at P) says whether P is inside, on or
// outside. From an outside point the figure draws both tangents, their length √S₁ and the chord of contact.
import { canvas, axes, line, dot, text, row, slider, readout, fmt } from '../../kit.js';

export default function (host) {
  let h = 1, k = 0.5, r = 2.5, px = 5, py = 3;
  const cv = canvas(host, { aspect: 0.75, max: 420, min: 280, label: 'A circle, a point P, the tangents from P and the chord of contact' });
  const ctl = row(host);
  const re = () => { cv.redraw(); show(); };
  slider(ctl, { label: 'centre x', min: -3, max: 3, step: 0.5, value: h, fmt: (v) => fmt(v, 2), oninput: (v) => { h = v; re(); } });
  slider(ctl, { label: 'centre y', min: -3, max: 3, step: 0.5, value: k, fmt: (v) => fmt(v, 2), oninput: (v) => { k = v; re(); } });
  slider(ctl, { label: 'radius r', min: 0.5, max: 4, step: 0.25, value: r, fmt: (v) => fmt(v, 3), oninput: (v) => { r = v; re(); } });
  slider(ctl, { label: 'P: x₁', min: -6, max: 6, step: 0.5, value: px, fmt: (v) => fmt(v, 2), oninput: (v) => { px = v; re(); } });
  slider(ctl, { label: 'P: y₁', min: -5, max: 5, step: 0.5, value: py, fmt: (v) => fmt(v, 2), oninput: (v) => { py = v; re(); } });
  const out = readout(host);
  const S1 = () => (px - h) ** 2 + (py - k) ** 2 - r * r;
  const show = () => {
    const s = S1(), g = -h, f = -k, c = h * h + k * k - r * r;
    const eq = `x² + y² ${g < 0 ? '−' : '+'} ${fmt(Math.abs(2 * g), 3)}x ${f < 0 ? '−' : '+'} ${fmt(Math.abs(2 * f), 3)}y ${c < 0 ? '−' : '+'} ${fmt(Math.abs(c), 4)} = 0`;
    const where = Math.abs(s) < 1e-9 ? 'P is <b>on</b> the circle: one tangent, at P itself.' : s < 0 ? 'S₁ < 0, so P is <b>inside</b> the circle: no tangent can be drawn from it.' : `S₁ > 0, so P is <b>outside</b>: two tangents, each of length √S₁ = <b>${fmt(Math.sqrt(s), 4)}</b>. The chord joining the points of contact is T = 0.`;
    out.innerHTML = `Circle: ${eq} (centre (−g, −f) = (${fmt(h, 2)}, ${fmt(k, 2)}), r = √(g² + f² − c) = ${fmt(r, 3)}). S₁ = ${fmt(s, 4)}. ${where}`;
  };
  cv.draw = (ctx, w, hh, col) => {
    const Ly = 6, Lx = (Ly * (w - 48)) / (hh - 50);
    const { X, Y, clip } = axes(ctx, w, hh, col, { x: [-Lx, Lx], y: [-Ly, Ly], l: 34, r: 14, t: 22, b: 28 });
    ctx.save(); clip();
    line(ctx, [[X(-Lx), Y(0)], [X(Lx), Y(0)]], col.muted, 1.2);
    line(ctx, [[X(0), Y(-Ly)], [X(0), Y(Ly)]], col.muted, 1.2);
    const sc = X(1) - X(0);
    ctx.beginPath(); ctx.arc(X(h), Y(k), r * sc, 0, 2 * Math.PI); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.stroke();
    dot(ctx, X(h), Y(k), 3.5, col.s[0]); text(ctx, 'C', X(h) + 6, Y(k) - 8, { color: col.s[0], size: 11, halo: col.panel });
    const s = S1(), d = Math.hypot(px - h, py - k);
    if (s > 1e-9) {
      // points of contact: angle at C between CP and CT is acos(r/d)
      const base = Math.atan2(py - k, px - h), a = Math.acos(r / d);
      const T = [base + a, base - a].map((t) => [h + r * Math.cos(t), k + r * Math.sin(t)]);
      T.forEach(([tx, ty]) => {
        const ex = tx + (tx - px) * 0.6, ey = ty + (ty - py) * 0.6;
        line(ctx, [[X(px), Y(py)], [X(ex), Y(ey)]], col.s[1], 2);
        line(ctx, [[X(h), Y(k)], [X(tx), Y(ty)]], col.line, 1, [3, 3]);
        dot(ctx, X(tx), Y(ty), 4, col.s[1]);
      });
      line(ctx, T.map(([x, y]) => [X(x), Y(y)]), col.s[2], 2, [6, 4]);
      line(ctx, [[X(h), Y(k)], [X(px), Y(py)]], col.line, 1, [3, 3]);
    } else if (Math.abs(s) <= 1e-9) {
      const nx = -(py - k), ny = px - h;
      line(ctx, [[X(px - nx * 3), Y(py - ny * 3)], [X(px + nx * 3), Y(py + ny * 3)]], col.s[1], 2);
    }
    dot(ctx, X(px), Y(py), 5, col.ink); text(ctx, 'P', X(px) + 8, Y(py) - 9, { color: col.ink, weight: 700, halo: col.panel });
    ctx.restore();
  };
  re();
}
