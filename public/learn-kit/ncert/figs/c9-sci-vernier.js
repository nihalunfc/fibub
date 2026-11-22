// Class 9 Science, Chapter 1: reading a vernier caliper. The main scale is in millimetres; the vernier has 10 divisions that
// together span 9 mm, so each is 0.9 mm and the least count is 1 mm − 0.9 mm = 0.1 mm. Move the jaws: the vernier division
// that lines up exactly with a main-scale division gives the tenths of a millimetre. Reading = main + n × 0.1 mm.
import { canvas, text, title, line, row, slider, readout, choice } from '../../kit.js';

export default function (host) {
  let x = 12.3, zoom = 'jaws';
  const cv = canvas(host, { aspect: 0.55, max: 440, min: 280, label: 'A vernier caliper scale with a movable vernier and the coinciding division highlighted' });
  const ctl = row(host);
  slider(ctl, { label: 'Opening', min: 3, max: 25, step: 0.1, value: x, fmt: (v) => `${v.toFixed(1)} mm`, oninput: (v) => { x = v; upd(); } });
  const out = readout(host);
  function upd() { const M = Math.floor(x + 1e-9), n = Math.round((x - M) * 10); out.innerHTML = `Main scale: <b>${M} mm</b>. Vernier division in line: <b>${n}</b>. Reading = ${M} + ${n} × 0.1 = <b>${(M + n * 0.1).toFixed(1)} mm</b>. Least count = 1 − 0.9 = 0.1 mm.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Vernier caliper: find the line that matches', col) + 14;
    const M = Math.floor(x + 1e-9), n = Math.round((x - M) * 10), L = 16, R = w - 16;
    const win0 = Math.max(0, M - 1), win1 = win0 + 13, pm = (R - L) / (win1 - win0), X = (v) => L + (v - win0) * pm;
    const y1 = top + 50, y2 = y1 + 56;
    // main scale body
    ctx.fillStyle = col.soft; ctx.fillRect(L - 8, y1 - 8, R - L + 16, 56); ctx.strokeStyle = col.muted; ctx.strokeRect(L - 8, y1 - 8, R - L + 16, 56);
    for (let v = Math.ceil(win0); v <= win1; v++) { const lg = v % 5 === 0; line(ctx, [[X(v), y1 + 40], [X(v), y1 + (lg ? 18 : 28)]], col.ink, 1); if (v % 2 === 0 || pm > 26) text(ctx, String(v), X(v), y1 + 8, { color: col.ink, size: 10, align: 'center' }); }
    text(ctx, 'main scale (mm)', L, y1 - 18, { color: col.muted, size: 10.5 });
    // vernier plate, drawn below, zero at X(x)
    ctx.fillStyle = col.panel; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.fillRect(X(x) - 6, y2 - 4, 9 * pm + 12, 50); ctx.strokeRect(X(x) - 6, y2 - 4, 9 * pm + 12, 50);
    for (let k = 0; k <= 10; k++) {
      const vx = X(x + 0.9 * k), on = k === n; line(ctx, [[vx, y2 - 4], [vx, y2 + (on ? 30 : 18)]], on ? col.s[2] : col.s[0], on ? 3 : 1.2);
      text(ctx, String(k), vx, y2 + 40, { color: on ? col.s[2] : col.s[0], size: 10, align: 'center', weight: on ? 700 : 400 });
    }
    // align highlight line from the matching main tick to the vernier tick
    const mx = X(M + n); line(ctx, [[mx, y1 + 20], [mx, y2 + 30]], col.s[2], 1.5, [3, 3]);
    line(ctx, [[X(x), y1 + 40], [X(x), y2 - 4]], col.s[1], 1.5, [3, 3]);
    text(ctx, `vernier zero is just past ${M} mm`, X(x), y2 + 64, { color: col.s[1], size: 11, align: x > (win0 + win1) / 2 ? 'right' : 'left', weight: 700 });
    text(ctx, `division ${n} lines up`, mx, y1 - 18, { color: col.s[2], size: 11, align: 'center', weight: 700, halo: col.panel });
  };
  upd();
}
