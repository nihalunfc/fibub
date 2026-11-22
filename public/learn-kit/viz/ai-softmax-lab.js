// Softmax step by step: drag the four score bars (logits, left) up and down. Middle: e to the power of each score
// divided by the temperature; right: those shares of the total, which are the probabilities. Try: add 2 to every score
// (nothing changes), lower the temperature (the leader takes all), raise it (flatter, more random).
import { canvas, text, row, slider, button, readout, title } from '../kit.js';
import { softmax, pointer } from './_ai.js';

const NAMES = ['cat', 'dog', 'fox', 'car'];
export default function (host) {
  const z = [2.0, 1.0, 0.2, -1.0]; let T = 1;
  const cv = canvas(host, { aspect: 0.78, max: 360, min: 250, label: 'Bars of scores turned into probabilities by softmax' });
  const ctl = row(host);
  slider(ctl, { label: 'Temperature', min: 0.1, max: 3, value: 1, fmt: (v) => v.toFixed(2), oninput: (v) => { T = v; show(); } });
  button(ctl, 'Add 2 to all', () => { for (let i = 0; i < 4; i++) z[i] = Math.min(5, z[i] + 2); show(); });
  button(ctl, 'Reset', () => { [2, 1, 0.2, -1].forEach((v, i) => (z[i] = v)); show(); });
  const out = readout(host);
  const L = { l: 8, w: 0, top: 50, h: 0 };
  pointer(cv, (px, py) => {
    const colw = (cv.w - 16) / 3, i = Math.floor((px - 8) / (colw / 4 * 1));
    const idx = Math.floor(((px - 8) / colw) * 4);
    if (idx < 0 || idx > 3) return;
    const v = -3 + ((L.top + L.h - py) / L.h) * 8; z[idx] = Math.max(-3, Math.min(5, Math.round(v * 10) / 10)); show();
  }, (px, py) => px < 8 + (cv.w - 16) / 3 && py > L.top - 10);
  function show() {
    const p = softmax(z, T), H = -p.reduce((s, q) => s + (q > 0 ? q * Math.log2(q) : 0), 0), top = p.indexOf(Math.max(...p));
    out.innerHTML = `Probabilities: ${p.map((q, i) => `${NAMES[i]} <b>${(q * 100).toFixed(1)}%</b>`).join(', ')}. Leader: <b>${NAMES[top]}</b>. Uncertainty (entropy) ${H.toFixed(2)} of a possible 2.00 bits. They always add up to 100%.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'scores → e^(score ÷ T) → share of total', col);
    L.h = h - 90; const colw = (w - 16) / 3, p = softmax(z, T);
    const ex = z.map((v) => Math.exp((v - Math.max(...z)) / T)), emax = 1;
    [['1. scores (drag)', 0], ['2. exponentiate', 1], ['3. probability', 2]].forEach(([lab, c]) => text(ctx, lab, 8 + c * colw + colw / 2, 44, { color: col.muted, size: 10.5, align: 'center', weight: 600 }));
    const bw = colw / 4 - 6, base = L.top + L.h * (3 / 8), y = (v) => L.top + L.h - ((v + 3) / 8) * L.h;
    ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(8, y(0)); ctx.lineTo(8 + colw - 4, y(0)); ctx.stroke();
    z.forEach((v, i) => {
      const x = 8 + i * (colw / 4) + 3, yb = y(0), yv = y(v);
      ctx.fillStyle = col.s[0]; ctx.fillRect(x, Math.min(yb, yv), bw, Math.abs(yb - yv));
      text(ctx, v.toFixed(1), x + bw / 2, Math.min(yb, yv) - 8, { color: col.ink, size: 10, align: 'center', fit: false });
      text(ctx, NAMES[i], x + bw / 2, h - 30, { color: col.muted, size: 10, align: 'center', fit: false });
      const x2 = 8 + colw + i * (colw / 4) + 3, hh = ex[i] * (L.h - 26), yb2 = L.top + L.h;
      ctx.fillStyle = col.s[1]; ctx.fillRect(x2, yb2 - hh, bw, hh);
      text(ctx, ex[i].toFixed(2), x2 + bw / 2, yb2 - hh - 8, { color: col.ink, size: 10, align: 'center', fit: false });
      text(ctx, NAMES[i], x2 + bw / 2, h - 30, { color: col.muted, size: 10, align: 'center', fit: false });
      const x3 = 8 + 2 * colw + i * (colw / 4) + 3, hp = p[i] * (L.h - 26);
      ctx.fillStyle = col.s[2]; ctx.fillRect(x3, yb2 - hp, bw, hp);
      text(ctx, (p[i] * 100).toFixed(0) + '%', x3 + bw / 2, yb2 - hp - 8, { color: col.ink, size: 10, align: 'center', fit: false, weight: 700 });
      text(ctx, NAMES[i], x3 + bw / 2, h - 30, { color: col.muted, size: 10, align: 'center', fit: false });
    });
    text(ctx, `Σ = ${ex.reduce((a, b) => a + b, 0).toFixed(2)}  (÷ this)`, 8 + 1.5 * colw, h - 12, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, 'sum = 100%', 8 + 2.5 * colw, h - 12, { color: col.muted, size: 10.5, align: 'center' });
  };
  show();
}
