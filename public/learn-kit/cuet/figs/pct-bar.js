// 3.2 Percent change as a multiplier. Two changes in a row: watch the bar grow or shrink and see why
// +20% then −20% does not come back to the start.
import { canvas, text, row, slider, readout } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.45, max: 280, min: 200, label: 'Three bars: the start, after the first change, after the second change' });
  let a = 20, b = -20;
  const ctl = row(host);
  slider(ctl, { label: 'First change', min: -50, max: 100, step: 5, value: a, fmt: (v) => `${v > 0 ? '+' : ''}${v}%`, oninput: (v) => { a = v; go(); } });
  slider(ctl, { label: 'Second change', min: -50, max: 100, step: 5, value: b, fmt: (v) => `${v > 0 ? '+' : ''}${v}%`, oninput: (v) => { b = v; go(); } });
  const out = readout(host);
  const go = () => {
    cv.redraw();
    const m = (1 + a / 100) * (1 + b / 100), net = (m - 1) * 100;
    out.innerHTML = `× ${(1 + a / 100).toFixed(2)} then × ${(1 + b / 100).toFixed(2)} = × <b>${m.toFixed(4)}</b>, a net change of <b>${net > 0 ? '+' : ''}${net.toFixed(2)}%</b>, not ${a + b > 0 ? '+' : ''}${a + b}%.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const v = [100, 100 * (1 + a / 100), 100 * (1 + a / 100) * (1 + b / 100)], max = 300;
    const labels = ['Start', `After ${a > 0 ? '+' : ''}${a}%`, `After ${b > 0 ? '+' : ''}${b}%`];
    const x0 = 90, bw = w - x0 - 60, rh = (h - 30) / 3;
    v.forEach((val, i) => {
      const y = 12 + i * rh;
      text(ctx, labels[i], x0 - 8, y + rh / 2, { color: col.ink, size: 12, align: 'right' });
      ctx.fillStyle = col.s[i === 0 ? 7 : i === 1 ? 0 : 2] || col.s[0];
      ctx.fillRect(x0, y + 6, (val / max) * bw, rh - 12);
      text(ctx, val.toFixed(2).replace(/\.00$/, ''), x0 + (val / max) * bw + 6, y + rh / 2, { color: col.ink, size: 12, weight: 600 });
    });
    const sx = x0 + (100 / max) * bw;
    ctx.strokeStyle = col.muted; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(sx, 8); ctx.lineTo(sx, h - 14); ctx.stroke(); ctx.setLineDash([]);
  };
  go();
}
