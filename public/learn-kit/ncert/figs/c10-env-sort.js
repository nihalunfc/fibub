// Class 10 Our Environment: sort the waste. Biodegradable wastes can be broken down by living things (composted); non-biodegradable wastes
// cannot, and need recycling, reuse or safe disposal. Pick a bin for each item; a score is kept.
import { canvas, text, title, row, button, readout } from '../../kit.js';

const IT = [['vegetable peels', 1, 'plant waste rots quickly into compost'], ['plastic bottle', 0, 'plastic is not broken down by microbes'], ['used tea leaves', 1, 'plant material: good for compost'], ['glass jar', 0, 'glass lasts almost for ever, but it can be recycled'], ['cotton shirt', 1, 'cotton is a plant fibre and rots in time'], ['polyester shirt', 0, 'synthetic fibre is plastic'], ['aluminium foil', 0, 'metals do not rot; recycle them'], ['dried leaves', 1, 'leaves are plant waste'], ['battery', 0, 'also hazardous: take to a collection point'], ['paper bag', 1, 'paper is made from plants']];
export default function (host) {
  let i = 0, score = 0, tried = 0, msg = 'Choose a bin for the item.', done = false;
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 270, label: 'A waste item and two bins: biodegradable and non-biodegradable' });
  const ctl = row(host);
  button(ctl, 'Biodegradable bin', () => pick(1)); button(ctl, 'Non-biodegradable bin', () => pick(0)); button(ctl, 'Restart', () => { i = 0; score = 0; tried = 0; done = false; msg = 'Choose a bin for the item.'; say(); });
  const out = readout(host);
  function pick(b) { if (done) return; const it = IT[i]; tried++; if (b === it[1]) { score++; msg = 'Correct: ' + it[2] + '.'; } else msg = 'Not quite: ' + it[2] + '.'; i++; if (i >= IT.length) { done = true; msg += ` All done! Score ${score} out of ${IT.length}.`; i = IT.length - 1; } say(); }
  function say() { out.textContent = msg; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Sort the waste', col) + 10, it = IT[i];
    text(ctx, `Item ${Math.min(i + (done ? 1 : 1), IT.length)} of ${IT.length}   ·   score ${score}`, 10, top + 6, { color: col.muted, size: 10.5 });
    ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.roundRect(w / 2 - 80, top + 24, 160, 50, 10); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.6; ctx.stroke(); text(ctx, it[0], w / 2, top + 49, { color: col.ink, size: 14, weight: 700, align: 'center' });
    [[0.28, 'Biodegradable', col.s[2]], [0.72, 'Non-biodegradable', col.s[1]]].forEach(([f, l, c]) => { const x = w * f, y = top + 110, bw = w * 0.38; ctx.fillStyle = c; ctx.globalAlpha = 0.55; ctx.beginPath(); ctx.roundRect(x - bw / 2, y, bw, h - y - 22, 8); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.stroke(); text(ctx, l, x, y + 18, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); });
    text(ctx, 'tip: compost the green bin, recycle the other', w / 2, h - 8, { color: col.muted, size: 9.5, align: 'center' });
  };
  say();
}
