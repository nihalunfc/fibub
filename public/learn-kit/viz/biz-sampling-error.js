// Uncertainty: 30 made-up surveys of the same population where 40% really say yes. Each dot is one survey's result with its
// 95% range (the error bar). Make the sample bigger and the bars shrink; about 95% of them should still catch the true 40%.
// Press "Run 30 new surveys" to draw again.
import { canvas, axes, line, dot, title, row, slider, button, readout, rng } from '../kit.js';

export default function (host) {
  let seed = 11, res = [];
  const cv = canvas(host, { aspect: 0.8, max: 400, min: 320, label: 'Thirty survey results with error bars around a true value' });
  const ctl = row(host);
  const N = slider(ctl, { label: 'People per survey', min: 10, max: 2000, step: 10, value: 100, fmt: (v) => v.toLocaleString(), oninput: () => run() });
  button(ctl, 'Run 30 new surveys', () => { seed += 7; run(); });
  const out = readout(host);
  function run() {
    const r = rng(seed), n = N.value;
    res = Array.from({ length: 30 }, () => { let y = 0; for (let i = 0; i < n; i++) if (r() < 0.4) y++; return y / n; });
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const n = N.value;
    title(ctx, 'Thirty surveys, one truth (40%)', col);
    const a = axes(ctx, w, h, col, { t: 36, x: [0, 31], y: [0, 0.8], xt: [], ylabel: 'Said yes', fy: (v) => Math.round(v * 100) + '%', l: 46, xlabel: 'Survey number' });
    line(ctx, [[a.L, a.Y(0.4)], [a.R, a.Y(0.4)]], col.s[1], 2, [5, 4]);
    let hit = 0;
    res.forEach((p, i) => {
      const s = 1.96 * Math.sqrt((p * (1 - p)) / n), ok = Math.abs(p - 0.4) <= s;
      if (ok) hit++;
      const x = a.X(i + 1);
      line(ctx, [[x, a.Y(p - s)], [x, a.Y(p + s)]], ok ? col.s[0] : col.bad, 2);
      dot(ctx, x, a.Y(p), 3.2, ok ? col.s[0] : col.bad);
    });
    const se = 1.96 * Math.sqrt(0.24 / n);
    out.innerHTML = `With <b>${n.toLocaleString()}</b> people, a typical survey is off by about <b>±${(se * 100).toFixed(1)} points</b>. <b>${hit} of 30</b> bars catch the true 40%${hit < 30 ? ' (red ones miss: that happens about 1 time in 20)' : ''}. Four times the people only halves the bar, so precision gets expensive.`;
  };
  run();
}
