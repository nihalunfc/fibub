// Class 9 Atomic Foundations of Matter: law of constant proportions. Pure water from any source (tap, river,
// rain, sea after distilling, a lab) always has hydrogen and oxygen in the same mass ratio, 1 : 8. Pick the source and
// the sample size: the bar splits into 1/9 hydrogen and 8/9 oxygen every time. A "wrong" mixture is shown to compare.
import { canvas, text, title, row, choice, slider, readout } from '../../kit.js';

const SRC = { tap: 'Tap water', river: 'River water', rain: 'Rain water', sea: 'Sea water (distilled)', lab: 'Made in a lab' };
export default function (host) {
  let src = 'tap', m = 36;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'A bar showing hydrogen and oxygen masses in water from different sources in the ratio one to eight' });
  const ctl = row(host);
  choice(ctl, 'Source', Object.entries(SRC), src, (v) => { src = v; upd(); });
  slider(ctl, { label: 'Sample', min: 9, max: 90, step: 9, value: m, fmt: (v) => `${v} g`, oninput: (v) => { m = v; upd(); } });
  const out = readout(host);
  function upd() { const H = m / 9, O = (8 * m) / 9; out.innerHTML = `${SRC[src]}, ${m} g: hydrogen <b>${H.toFixed(0)} g</b>, oxygen <b>${O.toFixed(0)} g</b>. Ratio H : O = ${H.toFixed(0)} : ${O.toFixed(0)} = <b>1 : 8</b>. Every source, every size: the same.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `${SRC[src]}: always 1 part H to 8 parts O`, col);
    const H = m / 9, O = (8 * m) / 9, x0 = 14, bw = w - 28, y = 58;
    ctx.fillStyle = col.s[0]; ctx.fillRect(x0, y, bw / 9, 40); ctx.fillStyle = col.s[2]; ctx.fillRect(x0 + bw / 9, y, (bw * 8) / 9, 40);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x0, y, bw, 40);
    text(ctx, 'H', x0 + bw / 18, y + 20, { color: col.panel, size: 13, weight: 700, align: 'center', fit: false });
    text(ctx, `oxygen ${O.toFixed(0)} g`, x0 + bw * 5 / 9, y + 20, { color: col.panel, size: 13, weight: 700, align: 'center' });
    text(ctx, `${H.toFixed(0)} g`, x0 + bw / 18, y + 56, { color: col.s[0], size: 11.5, weight: 700, align: 'center' });
    text(ctx, `total sample: ${m} g`, w / 2, y - 10, { color: col.muted, size: 11, align: 'center' });
    // unit squares: 1 H box : 8 O boxes
    text(ctx, 'in units: 1 hydrogen block, 8 oxygen blocks', 14, 150, { color: col.ink, size: 11.5, weight: 700 });
    for (let i = 0; i < 9; i++) { ctx.fillStyle = i === 0 ? col.s[0] : col.s[2]; ctx.fillRect(14 + i * ((w - 28) / 9), 162, (w - 28) / 9 - 4, 26); }
    // a made-up wrong mix for contrast
    text(ctx, 'A mixture of hydrogen and oxygen gas can have any ratio:', 14, 224, { color: col.ink, size: 11.5, weight: 700 });
    ctx.fillStyle = col.s[0]; ctx.fillRect(14, 236, (w - 28) * 0.4, 22); ctx.fillStyle = col.s[2]; ctx.fillRect(14 + (w - 28) * 0.4, 236, (w - 28) * 0.6, 22);
    text(ctx, 'but that is a mixture, not the compound water', 14, 276, { color: col.muted, size: 10.5 });
    text(ctx, 'ratio 2 : 3', 14 + (w - 28) * 0.2, 247, { color: col.panel, size: 10.5, weight: 700, align: 'center' });
    text(ctx, 'law of constant proportions', w / 2, h - 12, { color: col.s[3], size: 12, weight: 700, align: 'center' });
  };
  upd();
}
