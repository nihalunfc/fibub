// Class 11 Maths, Probability (step player): building the sample space of three coin tosses level by level with a tree, then picking out the event "exactly two heads".
import { canvas, text, title, line, dot } from '../../kit.js';

export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'A tree diagram of three coin tosses growing one toss at a time and ending in eight outcomes' });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Sample space of 3 tosses, one toss at a time', col), T0 = top + 18, B0 = h - 36, lv = Math.min(3, st), xs = [34, 34 + (w - 120) / 3, 34 + 2 * (w - 120) / 3, 34 + (w - 120)];
    const Y = (l, i) => T0 + ((i + 0.5) / 2 ** l) * (B0 - T0);
    for (let l = 1; l <= lv; l++) for (let i = 0; i < 2 ** l; i++) {
      const p = i >> 1, hit = st === 4 && l === 3, s = i.toString(2).padStart(l, '0').replace(/0/g, 'H').replace(/1/g, 'T'), good = (s.match(/H/g) || []).length === 2 && l === 3;
      line(ctx, [[xs[l - 1], Y(l - 1, p)], [xs[l], Y(l, i)]], hit && !good ? col.line : col.muted, good ? 3 : 1.5);
    }
    dot(ctx, xs[0], Y(0, 0), 6, col.ink);
    for (let l = 1; l <= lv; l++) for (let i = 0; i < 2 ** l; i++) {
      const hd = !(i & 1), s = i.toString(2).padStart(l, '0').replace(/0/g, 'H').replace(/1/g, 'T'), good = l === 3 && (s.match(/H/g) || []).length === 2 && st === 4;
      ctx.beginPath(); ctx.arc(xs[l], Y(l, i), 10, 0, 7); ctx.fillStyle = good ? col.s[2] : hd ? col.s[0] : col.s[3]; ctx.globalAlpha = st === 4 && l === 3 && !good ? 0.3 : 1; ctx.fill(); ctx.globalAlpha = 1;
      text(ctx, hd ? 'H' : 'T', xs[l], Y(l, i), { color: col.panel, size: 11, weight: 800, align: 'center' });
      if (l === 3) text(ctx, s, xs[3] + 18, Y(3, i), { color: good ? col.s[2] : col.ink, size: 12, weight: good ? 800 : 600 });
    }
    for (let l = 1; l <= 3; l++) if (lv >= l) text(ctx, 'toss ' + l, xs[l], B0 + 14, { color: col.muted, size: 10.5, align: 'center' });
    const msg = ['Start: nothing tossed yet.', 'Toss 1: 2 outcomes, H or T.', 'Toss 2: each branches again, 4 paths.', 'Toss 3: 8 paths. S = {HHH, HHT, HTH, HTT, THH, THT, TTH, TTT}.', 'Exactly two heads: HHT, HTH, THH. P = 3/8.'][st];
    text(ctx, msg, 12, h - 10, { color: col.ink, size: 12, weight: 700 });
  };
  cv.redraw();
  return { step(i) { st = Math.min(4, i); cv.redraw(); } };
}
