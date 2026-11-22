// 4.2 Retarded time. A charge moves along x (uniformly or oscillating). Light spheres it emitted in the past are drawn
// as circles; the one passing through the observer marks the retarded position. The readout gives the retarded time,
// the retarded and present positions and the Liénard-Wiechert factor 1/(1 - n.beta).
import { canvas, row, slider, choice, readout, line, dot, text, title } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 260, label: 'Light spheres emitted by a moving charge and the retarded position seen by an observer' });
  let beta = 0.6, mode = 'u';
  const ctl = row(host);
  slider(ctl, { label: 'Speed β = v/c', min: 0, max: 0.95, step: 0.01, value: beta, fmt: (v) => v.toFixed(2), oninput: (v) => { beta = v; cv.redraw(); show(); } });
  choice(ctl, 'Motion', [['u', 'Uniform'], ['o', 'Oscillating']], mode, (v) => { mode = v; cv.redraw(); show(); });
  const out = readout(host);
  const obs = [0.6, 2.2];                         // observer, in units where c = 1
  const xs = (t) => (mode === 'u' ? beta * t : (beta / 1.2) * Math.sin(1.2 * t));   // max speed beta in both modes
  const vx = (t) => (mode === 'u' ? beta : beta * Math.cos(1.2 * t));
  const tret = () => { // solve c(0 - t) = |obs - x(t)| for t < 0 by bisection
    let a = -20, b = 0;
    const g = (t) => -t - Math.hypot(obs[0] - xs(t), obs[1]);
    for (let i = 0; i < 80; i++) { const m = (a + b) / 2; g(m) > 0 ? (a = m) : (b = m); }
    return (a + b) / 2;
  };
  const show = () => {
    const tr = tret(), xr = xs(tr), n = [(obs[0] - xr), obs[1]], R = Math.hypot(n[0], n[1]);
    const k = 1 / (1 - (n[0] / R) * vx(tr));
    out.innerHTML = `Retarded time t<sub>r</sub> = <b>${tr.toFixed(3)}</b> (units of d/c; light-travel from the track alone would be ${(-Math.hypot(obs[0] - xs(0), obs[1])).toFixed(3)}). Retarded position x = ${xr.toFixed(3)}, present position x = ${xs(0).toFixed(3)}. Liénard-Wiechert factor 1/(1 − n̂·β) = <b>${k.toFixed(3)}</b> (${k > 1.0005 ? 'approaching: potential enhanced' : k < 0.9995 ? 'receding: potential reduced' : 'sideways'}).`;
  };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Past light spheres: the one through the observer fixes t_r', col);
    const s = Math.min(w / 6, (h - 40) / 3.3), X = (x) => w / 2 + x * s, Y = (y) => h - 22 - y * s;
    line(ctx, [[0, Y(0)], [w, Y(0)]], col.line, 1);
    const tr = tret();
    for (let i = 1; i <= 12; i++) {
      const te = -i * 0.35; if (-te > 6) break;
      ctx.beginPath(); ctx.arc(X(xs(te)), Y(0), -te * s, 0, 2 * Math.PI);
      ctx.strokeStyle = col.muted; ctx.globalAlpha = 0.35; ctx.lineWidth = 1; ctx.stroke(); ctx.globalAlpha = 1;
    }
    ctx.beginPath(); ctx.arc(X(xs(tr)), Y(0), -tr * s, 0, 2 * Math.PI); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.2; ctx.stroke();
    const path = []; for (let t = -6; t <= 0.001; t += 0.02) path.push([X(xs(t)), Y(0)]);
    line(ctx, path, col.s[2], 3);
    line(ctx, [[X(xs(tr)), Y(0)], [X(obs[0]), Y(obs[1])]], col.s[0], 1.5, [5, 4]);
    dot(ctx, X(xs(tr)), Y(0), 5, col.s[0]); dot(ctx, X(xs(0)), Y(0), 6, col.s[3]); dot(ctx, X(obs[0]), Y(obs[1]), 5, col.ink);
    text(ctx, 'observer', X(obs[0]) + 8, Y(obs[1]), { color: col.ink, size: 11, halo: col.panel });
    text(ctx, 'retarded', X(xs(tr)), Y(0) + 13, { color: col.s[0], size: 11, align: 'center', halo: col.panel });
    text(ctx, 'now', X(xs(0)), Y(0) - 12, { color: col.s[3], size: 11, align: 'center', halo: col.panel });
  };
  cv.redraw(); show();
}
