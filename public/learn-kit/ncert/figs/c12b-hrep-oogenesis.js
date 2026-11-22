// Class 12 Biology, Human Reproduction (step player): the long timetable of oogenesis. Oogonia multiply before birth; every primary oocyte starts meiosis I and
// stops in prophase I (inside a follicle) until puberty. Each cycle one follicle completes meiosis I just before ovulation (secondary oocyte + first
// polar body); the secondary oocyte stops at metaphase II; meiosis II finishes only if a sperm enters. Typical counts: about 1-2 million primary
// oocytes per ovary at birth, 60,000-80,000 at puberty, about 400 ovulated in a lifetime.
import { canvas, text, title, axes, line, dot } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 320, label: 'Timeline of oogenesis from before birth to fertilisation with the number of primary oocytes falling' });
  const T = ['Before birth: oogonia become primary oocytes', 'At birth: meiosis I paused in prophase I', 'Puberty: fewer than 80,000 left per ovary', 'Each cycle: meiosis I ends, one oocyte is released', 'A sperm enters: meiosis II is finished'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, T[step], col) + 4, ch = (h - top) * 0.5;
    const A = axes(ctx, w, top + ch + 30, col, { x: [-1, 50], y: [3, 6.5], t: top + 4, b: 40, l: 50, r: 12, xt: [0, 12, 25, 40, 50], yt: [3, 4, 5, 6], fy: (v) => (v === 3 ? '1 000' : v === 4 ? '10 000' : v === 5 ? '100 000' : '1 million'), xlabel: 'age (years): oocytes per ovary falls' });
    const pts = [[0, Math.log10(1.5e6)], [12, Math.log10(7e4)], [25, Math.log10(3e4)], [37, Math.log10(8e3)], [50, 3]];
    ctx.save(); A.clip(); const P = pts.map(([x, y]) => [A.X(x), A.Y(y)]); line(ctx, P, col.s[3], 3); ctx.restore();
    const mk = [[0, 1], [0, 1], [1, 1], [2, 1], [2, 1]][step]; const hi = [-1, 0, 1, 1, 1][step];
    if (hi >= 0) dot(ctx, P[hi][0], P[hi][1], 6, col.s[0], col.ink);
    text(ctx, 'ovulation ends ~ menopause', A.X(50), A.Y(3) - 12, { color: col.muted, size: 10, align: 'right' });
    // the cell
    const cy = top + ch + 30 + ((h - top - ch - 30) / 2), cx = w / 2, c = (x, y, r, f, s) => { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = f; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = col.ink; ctx.stroke(); if (s) text(ctx, s, x, y, { color: col.ink, size: 10, weight: 700, align: 'center' }); };
    const L = (s, x, y, al = 'center', cc = col.ink) => text(ctx, s, x, y, { color: cc, size: 10.5, weight: 600, align: al, halo: col.panel });
    if (step === 0) { for (let k = 0; k < 4; k++) c(cx - 90 + k * 20, cy - 6, 8, col.s[4], '2n'); text(ctx, '→', cx - 4, cy - 6, { color: col.ink, size: 14, align: 'center' }); c(cx + 40, cy - 6, 15, col.s[3], '2n'); L('oogonia divide by mitosis', cx - 50, cy + 22); L('primary oocyte starts meiosis I', cx + 40, cy + 32, 'center', col.s[3]); }
    if (step === 1) { c(cx, cy - 4, 18, col.s[3], '2n'); ctx.beginPath(); ctx.arc(cx, cy - 4, 30, 0, 7); ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.stroke(); L('primary oocyte inside a follicle', cx, cy + 40); L('stuck in prophase I of meiosis I until puberty', cx, cy + 56, 'center', col.muted); }
    if (step === 2) { for (let k = 0; k < 6; k++) { c(cx - 85 + k * 34, cy - 6, 11, col.s[3]); } L('many follicles, each with a primary oocyte; only about 400 will ever ovulate', cx, cy + 28, 'center', col.muted); L('each month a few start growing, one wins', cx, cy + 44, 'center', col.s[3]); }
    if (step === 3) { c(cx - 30, cy - 4, 20, col.s[1], 'n'); c(cx + 10, cy - 18, 6, col.muted); L('secondary oocyte (n)', cx - 30, cy + 28, 'center', col.s[1]); L('first polar body', cx + 40, cy - 32, 'left', col.muted); L('ovulation: stuck at metaphase II', cx, cy + 46, 'center', col.muted); }
    if (step === 4) { c(cx - 24, cy - 4, 20, col.s[3], 'n'); c(cx + 14, cy - 18, 5, col.muted); c(cx + 14, cy - 2, 5, col.muted); dot(ctx, cx - 56, cy - 4, 4, col.s[0], col.ink); L('ovum (n) + sperm → zygote', cx - 24, cy + 28, 'center', col.s[3]); L('second polar body', cx + 24, cy - 8, 'left', col.muted); L('polar bodies degenerate', cx, cy + 46, 'center', col.muted); }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
