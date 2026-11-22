// 4.5 Two overlapping groups: Total = A + B − Both + Neither.
import { canvas, text, row, slider, readout, title } from '../../kit.js';
export default function (host) {
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 220, label: 'A Venn diagram of two groups' });
  let A = 30, B = 25, both = 13, total = 50;
  const ctl = row(host), f = (v) => String(Math.round(v));
  slider(ctl, { label: 'In A', min: 5, max: 60, step: 1, value: A, fmt: f, oninput: (v) => { A = Math.round(v); go(); } });
  slider(ctl, { label: 'In B', min: 5, max: 60, step: 1, value: B, fmt: f, oninput: (v) => { B = Math.round(v); go(); } });
  slider(ctl, { label: 'In both', min: 0, max: 40, step: 1, value: both, fmt: f, oninput: (v) => { both = Math.round(v); go(); } });
  slider(ctl, { label: 'Total', min: 20, max: 120, step: 1, value: total, fmt: f, oninput: (v) => { total = Math.round(v); go(); } });
  const out = readout(host);
  const go = () => { cv.redraw(); const nei = total - A - B + both; out.innerHTML = both > Math.min(A, B) ? 'The overlap cannot be bigger than either group.' : nei < 0 ? `Impossible: A + B − both = ${A + B - both} is more than the total ${total}.` : `Neither = ${total} − ${A} − ${B} + ${both} = <b>${nei}</b>. Only A: ${A - both}. Only B: ${B - both}.`; };
  cv.draw = (ctx, w, h, col) => {
    const cy = h * 0.55, r = Math.min(h * 0.33, w * 0.2), cx = w / 2, off = r * 0.6;
    ctx.globalAlpha = 0.35; ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(cx - off, cy, r, 0, 7); ctx.fill();
    ctx.fillStyle = col.s[1]; ctx.beginPath(); ctx.arc(cx + off, cy, r, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.line; ctx.strokeRect(14, 30, w - 28, h - 40);
    text(ctx, String(Math.max(0, A - both)), cx - off - r * 0.45, cy, { color: col.ink, size: 15, weight: 700, align: 'center' });
    text(ctx, String(both), cx, cy, { color: col.ink, size: 15, weight: 700, align: 'center' });
    text(ctx, String(Math.max(0, B - both)), cx + off + r * 0.45, cy, { color: col.ink, size: 15, weight: 700, align: 'center' });
    text(ctx, 'A', cx - off - r * 0.6, cy - r * 0.8, { color: col.ink, size: 12, weight: 700 }); text(ctx, 'B', cx + off + r * 0.5, cy - r * 0.8, { color: col.ink, size: 12, weight: 700 });
    text(ctx, `Neither: ${total - A - B + both}`, 24, h - 22, { color: col.muted, size: 11.5 });
    title(ctx, 'The overlap is counted once in A and once in B', col);
  };
  go();
}
