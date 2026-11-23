// Class 11 Waves (step player): how a wave travels without matter travelling. A row of beads joined by springs: the first is shaken up and down; each
// bead copies its left neighbour a moment later. The wiggle (the wave) moves right at speed v; the beads only move up and down. One wavelength = the distance
// the wave moves in one period, so v = lambda / T = f lambda.
import { canvas, text, title, line, arrow, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0, started = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 280, label: 'A row of beads along which a wiggle travels while each bead moves only up and down' });
  const TT = ['Beads in a row, at rest', 'Shake the first bead', 'The next bead copies it a moment later', 'The wiggle travels, the beads do not', 'Wavelength and speed'];
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); });
  const N = 24, T = 2, v = 3.2;
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col), x0 = 24, x1 = w - 18, my = top + (h - top) / 2 - 8, amp = (h - top) * 0.2, sp = (x1 - x0) / (N - 1);
    line(ctx, [[x0 - 10, my], [x1 + 6, my]], col.line, 1, [3, 3]);
    const y = (i) => { if (step === 0) return 0; const tt = t - started - i * 0.18; const lim = step === 1 ? 0 : step === 2 ? 2 : 99; if (i > lim) return 0; return tt < 0 ? 0 : Math.sin(2 * Math.PI * tt / T); };
    const pts = Array.from({ length: N }, (_, i) => [x0 + i * sp, my - amp * y(i)]);
    line(ctx, pts, col.s[3], 1.5);
    pts.forEach(([x, yy], i) => { ctx.fillStyle = i === 0 || i === 1 || i === 2 ? col.s[2] : col.s[0]; ctx.beginPath(); ctx.arc(x, yy, 5.5, 0, 7); ctx.fill(); });
    if (step === 3) { arrow(ctx, x0 + 3 * sp, my + amp + 24, x0 + 8 * sp, my + amp + 24, col.s[1], 3, 9); text(ctx, 'wave moves →', x0 + 8.5 * sp, my + amp + 24, { color: col.s[1], size: 11, weight: 700 }); arrow(ctx, pts[17][0], my - amp - 14, pts[17][0], my - amp + 8, col.s[2], 2, 7); text(ctx, 'bead: only ↕', pts[17][0] + 6, my - amp - 14, { color: col.s[2], size: 11, weight: 700 }); }
    if (step === 4) { const lx0 = x0 + 2 * sp, ly = my + amp + 24; line(ctx, [[lx0, ly], [lx0 + 11.1 * sp, ly]], col.s[1], 3); line(ctx, [[lx0, ly - 5], [lx0, ly + 5]], col.s[1], 2); line(ctx, [[lx0 + 11.1 * sp, ly - 5], [lx0 + 11.1 * sp, ly + 5]], col.s[1], 2); text(ctx, 'λ', lx0 + 5.5 * sp, ly - 10, { color: col.s[1], size: 12, weight: 700, align: 'center' }); }
    const N2 = ['No wave yet.', 'The first bead (orange) goes up and down.', 'Bead 2 and bead 3 follow, each slightly later than the one before.', 'Pattern speed v is not the bead speed.', 'One wavelength λ = distance the pattern moves in one period T: v = λ/T = fλ'][step];
    const ws = N2.split(' '); let a = '', b = ''; for (const s of ws) { if ((a + s).length < w / 7.3 && !b) a += s + ' '; else b += s + ' '; }
    text(ctx, a.trim(), w / 2, h - 36, { color: col.ink, size: 11.5, weight: 700, align: 'center' }); text(ctx, b.trim(), w / 2, h - 16, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); started = t; cv.redraw(); } };
}
