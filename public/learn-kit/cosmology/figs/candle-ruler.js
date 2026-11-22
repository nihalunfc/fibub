// 2.2 Standard candles and standard rulers. Move the same lamp (or the same rod) farther away: a candle
// fades as 1 / distance², a ruler shrinks as 1 / distance. If you know how bright or how big something
// really is, how it looks tells you how far away it is.
import { canvas, text, line, dot, row, slider, choice, readout, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.46, max: 320, min: 220, label: 'The same lamp and the same rod at different distances' });
  let d = 2, kind = 'candle';
  const ctl = row(host);
  slider(ctl, { label: 'Distance', min: 1, max: 10, step: 0.1, value: d, fmt: (v) => `${v.toFixed(1)} units`, oninput: (v) => { d = v; cv.redraw(); show(); } });
  choice(ctl, 'Use', [['candle', 'Standard candle'], ['ruler', 'Standard ruler']], kind, (v) => { kind = v; cv.redraw(); show(); });
  const out = readout(host);
  const show = () => {
    out.innerHTML = kind === 'candle'
      ? `At ${d.toFixed(1)} units the lamp looks <b>1/${fmt(d * d)}</b> as bright as at 1 unit (1 ÷ ${d.toFixed(1)}²). Measure the brightness and you can work backwards to the distance.`
      : `At ${d.toFixed(1)} units the rod looks <b>1/${fmt(d)}</b> as long as at 1 unit (1 ÷ ${d.toFixed(1)}). Measure its angle and you can work out the distance.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const L = 30, R = w - 30, y = h * 0.5, X = (v) => L + ((v - 0) / 10.5) * (R - L);
    dot(ctx, L - 10, y, 7, col.s[0]);
    text(ctx, 'You', L - 10, y + 20, { color: col.ink, size: 11, weight: 600, align: 'center' });
    line(ctx, [[L, y], [R, y]], col.line, 1, [3, 4]);
    for (let k = 1; k <= 10; k++) text(ctx, String(k), X(k), h - 10, { color: col.muted, size: 10, align: 'center' });
    const x = X(d);
    if (kind === 'candle') {
      // the rays spread: a cone of the same light through ever larger squares
      ctx.save(); ctx.globalAlpha = 0.18; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(L - 10, y - (x - L) * 0.3); ctx.lineTo(L - 10, y + (x - L) * 0.3); ctx.closePath(); ctx.fillStyle = col.s[3]; ctx.fill(); ctx.restore();
      dot(ctx, x, y, 9, col.s[3]);
      // what you see: a disc whose brightness falls as 1/d²
      const b = 1 / (d * d);
      ctx.save(); ctx.globalAlpha = Math.max(0.03, b); dot(ctx, w - 60, 40, 18, col.s[3]); ctx.restore();
      ctx.beginPath(); ctx.arc(w - 60, 40, 18, 0, Math.PI * 2); ctx.strokeStyle = col.line; ctx.stroke();
      text(ctx, 'what you see', w - 60, 70, { color: col.muted, size: 10.5, align: 'center' });
    } else {
      const len = 40;
      line(ctx, [[x, y - len], [x, y + len]], col.s[0], 4);
      line(ctx, [[L - 10, y], [x, y - len]], col.s[0], 1, [4, 3]);
      line(ctx, [[L - 10, y], [x, y + len]], col.s[0], 1, [4, 3]);
      const ang = 2 * Math.atan(len / (x - L + 10)) * 180 / Math.PI;
      text(ctx, `looks ${fmt(ang)}° tall`, L + 14, y - 12, { color: col.ink, size: 11.5, weight: 600, halo: col.panel });
    }
    text(ctx, kind === 'candle' ? 'A lamp of known power' : 'A rod of known length', 10, 16, { color: col.ink, size: 12, weight: 600 });
  };
  cv.redraw(); show();
}
