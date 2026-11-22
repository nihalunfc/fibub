// Limiting reagent, shown with molecules: N₂ + 3H₂ → 2NH₃. Set how many moles of each you start with, press React and
// watch molecules combine until one reagent runs out. The readout gives the limiting reagent, the leftover and the
// mass of NH₃ made (17 g per mole). Try 3 N₂ with 3 H₂, then 1 N₂ with 9 H₂.
import { canvas, text, row, slider, button, readout, loop, title } from '../kit.js';
import { atom } from './_chem.js';

export default function (host) {
  let n0 = 3, h0 = 6, N = 3, H = 6, A = 0, acc = 0, going = false;
  const cv = canvas(host, { aspect: 0.7, max: 400, min: 280, label: 'Nitrogen and hydrogen molecules reacting to ammonia until one runs out' });
  const ctl = row(host);
  const sn = slider(ctl, { label: 'N₂ (mol)', min: 0, max: 8, step: 1, value: n0, oninput: (v) => { n0 = v; reset(); } });
  const sh = slider(ctl, { label: 'H₂ (mol)', min: 0, max: 18, step: 1, value: h0, oninput: (v) => { h0 = v; reset(); } });
  const c2 = row(host);
  button(c2, 'React', () => { reset(); going = true; });
  button(c2, 'Reset', () => reset());
  const out = readout(host);
  loop(host, (dt) => {
    if (!going) return;
    acc += dt; if (acc < 0.55) return; acc = 0;
    if (N >= 1 && H >= 3) { N--; H -= 3; A += 2; } else going = false;
    cv.redraw(); show();
  });
  function reset() { N = n0; H = h0; A = 0; going = false; acc = 0; cv.redraw(); show(); }
  function show() {
    const lim = n0 * 3 < h0 ? 'N₂' : n0 * 3 > h0 ? 'H₂' : 'neither (exact amounts)';
    const made = 2 * Math.min(n0, h0 / 3);
    out.innerHTML = `Start: ${n0} mol N₂ and ${h0} mol H₂. Limiting reagent: <b>${lim}</b> (the mole ratio needed is 1 : 3). NH₃ possible: <b>${made.toFixed(2)} mol = ${(made * 17).toFixed(1)} g</b>. Left over: ${(n0 - made / 2).toFixed(2)} mol N₂, ${(h0 - 1.5 * made).toFixed(2)} mol H₂. So far: ${A} mol NH₃ made.`;
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, "N₂ + 3 H₂ → 2 NH₃ (1 drawing = 1 mol)", col);
    const cols = Math.max(4, Math.floor((w - 20) / 38));
    const place = (list, y0, label, color) => {
      text(ctx, label, 10, y0 - 8, { color, size: 11, weight: 700 });
      list.forEach((k, i) => { const x = 22 + (i % cols) * 36, y = y0 + 12 + Math.floor(i / cols) * 24; k(x, y); });
    };
    const nl = Array.from({ length: N }, () => (x, y) => { atom(ctx, x - 5, y, 6, col.s[0], '', col); atom(ctx, x + 5, y, 6, col.s[0], '', col); });
    const hl = Array.from({ length: H }, () => (x, y) => { atom(ctx, x - 3, y, 4, col.s[1], '', col); atom(ctx, x + 3, y, 4, col.s[1], '', col); });
    const al = Array.from({ length: A }, () => (x, y) => { atom(ctx, x, y, 6, col.s[0], '', col); [[-7, 5], [7, 5], [0, -8]].forEach(([dx, dy]) => atom(ctx, x + dx, y + dy, 3.5, col.s[1], '', col)); });
    const rowsOf = (n) => Math.ceil(Math.max(1, n) / cols) * 24 + 8;
    place(nl, 62, `N₂ left: ${N}`, col.s[0]);
    place(hl, 62 + 22 + rowsOf(8), `H₂ left: ${H}`, col.s[1]);
    place(al, 62 + 44 + rowsOf(8) + rowsOf(18), `NH₃ made: ${A}`, col.s[2]);
  };
  show();
}
