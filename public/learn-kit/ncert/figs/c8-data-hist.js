// Class 8 Tales by Dots and Lines: a histogram groups continuous data (here heights) into equal class intervals;
// the bars touch because the intervals touch. Narrow classes show detail, wide classes hide it.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

const H = [128, 131, 133, 135, 136, 138, 139, 140, 141, 142, 143, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 156, 157, 159, 161, 164, 168, 172];
export default function (host) {
  let bw = 10;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'A histogram of the heights of 30 students with a choice of class width' });
  const ctl = row(host);
  choice(ctl, 'Class width', [[5, '5 cm'], [10, '10 cm'], [20, '20 cm']], bw, (v) => { bw = v; sync(); });
  const out = readout(host);
  const bins = () => { const lo = 125, n = Math.ceil((175 - lo) / bw), c = Array(n).fill(0); H.forEach((x) => c[Math.min(n - 1, Math.floor((x - lo) / bw))]++); return { lo, n, c }; };
  function sync() { const { lo, c } = bins(), mi = c.indexOf(Math.max(...c)); out.innerHTML = `30 students, class width ${bw} cm. The tallest bar is <b>${lo + mi * bw}–${lo + (mi + 1) * bw} cm</b> with <b>${c[mi]}</b> students. The bars add up to ${c.reduce((a, b) => a + b, 0)}.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Heights of 30 students (histogram)', col), { lo, n, c } = bins(), L = 34, B = h - 40, W = w - L - 14, Hh = B - top - 16, mx = Math.max(...c) + 2, bwid = W / n;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1;
    for (let g = 0; g <= mx; g += mx > 14 ? 4 : 2) { const y = B - (g / mx) * Hh; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(L + W, y); ctx.stroke(); text(ctx, String(g), L - 5, y, { color: col.muted, size: 10, align: 'right' }); }
    c.forEach((k, i) => { const bh = (k / mx) * Hh; ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.6; ctx.fillRect(L + i * bwid, B - bh, bwid, bh); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(L + i * bwid, B - bh, bwid, bh); if (k) text(ctx, String(k), L + i * bwid + bwid / 2, B - bh - 8, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); if (n <= 12 || i % 2 === 0) text(ctx, String(lo + i * bw), L + i * bwid, B + 12, { color: col.muted, size: 9.5, align: 'center' }); });
    text(ctx, 'height (cm)', L + W / 2, h - 8, { color: col.muted, size: 10.5, align: 'center' });
  };
  sync();
}
