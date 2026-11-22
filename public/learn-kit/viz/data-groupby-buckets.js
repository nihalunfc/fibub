// GROUP BY / groupby as split, apply, combine: rows slide into one bucket per region, the aggregate is worked out inside
// each bucket, and the buckets collapse to one result row each. Try: change the aggregate, then raise the HAVING bar
// and see whole groups (not single rows) disappear.
import { canvas, text, row, choice, slider, readout, title, ease } from '../kit.js';
import { stepper } from './_data.js';

const D = [['East', 30], ['West', 12], ['North', 25], ['East', 18], ['West', 40], ['East', 9], ['North', 33], ['West', 21], ['North', 14], ['East', 22]];
const G = ['East', 'West', 'North'];
export default function (host, opts) {
  let ph = 0, a = 0, agg = 'sum', having = 0;
  const cv = canvas(host, { aspect: 1.15, max: 480, min: 360, label: 'Ten rows split into region buckets and combined into one row each' });
  const ctl = row(host); choice(ctl, 'Aggregate', [['sum', 'SUM'], ['avg', 'AVG'], ['count', 'COUNT'], ['max', 'MAX']], agg, (v) => { agg = v; draw(); });
  const c2 = row(host); slider(c2, { label: 'HAVING result ≥', min: 0, max: 100, step: 1, value: 0, fmt: (v) => String(Math.round(v)), oninput: (v) => { having = Math.round(v); draw(); } });
  const st = stepper(host, opts, ['table', 'split into buckets', 'apply the aggregate', 'combine into rows'], (i) => { ph = i; go(); });
  const out = readout(host);
  let raf = 0;
  function go() { cancelAnimationFrame(raf); const tick = () => { a += Math.sign(ph - a) * 0.06; if (Math.abs(ph - a) < 0.06) a = ph; draw(); if (a !== ph) raf = requestAnimationFrame(tick); }; tick(); }
  const val = (g) => { const v = D.filter((r) => r[0] === g).map((r) => r[1]); return agg === 'sum' ? v.reduce((x, y) => x + y, 0) : agg === 'avg' ? +(v.reduce((x, y) => x + y, 0) / v.length).toFixed(1) : agg === 'count' ? v.length : Math.max(...v); };
  function draw() {
    const kept = G.filter((g) => val(g) >= having);
    out.innerHTML = `<code>GROUP BY region</code> made <b>3</b> buckets; <b>${agg.toUpperCase()}(amount)</b> gives ${G.map((g) => `${g} ${val(g)}`).join(', ')}. ${having ? `HAVING keeps <b>${kept.length}</b> group(s) after the buckets are built.` : 'Raise the HAVING bar to drop whole groups.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, ['Every row, in table order', 'Split: one bucket per region', 'Apply: ' + agg.toUpperCase() + ' inside each bucket', 'Combine: one row per group'][Math.round(a)], col);
    const e = ease(Math.min(1, Math.max(0, a)) % 1 || (a >= 1 ? 1 : 0));
    const split = Math.min(1, a), comb = Math.max(0, Math.min(1, a - 2));
    const bw = (w - 20) / 3;
    G.forEach((g, gi) => {
      const x0 = 10 + gi * bw; ctx.globalAlpha = split;
      ctx.strokeStyle = col.s[gi]; ctx.lineWidth = 2; ctx.strokeRect(x0 + 2, 120, bw - 4, h - 190);
      ctx.globalAlpha = 1; text(ctx, g, x0 + bw / 2, 132, { color: col.s[gi], size: 12, weight: 700, align: 'center', fit: false });
    });
    const cnt = { East: 0, West: 0, North: 0 };
    D.forEach((r, i) => {
      const gi = G.indexOf(r[0]), k = cnt[r[0]]++;
      const tx = 10 + (i % 2) * 72, ty = 38 + Math.floor(i / 2) * 15 * 1;
      const bx = 10 + gi * bw + 10 + (k % 2) * 36, by = 146 + Math.floor(k / 2) * 17;
      const s = Math.min(1, a) , x = tx + (bx - tx) * ease(s), y = ty + (by - ty) * ease(s);
      const cx = x + 17 + (10 + gi * bw + bw / 2 - 17 - x) * ease(comb), cy = y + (h - 36 - y) * ease(comb);
      ctx.globalAlpha = (1 - comb * 0.85) * (a >= 1 && having && val(r[0]) < having ? 0.35 : 1);
      ctx.fillStyle = a >= 1 ? col.s[gi] : col.soft; const cw2 = a < 0.5 ? 66 : 34; ctx.fillRect(x, y, cw2, 14);
      text(ctx, a < 0.5 ? `${r[0]} ${r[1]}` : String(r[1]), x + cw2 / 2, y + 7, { color: a >= 1 ? '#fff' : col.ink, size: 10, weight: 600, align: 'center', fit: false });
    });
    ctx.globalAlpha = 1;
    if (a < 1) text(ctx, 'region, amount', 90, 46, { color: col.muted, size: 11 });
    G.forEach((g, gi) => {
      const x0 = 10 + gi * bw, v = val(g), ok = v >= having;
      const ap = Math.max(0, Math.min(1, a - 1));
      if (ap > 0) { ctx.globalAlpha = ap * (ok ? 1 : 0.4); text(ctx, `${agg.toUpperCase()} = ${v}`, x0 + bw / 2, h - 52, { color: ok ? col.ink : col.bad, size: 13, weight: 700, align: 'center' }); }
      if (comb > 0) { ctx.globalAlpha = comb * (ok ? 1 : 0.35); ctx.fillStyle = ok ? col.s[gi] : col.line; ctx.fillRect(x0 + 6, h - 34, bw - 12, 22); text(ctx, `${g}: ${v}${ok ? '' : ' (out)'}`, x0 + bw / 2, h - 23, { color: ok ? '#fff' : col.ink, size: 11, weight: 700, align: 'center' }); }
    });
    ctx.globalAlpha = 1;
  };
  st.set(0); draw();
  return { step(i) { st.set(i); } };
}
