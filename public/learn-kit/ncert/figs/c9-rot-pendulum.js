// Class 9 Rotation (repeating motion): a pendulum swings to and fro. The time for one full swing (out and back) is
// the period T. For small swings T = 2 pi sqrt(L / g) depends on the length L, not on how wide the swing is.
import { canvas, text, title, row, slider, button, readout, loop, dot } from '../../kit.js';

export default function (host) {
  let L = 1, amp = 25, t = 0;
  const TM = 10, g = 9.8;
  const cv = canvas(host, { aspect: 1.18, max: 440, min: 290, label: 'A swinging pendulum and the graph of its sideways position against time' });
  const ctl = row(host);
  slider(ctl, { label: 'String length', min: 0.25, max: 2, step: 0.05, value: L, fmt: (v) => v.toFixed(2) + ' m', oninput: (v) => { L = v; sync(); } });
  slider(ctl, { label: 'Swing angle', min: 5, max: 40, step: 1, value: amp, fmt: (v) => v + '°', oninput: (v) => { amp = v; sync(); } });
  const c2 = row(host);
  const anim = loop(host, (dt) => { t = (t + dt) % TM; sync(); });
  anim.button(c2);
  const out = readout(host);
  const T = () => 2 * Math.PI * Math.sqrt(L / g);
  const ang = (tt) => amp * Math.cos((2 * Math.PI * tt) / T());
  function sync() { out.innerHTML = `The period is <b>${T().toFixed(2)} s</b> (T = 2π√(L ÷ 9.8)): ${(TM / T()).toFixed(1)} full swings in ${TM} s. Make the string 4 times longer and the period only doubles. Change the swing angle: the period stays the same.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Pendulum: swing to and fro, again and again', col), px = w * 0.5, py = top + 6, Mx = (h - top) * 0.28, S = Mx * (0.35 + 0.65 * L / 2);
    const a = (ang(t) * Math.PI) / 180, bx = px + Math.sin(a) * S, by = py + Math.cos(a) * S;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(px - 28, py); ctx.lineTo(px + 28, py); ctx.stroke();
    ctx.strokeStyle = col.line; ctx.setLineDash([4, 4]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py + S + 14); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(bx, by); ctx.stroke();
    dot(ctx, bx, by, 9, col.s[2], col.ink);
    const gx0 = 40, gx1 = w - 14, gy0 = py + Mx * 1.15 + 22, gy1 = h - 24, gm = (gy0 + gy1) / 2, X = (tt) => gx0 + (tt / TM) * (gx1 - gx0), Y = (v) => gm - (v / 40) * ((gy1 - gy0) / 2);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(gx0, gm); ctx.lineTo(gx1, gm); ctx.stroke();
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx0, gy1); ctx.stroke();
    text(ctx, 'right', gx0 - 5, Y(40) + 4, { color: col.muted, size: 10, align: 'right' }); text(ctx, 'left', gx0 - 5, Y(-40) - 2, { color: col.muted, size: 10, align: 'right' });
    for (let s = 0; s <= TM; s += 2) text(ctx, s + ' s', X(s), gy1 + 11, { color: col.muted, size: 10, align: 'center' });
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.beginPath();
    for (let tt = 0; tt <= t; tt += 0.05) { const x = X(tt), y = Y(ang(tt)); tt === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    ctx.stroke();
    ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(0), Y(-amp) + 8); ctx.lineTo(X(T()), Y(-amp) + 8); ctx.stroke();
    text(ctx, 'period', X(T() / 2), Y(-amp) + 18, { color: col.s[3], size: 10, weight: 700, align: 'center' });
    dot(ctx, X(t), Y(ang(t)), 5, col.s[2], col.ink);
  };
  sync();
}
