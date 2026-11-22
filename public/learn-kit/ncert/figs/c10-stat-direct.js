// Class 10 Statistics (step player): the direct method for the mean of grouped data, and the shared table drawer used
// by the assumed-mean, step-deviation and median step players. Data: runs scored by 40 batters, classes of width 20.
// mean = (sum of f·x) / (sum of f), where x is the class mark.
import { canvas, text, title } from '../../kit.js';

export const RUNS = { cls: ['0–20', '20–40', '40–60', '60–80', '80–100'], f: [5, 9, 14, 8, 4], x: [10, 30, 50, 70, 90] };

/** Draw a growing table. cfg: { title, cols: [{ h, vals: [..5 strings], at: step shown, tot: 'text' or null, totAt }], notes: [per step], hi: { step: row index } }. */
export function tableFig(host, cfg) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: cfg.label });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, cfg.title, col), nR = RUNS.cls.length + 2, noteH = 46;
    const rh = Math.min(36, (h - top - noteH - 18) / nR), L = 8, W = w - 16, cw = W / cfg.cols.length, y0 = top + 8;
    cfg.cols.forEach((c, j) => {
      const x = L + j * cw + cw / 2, on = step >= c.at;
      if (on) { ctx.fillStyle = col.soft; ctx.globalAlpha = c.at === step && c.at > 0 ? 1 : 0; ctx.fillRect(L + j * cw, y0, cw, rh * nR); ctx.globalAlpha = 1; }
      if (on) text(ctx, c.h, x, y0 + rh / 2, { color: col.ink, size: 12, weight: 700, align: 'center' });
      RUNS.cls.forEach((_, i) => { if (on) text(ctx, c.vals[i], x, y0 + rh * (i + 1.5), { color: c.at === step && c.at > 0 ? col.s[1] : col.ink, size: 12, weight: c.at === step ? 700 : 400, align: 'center' }); });
      if (c.tot && step >= (c.totAt ?? 99)) text(ctx, c.tot, x, y0 + rh * (nR - 0.5), { color: col.s[3], size: 12, weight: 700, align: 'center' });
    });
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1;
    for (let i = 0; i <= nR; i++) if (i <= 1 || i >= nR - 1) { ctx.beginPath(); ctx.moveTo(L, y0 + i * rh); ctx.lineTo(L + W, y0 + i * rh); ctx.stroke(); }
    const hr = cfg.hi && cfg.hi[step];
    if (hr !== undefined) { ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2.5; ctx.strokeRect(L, y0 + rh * (hr + 1), W, rh); }
    if (step >= (cfg.totRowAt ?? 99)) text(ctx, 'Total', L + 4, y0 + rh * (nR - 0.5), { color: col.s[3], size: 11, weight: 700 });
    const note = cfg.notes[step] || '';
    const lines = Array.isArray(note) ? note : [note];
    lines.forEach((t, i) => text(ctx, t, w / 2, h - noteH + 12 + i * 18, { color: i ? col.s[2] : col.ink, size: i ? 13 : 11.5, weight: i ? 700 : 400, align: 'center' }));
    if (cfg.after) cfg.after(ctx, w, h, col, step, y0, rh);
  };
  cv.redraw();
  return { step(i) { step = Math.min(cfg.notes.length - 1, i); cv.redraw(); } };
}

const fx = RUNS.f.map((f, i) => f * RUNS.x[i]);
export default function (host) {
  return tableFig(host, {
    title: 'Direct method: mean = Σfx ÷ Σf', label: 'Table for the direct method of finding the mean of grouped data', totRowAt: 3,
    cols: [
      { h: 'class', vals: RUNS.cls, at: 0 },
      { h: 'f', vals: RUNS.f.map(String), at: 0, tot: '40', totAt: 3 },
      { h: 'x (mid)', vals: RUNS.x.map(String), at: 1 },
      { h: 'f × x', vals: fx.map(String), at: 2, tot: '1940', totAt: 3 },
    ],
    notes: ['Runs of 40 batters: each class and its frequency f', 'Class mark x = (lower + upper) ÷ 2, e.g. (40 + 60) ÷ 2 = 50', 'Multiply each frequency by its class mark: 5×10 = 50, 9×30 = 270 ...', ['Add the columns: Σf = 40 and Σfx = 1940', ''], ['mean = 1940 ÷ 40', 'x̄ = 48.5 runs']],
    hi: { 1: 2, 2: 2 },
  });
}
