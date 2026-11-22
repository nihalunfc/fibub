// Class 9 Probability: the long-run idea. Five separate runs of the same experiment start in very different places
// (short runs are unpredictable), but every run's relative frequency settles near the same theoretical probability.
import { canvas, text, title, row, button, choice, readout, loop } from '../../kit.js';

const EV = { coin: ['Coin: heads', 1 / 2], six: ['Die: a six', 1 / 6], mult: ['Die: a multiple of 3', 1 / 3], quarter: ['Spinner: a quarter-sector', 1 / 4] };
export default function (host) {
  let key = 'coin', runs = [], n = 0;
  const MAXN = 600;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'Five runs of an experiment whose relative frequency settles near the probability' });
  const ctl = row(host);
  choice(ctl, 'Event', Object.entries(EV).map(([k, d]) => [k, d[0]]), key, (v) => { key = v; reset(); });
  const c2 = row(host);
  const anim = loop(host, () => { if (n < MAXN) step(4); });
  anim.button(c2);
  button(c2, 'Restart', () => reset());
  const out = readout(host);
  function reset() { runs = Array.from({ length: 5 }, () => ({ hits: 0, h: [] })); n = 0; sync(); }
  function step(k) { for (let q = 0; q < k && n < MAXN; q++) { n++; runs.forEach((r) => { if (Math.random() < EV[key][1]) r.hits++; r.h.push(r.hits / n); }); } sync(); }
  function sync() { const p = EV[key][1]; out.innerHTML = `Probability of “${EV[key][0].split(': ')[1]}” = ${+p.toFixed(3)}. After ${n} trials the five runs show ${runs.map((r) => (n ? r.h[n - 1].toFixed(2) : '–')).join(', ')}. Early on they disagree a lot; later they crowd round ${+p.toFixed(2)}. This is the <b>long-run</b> idea.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Five runs, one probability', col), p = EV[key][1], gx0 = 34, gx1 = w - 14, gy0 = top + 12, gy1 = h - 34, X = (i) => gx0 + (i / MAXN) * (gx1 - gx0), Y = (v) => gy1 - v * (gy1 - gy0);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; [0, 0.25, 0.5, 0.75, 1].forEach((v) => { ctx.beginPath(); ctx.moveTo(gx0, Y(v)); ctx.lineTo(gx1, Y(v)); ctx.stroke(); text(ctx, String(v), gx0 - 5, Y(v), { color: col.muted, size: 10, align: 'right' }); });
    runs.forEach((r, k) => { ctx.strokeStyle = col.s[k % 8]; ctx.lineWidth = 1.8; ctx.beginPath(); r.h.forEach((v, i) => (i ? ctx.lineTo(X(i + 1), Y(v)) : ctx.moveTo(X(1), Y(v)))); ctx.stroke(); });
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(gx0, Y(p)); ctx.lineTo(gx1, Y(p)); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'P = ' + +p.toFixed(3), gx1, Y(p) - 9, { color: col.ink, size: 11, weight: 700, align: 'right', halo: col.panel });
    text(ctx, 'number of trials →  ' + n + ' of ' + MAXN, gx1, gy1 + 14, { color: col.muted, size: 10, align: 'right' });
  };
  reset();
}
