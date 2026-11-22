// Class 9 Rotation: the height of a point on a turning wheel, plotted against the angle turned. Measured from the
// centre, the height is R x (a number that goes 0 to 1, back to 0, down to -1 and back to 0): this number is the
// sine of the angle. Switch to "sideways" to see the same shape shifted by a quarter turn (the cosine).
import { canvas, text, title, row, slider, button, choice, readout, loop, dot } from '../../kit.js';

const fm = (v) => (Math.abs(v) < 0.005 ? 0 : v).toFixed(2).replace('-', '−');
export default function (host) {
  let a = 30, mode = 'h', trail = true;
  const cv = canvas(host, { aspect: 1.15, max: 440, min: 290, label: 'A point on a turning circle and the graph of its height against the angle' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Angle turned', min: 0, max: 360, step: 1, value: a, fmt: (v) => Math.round(v) + '°', oninput: (v) => { a = v; sync(); } });
  const c2 = row(host);
  choice(c2, 'Measure', [['h', 'Height'], ['s', 'Sideways']], mode, (v) => { mode = v; sync(); });
  const anim = loop(host, (dt) => { a = (a + 40 * dt) % 360; sl.set(a); sync(); }, { autoplay: false });
  anim.button(c2);
  [['30°', 30], ['90°', 90], ['150°', 150], ['270°', 270]].forEach(([l, v]) => button(c2, l, () => { anim.pause(); a = v; sl.set(v); sync(); }));
  const out = readout(host);
  const f = (d) => (mode === 'h' ? Math.sin((d * Math.PI) / 180) : Math.cos((d * Math.PI) / 180));
  function sync() {
    const v = f(a);
    out.innerHTML = `At ${Math.round(a)}° the point is ${mode === 'h' ? 'height' : 'sideways distance'} <b>${fm(v)} × radius</b> from the centre${Math.abs(v) < 0.005 ? ' (on the middle line)' : v > 0 ? mode === 'h' ? ' (above)' : ' (right)' : mode === 'h' ? ' (below)' : ' (left)'}. The highest it ever gets is 1 × radius, the lowest is −1 × radius.`; cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, mode === 'h' ? 'Height of the point against the angle' : 'Sideways distance against the angle', col), R = Math.min(w * 0.17, (h - top) * 0.2), cx = w * 0.3, cy = top + R + 14, th = (a * Math.PI) / 180;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx - R - 6, cy); ctx.lineTo(cx + R + 6, cy); ctx.moveTo(cx, cy - R - 6); ctx.lineTo(cx, cy + R + 6); ctx.stroke();
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R * 0.4, 0, -th, true); ctx.fill(); ctx.globalAlpha = 1;
    const px = cx + Math.cos(th) * R, py = cy - Math.sin(th) * R;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();
    ctx.strokeStyle = col.s[2]; ctx.lineWidth = 3; ctx.beginPath();
    if (mode === 'h') { ctx.moveTo(px, cy); ctx.lineTo(px, py); } else { ctx.moveTo(cx, py); ctx.lineTo(px, py); }
    ctx.stroke();
    dot(ctx, px, py, 6, col.s[2], col.ink);
    text(ctx, 'R', cx + Math.cos(th) * R * 0.5 - 8, cy - Math.sin(th) * R * 0.5 - 6, { color: col.ink, size: 11, weight: 700, halo: col.panel });
    text(ctx, mode === 'h' ? 'height = ' + fm(Math.sin(th)) + ' R' : 'sideways = ' + fm(Math.cos(th)) + ' R', w * 0.74, cy - 6, { color: col.s[2], size: 13, weight: 700, align: 'center' });
    text(ctx, 'angle ' + Math.round(a) + '°', w * 0.74, cy + 14, { color: col.muted, size: 11, align: 'center' });
    const gx0 = 34, gx1 = w - 14, gy0 = cy + R + 26, gy1 = h - 24, gm = (gy0 + gy1) / 2, X = (d) => gx0 + (d / 360) * (gx1 - gx0), Y = (v) => gm - v * ((gy1 - gy0) / 2 - 4);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1;
    [-1, 0, 1].forEach((v) => { ctx.beginPath(); ctx.moveTo(gx0, Y(v)); ctx.lineTo(gx1, Y(v)); ctx.stroke(); text(ctx, String(v).replace('-', '−'), gx0 - 5, Y(v), { color: col.muted, size: 10, align: 'right' }); });
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx0, gy1); ctx.stroke();
    [0, 90, 180, 270, 360].forEach((d) => text(ctx, d + '°', X(d), gy1 + 11, { color: col.muted, size: 10, align: 'center' }));
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.beginPath();
    for (let d = 0; d <= a; d += 2) { const x = X(d), y = Y(f(d)); d === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    ctx.lineTo(X(a), Y(f(a))); ctx.stroke();
    ctx.setLineDash([3, 3]); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(X(a), Y(f(a))); ctx.stroke(); ctx.setLineDash([]);
    dot(ctx, X(a), Y(f(a)), 5, col.s[2], col.ink);
  };
  sync();
}
