// Class 10 Heredity (step player): how a trait is expressed. A gene is a stretch of DNA with the instructions for one protein.
// For plant height the protein is an enzyme that helps make a plant hormone for growth. A working copy of the gene (T) gives enough
// enzyme and hormone, so the plant grows tall; a less efficient copy (t) gives less, so a plant with tt stays short.
import { canvas, text, title, line, dot, arrow, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.84, max: 440, min: 300, label: 'From a gene to a protein to a hormone to the height of a pea plant' });
  const TITLES = ['A gene is a stretch of DNA', 'The gene is read to make a protein', 'The enzyme helps make a growth hormone', 'TT or Tt: enough hormone, tall plant', 'tt: little hormone, short plant'];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 8, bx = 24, bw = w - 48;
    // chromosome with gene band
    const cy = top + 22; ctx.fillStyle = col.line; ctx.beginPath(); ctx.roundRect(bx, cy - 9, bw, 18, 9); ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.3; ctx.stroke();
    ctx.fillStyle = col.s[0]; ctx.fillRect(bx + bw * 0.55, cy - 9, bw * 0.14, 18); text(ctx, step >= 4 ? 't' : 'T', bx + bw * 0.62, cy, { color: col.panel, size: 11, weight: 700, align: 'center' }); text(ctx, 'chromosome', bx, cy - 17, { color: col.muted, size: 10 }); text(ctx, 'height gene', bx + bw * 0.62, cy + 22, { color: col.ink, size: 10, align: 'center', weight: 700 });
    const my = cy + 56; const strong = step !== 4;
    if (step >= 1) { arrow(ctx, bx + bw * 0.62, cy + 30, bx + bw * 0.62, my - 8, col.muted, 2); const en = step === 4 ? 2 : 6; for (let i = 0; i < en; i++) { const a = t * 1.4 + i; dot(ctx, bx + bw * 0.62 + Math.cos(a) * 26 + (i - en / 2) * 4, my + 6 + Math.sin(a * 1.3) * 7, 5, step === 4 ? col.s[1] : col.s[2], col.ink); } text(ctx, step === 4 ? 'less enzyme (or a weaker one)' : 'enzyme (a protein)', bx + bw * 0.62, my + 28, { color: col.ink, size: 10.5, align: 'center' }); }
    if (step >= 2) { const hy = my + 70; arrow(ctx, bx + bw * 0.62, my + 36, bx + bw * 0.62, hy - 8, col.muted, 2); const n = step === 4 ? 2 : 9; for (let i = 0; i < n; i++) dot(ctx, bx + bw * 0.62 + ((i * 17) % 60) - 30, hy + 4 + Math.sin(t * 2 + i) * 3 + (i % 3) * 5, 3, col.s[3]); text(ctx, step === 4 ? 'little growth hormone' : 'plenty of growth hormone', bx + bw * 0.62, hy + 28, { color: col.ink, size: 10.5, align: 'center' }); }
    if (step >= 3) { const px = bx + bw * 0.14, base = h - 22, H = step === 3 ? Math.min(120, base - (my + 20)) : Math.min(120, base - (my + 20)) * 0.45; line(ctx, [[px, base], [px, base - H]], col.s[2], 4); [0.35, 0.7].forEach((f, i) => { ctx.save(); ctx.globalAlpha = 0.6; ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.ellipse(px + (i ? 11 : -11), base - H * f, 10, 4, i ? -0.5 : 0.5, 0, 7); ctx.fill(); ctx.restore(); }); text(ctx, step === 3 ? 'tall' : 'short', px, base + 11, { color: col.ink, size: 11, weight: 700, align: 'center' }); }
    if (step === 0) text(ctx, 'It holds the instructions for one protein.', w / 2, h - 16, { color: col.muted, size: 10.5, align: 'center' });
    if (step === 3) text(ctx, 'One working copy is enough: T is dominant.', w - 10, h - 10, { color: col.muted, size: 10.5, align: 'right' });
    if (step === 4) text(ctx, 'Both copies weak: the trait of tt shows.', w - 10, h - 10, { color: col.muted, size: 10.5, align: 'right' });
  };
  return { step(i) { step = Math.min(i, 4); t = 0; cv.redraw(); } };
}
