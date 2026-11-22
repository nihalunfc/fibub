// Class 9 Propositions: when is "If P then Q" true? Think of it as a promise: "If it rains, I will carry an umbrella."
// The promise is broken only when P happens and Q does not. In every other case the promise was not broken, so it is true.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

export default function (host) {
  let P = true, Q = true;
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 280, label: 'A table of the four cases of an if-then promise' });
  const c = row(host);
  choice(c, 'P: it rains', [[true, 'Yes'], [false, 'No']], P, (v) => { P = v; upd(); });
  choice(c, 'Q: I carry an umbrella', [[true, 'Yes'], [false, 'No']], Q, (v) => { Q = v; upd(); });
  const out = readout(host);
  const rows = [[true, true], [true, false], [false, true], [false, false]], tf = (v) => (v ? 'T' : 'F');
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, '“If it rains, I carry an umbrella”', col), x0 = 14, rw = h > 0 ? Math.min(46, (h - t - 56) / 5) : 40, cw = (w - 28) / 3;
    ['P (rain)', 'Q (umbrella)', 'If P then Q'].forEach((s, i) => text(ctx, s, x0 + cw * i + cw / 2, t + 16, { color: col.muted, size: 11, weight: 700, align: 'center' }));
    rows.forEach(([p, q], k) => {
      const y = t + 28 + k * rw, truth = !(p && !q), cur = p === P && q === Q;
      ctx.save(); ctx.fillStyle = truth ? col.s[2] : col.s[6]; ctx.globalAlpha = cur ? 0.45 : 0.12; ctx.fillRect(x0, y, w - 28, rw - 4); ctx.restore();
      if (cur) { ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.strokeRect(x0, y, w - 28, rw - 4); ctx.restore(); }
      [tf(p), tf(q), truth ? 'TRUE' : 'FALSE'].forEach((s, i) => text(ctx, s, x0 + cw * i + cw / 2, y + (rw - 4) / 2, { color: col.ink, size: i === 2 ? 14 : 15, weight: 700, align: 'center' }));
    });
    text(ctx, 'Only “rain and no umbrella” breaks the promise', w / 2, h - 12, { color: col.s[6], size: 12, weight: 700, align: 'center' });
  };
  function upd() { const v = !(P && !Q); out.innerHTML = `It ${P ? 'rains' : 'does not rain'} and I ${Q ? 'carry' : 'do not carry'} an umbrella: the promise is <b>${v ? 'kept (true)' : 'broken (false)'}</b>. ` + (!P ? 'No rain means the promise says nothing, so it cannot be broken.' : ''); cv.redraw(); }
  upd();
}
