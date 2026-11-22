// Launch a planet sideways at distance 1 from the Sun, with a speed you choose (units: circular speed = 1). Below 1
// it falls into an ellipse, exactly 1 gives a circle, above gives a longer ellipse, √2 ≈ 1.41 just escapes (parabola),
// beyond that a hyperbola. The two shaded wedges are swept in equal times: Kepler's second law, equal areas.
import { canvas, text, row, choice, slider, readout, loop, button, line, dot } from '../kit.js';

export default function (host) {
  let t = 0, tr = null;
  const cv = canvas(host, { aspect: 0.9, max: 420, min: 300, label: 'An orbit around the Sun for a chosen launch speed, with two equal-time wedges of equal area' });
  const c1 = row(host);
  const sv = slider(c1, { label: 'Launch speed (circular = 1)', min: 0.5, max: 1.6, step: 0.01, value: 0.8, fmt: (v) => v.toFixed(2), oninput: () => { build(); } });
  [['Circle', 1], ['Escape', Math.SQRT2]].forEach(([n, v]) => button(c1, n, () => { sv.set(v); build(); }));
  const anim = loop(host, (dt) => { t += dt * 0.6; if (t > tr.tmax + 0.5) t = 0; cv.redraw(); });
  anim.button(c1);
  const out = readout(host);
  function build() {
    const v = sv.value, dt = 0.002, e = Math.abs(v * v - 1);
    let x = 1, y = 0, vx = 0, vy = v, s = [[0, x, y]], tm = 0, tmax = v < Math.SQRT2 - 1e-6 ? 2 * Math.PI * Math.pow(1 / (2 - v * v), 1.5) : 14;
    const acc = (x, y) => { const r3 = Math.pow(x * x + y * y, 1.5); return [-x / r3, -y / r3]; };
    let ax = acc(x, y);
    while (tm < tmax && x * x + y * y < 60) { vx += 0.5 * dt * ax[0]; vy += 0.5 * dt * ax[1]; x += vx * dt; y += vy * dt; ax = acc(x, y); vx += 0.5 * dt * ax[0]; vy += 0.5 * dt * ax[1]; tm += dt; s.push([tm, x, y]); }
    tr = { s, tmax: tm, v, e }; t = 0;
    const type = Math.abs(v - 1) < 0.005 ? 'circle' : v < Math.SQRT2 - 0.005 ? 'ellipse' : Math.abs(v - Math.SQRT2) < 0.005 ? 'parabola (just escapes)' : 'hyperbola (escapes)';
    const a = 1 / (2 - v * v);
    out.innerHTML = `v = ${v.toFixed(2)} v<sub>circ</sub>: a <b>${type}</b>, eccentricity e = |v² − 1| = ${e.toFixed(2)}. Energy per unit mass ½v² − 1 = ${(0.5 * v * v - 1).toFixed(2)} (negative = bound).` + (v < Math.SQRT2 - 0.005 ? ` Semi-major axis a = ${a.toFixed(2)}, period ∝ a<sup>3/2</sup> = ${(2 * Math.PI * Math.pow(a, 1.5)).toFixed(2)}.` : '') + ` Angular momentum r v is the same everywhere, so the wedges are equal: A = ½ L Δt.`;
    cv.redraw();
  }
  const slice = (t0, t1) => tr.s.filter((q) => q[0] >= t0 && q[0] <= t1);
  cv.draw = (ctx, w, h, col) => {
    if (!tr) return;
    const xs = tr.s.map((q) => q[1]), ys = tr.s.map((q) => q[2]);
    let x0 = Math.min(...xs, -0.3), x1 = Math.max(...xs, 0.3), y0 = Math.min(...ys, -0.3), y1 = Math.max(...ys, 0.3);
    if (tr.v >= Math.SQRT2 - 1e-6) { x1 = Math.min(x1, 5); y0 = Math.max(y0, -4); y1 = Math.min(y1, 4); x0 = Math.max(x0, -2); }
    const k = Math.min((w - 24) / (x1 - x0), (h - 30) / (y1 - y0)), X = (x) => 12 + (x - x0) * k + (w - 24 - (x1 - x0) * k) / 2, Y = (y) => h - 14 - (y - y0) * k - (h - 30 - (y1 - y0) * k) / 2;
    line(ctx, tr.s.filter((q, i) => i % 6 === 0).map((q) => [X(q[1]), Y(q[2])]), col.line, 1.5);
    const dtw = tr.tmax / (tr.v < Math.SQRT2 ? 9 : 14), starts = [0, tr.v < Math.SQRT2 - 1e-6 ? tr.tmax * 0.5 - dtw / 2 : tr.tmax * 0.5];
    const areas = starts.map((t0, i) => {
      const P = slice(t0, t0 + dtw); if (P.length < 2) return 0;
      ctx.beginPath(); ctx.moveTo(X(0), Y(0)); P.forEach((q) => ctx.lineTo(X(q[1]), Y(q[2]))); ctx.closePath(); ctx.fillStyle = col.s[i ? 1 : 0]; ctx.globalAlpha = 0.35; ctx.fill(); ctx.globalAlpha = 1;
      let A = 0; for (let j = 1; j < P.length; j++) A += 0.5 * (P[j - 1][1] * P[j][2] - P[j][1] * P[j - 1][2]); return A;
    });
    dot(ctx, X(0), Y(0), 7, col.s[1], col.panel); text(ctx, 'Sun', X(0) + 9, Y(0) + 12, { color: col.muted, size: 10 });
    const cur = tr.s[Math.min(tr.s.length - 1, Math.round(Math.min(t, tr.tmax) / 0.002))];
    line(ctx, tr.s.filter((q) => q[0] <= t && q[0] % 0.012 < 0.002).map((q) => [X(q[1]), Y(q[2])]), col.s[0], 2.5);
    dot(ctx, X(cur[1]), Y(cur[2]), 6, col.s[0], col.panel);
    text(ctx, `Equal-time wedges: area ${areas[0].toFixed(3)} and ${areas[1].toFixed(3)}`, 8, 14, { color: col.ink, size: 11, weight: 700 });
  };
  build();
}
