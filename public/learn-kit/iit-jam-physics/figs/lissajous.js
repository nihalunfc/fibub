// 3.3 Lissajous figures: x = sin(a t), y = sin(b t + phi). Choose the frequency ratio a : b and the phase; a dot traces
// the path. Small markers show where the curve touches the top edge and a side edge, which is how the ratio is read
// off an oscilloscope (f_y : f_x = top touches : side touches).
import { canvas, line, dot, text, title, row, slider, choice, readout, loop, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.75, max: 420, min: 280, label: 'Lissajous figure traced by two perpendicular oscillations' });
  let a = 1, b = 2, ph = Math.PI / 4, t = 0;
  const ctl = row(host);
  choice(ctl, 'f_x : f_y', [['1:1', '1 : 1'], ['1:2', '1 : 2'], ['1:3', '1 : 3'], ['2:3', '2 : 3'], ['3:4', '3 : 4']], '1:2', (v) => { [a, b] = v.split(':').map(Number); cv.redraw(); show(); });
  slider(ctl, { label: 'Phase φ (degrees)', min: 0, max: 180, step: 5, value: 45, fmt: (v) => fmt(v, 3) + '°', oninput: (v) => { ph = v * Math.PI / 180; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    const deg = Math.round(ph * 180 / Math.PI);
    let shape = '';
    if (a === b) shape = deg === 0 ? 'a straight line along y = x' : deg === 180 ? 'a straight line along y = −x' : deg === 90 ? 'a circle' : `an ellipse along ${deg < 90 ? 'y = x' : 'y = −x'}`;
    else shape = `a closed ${a} : ${b} figure`;
    out.innerHTML = `x = sin(${a}ωt), y = sin(${b}ωt + ${deg}°): <b>${shape}</b>. The top edge is touched ${b} time${b > 1 ? 's' : ''} and a side edge ${a} time${a > 1 ? 's' : ''} (for a general phase), so f<sub>y</sub> : f<sub>x</sub> = ${b} : ${a}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Two perpendicular SHMs added', col);
    const s = Math.min(w, h - 40) * 0.4, cx = w / 2, cy = h / 2 + 12;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(cx - s, cy - s, 2 * s, 2 * s);
    line(ctx, [[cx - s, cy], [cx + s, cy]], col.line, 1); line(ctx, [[cx, cy - s], [cx, cy + s]], col.line, 1);
    const pts = [];
    for (let k = 0; k <= 1200; k++) { const u = (k / 1200) * 2 * Math.PI; pts.push([cx + s * Math.sin(a * u), cy - s * Math.sin(b * u + ph)]); }
    line(ctx, pts, col.s[0], 2);
    dot(ctx, cx + s * Math.sin(a * t), cy - s * Math.sin(b * t + ph), 6, col.s[3]);
    text(ctx, 'x', cx + s + 8, cy, { color: col.muted, size: 12 });
    text(ctx, 'y', cx + 6, cy - s - 8, { color: col.muted, size: 12 });
  };
  const anim = loop(host, (dt) => { t += dt * 0.8; cv.redraw(); });
  anim.button(ctl);
  cv.redraw(); show();
}
