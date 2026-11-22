// Le Chatelier and pressure: PCl5(g) ⇌ PCl3(g) + Cl2(g). Starting from 1 mol of PCl5, the degree of dissociation is
// α = √(Kp / (Kp + P)). Raise the pressure and the equilibrium moves to the side with fewer gas moles (less dissociation);
// raise Kp (as heating does for this endothermic reaction) and it moves forward.
import { canvas, axes, line, text, row, slider, readout, fmt, dot } from '../../kit.js';

export default function (host) {
  let Kp = 1, P = 1;
  const alpha = (k, p) => Math.sqrt(k / (k + p));
  const cv = canvas(host, { aspect: 0.62, max: 340, min: 250, label: 'Degree of dissociation of PCl5 against total pressure, with the amount of each gas' });
  const ctl = row(host);
  slider(ctl, { label: 'Total pressure', min: 0.1, max: 100, value: P, log: true, fmt: (v) => `${fmt(v, 2)} atm`, oninput: (v) => { P = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Kp (rises on heating)', min: 0.01, max: 100, value: Kp, log: true, fmt: (v) => fmt(v, 2), oninput: (v) => { Kp = v; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    const a = alpha(Kp, P);
    out.innerHTML = `α = √(K<sub>p</sub>/(K<sub>p</sub> + P)) = <b>${fmt(a, 3)}</b>. Moles from 1 mol PCl₅: PCl₅ ${fmt(1 - a, 3)}, PCl₃ ${fmt(a, 3)}, Cl₂ ${fmt(a, 3)} (total ${fmt(1 + a, 3)}). K<sub>p</sub> itself does not change with pressure; only the position does.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const split = w > 520 ? 0.68 : 0.62, W1 = w * split;
    // left: α against pressure (log axis)
    ctx.save();
    const A = axes(ctx, W1, h, col, { x: [0.1, 100], xlog: true, y: [0, 1], xlabel: 'total pressure (atm)', ylabel: 'α', l: 40, t: 22, fx: (v) => fmt(v, 2) });
    const pts = []; for (let i = 0; i <= 120; i++) { const p = 0.1 * 10 ** (3 * i / 120); pts.push([A.X(p), A.Y(alpha(Kp, p))]); }
    line(ctx, pts, col.s[0], 2.5);
    dot(ctx, A.X(P), A.Y(alpha(Kp, P)), 6, col.s[2], col.panel);
    ctx.restore();
    // right: bars of moles
    const a = alpha(Kp, P), bars = [['PCl₅', 1 - a, col.s[0]], ['PCl₃', a, col.s[1]], ['Cl₂', a, col.s[3]]];
    const L = W1 + 14, R = w - 10, T = 30, B = h - 42, bw = (R - L) / 3;
    ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(L, B); ctx.lineTo(R, B); ctx.stroke();
    bars.forEach(([name, v, c], i) => {
      const x = L + i * bw + bw * 0.18, wd = bw * 0.64, y = B - v * (B - T);
      ctx.fillStyle = c; ctx.fillRect(x, y, wd, B - y);
      text(ctx, fmt(v, 2), x + wd / 2, y - 8, { color: col.ink, size: 10.5, align: 'center' });
      text(ctx, name, x + wd / 2, B + 12, { color: col.ink, size: 10.5, weight: 600, align: 'center' });
    });
  };
  cv.redraw(); show();
}
