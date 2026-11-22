// The argument principle, watched. The loop in the z-plane (left) is walked once anticlockwise. The right plane shows
// w = f(z) as it goes round. The number of times the w-curve winds anticlockwise round the origin equals
// (zeros inside the loop) − (poles inside), each counted with its multiplicity. Resize and move the loop to catch or
// drop a zero or pole, then read the winding number.
import { canvas, row, slider, choice, button, readout, loop, dot, line, text } from '../kit.js';
import { f2 } from './_math.js';

// zeros and poles: [x, y, multiplicity (positive for zero, negative for pole)]
const FN = {
  a: ['(z − 1)(z + 1)', [[1, 0, 1], [-1, 0, 1]], 1], b: ['(z² + 1)/z', [[0, 1, 1], [0, -1, 1], [0, 0, -1]], 1], c: ['1/(z − 0.5)²', [[0.5, 0, -2]], 1],
  d: ['z (z − 1)/(z + 1 − i)', [[0, 0, 1], [1, 0, 1], [-1, 1, -1]], 1], e: ['z³ − 1', [[1, 0, 1], [-0.5, 0.866, 1], [-0.5, -0.866, 1]], 1],
};
const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cdiv = (a, b) => { const d = b[0] * b[0] + b[1] * b[1] || 1e-12; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
export default function (host) {
  let k = 'e', cx = 0, cy = 0, rr = 1.3, tt = 0;
  const cv = canvas(host, { aspect: 0.58, max: 330, min: 220, label: 'A loop in the z-plane and the winding of its image f(z) round the origin' });
  const c = row(host), c2 = row(host);
  choice(c, 'f(z)', Object.entries(FN).map(([id, v]) => [id, v[0]]), k, (v) => { k = v; re(); });
  slider(c2, { label: 'loop radius', min: 0.3, max: 2.4, step: 0.05, value: rr, fmt: (v) => f2(v), oninput: (v) => { rr = v; re(); } });
  slider(c2, { label: 'centre x', min: -1.5, max: 1.5, step: 0.05, value: cx, fmt: (v) => f2(v), oninput: (v) => { cx = v; re(); } });
  slider(c2, { label: 'centre y', min: -1.5, max: 1.5, step: 0.05, value: cy, fmt: (v) => f2(v), oninput: (v) => { cy = v; re(); } });
  const anim = loop(host, (dt) => { tt = (tt + dt * 0.12) % 1; re(); }); anim.button(c);
  const out = readout(host);
  const F = (z) => { let w = [1, 0]; FN[k][1].forEach(([a, b, m]) => { const d = [z[0] - a, z[1] - b]; for (let i = 0; i < Math.abs(m); i++) w = m > 0 ? cmul(w, d) : cdiv(w, d); }); return w; };
  const zat = (s) => [cx + rr * Math.cos(2 * Math.PI * s), cy + rr * Math.sin(2 * Math.PI * s)];
  const winding = () => { let tot = 0, prev = Math.atan2(F(zat(0))[1], F(zat(0))[0]); for (let i = 1; i <= 800; i++) { const w = F(zat(i / 800)), a = Math.atan2(w[1], w[0]); let d = a - prev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; tot += d; prev = a; } return Math.round(tot / (2 * Math.PI)); };
  const inside = () => { let Z = 0, P = 0; FN[k][1].forEach(([a, b, m]) => { if (Math.hypot(a - cx, b - cy) < rr) m > 0 ? (Z += m) : (P -= m); }); return [Z, P]; };
  function re() { cv.redraw(); const [Z, P] = inside(), n = winding(); out.innerHTML = `Inside the loop: <b>${Z}</b> zero${Z === 1 ? '' : 's'} and <b>${P}</b> pole${P === 1 ? '' : 's'} (counted with multiplicity). The image curve winds round 0 <b>${n}</b> time${Math.abs(n) === 1 ? '' : 's'} anticlockwise. Z − P = ${Z} − ${P} = ${Z - P}. ${Math.abs(Math.min(...FN[k][1].map(([a, b]) => Math.abs(Math.hypot(a - cx, b - cy) - rr)))) < 0.04 ? 'The loop passes right through a zero or pole, so the count is not defined there: nudge it.' : 'The argument principle: (1/2πi)∮ f′/f dz = Z − P.'}`; }
  const panel = (ctx, x0, y0, w, h, col, title, ext) => { const s = Math.min(w, h) / (2 * ext), cx0 = x0 + w / 2, cy0 = y0 + h / 2; ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(x0, y0, w, h); line(ctx, [[x0, cy0], [x0 + w, cy0]], col.line, 1); line(ctx, [[cx0, y0], [cx0, y0 + h]], col.line, 1); text(ctx, title, x0 + 6, y0 + 10, { color: col.muted, size: 10.5, weight: 600 }); return (z) => [cx0 + z[0] * s, cy0 - z[1] * s]; };
  cv.draw = (ctx, w, h, col) => {
    const half = (w - 24) / 2, y0 = 26, ph = h - y0 - 10;
    const Z = panel(ctx, 8, y0, half, ph, col, 'z-plane', 2.8);
    ctx.save(); ctx.beginPath(); ctx.rect(8, y0, half, ph); ctx.clip();
    FN[k][1].forEach(([a, b, m]) => { const p = Z([a, b]); if (m > 0) dot(ctx, p[0], p[1], 5, col.s[0], col.ink); else { ctx.beginPath(); ctx.moveTo(p[0] - 5, p[1] - 5); ctx.lineTo(p[0] + 5, p[1] + 5); ctx.moveTo(p[0] + 5, p[1] - 5); ctx.lineTo(p[0] - 5, p[1] + 5); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2.5; ctx.stroke(); } });
    const pts = Array.from({ length: 121 }, (_, i) => Z(zat(i / 120))); line(ctx, pts, col.s[2], 2.5); const q = Z(zat(tt)); dot(ctx, q[0], q[1], 5, col.s[3], col.ink); ctx.restore();
    const W = panel(ctx, 16 + half, y0, half, ph, col, 'w = f(z)', 4);
    ctx.save(); ctx.beginPath(); ctx.rect(16 + half, y0, half, ph); ctx.clip();
    const img = Array.from({ length: 241 }, (_, i) => W(F(zat(i / 240)))); line(ctx, img, col.s[2], 2.5); const p2 = W(F(zat(tt))); dot(ctx, p2[0], p2[1], 5, col.s[3], col.ink); dot(ctx, ...W([0, 0]), 3, col.ink); ctx.restore();
    text(ctx, 'blue dot = zero · orange × = pole', 10, h - 4, { color: col.muted, size: 9.5 });
  };
  re();
}
