// 13.6 Making images offline: a toy "lighthouse at dawn" appearing as noise is removed step by step.
// The noise is seeded (same picture on every visit). Colours come from the palette, so dark and red modes work.
import { canvas, title, text, rng, loop, calm, lerp } from '../../kit.js';

const NOISE = [1, 0.75, 0.45, 0.15, 0];
const HEAD = ['Step 0: pure noise from the seed', 'Early steps: sky and sea', 'Middle steps: sun and tower', 'Late steps: edges sharpen', 'Done: 30 steps × 0.4 s = 12 s'];
const COLS = 48, ROWS = 28;

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 340, min: 220, label: 'A toy picture of a lighthouse at dawn appearing out of random noise' });
  const r = rng(7), pick = [], amt = [];
  for (let i = 0; i < COLS * ROWS; i++) { pick.push(Math.floor(r() * 8)); amt.push(0.6 + 0.4 * r()); }
  let step = 0, a = 1, from = 1;
  const anim = loop(host, (dt) => { a = Math.max(NOISE[step], a - dt * 0.9 * Math.max(0.2, from - NOISE[step])); cv.redraw(); if (a <= NOISE[step]) anim.pause(); }, { autoplay: false });
  const scene = (u, v, col) => {
    const sx = u - 0.28, sy = (v - 0.42) * 0.62;
    if (u > 0.64 && u < 0.72 && v > 0.22 && v < 0.62) return Math.floor(v * 14) % 2 ? col.ink : col.panel; // tower
    if (u > 0.62 && u < 0.74 && v > 0.17 && v <= 0.22) return col.s[2];                                 // lamp
    if (sx * sx + sy * sy < 0.012) return col.s[1];                                                      // sun
    if (v > 0.6) return col.s[0];                                                                        // sea
    return v < 0.3 ? col.soft : col.panel;                                                               // sky
  };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, HEAD[step], col);
    const top = 30, cw = (w - 20) / COLS, ch = (h - top - 26) / ROWS;
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
      const i = y * COLS + x, X = 10 + x * cw, Y = top + y * ch;
      ctx.globalAlpha = 1; ctx.fillStyle = scene((x + 0.5) / COLS, (y + 0.5) / ROWS, col); ctx.fillRect(X, Y, cw + 0.6, ch + 0.6);
      const na = a * amt[i];
      if (na > 0.01) { ctx.globalAlpha = na; ctx.fillStyle = col.s[pick[i]]; ctx.fillRect(X, Y, cw + 0.6, ch + 0.6); }
    }
    ctx.globalAlpha = 1;
    text(ctx, `noise left: ${Math.round(lerp(0, 100, a))}%`, 10, h - 12, { color: col.muted, size: 11.5, weight: 600 });
  };
  cv.redraw();
  return { step(i) { from = a; step = i; if (calm() || NOISE[i] > a) { a = NOISE[i]; cv.redraw(); } else anim.play(); } };
}
