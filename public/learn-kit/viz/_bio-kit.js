// Small helpers for the biology figures (bio-*): a step-player canvas with eased tweening between stages, rod
// "chromosomes", cells drawn as ellipses, and a wrapped caption line. Only used by figures whose names start bio-.
import { canvas, loop, calm, clamp, ease, text, font } from '../kit.js';

/** A canvas that follows a step player: draw(ctx, w, h, col, stage, k, t, prevStage), k eases 0 to 1 after each change. */
export function stepper(host, o, draw) {
  const cv = canvas(host, o);
  let cur = 0, prev = 0, k = 1, t = 0;
  loop(host, (dt, tt) => { t = tt; if (k < 1) k = Math.min(1, k + dt / 0.9); cv.redraw(); });
  cv.draw = (ctx, w, h, col) => draw(ctx, w, h, col, cur, ease(k), t, prev);
  return {
    cv,
    step(i) {
      i = clamp(i, 0, o.stages - 1);
      if (i !== cur) { prev = cur; cur = i; k = calm() ? 1 : 0; }
      cv.redraw();
    },
  };
}

/** Rod chromatid centred at (x, y), length L, angle a (radians), optional coloured segments [[from, to, colour]] */
export function rod(ctx, x, y, L, a, color, wd = 5, segs = []) {
  const dx = Math.cos(a) * L / 2, dy = Math.sin(a) * L / 2;
  ctx.save(); ctx.lineCap = 'round';
  const stroke = (f0, f1, c) => { ctx.strokeStyle = c; ctx.lineWidth = wd; ctx.beginPath(); ctx.moveTo(x - dx + 2 * dx * f0, y - dy + 2 * dy * f0); ctx.lineTo(x - dx + 2 * dx * f1, y - dy + 2 * dy * f1); ctx.stroke(); };
  stroke(0, 1, color);
  for (const [f0, f1, c] of segs) stroke(f0, f1, c);
  ctx.restore();
}

export function ellipse(ctx, cx, cy, rx, ry, fill, stroke, lw = 2, dash) {
  ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy, Math.max(1, rx), Math.max(1, ry), 0, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; if (dash) ctx.setLineDash(dash); ctx.stroke(); }
  ctx.restore();
}

/** A caption line at the bottom of a canvas (shrinks to fit). */
export function note(ctx, w, h, col, s, y = h - 12) { text(ctx, s, w / 2, y, { color: col.ink, size: 12, align: 'center', weight: 600 }); }

export const mix = (a, b, k) => a + (b - a) * k;

/** The standard genetic code. CODON['AUG'] = 'Met'; stop codons are 'Stop'. Bases in RNA letters. */
const ORDER = 'UCAG', AA1 = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';
const AA3 = { F: 'Phe', L: 'Leu', S: 'Ser', Y: 'Tyr', C: 'Cys', W: 'Trp', P: 'Pro', H: 'His', Q: 'Gln', R: 'Arg', I: 'Ile', M: 'Met', T: 'Thr', N: 'Asn', K: 'Lys', V: 'Val', A: 'Ala', D: 'Asp', E: 'Glu', G: 'Gly', '*': 'Stop' };
export const CODON = {};
for (let i = 0; i < 64; i++) CODON[ORDER[i >> 4] + ORDER[(i >> 2) & 3] + ORDER[i & 3]] = AA3[AA1[i]];
export const BASES = ORDER.split('');

/** Wrapped text: breaks s into lines no wider than maxW and draws them centred (or left) from y downward. Returns the next y. */
export function wrap(ctx, s, x, y, maxW, o = {}) {
  const { size = 11, weight = 600, color, lh = size + 3, align = 'center' } = o;
  ctx.save(); ctx.font = font(size, weight);
  const words = s.split(' '), lines = []; let cur = '';
  for (const wd of words) { const t = cur ? cur + ' ' + wd : wd; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = wd; } else cur = t; }
  lines.push(cur); ctx.restore();
  lines.forEach((l, i) => text(ctx, l, x, y + i * lh, { color, size, weight, align }));
  return y + lines.length * lh;
}
