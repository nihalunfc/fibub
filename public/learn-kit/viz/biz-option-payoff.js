// Stock options: the right to buy shares at a fixed strike price. The payoff line is flat at zero (you would not buy above
// the market) and climbs once the share price passes the strike. Drag the share price at exit; change the strike, the
// number of options and the vested share. Made-up numbers; tax on options differs by country, see the lesson.
import { canvas, axes, line, dot, text, title, row, slider, readout } from '../kit.js';
import { money } from './_biz.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 400, label: 'Option value against share price at exit' });
  const ctl = row(host);
  const S = {
    n: slider(ctl, { label: 'Options granted', min: 1000, max: 100000, step: 1000, value: 20000, fmt: (v) => v.toLocaleString(), oninput: () => cv.redraw() }),
    k: slider(ctl, { label: 'Strike price', min: 0.1, max: 10, step: 0.1, value: 1, fmt: (v) => '$' + v.toFixed(2), oninput: () => cv.redraw() }),
    v: slider(ctl, { label: 'Vested', min: 0, max: 1, step: 0.05, value: 0.5, fmt: (v) => Math.round(v * 100) + '%', oninput: () => cv.redraw() }),
    p: slider(ctl, { label: 'Share price at exit', min: 0, max: 20, step: 0.1, value: 6, fmt: (v) => '$' + v.toFixed(2), oninput: () => cv.redraw() }),
  };
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const n = S.n.value * S.v.value, K = S.k.value, P = S.p.value, f = (x) => n * Math.max(0, x - K), hi = Math.max(f(20), 1);
    title(ctx, 'What your vested options are worth', col);
    const a = axes(ctx, w, h, col, { t: 34, x: [0, 20], y: [0, hi * 1.05], xlabel: 'Share price when the company is sold', ylabel: 'Your gain', fx: (v) => '$' + v, fy: (v) => (v >= 1000 ? Math.round(v / 1000) + 'k' : v), xt: [0, 5, 10, 15, 20] });
    line(ctx, [[a.X(0), a.Y(0)], [a.X(K), a.Y(0)], [a.X(20), a.Y(f(20))]], col.s[0], 3);
    line(ctx, [[a.X(K), a.T], [a.X(K), a.B]], col.muted, 1.2, [3, 4]); text(ctx, 'strike', a.X(K) + 4, a.T + 10, { color: col.muted, size: 10 });
    dot(ctx, a.X(P), a.Y(f(P)), 6, P > K ? col.good : col.bad, col.panel);
    out.innerHTML = P <= K ? `Share price <b>$${P.toFixed(2)}</b> is at or below the strike <b>$${K.toFixed(2)}</b>: the options are <b style="color:${col.bad}">underwater</b>. You would not exercise, and the gain is $0.` : `Exercising ${Math.round(n).toLocaleString()} options costs ${money(n * K)} and the shares are worth ${money(n * P)}: gain <b style="color:${col.good}">${money(f(P))}</b> (before tax). Each $1 rise in the share price adds ${money(n)}.`;
  };
  cv.redraw();
}
