// Class 12 Magnetism and Matter: the field lines of a bar magnet, with a compass you can drag, and what happens when you cut it.
// Lines leave the north pole and enter the south pole outside the magnet and close up inside it (pole model, drawn as the lines of B).
// Cut the magnet in half and each piece has its own north and south: the poles never come apart (no magnetic monopoles).
import { canvas, text, title, row, button, choice, readout, arrow, line, dot } from '../../kit.js';
import { poleLines, poleDir, barMagnet, drag, headed } from '../c12p-mmlib.js';

export default function (host) {
  let cut = false, show = 'lines', C = null, cache = null, key = '';
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 270, label: 'Field lines of a bar magnet with a compass you can drag' });
  const ctl = row(host);
  choice(ctl, 'Show', [['lines', 'Field lines'], ['filings', 'Iron filings']], show, (v) => { show = v; cv.redraw(); });
  button(ctl, 'Cut the magnet', () => { cut = !cut; cv.redraw(); });
  const out = readout(host);
  drag(cv, (x, y) => { C = [x, y]; cv.redraw(); }, (x, y) => !C || Math.hypot(x - C[0], y - C[1]) < 44);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, cut ? 'Two magnets: every piece still has two poles' : 'Field lines leave N and enter S', col);
    const cx = w / 2, cy = (top + h) / 2, L = Math.min(w * 0.32, 120), t = 26, g = cut ? 14 : 0;
    const poles = cut ? [{ x: cx - L / 2, y: cy, s: -1, out: [-1, 0] }, { x: cx - g / 2 - 2, y: cy, s: 1, out: [1, 0] }, { x: cx + g / 2 + 2, y: cy, s: -1, out: [-1, 0] }, { x: cx + L / 2, y: cy, s: 1, out: [1, 0] }]
      : [{ x: cx - L / 2, y: cy, s: -1, out: [-1, 0] }, { x: cx + L / 2, y: cy, s: 1, out: [1, 0] }];
    const k = `${w}${h}${cut}`; if (k !== key) { cache = poleLines(poles, { x0: 4, y0: top, x1: w - 4, y1: h - 4 }, cut ? 7 : 11); key = k; }
    if (show === 'lines') cache.forEach((p) => { const m = Math.floor(p.length / 2); headed(ctx, p.filter((_, i) => i % 2 === 0), Math.floor(m / 2), col.s[0], 1.3); });
    else for (let y = top + 12; y < h - 6; y += 16) for (let x = 12; x < w - 6; x += 16) { const [dx, dy, m] = poleDir(poles, x, y); if (m < 2e-5) continue; line(ctx, [[x - dx * 5, y - dy * 5], [x + dx * 5, y + dy * 5]], col.muted, 1.6); }
    if (cut) { barMagnet(ctx, cx - L / 4 - g / 2, cy, L / 2 - g / 2, t, col); barMagnet(ctx, cx + L / 4 + g / 2, cy, L / 2 - g / 2, t, col); } else barMagnet(ctx, cx, cy, L, t, col);
    if (!C) C = [cx + L * 0.45, cy - L * 0.5];
    const [dx, dy] = poleDir(poles, C[0], C[1]); const a = Math.atan2(dy, dx);
    ctx.save(); ctx.translate(C[0], C[1]); ctx.rotate(a); ctx.fillStyle = col.s[1]; ctx.beginPath(); ctx.moveTo(16, 0); ctx.lineTo(0, -5); ctx.lineTo(0, 5); ctx.fill(); ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(-16, 0); ctx.lineTo(0, -5); ctx.lineTo(0, 5); ctx.fill(); ctx.restore();
    dot(ctx, C[0], C[1], 2, col.ink);
    text(ctx, 'compass (drag me)', C[0], C[1] - 16, { color: col.muted, size: 10.5, align: 'center' });
    out.innerHTML = cut ? 'Cut in two, you get <b>two complete magnets</b>, each with its own N and S. Cut again and again: still a north and a south every time. No one has found a lone magnetic pole.' : 'The compass needle lines up along the field line through it, its red end (north) pointing the way the line points. Inside the magnet the lines carry on from S to N, so every line is a closed loop.';
  };
  cv.redraw();
}
