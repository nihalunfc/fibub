// How much memory a DataFrame needs, column by column, and what the right dtype saves. Slide the row count, then tap a
// column to swap its dtype (int64 to int8, float64 to float32, text to category, text dates to datetime64).
// Numbers are the real bytes per value for numbers; for text they are a typical estimate and say so.
import { canvas, text, row, slider, button, readout, title } from '../kit.js';

// bytes per value: [before, after]
const COLS = [
  { n: 'age', b: ['int64', 8], a: ['int8', 1] },
  { n: 'price', b: ['float64', 8], a: ['float32', 4] },
  { n: 'country (text)', b: ['object', 58], a: ['category', 1] },
  { n: 'signup (text)', b: ['object', 66], a: ['datetime64', 8] },
  { n: 'is_vip', b: ['int64', 8], a: ['bool', 1] },
];
export default function (host) {
  let lg = 6; const on = COLS.map(() => false);
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 320, label: 'Memory used by each DataFrame column before and after a smaller dtype' });
  const c1 = row(host); slider(c1, { label: 'Rows', min: 4, max: 8, step: 0.1, value: lg, fmt: (v) => Math.round(10 ** v).toLocaleString('en-CA'), oninput: (v) => { lg = v; draw(); } });
  const c2 = row(host);
  const bt = COLS.map((c, i) => button(c2, c.n.split(' ')[0], () => { on[i] = !on[i]; lab(); draw(); }));
  const lab = () => bt.forEach((b, i) => { b.setAttribute('aria-pressed', String(on[i])); b.textContent = (on[i] ? '✓ ' : '') + COLS[i].n.split(' ')[0]; });
  button(c2, 'All smaller', () => { on.fill(true); lab(); draw(); });
  button(c2, 'Reset', () => { on.fill(false); lab(); draw(); });
  const out = readout(host);
  const N = () => Math.round(10 ** lg), mb = (i) => (N() * COLS[i][on[i] ? 'a' : 'b'][1]) / 1e6;
  const fmtMB = (v) => (v >= 1000 ? (v / 1000).toFixed(2) + ' GB' : v.toFixed(v < 10 ? 1 : 0) + ' MB');
  function draw() { const before = COLS.reduce((s, c) => s + (N() * c.b[1]) / 1e6, 0), now = COLS.reduce((s, _, i) => s + mb(i), 0); out.innerHTML = `<b>${N().toLocaleString('en-CA')} rows:</b> ${fmtMB(before)} with default dtypes, <b>${fmtMB(now)}</b> now (${Math.round((1 - now / before) * 100)}% saved). Tap a column name to toggle it. Text sizes are typical (a Python string costs about 50 to 70 bytes); <code>df.memory_usage(deep=True)</code> gives your real numbers.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Memory per column', col);
    const mx = Math.max(...COLS.map((c) => (N() * c.b[1]) / 1e6)), L = 112, bw = w - L - 64;
    COLS.forEach((c, i) => {
      const y = 48 + i * 52, b = (N() * c.b[1]) / 1e6, a = mb(i);
      text(ctx, c.n, 8, y + 4, { color: col.ink, size: 11, weight: 600, fit: false });
      text(ctx, `${c.b[0]} → ${c.a[0]}`, 8, y + 20, { color: col.muted, size: 10 });
      ctx.fillStyle = col.line; ctx.fillRect(L, y - 6, (bw * b) / mx, 14); ctx.fillStyle = on[i] ? col.s[2] : col.s[1]; ctx.fillRect(L, y + 10, Math.max(2, (bw * a) / mx), 14);
      text(ctx, fmtMB(b), L + (bw * b) / mx + 4, y + 1, { color: col.muted, size: 10, fit: false }); text(ctx, fmtMB(a), L + Math.max(2, (bw * a) / mx) + 4, y + 17, { color: col.ink, size: 10, weight: 600, fit: false });
    });
    text(ctx, 'grey = default dtype, colour = now', 8, 48 + 5 * 52 - 6, { color: col.muted, size: 10 });
  };
  lab(); draw();
}
