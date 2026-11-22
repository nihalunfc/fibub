// Vesting with a cliff: shares are earned over time and nothing is yours until the cliff. Set the length of the vesting
// period and the cliff, then drag "months worked" (or press Play) and see how many shares are vested if someone leaves then.
// Typical founder deal: 4 years, 1-year cliff, then monthly.
import { canvas, axes, line, dot, text, title, row, slider, readout, loop } from '../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 400, label: 'Vested share of a grant against months worked' });
  let tt = 10;
  const ctl = row(host);
  const S = {
    total: slider(ctl, { label: 'Vesting period', min: 12, max: 60, step: 6, value: 48, fmt: (v) => v + ' months', oninput: () => cv.redraw() }),
    cliff: slider(ctl, { label: 'Cliff', min: 0, max: 24, step: 1, value: 12, fmt: (v) => v + ' months', oninput: () => cv.redraw() }),
    t: slider(ctl, { label: 'Months worked', min: 0, max: 60, step: 1, value: 10, fmt: (v) => v, oninput: (v) => { tt = v; cv.redraw(); } }),
  };
  const out = readout(host), G = 1000000;
  const vest = (t) => { const T = S.total.value, c = Math.min(S.cliff.value, T); if (t < c) return 0; return Math.min(1, t / T); };
  const anim = loop(host, (dt) => { if (tt >= 60) tt = 0; tt = Math.min(60, tt + dt * 6); S.t.set(Math.round(tt)); if (tt >= 60) anim.pause(); cv.redraw(); }, { autoplay: false });
  anim.button(ctl);
  cv.draw = (ctx, w, h, col) => {
    const T = S.total.value, c = Math.min(S.cliff.value, T), t = Math.min(S.t.value, T + 12), X = 60;
    title(ctx, 'Shares you own, month by month', col);
    const a = axes(ctx, w, h, col, { t: 34, x: [0, X], y: [0, 1], xlabel: 'Months worked', ylabel: 'Vested', fy: (v) => Math.round(v * 100) + '%', xt: [0, 12, 24, 36, 48, 60] });
    const pts = [[0, 0]]; for (let m = 0; m <= X; m++) { if (m === c && c > 0) pts.push([m, 0]); pts.push([m, vest(m)]); }
    line(ctx, pts.map(([m, v]) => [a.X(m), a.Y(v)]), col.s[0], 3);
    if (c > 0) { line(ctx, [[a.X(c), a.B], [a.X(c), a.T]], col.warn, 1.2, [4, 3]); text(ctx, 'cliff', a.X(c) + 4, a.T + 10, { color: col.warn, size: 10, weight: 700 }); }
    const v = vest(t); dot(ctx, a.X(t), a.Y(v), 6, v ? col.good : col.bad, col.panel);
    line(ctx, [[a.X(t), a.B], [a.X(t), a.Y(v)]], col.s[1], 1.2, [3, 3]);
    out.innerHTML = `After <b>${t}</b> months: <b style="color:${v ? col.good : col.bad}">${Math.round(v * G).toLocaleString()}</b> of 1,000,000 shares are vested (${(v * 100).toFixed(1)}%). ` + (t < c ? `Before the ${c}-month cliff <b>nothing</b> has vested: leave now and you walk away with zero.` : c > 0 && t - c < 1 ? `The cliff just passed, so ${(c / T * 100).toFixed(0)}% arrived at once.` : `After the cliff, each month adds ${Math.round(G / T).toLocaleString()} shares.`);
  };
  cv.redraw();
}
