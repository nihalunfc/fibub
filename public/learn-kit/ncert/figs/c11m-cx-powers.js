// Class 11 Maths, Complex Numbers: powers of i. Each multiplication by i is a quarter turn, so i, i², i³, i⁴ go to i, −1, −i, 1 and then the cycle repeats every four steps.
// iⁿ depends only on the remainder of n when divided by 4.
import { canvas, text, title, row, slider, readout, loop, dot } from '../../kit.js';

const V = ['1', 'i', '−1', '−i'];
export default function (host) {
  let n = 3, sl;
  const cv = canvas(host, { aspect: 0.96, max: 440, min: 290, label: 'The powers of i going round the unit circle in quarter turns' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Each × i is a quarter turn', col), R = Math.min(w * 0.28, 90), cx = w / 2, cy = top + 14 + R, nn = Math.round(n), r4 = nn % 4;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke(); ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(cx - R - 12, cy); ctx.lineTo(cx + R + 12, cy); ctx.moveTo(cx, cy - R - 12); ctx.lineTo(cx, cy + R + 12); ctx.stroke();
    [[1, 0], [0, 1], [-1, 0], [0, -1]].forEach(([a, b], k) => { const x = cx + a * R, y = cy - b * R, on = k === r4; if (on) { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.2; ctx.beginPath(); ctx.arc(x, y, 16, 0, 7); ctx.fill(); ctx.globalAlpha = 1; } text(ctx, V[k], x + (a === 1 ? 20 : a === -1 ? -20 : 0), y + (b === 1 ? -18 : b === -1 ? 18 : 0), { color: on ? col.s[0] : col.muted, size: 14, weight: 800, align: 'center' }); dot(ctx, x, y, 4, on ? col.s[0] : col.muted, col.panel); });
    const a = (n * Math.PI) / 2; ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R * 0.45, 0, -a, true); ctx.stroke();
    const px = cx + R * Math.cos(a), py = cy - R * Math.sin(a); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke(); dot(ctx, px, py, 7, col.s[0], col.panel);
    text(ctx, `i^${nn} = ${V[r4]}`, cx, cy + R + 52, { color: col.s[0], size: 20, weight: 800, align: 'center' });
    out.innerHTML = `n = ${nn} = 4 × ${Math.floor(nn / 4)} + ${r4}, so iⁿ = i<sup>${r4}</sup> = <b>${V[r4]}</b>. Four quarter turns make one full turn (i⁴ = 1).`;
  };
  const anim = loop(host, (dt) => { n = (n + dt * 1.2) % 24; sl.set(n); cv.redraw(); }, { autoplay: false });
  const r = row(host); anim.button(r);
  sl = slider(r, { label: 'n', min: 0, max: 24, step: 1, value: n, fmt: (v) => Math.round(v), oninput: (v) => { n = v; anim.pause(); cv.redraw(); } });
  cv.redraw();
}
