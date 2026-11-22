// Microbes in human welfare: how sewage treatment lowers BOD. Primary treatment settles out solids; secondary
// treatment lets aerobic microbes (flocs) eat the dissolved organic matter in aeration tanks. Move the aeration time
// and see BOD fall. Numbers are typical, schematic values, not a design standard.
import { canvas, axes, line, dot, text, row, slider, readout } from '../../kit.js';

export default function (host) {
  let hrs = 6;
  const raw = 300, afterPrimary = 200, floor = 20, k = 0.45;
  const bod = (t) => floor + (afterPrimary - floor) * Math.exp(-k * t);
  const cv = canvas(host, { aspect: 0.58, max: 340, min: 240, mark: 'bl', label: 'BOD of sewage through primary and secondary treatment' });
  const ctl = row(host);
  slider(ctl, { label: 'Aeration time', min: 0, max: 10, step: 0.5, value: hrs, fmt: (v) => `${v} h`, oninput: (v) => { hrs = v; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    const b = bod(hrs);
    out.innerHTML = `Raw sewage: BOD about ${raw} mg/L. After primary treatment (screening, grit removal, settling): about ${afterPrimary} mg/L. After ${hrs} h of aeration with flocs: about <b>${Math.round(b)} mg/L</b> (${Math.round((1 - b / raw) * 100)}% lower than raw). The effluent then goes to a settling tank; the flocs settle as activated sludge, part of which goes back as inoculum and the rest to anaerobic digesters that make biogas.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const { X, Y, T } = axes(ctx, w, h, col, { x: [-3, 10], y: [0, 330], xt: [0, 2, 4, 6, 8, 10], xlabel: 'Hours in the aeration tank', ylabel: 'BOD (mg/L)', l: 50 });
    ctx.fillStyle = col.soft; ctx.fillRect(X(-3), T, X(0) - X(-3), Y(0) - T);
    text(ctx, 'primary', (X(-3) + X(0)) / 2, T + 10, { color: col.muted, size: 10, align: 'center' });
    line(ctx, [[X(-3), Y(raw)], [X(-1.5), Y(raw)], [X(-0.5), Y(afterPrimary)], [X(0), Y(afterPrimary)]], col.s[1], 2.5);
    const pts = []; for (let t = 0; t <= 10; t += 0.1) pts.push([X(t), Y(bod(t))]);
    line(ctx, pts, col.s[0], 2.5);
    dot(ctx, X(hrs), Y(bod(hrs)), 6, col.s[0], col.panel);
    text(ctx, 'secondary (biological)', X(5), T + 10, { color: col.muted, size: 10, align: 'center' });
  };
  cv.redraw(); show();
}
