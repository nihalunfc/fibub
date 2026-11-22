// Sales funnel: set the share that moves on at each stage and see how many people reach the end. "Add 5 points to" a
// stage shows why the same effort gives very different gains: five points on a 4% step is a lot, on a 60% step it is little.
import { canvas, text, title, row, slider, readout, choice } from '../kit.js';
import { pct } from './_biz.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.9, max: 400, min: 300, label: 'A four-stage funnel with drop-offs' });
  const names = ['Visit the site', 'Sign up', 'Start a trial', 'Pay'];
  let fix = -1;
  const ctl = row(host);
  const S = [
    slider(ctl, { label: 'Visit → sign up', min: 0.01, max: 0.3, step: 0.005, value: 0.04, fmt: (v) => pct(v, 1), oninput: () => cv.redraw() }),
    slider(ctl, { label: 'Sign up → trial', min: 0.1, max: 0.9, step: 0.01, value: 0.4, fmt: (v) => pct(v), oninput: () => cv.redraw() }),
    slider(ctl, { label: 'Trial → pay', min: 0.02, max: 0.6, step: 0.01, value: 0.2, fmt: (v) => pct(v), oninput: () => cv.redraw() }),
  ];
  const ctl2 = row(host);
  choice(ctl2, 'Add 5 points to', [[-1, 'Nothing'], [0, 'Step 1'], [1, 'Step 2'], [2, 'Step 3']], fix, (v) => { fix = v; cv.redraw(); });
  const out = readout(host), V = 10000;
  const counts = (rates) => { const c = [V]; rates.forEach((r) => c.push(c[c.length - 1] * r)); return c; };
  cv.draw = (ctx, w, h, col) => {
    const rates = S.map((s) => s.value), c = counts(rates), base = c[3];
    const r2 = rates.map((r, i) => (i === fix ? Math.min(1, r + 0.05) : r)), c2 = counts(r2);
    title(ctx, `Out of ${V.toLocaleString()} visitors`, col);
    const top = 40, bh = (h - top - 14) / 4 - 8, maxW = w - 24;
    c2.forEach((n, i) => {
      const y = top + i * (bh + 8), bw = Math.max(3, (maxW * n) / V), x = (w - bw) / 2;
      ctx.fillStyle = i === 3 ? col.good : col.s[0]; ctx.globalAlpha = 0.25 + 0.75 * (1 - i / 4); ctx.fillRect(x, y, bw, bh); ctx.globalAlpha = 1;
      text(ctx, `${names[i]}: ${Math.round(n).toLocaleString()}`, w / 2, y + bh / 2, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
      if (i > 0) text(ctx, `lost ${Math.round(c2[i - 1] - n).toLocaleString()} (${pct(1 - r2[i - 1], 0)} drop)`, w - 8, y - 4, { color: col.muted, size: 10, align: 'right' });
    });
    const gain = c2[3] - base;
    out.innerHTML = `<b>${Math.round(c2[3]).toLocaleString()} customers</b> from ${V.toLocaleString()} visitors: overall conversion <b>${pct(c2[3] / V, 2)}</b> (the three steps multiplied: ${r2.map((r) => pct(r, 0)).join(' × ')}).` + (fix >= 0 ? ` Five more points at step ${fix + 1} adds <b style="color:${col.good}">${gain.toFixed(1)} customers (+${((gain / base) * 100).toFixed(0)}%)</b>.` : ' Pick a step to improve and compare: the step with the smallest rate usually has the most room.');
  };
  cv.redraw();
}
