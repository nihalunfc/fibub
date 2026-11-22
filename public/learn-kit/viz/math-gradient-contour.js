// Contours, gradient and slope in any direction. Lines join points of equal height of z = f(x, y). Drag the probe and
// turn the direction slider: the slope along your direction is D = ∇f · û = |∇f| cos φ. It is largest (|∇f|) when you
// face straight uphill, zero when you walk along a contour, and the gradient arrow always stands at right angles to
// the contour through the probe.
import { canvas, axes, row, slider, choice, readout, line, dot, text, arrow } from '../kit.js';
import { drag, f2 } from './_math.js';

const FN = {
  bowl: ['x² + 2y² (bowl)', (x, y) => x * x + 2 * y * y], hill: ['3 − x² − y² (hill)', (x, y) => 3 - x * x - y * y], sad: ['x² − y² (saddle)', (x, y) => x * x - y * y],
  wave: ['sin x · cos y', (x, y) => Math.sin(x) * Math.cos(y)], tilt: ['x + 0.5y + sin 2y', (x, y) => x + 0.5 * y + Math.sin(2 * y)],
};
export default function (host) {
  let k = 'bowl', pr = [1.2, 0.6], th = 40;
  const cv = canvas(host, { aspect: 0.9, max: 400, min: 280, label: 'Contour map with the gradient arrow and a chosen direction' });
  const c = row(host), c2 = row(host);
  choice(c, 'Surface', Object.entries(FN).map(([id, v]) => [id, v[0]]), k, (v) => { k = v; re(); });
  slider(c2, { label: 'direction (°)', min: 0, max: 360, step: 1, value: th, fmt: (v) => v + '°', oninput: (v) => { th = v; re(); } });
  const out = readout(host);
  let A0 = null;
  drag(cv, () => (A0 ? [[A0.X(pr[0]), A0.Y(pr[1])]] : []), (i, x, y) => { pr = [Math.max(-2.8, Math.min(2.8, -3 + ((x - A0.L) / (A0.R - A0.L)) * 6)), Math.max(-2.8, Math.min(2.8, 3 - ((y - A0.T) / (A0.B - A0.T)) * 6))]; re(); });
  const grad = () => { const f = FN[k][1], e = 1e-4, [x, y] = pr; return [(f(x + e, y) - f(x - e, y)) / (2 * e), (f(x, y + e) - f(x, y - e)) / (2 * e)]; };
  function re() { cv.redraw(); const g = grad(), gm = Math.hypot(...g), t = (th * Math.PI) / 180, D = g[0] * Math.cos(t) + g[1] * Math.sin(t), up = ((Math.atan2(g[1], g[0]) * 180) / Math.PI + 360) % 360;
    out.innerHTML = `At (${f2(pr[0])}, ${f2(pr[1])}): f = ${f2(FN[k][1](...pr))}, ∇f = (${f2(g[0])}, ${f2(g[1])}), |∇f| = <b>${f2(gm)}</b>, uphill direction ${f2(up, 0)}°. Slope in your direction ${th}°: D = ∇f·û = <b>${f2(D)}</b> (= |∇f| cos φ with φ = ${f2(((th - up + 540) % 360) - 180, 0)}°). ${Math.abs(D) < 0.03 * (gm + 1) ? 'You are walking along a contour: no change.' : ''} Biggest possible slope is |∇f| = ${f2(gm)}.`; }
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [-3, 3], y: [-3, 3], l: 8, b: 8, t: 22, r: 8, xt: [], yt: [], grid: false }); A0 = A; const f = FN[k][1];
    // heat map and contours on a grid
    const G = 64, vals = [], gx = (i) => -3 + (6 * i) / G;
    let lo = Infinity, hi = -Infinity; for (let i = 0; i <= G; i++) { vals[i] = []; for (let j = 0; j <= G; j++) { const v = f(gx(i), gx(j)); vals[i][j] = v; lo = Math.min(lo, v); hi = Math.max(hi, v); } }
    ctx.save(); ctx.beginPath(); ctx.rect(A.L, A.T, A.R - A.L, A.B - A.T); ctx.clip();
    for (let i = 0; i < G; i++) for (let j = 0; j < G; j++) { const t = (vals[i][j] - lo) / (hi - lo || 1); ctx.globalAlpha = 0.07 + 0.3 * t; ctx.fillStyle = col.s[0]; const xa = Math.round(A.X(gx(i))), xb = Math.round(A.X(gx(i + 1))), ya = Math.round(A.Y(gx(j + 1))), yb = Math.round(A.Y(gx(j))); ctx.fillRect(xa, ya, xb - xa, yb - ya); }
    ctx.globalAlpha = 1; ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath();
    const L = 12; for (let li = 1; li < L; li++) { const lv = lo + ((hi - lo) * li) / L; for (let i = 0; i < G; i++) for (let j = 0; j < G; j++) { const a = vals[i][j] - lv, b = vals[i + 1][j] - lv, c3 = vals[i + 1][j + 1] - lv, d = vals[i][j + 1] - lv, pts = []; const edge = (p, q, x0, y0, x1, y1) => { if ((p < 0) !== (q < 0)) { const s = p / (p - q); pts.push([x0 + (x1 - x0) * s, y0 + (y1 - y0) * s]); } }; edge(a, b, gx(i), gx(j), gx(i + 1), gx(j)); edge(b, c3, gx(i + 1), gx(j), gx(i + 1), gx(j + 1)); edge(d, c3, gx(i), gx(j + 1), gx(i + 1), gx(j + 1)); edge(a, d, gx(i), gx(j), gx(i), gx(j + 1)); if (pts.length >= 2) { ctx.moveTo(A.X(pts[0][0]), A.Y(pts[0][1])); ctx.lineTo(A.X(pts[1][0]), A.Y(pts[1][1])); } } }
    ctx.stroke();
    const g = grad(), gm = Math.hypot(...g) || 1, px = A.X(pr[0]), py = A.Y(pr[1]), t = (th * Math.PI) / 180;
    const Ls = 55; arrow(ctx, px, py, px + (g[0] / gm) * Ls * Math.min(1, gm / 2 + 0.3), py - (g[1] / gm) * Ls * Math.min(1, gm / 2 + 0.3), col.s[3], 3);
    arrow(ctx, px, py, px + Math.cos(t) * 45, py - Math.sin(t) * 45, col.s[1], 3);
    ctx.beginPath(); ctx.arc(px, py, 6, 0, 7); ctx.fillStyle = col.bg; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();
    text(ctx, 'pink: uphill · orange: your direction · darker = higher', A.L + 6, A.T + 10, { color: col.muted, size: 10 });
  };
  re();
}
