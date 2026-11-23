// Class 11 Biology, Breathing and Exchange of Gases: pulmonary and alveolar ventilation. Pulmonary ventilation = breaths per minute x tidal volume. About 150 mL of each breath stays in the airways (dead space)
// and never reaches the alveoli, so alveolar ventilation = breaths per minute x (tidal volume - dead space). Deep slow breaths ventilate the alveoli better than quick shallow ones.
import { canvas, text, title, axes, row, slider, readout } from '../../kit.js';

export default function (host) {
  let rate = 12, tv = 500;
  const DS = 150;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Bars for pulmonary and alveolar ventilation for chosen breathing rate and tidal volume, with dead space' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'Breaths per minute', min: 6, max: 40, step: 1, value: rate, fmt: (v) => String(Math.round(v)), oninput: (v) => { rate = v; go(); } });
  slider(ctl, { label: 'Tidal volume', min: 150, max: 1500, step: 50, value: tv, fmt: (v) => v + ' mL', oninput: (v) => { tv = v; go(); } });
  const pv = () => rate * tv / 1000, av = () => rate * Math.max(0, tv - DS) / 1000;
  const go = () => { ro.textContent = `Pulmonary ventilation = ${Math.round(rate)} × ${tv} mL = ${pv().toFixed(1)} L/min. Alveolar ventilation = ${Math.round(rate)} × (${tv} − ${DS}) = ${av().toFixed(1)} L/min, so ${(100 * av() / pv() || 0).toFixed(0)} % of the air reaches the alveoli. Try 40 shallow breaths of 200 mL: the total looks large (8 L) but only 2 L reaches the alveoli.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'How much air reaches the alveoli?', col), mx = 30;
    const A = axes(ctx, w, h, col, { x: [0, 2], y: [0, mx], xlabel: '', ylabel: 'litres per minute', l: 48, t: t0 + 10, b: 36, xt: [], yt: [0, 10, 20, 30] });
    const bw = (A.R - A.L) * 0.3, x1 = A.L + (A.R - A.L) * 0.14, x2 = A.L + (A.R - A.L) * 0.56, dsL = rate * Math.min(tv, DS) / 1000;
    ctx.fillStyle = col.s[2]; ctx.fillRect(x1, A.Y(av()), bw, A.B - A.Y(av())); ctx.fillStyle = col.s[3]; ctx.fillRect(x1, A.Y(pv()), bw, A.Y(av()) - A.Y(pv()));
    ctx.fillStyle = col.s[2]; ctx.fillRect(x2, A.Y(av()), bw, A.B - A.Y(av()));
    text(ctx, 'pulmonary', x1 + bw / 2, A.B + 14, { color: col.ink, size: 11, weight: 600, align: 'center' }); text(ctx, 'alveolar', x2 + bw / 2, A.B + 14, { color: col.ink, size: 11, weight: 600, align: 'center' });
    text(ctx, pv().toFixed(1), x1 + bw / 2, A.Y(pv()) - 9, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, av().toFixed(1), x2 + bw / 2, A.Y(av()) - 9, { color: col.ink, size: 11, weight: 700, align: 'center' });
    if (dsL > 0.3) text(ctx, 'dead space ' + dsL.toFixed(1), x1 + bw / 2, (A.Y(pv()) + A.Y(av())) / 2, { color: col.bg, size: 10, weight: 700, align: 'center' });
  };
  go();
}
