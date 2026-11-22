// 4.8 The cosmological principle: lumpy up close, smooth on big scales. Made-up galaxies sit in clumps and
// strands (like the real cosmic web). Cut the picture into boxes and count the galaxies in each: in small
// boxes the counts are wildly different; in big boxes they come out nearly the same. Slide the box size.
import { canvas, text, title, dot, row, slider, readout, rng } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 300, label: 'Clumpy galaxies counted in boxes of growing size' });
  const r = rng(42), pts = [];
  // clumps along random strands, in a unit square
  for (let c = 0; c < 70; c++) {
    const x = r(), y = r(), ang = r() * Math.PI, len = 0.04 + r() * 0.1, n = 10 + Math.floor(r() * 40);
    for (let i = 0; i < n; i++) {
      const s = (r() - 0.5) * len;
      pts.push([(x + Math.cos(ang) * s + (r() - 0.5) * 0.02 + 1) % 1, (y + Math.sin(ang) * s + (r() - 0.5) * 0.02 + 1) % 1]);
    }
  }
  let nb = 16; // boxes per side
  const ctl = row(host);
  slider(ctl, { label: 'Box size', min: 1, max: 5, step: 1, value: 1, fmt: (v) => ['tiny', 'small', 'medium', 'large', 'huge'][v - 1], oninput: (v) => { nb = [16, 8, 4, 3, 2][v - 1]; show(); cv.redraw(); } });
  const out = readout(host);
  const counts = () => {
    const c = new Array(nb * nb).fill(0);
    pts.forEach(([x, y]) => c[Math.min(nb - 1, Math.floor(y * nb)) * nb + Math.min(nb - 1, Math.floor(x * nb))]++);
    const m = c.reduce((s, v) => s + v, 0) / c.length, sd = Math.sqrt(c.reduce((s, v) => s + (v - m) ** 2, 0) / c.length);
    return { c, m, sd };
  };
  const show = () => {
    const { m, sd } = counts();
    out.innerHTML = `${nb * nb} boxes, about <b>${Math.round(m)}</b> galaxies each on average. A typical box differs from the average by <b>${Math.round((100 * sd) / m)}%</b>. ${sd / m < 0.2 ? 'Big enough boxes look alike: the universe is smooth on this scale.' : 'Small boxes look very different: lumpy.'}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Count galaxies in boxes: lumpy small, smooth big', col) + 2, S = Math.min(w - 20, h - top - 8), x0 = (w - S) / 2, y0 = top;
    const { c, m } = counts(), b = S / nb;
    for (let j = 0; j < nb; j++) for (let i = 0; i < nb; i++) {
      const v = c[j * nb + i] / m; // 1 = average
      ctx.fillStyle = v > 1 ? `rgba(220,120,40,${Math.min(0.45, (v - 1) * 0.25)})` : `rgba(60,120,200,${Math.min(0.35, (1 - v) * 0.35)})`;
      ctx.fillRect(x0 + i * b, y0 + j * b, b, b);
    }
    pts.forEach(([x, y]) => dot(ctx, x0 + x * S, y0 + y * S, 1.4, col.ink));
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1;
    for (let i = 0; i <= nb; i++) {
      ctx.beginPath(); ctx.moveTo(x0 + i * b, y0); ctx.lineTo(x0 + i * b, y0 + S); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x0, y0 + i * b); ctx.lineTo(x0 + S, y0 + i * b); ctx.stroke();
    }
    if (nb <= 4) for (let j = 0; j < nb; j++) for (let i = 0; i < nb; i++) text(ctx, String(c[j * nb + i]), x0 + (i + 0.5) * b, y0 + (j + 0.5) * b, { color: col.ink, size: 14, weight: 700, align: 'center', halo: col.panel });
  };
  show(); cv.redraw();
}
