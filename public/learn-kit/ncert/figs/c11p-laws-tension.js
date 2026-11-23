// Class 11 Laws of Motion: equilibrium of concurrent forces. A lamp of weight W hangs from two strings at angles a and b above the horizontal. At rest the three forces add to zero:
// horizontal T1 cos a = T2 cos b, vertical T1 sin a + T2 sin b = W. Hence T1 = W cos b / sin(a + b) and T2 = W cos a / sin(a + b) (Lami's theorem). The force triangle closes.
// Flatter strings (small angles) need much larger tensions.
import { canvas, text, title, line, dot, arrow, row, slider, readout } from '../../kit.js';

export default function (host) {
  let a = 40, b = 55, W = 50;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A lamp hanging from two strings with the triangle of forces' });
  const ctl = row(host), out = readout(host);
  slider(ctl, { label: 'Left string angle α', min: 10, max: 80, step: 1, value: a, fmt: (q) => q + '°', oninput: (q) => { a = q; go(); } });
  slider(ctl, { label: 'Right string angle β', min: 10, max: 80, step: 1, value: b, fmt: (q) => q + '°', oninput: (q) => { b = q; go(); } });
  slider(ctl, { label: 'Weight W (N)', min: 10, max: 100, step: 5, value: W, fmt: (q) => q + ' N', oninput: (q) => { W = q; go(); } });
  const T = () => { const A = a * Math.PI / 180, B = b * Math.PI / 180, s = Math.sin(A + B); return [W * Math.cos(B) / s, W * Math.cos(A) / s]; };
  function go() { const [t1, t2] = T(); out.innerHTML = `Horizontal: T₁ cosα = T₂ cosβ. Vertical: T₁ sinα + T₂ sinβ = W = ${W} N. So <b>T₁ = ${t1.toFixed(1)} N</b> and <b>T₂ = ${t2.toFixed(1)} N</b>. ${Math.min(a, b) < 25 ? 'Nearly flat strings: the tensions are many times the weight.' : 'Check: ' + (t1 * Math.sin(a * Math.PI / 180) + t2 * Math.sin(b * Math.PI / 180)).toFixed(1) + ' N upward = W.'}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Lamp in equilibrium', col);
    const A = a * Math.PI / 180, B = b * Math.PI / 180, [t1, t2] = T(), L = Math.min(w * 0.3, 90), ox = w * 0.3, oy = 84, cy = oy + 50;
    // strings meet at the lamp point (ox, cy) with left anchor up-left and right anchor up-right
    const lx = ox - Math.cos(A) * L, ly = cy - Math.sin(A) * L, rx = ox + Math.cos(B) * L, ry = cy - Math.sin(B) * L, top = Math.min(ly, ry) - 10;
    line(ctx, [[lx - 20, top], [rx + 20, top]], col.muted, 4);
    line(ctx, [[lx, top], [lx, ly]], col.line, 1, [2, 3]); line(ctx, [[rx, top], [rx, ry]], col.line, 1, [2, 3]);
    line(ctx, [[lx, ly], [ox, cy]], col.s[0], 3); line(ctx, [[rx, ry], [ox, cy]], col.s[1], 3); line(ctx, [[ox, cy], [ox, cy + 40]], col.ink, 2);
    ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(ox, cy + 54, 14, 0, 7); ctx.fill(); text(ctx, `${W} N`, ox, cy + 80, { size: 11, weight: 700, color: col.s[3], align: 'center' });
    text(ctx, `α=${a}°`, lx + 36, ly + 18, { size: 10.5, weight: 700, color: col.s[0] }); text(ctx, `β=${b}°`, rx - 34, ry + 18, { size: 10.5, weight: 700, color: col.s[1], align: 'right' });
    // triangle of forces on the right (scaled)
    const S = Math.min(95 / Math.max(t1, t2, W), 3.2), px = w * 0.72, py = h * 0.66;
    arrow(ctx, px, py, px - t1 * Math.cos(A) * S, py - t1 * Math.sin(A) * S, col.s[0], 2.5, 8);
    const e1 = [px - t1 * Math.cos(A) * S, py - t1 * Math.sin(A) * S]; arrow(ctx, e1[0], e1[1], e1[0] + t2 * Math.cos(B) * S, e1[1] - t2 * Math.sin(B) * S, col.s[1], 2.5, 8);
    const e2 = [e1[0] + t2 * Math.cos(B) * S, e1[1] - t2 * Math.sin(B) * S]; arrow(ctx, e2[0], e2[1], e2[0], e2[1] + W * S, col.s[3], 2.5, 8);
    text(ctx, 'T₁', (px + e1[0]) / 2 - 6, (py + e1[1]) / 2, { size: 11, weight: 700, color: col.s[0], align: 'right' }); text(ctx, 'T₂', (e1[0] + e2[0]) / 2, (e1[1] + e2[1]) / 2 - 8, { size: 11, weight: 700, color: col.s[1], align: 'center' }); text(ctx, 'W', e2[0] + 8, (e2[1] + py) / 2, { size: 11, weight: 700, color: col.s[3] });
    text(ctx, 'force triangle closes', px, h - 10, { size: 10.5, color: col.muted, align: 'center' });
  };
  go();
}
