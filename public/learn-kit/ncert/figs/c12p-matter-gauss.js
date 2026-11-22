// Class 12 Magnetism and Matter: Gauss's law for magnetism. Every magnetic field line is a closed loop, so a line that goes out through any closed
// surface must come back in: the net flux is always zero, ∮B·dA = 0 (no magnetic charge). For an electric charge the lines start on the charge,
// so a surface round it has net outward flux q/ε0. Slide the source in and out of the circle and count the lines.
import { canvas, text, title, row, slider, choice, readout, line, dot, arrow } from '../../kit.js';
import { poleLines, barMagnet, headed } from '../c12p-mmlib.js';

export default function (host) {
  let kind = 'mag', off = -0.6;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'Counting field lines through a closed surface for a magnet and for a charge' });
  const ctl = row(host);
  choice(ctl, 'Source', [['mag', 'Bar magnet'], ['el', 'Electric charge']], kind, (v) => { kind = v; cv.redraw(); });
  slider(ctl, { label: 'Position of the source', min: -1, max: 1, step: 0.05, value: off, fmt: (x) => (Math.abs(x) < 0.3 ? 'inside' : x < 0 ? 'left' : 'right'), oninput: (x) => { off = x; cv.redraw(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Count the lines going out and coming in', col);
    const cx = w / 2, cy = (top + h) / 2 + 4, R = Math.min(w * 0.18, (h - top) * 0.28), sx = cx + off * R * 2.3;
    ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke(); ctx.restore();
    text(ctx, 'closed surface', cx, cy + R + 14, { color: col.muted, size: 10.5, align: 'center' });
    let nout = 0, nin = 0; const inside = (p) => Math.hypot(p[0] - cx, p[1] - cy) < R;
    const count = (pts) => { for (let i = 1; i < pts.length; i++) { const a = inside(pts[i - 1]), b = inside(pts[i]); if (a && !b) nout++; else if (!a && b) nin++; } };
    if (kind === 'mag') {
      const L = 44, poles = [{ x: sx - L / 2, y: cy, s: -1, out: [-1, 0] }, { x: sx + L / 2, y: cy, s: 1, out: [1, 0] }];
      const lines = poleLines(poles, { x0: 2, y0: top, x1: w - 2, y1: h - 2 }, 9, 3).filter((p) => Math.hypot(p.at(-1)[0] - poles[0].x, p.at(-1)[1] - poles[0].y) < 8);
      lines.forEach((p) => { headed(ctx, p.filter((_, i) => i % 2 === 0), Math.floor(p.length / 4), col.s[0], 1.2); count(p.concat([[poles[1].x, poles[1].y]])); });
      barMagnet(ctx, sx, cy, L, 14, col);
    } else {
      const N = 16;
      for (let k = 0; k < N; k++) { const a = (k / N) * 2 * Math.PI, d = [Math.cos(a), Math.sin(a)], far = [sx + d[0] * 400, cy + d[1] * 400]; const ray = []; for (let s = 0; s <= 400; s += 4) ray.push([sx + d[0] * s, cy + d[1] * s]); count(ray);
        const e = Math.min(w, h); line(ctx, [[sx, cy], [sx + d[0] * w, cy + d[1] * w]], col.s[1], 1.2); }
      dot(ctx, sx, cy, 7, col.s[1], col.ink); text(ctx, '+q', sx, cy - 14, { color: col.s[1], size: 12, weight: 700, align: 'center' });
    }
    ctx.save(); ctx.fillStyle = col.panel; ctx.restore();
    const net = nout - nin;
    text(ctx, `lines out: ${nout}   lines in: ${nin}   net: ${net}`, 10, h - 12, { color: col.ink, size: 12.5, weight: 700 });
    out.innerHTML = kind === 'mag' ? `Net outward flux = <b>${net}</b> lines, wherever the magnet is: every line that leaves comes back, so ∮B·dA = 0. The two ends of a magnet are not separate "charges".` : `Charge inside: all ${nout} lines go out, net = ${net} (flux = q/ε0). Charge outside: lines go in and out equally, net = ${net}. Gauss's law for E is not zero; for B it always is.`;
  };
  cv.redraw();
}
