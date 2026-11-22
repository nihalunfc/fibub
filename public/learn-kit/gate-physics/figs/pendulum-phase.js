// 2.2 Phase portrait of a pendulum, H = p²/2 − cos θ (units m = l = g = 1, so p = θ'). Contours of H, the separatrix
// H = 1 through the unstable top, and a point that moves along the chosen orbit by Hamilton's equations (RK4).
// The period comes from the complete elliptic integral K (by the arithmetic-geometric mean).
import { canvas, axes, line, dot, text, title, row, slider, readout, loop, fmt } from '../../kit.js';

const agm = (a, b) => { for (let i = 0; i < 30; i++) { const a1 = (a + b) / 2; b = Math.sqrt(a * b); a = a1; } return a; };
const K = (k) => Math.PI / (2 * agm(1, Math.sqrt(1 - k * k)));

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 270, label: 'Phase portrait of a pendulum with its separatrix and a moving phase point' });
  let E = 0.3, th = 0, p = 0;
  const reset = () => { th = 0; p = Math.sqrt(2 * (E + 1)); };
  const ctl = row(host);
  slider(ctl, { label: 'Energy H (separatrix at 1)', min: -0.95, max: 2.5, step: 0.01, value: E, fmt: (x) => fmt(x, 3), oninput: (x) => { E = x; reset(); show(); cv.redraw(); } });
  const out = readout(host);
  const show = () => {
    if (E < 1 - 1e-6) {
      const t0 = Math.acos(-E), T = 4 * K(Math.sin(t0 / 2));
      out.innerHTML = `Libration (swinging): amplitude <b>${fmt(t0 * 180 / Math.PI, 3)}°</b>, period <b>${fmt(T, 4)}</b> √(l/g) (small swings: 2π = 6.283). The closed loop encloses the action ∮p dθ.`;
    } else if (E > 1 + 1e-6) {
      const k = Math.sqrt(2 / (E + 1)), T = 2 * k * K(k);
      out.innerHTML = `Rotation (going over the top): one turn takes <b>${fmt(T, 4)}</b> √(l/g). The orbit is an open wavy line; θ = −π and π are the same point.`;
    } else out.innerHTML = 'On the separatrix: the pendulum creeps towards the top and takes for ever to get there.';
  };
  const f = (t, q) => [q, -Math.sin(t)];
  cv.draw = (ctx, W, H, col) => {
    title(ctx, 'Pendulum phase portrait', col);
    const ax = axes(ctx, W, H, col, { x: [-Math.PI, Math.PI], y: [-3, 3], xlabel: 'θ', ylabel: 'p = θ′', t: 30,
      xt: [-Math.PI, -Math.PI / 2, 0, Math.PI / 2, Math.PI], fx: (v) => ({ [-Math.PI]: '−π', [-Math.PI / 2]: '−π/2', 0: '0', [Math.PI / 2]: 'π/2', [Math.PI]: 'π' }[v] ?? '') });
    ctx.save(); ax.clip();
    const curve = (h, color, wdt, dash) => {
      for (const s of [1, -1]) {
        const pts = [];
        for (let t = -Math.PI; t <= Math.PI + 1e-9; t += 0.01) { const q2 = 2 * (h + Math.cos(t)); if (q2 >= 0) pts.push([ax.X(t), ax.Y(s * Math.sqrt(q2))]); else if (pts.length) { line(ctx, pts.splice(0), color, wdt, dash); } }
        line(ctx, pts, color, wdt, dash);
      }
    };
    for (const h of [-0.8, -0.5, 0, 0.5, 1.5, 2.2]) curve(h, col.line, 1.2);
    curve(1, col.s[1], 2, [6, 4]);
    curve(E, col.s[0], 2.5);
    dot(ctx, ax.X(0), ax.Y(0), 4, col.ink);
    dot(ctx, ax.X(Math.PI), ax.Y(0), 4, col.s[1]); dot(ctx, ax.X(-Math.PI), ax.Y(0), 4, col.s[1]);
    const tw = ((th + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
    dot(ctx, ax.X(tw), ax.Y(p), 6, col.s[0], col.panel);
    ctx.restore();
    text(ctx, 'dashed: separatrix (H = 1)', ax.L + 6, ax.T + 10, { color: col.s[1], size: 11, weight: 600 });
  };
  const anim = loop(host, (dt) => {
    const n = 8, h = (dt * 2.5) / n;
    for (let i = 0; i < n; i++) {
      const k1 = f(th, p), k2 = f(th + h / 2 * k1[0], p + h / 2 * k1[1]), k3 = f(th + h / 2 * k2[0], p + h / 2 * k2[1]), k4 = f(th + h * k3[0], p + h * k3[1]);
      th += h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); p += h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
    }
    cv.redraw();
  });
  anim.button(ctl);
  reset(); cv.redraw(); show();
}
