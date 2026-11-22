// Cap table across rounds, one step at a time: two founders, an option pool, a seed round, then Series A. Each step
// adds shares, so everyone's percentage falls, but the price per share rises and a founder's stake is worth more.
// Made-up numbers. Use Next, or press a step's dot, and compare the percentage with the value on each row.
import { canvas, text, title, readout } from '../kit.js';
import { short, pct } from './_biz.js';

// shares in millions: founders 6.0 and 4.0 at the start
const A0 = 6, B0 = 4, TOT0 = 10;
const pool = (TOT0 / 9); // pool = 10% of the company after it is created
const T1 = TOT0 + pool, ps2 = 4 / T1, new2 = 1 / ps2, T2 = T1 + new2, ps3 = 15 / T2, new3 = 5 / ps3, T3 = T2 + new3;
const ROUNDS = [
  { name: 'Start', sh: [A0, B0, 0, 0, 0], note: 'Two founders hold 10 million shares.', ps: null },
  { name: 'Option pool', sh: [A0, B0, pool, 0, 0], note: 'An employee option pool is set aside (10% of the company), before any investor arrives.', ps: null },
  { name: 'Seed', sh: [A0, B0, pool, new2, 0], note: 'Seed: $1M for new shares at a $4M valuation before the money. $1M ÷ $5M = 20% for the seed investor.', ps: ps2 },
  { name: 'Series A', sh: [A0, B0, pool, new2, new3], note: 'Series A: $5M at a $15M valuation before the money. $5M ÷ $20M = 25% for the new investor.', ps: ps3 },
];
const NAMES = ['Founder A', 'Founder B', 'Option pool', 'Seed investor', 'Series A investor'];

export default function (host) {
  let k = 0;
  const cv = canvas(host, { aspect: 0.86, max: 400, min: 310, label: 'Ownership bars after each funding round' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Who owns what after each round', col);
    const top = 34, rh = (h - top - 10) / 4, L = 74, bw = w - L - 12;
    ROUNDS.forEach((r, i) => {
      const y = top + i * rh, tot = r.sh.reduce((a, b) => a + b, 0);
      ctx.globalAlpha = i <= k ? 1 : 0.12;
      text(ctx, r.name, 8, y + 14, { color: col.ink, size: 11, weight: i === k ? 800 : 600, fit: false });
      let x = L;
      r.sh.forEach((s, j) => {
        if (s <= 0) return;
        const wd = bw * (s / tot);
        ctx.fillStyle = col.s[j === 2 ? 7 : j]; ctx.fillRect(x, y + 3, wd - 1, rh * 0.42);
        if (wd > 26) text(ctx, pct(s / tot, 0), x + wd / 2, y + 3 + rh * 0.21, { color: j === 2 ? col.bg : col.bg, size: 11, weight: 700, align: 'center', fit: false });
        x += wd;
      });
      const a = r.sh[0], val = r.ps ? a * r.ps : null;
      text(ctx, `Founder A: ${pct(a / tot, 1)}` + (val ? ` of the company, worth ${short(val * 1e6)}` : ' of the company'), L, y + rh * 0.42 + 18, { color: col.muted, size: 10.5 });
      ctx.globalAlpha = 1;
    });
    // legend
    let lx = 8; const ly = h - 6;
    NAMES.forEach((n, j) => { if (j > 1 + (k >= 1 ? 1 : 0) + (k >= 2 ? 1 : 0) + (k >= 3 ? 1 : 0)) return; ctx.fillStyle = col.s[j === 2 ? 7 : j]; ctx.fillRect(lx, ly - 8, 8, 8); text(ctx, n, lx + 11, ly - 4, { color: col.muted, size: 9.5, fit: false }); lx += 14 + n.length * 5.2; });
  };
  const show = () => {
    const r = ROUNDS[k], tot = r.sh.reduce((a, b) => a + b, 0);
    out.innerHTML = `<b>${r.name}.</b> ${r.note} Total shares: ${tot.toFixed(2)} million.` + (r.ps ? ` Price per share: <b>$${r.ps.toFixed(2)}</b>.` : '') + (k === 3 ? ` Founder A went from 60% to ${pct(r.sh[0] / tot, 1)}, yet the stake is worth far more than at the start.` : '');
  };
  show(); cv.redraw();
  return { step(i) { k = Math.max(0, Math.min(3, i)); show(); cv.redraw(); } };
}
