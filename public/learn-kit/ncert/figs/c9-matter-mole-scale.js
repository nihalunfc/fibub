// Class 9 Atomic Foundations of Matter: why the mole. Atoms are too small to count one by one, so chemists count in
// a huge "dozen": a mole is 6.022 x 10^23 particles (Avogadro's number). The figure scales up a counting unit: one
// (1), a dozen (12), a gross (144), a lakh, a crore and so on, to a mole, with everyday comparisons. A slider moves up
// the powers of ten; the picture shows how long it would take to count that many at one per second.
import { canvas, text, title, row, slider, readout, dot } from '../../kit.js';

const LAB = [[0, '1 (one)', 'one rupee coin'], [1.08, '12 (a dozen)', 'bananas at the shop'], [2.16, '144 (a gross)', 'pencils in a box'], [5, '10⁵ (a lakh)', 'people in a small town'], [7, '10⁷ (a crore)', 'people in a big city'], [9.9, '8 × 10⁹', 'people on Earth'], [23.78, '6.022 × 10²³ (a mole)', 'atoms in 12 g of carbon']];
export default function (host) {
  let e = 0;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 300, label: 'A scale from one to a dozen to a mole with comparisons and the time needed to count them' });
  const ctl = row(host);
  slider(ctl, { label: 'Powers of ten', min: 0, max: 23.78, step: 0.02, value: e, fmt: (v) => (v < 3 ? Math.round(Math.pow(10, v)).toLocaleString('en-IN') : `10^${v.toFixed(1)}`), oninput: (v) => { e = v; upd(); } });
  const out = readout(host);
  function upd() {
    const secs = Math.pow(10, e), yrs = secs / 3.156e7;
    const time = secs < 60 ? `${secs.toFixed(0)} s` : secs < 86400 ? `${(secs / 3600).toFixed(1)} hours` : yrs < 1000 ? `${yrs.toFixed(yrs < 10 ? 1 : 0)} years` : `${yrs.toExponential(1)} years`;
    out.innerHTML = `Counting 10<sup>${e.toFixed(1)}</sup> things at one per second would take <b>${time}</b>. A mole is ${(Math.pow(10, 23.78) / 1e23).toFixed(1)} × 10²³ ≈ 10<sup>23.8</sup> things: counting a mole would take about 2 × 10¹⁶ years, over a million times the age of the universe (1.4 × 10¹⁰ years). So we weigh atoms instead of counting them.`; cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'From one to a mole: counting in bigger units', col);
    const x0 = 14, bw = w - 28, y = 64, maxE = 23.78;
    ctx.fillStyle = col.line; ctx.fillRect(x0, y, bw, 10); ctx.fillStyle = col.s[2]; ctx.fillRect(x0, y, bw * (e / maxE), 10);
    LAB.forEach(([v], i) => { const x = x0 + (v / maxE) * bw; ctx.fillStyle = e >= v ? col.s[2] : col.muted; ctx.beginPath(); ctx.arc(x, y + 5, 5, 0, 7); ctx.fill(); });
    let k = 0; LAB.forEach(([v], i) => { if (e >= v - 0.001) k = i; });
    const [v, lab, ex] = LAB[k];
    text(ctx, lab, w / 2, 118, { color: col.s[2], size: 17, weight: 700, align: 'center' });
    text(ctx, `like: ${ex}`, w / 2, 142, { color: col.ink, size: 12, align: 'center' });
    // dots up to 60 to show growth
    const n = Math.min(60, Math.round(Math.pow(10, Math.min(e, 1.78)))); for (let i = 0; i < n; i++) dot(ctx, 24 + (i % 20) * ((w - 48) / 19), 172 + Math.floor(i / 20) * 14, 3.2, col.s[1]);
    if (e > 1.78) text(ctx, '… far too many to draw', w / 2, 222, { color: col.muted, size: 11, align: 'center' });
    text(ctx, 'a mole is to atoms what a dozen is to bananas', w / 2, h - 30, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
    text(ctx, `now: 10^${e.toFixed(1)} items`, w / 2, h - 12, { color: col.muted, size: 11, align: 'center' });
    void v;
  };
  upd();
}
