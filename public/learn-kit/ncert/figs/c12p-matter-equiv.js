// Class 12 Magnetism and Matter (step player): a bar magnet behaves like a solenoid. The field outside a current-carrying solenoid
// has the same shape as that of a bar magnet; a bar magnet is the sum of countless tiny atomic current loops, whose inside parts
// cancel and leave a current round the surface. Magnetic moment m = N I A (along the axis, S to N).
import { canvas, text, title, line, dot, arrow, loop } from '../../kit.js';
import { poleLines, barMagnet, headed, outof, into } from '../c12p-mmlib.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A bar magnet compared with a solenoid' });
  const TITLES = ['A bar magnet and its field', 'A solenoid: the same field pattern', 'Put them side by side', 'Inside the magnet: many tiny current loops', 'The inside currents cancel; a surface current is left', 'So m = N I A, along the axis from S to N'];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const lines = (ctx, w, h, col, cx, cy, L, c) => poleLines([{ x: cx - L / 2, y: cy, s: -1, out: [-1, 0] }, { x: cx + L / 2, y: cy, s: 1, out: [1, 0] }], { x0: 4, y0: 30, x1: w - 4, y1: h - 4 }, 7).forEach((p) => headed(ctx, p.filter((_, i) => i % 2 === 0), Math.floor(p.length / 4), c, 1.2));
  const coil = (ctx, cx, cy, L, tk, col, c) => { const n = 9; ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = 2; for (let k = 0; k < n; k++) { const x = cx - L / 2 + (L * (k + 0.5)) / n; ctx.beginPath(); ctx.ellipse(x, cy, 4, tk / 2, 0, 0, 7); ctx.stroke(); } ctx.restore(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 4;
    const cy = (top + h) / 2, L = Math.min(w * 0.34, 130), tk = 28;
    if (step <= 2) {
      const cx = step === 2 ? w * 0.27 : w / 2; const lx = (c, a) => { ctx.save(); ctx.translate(c - cx, 0); lines(ctx, w, h, col, cx, cy, L, a); ctx.restore(); };
      if (step === 0) { lines(ctx, w, h, col, cx, cy, L, col.s[0]); barMagnet(ctx, cx, cy, L, tk, col); }
      if (step === 1) { lines(ctx, w, h, col, cx, cy, L, col.s[2]); coil(ctx, cx, cy, L, tk * 1.2, col, col.ink); text(ctx, 'I', cx, cy - tk, { color: col.ink, size: 13, weight: 700, align: 'center' }); }
      if (step === 2) {
        const L2 = Math.min(w * 0.3, 110), ca = w * 0.25, cb = w * 0.75, cy1 = (top + h) / 2 - 24, cy2 = cy1 + 82;
        const mini = (cc, yy, solenoid) => { poleLines([{ x: cc - L2 / 2, y: yy, s: -1, out: [-1, 0] }, { x: cc + L2 / 2, y: yy, s: 1, out: [1, 0] }], { x0: 4, y0: top, x1: w - 4, y1: h - 4 }, 5).forEach((p) => headed(ctx, p.filter((_, i) => i % 2 === 0), Math.floor(p.length / 4), solenoid ? col.s[2] : col.s[0], 1.2)); };
        mini(w / 2, cy1, false); barMagnet(ctx, w / 2, cy1, L2, 20, col); mini(w / 2, cy2, true); coil(ctx, w / 2, cy2, L2, 24, col, col.ink);
        text(ctx, 'magnet', 8, cy1, { color: col.muted, size: 11 }); text(ctx, 'solenoid', 8, cy2, { color: col.muted, size: 11 });
      }
    } else {
      const x0 = w * 0.18, x1 = w * 0.82, y0 = cy - 52, y1 = cy + 52, nx = 6, ny = 4;
      ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, x1 - x0, y1 - y0); ctx.restore();
      if (step === 3 || step === 4) for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) { const x = x0 + ((i + 0.5) * (x1 - x0)) / nx, y = y0 + ((j + 0.5) * (y1 - y0)) / ny; ctx.save(); ctx.strokeStyle = step === 4 ? col.line : col.s[1]; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, 12, 0, 7); ctx.stroke(); ctx.restore(); arrow(ctx, x + 12, y, x + 12, y - 1 + 0.01, step === 4 ? col.line : col.s[1], 1.5, 6); }
      if (step === 4) { ctx.save(); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 3; ctx.setLineDash([8, 6]); ctx.lineDashOffset = -t * 20; ctx.strokeRect(x0 + 2, y0 + 2, x1 - x0 - 4, y1 - y0 - 4); ctx.restore(); text(ctx, 'neighbouring loops cancel: current runs only round the outside', w / 2, y1 + 22, { color: col.ink, size: 11, weight: 700, align: 'center' }); }
      if (step === 3) text(ctx, 'each loop is an electron orbiting or spinning', w / 2, y1 + 22, { color: col.ink, size: 11, weight: 700, align: 'center' });
      if (step === 5) { coil(ctx, cx0(w), cy, x1 - x0, 60, col, col.ink); arrow(ctx, x0 - 6, cy + 76, x1 + 6, cy + 76, col.s[3], 3, 10); text(ctx, 'm = N I A', w / 2, cy + 94, { color: col.s[3], size: 14, weight: 700, align: 'center' }); text(ctx, 'S', x0 - 14, cy + 76, { color: col.s[0], size: 12, weight: 700 }); text(ctx, 'N', x1 + 16, cy + 76, { color: col.s[1], size: 12, weight: 700 }); }
    }
  };
  const cx0 = (w) => w / 2;
  cv.redraw();
  return { step(i) { step = Math.min(5, i); t = 0; cv.redraw(); } };
}
