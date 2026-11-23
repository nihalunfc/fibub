// Class 11 Maths, Trigonometric Functions: on the unit circle the point at angle θ is (cos θ, sin θ). Its height is sin θ and its sideways
// position is cos θ. Turn the point (play or slide) and the graphs of sin and cos are drawn from those heights and positions.
import { canvas, text, title, row, slider, choice, readout, loop, dot } from '../../kit.js';
import { r2, piLabel } from '../c11m-lib.js';

export default function (host) {
  let th = 0.8, show = 'both', sl;
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 300, label: 'A point moving round the unit circle with the sine and cosine graphs drawn beside it' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Unit circle and its sin / cos graphs', col), R = Math.min(70, (h - top) * 0.34), cx = R + 14, cy = top + 14 + R * 1.1, gx0 = 2 * R + 40, gx1 = w - 10, gw = gx1 - gx0, Gx = (a) => gx0 + (a / (2 * Math.PI)) * gw, Gy = (v) => cy - v * R;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke(); ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(cx - R - 6, cy); ctx.lineTo(cx + R + 6, cy); ctx.moveTo(cx, cy - R - 6); ctx.lineTo(cx, cy + R + 6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(gx0, cy); ctx.lineTo(gx1, cy); ctx.moveTo(gx0, Gy(1) - 4); ctx.lineTo(gx0, Gy(-1) + 4); ctx.stroke();
    [0.5, 1, 1.5, 2].forEach((m) => { ctx.beginPath(); ctx.moveTo(Gx(m * Math.PI), cy - 3); ctx.lineTo(Gx(m * Math.PI), cy + 3); ctx.stroke(); text(ctx, piLabel(m * Math.PI), Gx(m * Math.PI), Gy(-1) + 14, { color: col.muted, size: 10, align: 'center' }); });
    text(ctx, '1', gx0 - 6, Gy(1), { color: col.muted, size: 10, align: 'right' }); text(ctx, '−1', gx0 - 6, Gy(-1), { color: col.muted, size: 10, align: 'right' });
    const px = cx + R * Math.cos(th), py = cy - R * Math.sin(th);
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.15; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, 16, 0, -th, true); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();
    if (show !== 'cos') { ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(px, cy); ctx.lineTo(px, py); ctx.stroke(); }
    if (show !== 'sin') { ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, cy); ctx.stroke(); }
    const curv = (f, c) => { ctx.strokeStyle = c; ctx.lineWidth = 2.4; ctx.beginPath(); for (let a = 0; a <= th + 1e-9; a += 0.03) { const x = Gx(a), y = Gy(f(a)); a ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.lineTo(Gx(th), Gy(f(th))); ctx.stroke(); };
    if (show !== 'cos') { curv(Math.sin, col.s[3]); dot(ctx, Gx(th), Gy(Math.sin(th)), 5, col.s[3], col.panel); ctx.setLineDash([3, 3]); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(Gx(th), Gy(Math.sin(th))); ctx.stroke(); ctx.setLineDash([]); }
    if (show !== 'sin') { curv(Math.cos, col.s[0]); dot(ctx, Gx(th), Gy(Math.cos(th)), 5, col.s[0], col.panel); }
    dot(ctx, px, py, 6, col.ink, col.panel);
    text(ctx, 'sin θ', gx1 - 4, cy - R - 6, { color: col.s[3], size: 11.5, weight: 800, align: 'right' }); text(ctx, 'cos θ', gx1 - 56, cy - R - 6, { color: col.s[0], size: 11.5, weight: 800, align: 'right' });
    out.innerHTML = `θ = ${r2(th, 2)} rad (${r2((th * 180) / Math.PI, 0)}°): point (cos θ, sin θ) = (<b style="color:${col.s[0]}">${r2(Math.cos(th))}</b>, <b style="color:${col.s[3]}">${r2(Math.sin(th))}</b>). Both are always between −1 and 1, and sin²θ + cos²θ = ${r2(Math.sin(th) ** 2 + Math.cos(th) ** 2)}.`;
  };
  const anim = loop(host, (dt) => { th = (th + dt * 0.9) % (2 * Math.PI); sl.set(th); cv.redraw(); }, { autoplay: false });
  const r = row(host); anim.button(r);
  sl = slider(r, { label: 'θ (rad)', min: 0, max: 6.2832, step: 0.01, value: th, fmt: (v) => r2(v, 2), oninput: (v) => { th = v; anim.pause(); cv.redraw(); } });
  choice(r, 'Show', [['both', 'sin and cos'], ['sin', 'sin'], ['cos', 'cos']], show, (v) => { show = v; cv.redraw(); });
  cv.redraw();
}
