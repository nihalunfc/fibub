// Money creation by banks: ₹1,000 is deposited; each bank keeps the legal reserve and lends the rest, which is deposited in
// the next bank. Press Play (or step with the slider) to watch deposits pile up towards 1000 ÷ LRR. Change the reserve
// ratio: a smaller ratio means a longer chain and a bigger multiplier (1 ÷ LRR).
import { canvas, row, slider, readout, loop, text, title, clamp } from '../kit.js';

const rs = (v) => '₹' + Math.round(v).toLocaleString('en-IN');
export default function (host) {
  let lrr = 0.2, shown = 1, t = 0;
  const cv = canvas(host, { aspect: 0.85, max: 400, min: 310, label: 'Deposits passing through a chain of banks' });
  const c = row(host);
  slider(c, { label: 'Legal reserve ratio', min: 0.05, max: 0.5, step: 0.05, value: lrr, fmt: (v) => Math.round(v * 100) + '%', oninput: (v) => { lrr = v; shown = 1; t = 0; show(); cv.redraw(); } });
  const c2 = row(host);
  const a = loop(host, (dt) => { t += dt; if (t > 0.7 && shown < 12) { shown++; t = 0; show(); } cv.redraw(); }, { autoplay: false }); a.button(c2);
  const out = readout(host);
  const dep = (i) => 1000 * Math.pow(1 - lrr, i);
  const show = () => { let tot = 0; for (let i = 0; i < shown; i++) tot += dep(i);
    out.innerHTML = `After ${shown} bank${shown > 1 ? 's' : ''}: total deposits ${rs(tot)}. The limit is 1000 ÷ ${lrr} = <b>${rs(1000 / lrr)}</b> (multiplier ${(1 / lrr).toFixed(1)}). Bank ${shown} holds ${rs(dep(shown - 1))} and keeps ${rs(dep(shown - 1) * lrr)} as reserve.`; };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Each loan becomes the next bank\'s deposit', col);
    const n = 12, L = 14, W = w - 28, bw = W / n, bot = h - 56, top = 50, mx = 1000;
    let tot = 0;
    for (let i = 0; i < n; i++) { const d = dep(i), x = L + i * bw, hh = d / mx * (bot - top), on = i < shown;
      ctx.globalAlpha = on ? 1 : 0.18; ctx.fillStyle = col.s[0]; ctx.fillRect(x + 2, bot - hh * (1 - lrr), bw - 4, hh * (1 - lrr)); ctx.fillStyle = col.s[1]; ctx.fillRect(x + 2, bot - hh, bw - 4, hh * lrr); ctx.globalAlpha = 1;
      text(ctx, String(i + 1), x + bw / 2, bot + 9, { color: col.muted, size: 10, align: 'center' }); if (on) tot += d; }
    text(ctx, 'Bank number', w / 2, bot + 24, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, 'blue = lent on, orange = kept as reserve', L, 36, { color: col.muted, size: 10.5 });
    const barW = W * clamp(tot / (1000 / lrr), 0, 1); ctx.fillStyle = col.line; ctx.fillRect(L, h - 20, W, 12); ctx.fillStyle = col.s[2]; ctx.fillRect(L, h - 20, barW, 12);
    text(ctx, `total ${rs(tot)} of ${rs(1000 / lrr)}`, L + 4, h - 14, { color: col.ink, size: 10, weight: 700, halo: col.panel });
  };
  show();
}
