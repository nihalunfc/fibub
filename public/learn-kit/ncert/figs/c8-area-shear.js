// Class 8 Area: a parallelogram has the same area as a rectangle on the same base with the same height.
// Cut the triangle off the left end and slide it to the right end: the pieces fit and make a rectangle b x h.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let t = 0, lean = 3;
  const b = 8, hh = 5;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'A parallelogram cut and rearranged into a rectangle with a slider' });
  const ctl = row(host);
  slider(ctl, { label: 'Slide the cut-off triangle', min: 0, max: 1, step: 0.01, value: t, fmt: (v) => Math.round(v * 100) + '%', oninput: (v) => { t = v; sync(); } });
  slider(ctl, { label: 'Lean', min: 1, max: 7, step: 1, value: lean, fmt: (v) => v + ' m', oninput: (v) => { lean = v; sync(); } });
  const out = readout(host);
  function sync() { out.innerHTML = t > 0.99 ? `The pieces now make a rectangle ${b} m by ${hh} m. Area = <b>${b} × ${hh} = ${b * hh} m²</b>. So the parallelogram’s area is base × height, whatever the lean (the slanting side is not used).` : `Base ${b} m, height ${hh} m (straight up, not along the slant). Slide the triangle to see the rectangle appear.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Parallelogram → rectangle', col), s = Math.min((w - 30) / (b + lean + 1), (h - top - 60) / hh), ox = (w - s * (b + lean)) / 2, by = h - 38, ty = by - s * hh, X = (x) => ox + x * s;
    ctx.beginPath(); ctx.moveTo(X(lean), by); ctx.lineTo(X(lean + b), by); ctx.lineTo(X(lean + b), ty); ctx.lineTo(X(lean), ty); ctx.closePath(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.3; ctx.fill(); ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.moveTo(X(lean), by); ctx.lineTo(X(lean + b), by); ctx.lineTo(X(lean + b), ty); ctx.lineTo(X(lean), ty); ctx.closePath(); ctx.setLineDash([4, 4]); ctx.strokeStyle = col.muted; ctx.lineWidth = 1.2; ctx.stroke(); ctx.setLineDash([]);
    // parallelogram body: from the vertical line x = lean to the slanted right side
    const dx = t * b;
    ctx.beginPath(); ctx.moveTo(X(lean), by); ctx.lineTo(X(b), by); ctx.lineTo(X(b + lean), ty); ctx.lineTo(X(lean), ty); ctx.closePath(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.45; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(X(dx), by); ctx.lineTo(X(lean + dx), by); ctx.lineTo(X(lean + dx), ty); ctx.closePath(); ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.7; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2.5; ctx.stroke();
    text(ctx, 'base b = ' + b, X(lean + b / 2), by + 15, { color: col.ink, size: 11.5, weight: 700, align: 'center' }); text(ctx, 'h = ' + hh, X(lean) - 4, (by + ty) / 2, { color: col.s[2], size: 11.5, weight: 700, align: 'right' });
  };
  sync();
}
