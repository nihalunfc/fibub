// A ball rolling on a potential-energy landscape U(x). The force is the downhill slope, F = −dU/dx (red arrow); the
// total energy E is the flat line, so the ball can only go where U ≤ E and turns back at the crossing points.
// Drag the ball sideways to choose where it starts, add kinetic energy with the slider, switch friction on to see it settle.
import { canvas, text, row, choice, slider, readout, loop, button, line, dot, arrow } from '../kit.js';
import { drag } from './_mech.js';

const LAND = {
  sho: { n: 'Spring', U: (x) => 0.5 * x * x, a: -3, b: 3, ymax: 4.5 },
  well2: { n: 'Double well', U: (x) => x ** 4 / 4 - x * x / 2 + 0.25, a: -2.2, b: 2.2, ymax: 2.6 },
  morse: { n: 'Molecule (Morse)', U: (x) => (1 - Math.exp(-x)) ** 2, a: -1, b: 5, ymax: 3.0 },
  hill: { n: 'Hills and valley', U: (x) => 0.9 * Math.sin(1.6 * x) + 0.12 * x * x, a: -4, b: 4, ymax: 3.4 },
};
export default function (host) {
  let L = 'well2', x = -1.6, v = 0, fr = 0, drg = false;
  const cv = canvas(host, { aspect: 0.72, max: 380, min: 270, label: 'A ball on a potential-energy curve with its energy line and force arrow' });
  const c1 = row(host), c2 = row(host);
  choice(c1, 'Landscape', Object.keys(LAND).map((k) => [k, LAND[k].n]), L, (k) => { L = k; x = k === 'morse' ? 3 : k === 'sho' ? 2 : -1.6; v = 0; cv.redraw(); });
  choice(c2, 'Friction', [[0, 'Off'], [0.4, 'On']], fr, (k) => { fr = k; });
  const sk = slider(c2, { label: 'Push (extra speed)', min: -3, max: 3, step: 0.1, value: 0, fmt: (a) => a.toFixed(1), oninput: (a) => { v = a; } });
  const anim = loop(host, (dt) => { if (!drg) { const n = 10, h = Math.min(dt, 0.04) / n; for (let i = 0; i < n; i++) { v += (-dU(x) - fr * v) * h; x += v * h; } const S = LAND[L]; if (x < S.a) { x = S.a; v = Math.abs(v) * 0.5; } if (x > S.b) { x = S.b; v = -Math.abs(v) * 0.5; } } cv.redraw(); show(); });
  anim.button(c2);
  const out = readout(host);
  const dU = (z) => (LAND[L].U(z + 1e-4) - LAND[L].U(z - 1e-4)) / 2e-4;
  const X = (z) => 10 + ((z - LAND[L].a) / (LAND[L].b - LAND[L].a)) * (cv.w - 20), Y = (u) => cv.h - 24 - (Math.max(-0.1, u) + 0.1) / (LAND[L].ymax + 0.1) * (cv.h - 50);
  drag(cv, () => [[X(x), Y(LAND[L].U(x))]], (i, px) => { drg = true; x = LAND[L].a + ((px - 10) / (cv.w - 20)) * (LAND[L].b - LAND[L].a); v = 0; sk.set(0); setTimeout(() => { drg = false; }, 60); }, 22);
  function show() { const S = LAND[L], E = S.U(x) + 0.5 * v * v; out.innerHTML = `x = ${x.toFixed(2)}: U = ${S.U(x).toFixed(2)}, kinetic ½v² = ${(0.5 * v * v).toFixed(2)}, total E = <b>${E.toFixed(2)}</b>${fr ? ' (falling: friction turns it into heat)' : ' (constant)'}. Force −dU/dx = ${(-dU(x)).toFixed(2)} ${-dU(x) > 0.02 ? '(to the right)' : -dU(x) < -0.02 ? '(to the left)' : '(zero: an equilibrium)'}. Valley bottoms are stable equilibria, hilltops unstable.`; }
  cv.draw = (ctx, w, h, col) => {
    const S = LAND[L], E = S.U(x) + 0.5 * v * v, pts = []; for (let i = 0; i <= 160; i++) { const z = S.a + ((S.b - S.a) * i) / 160; pts.push([X(z), Y(S.U(z))]); }
    ctx.beginPath(); ctx.moveTo(X(S.a), h - 24); pts.forEach((p) => ctx.lineTo(p[0], p[1])); ctx.lineTo(X(S.b), h - 24); ctx.fillStyle = col.soft; ctx.fill(); line(ctx, pts, col.ink, 2.5);
    ctx.save(); ctx.setLineDash([6, 4]); line(ctx, [[X(S.a), Y(E)], [X(S.b), Y(E)]], col.s[1], 2); ctx.restore(); text(ctx, 'E', X(S.b) - 6, Y(E) - 8, { color: col.s[1], size: 12, weight: 700, align: 'right' });
    for (let i = 1; i < 160; i++) { const z0 = S.a + ((S.b - S.a) * (i - 1)) / 160, z1 = S.a + ((S.b - S.a) * i) / 160; if ((S.U(z0) - E) * (S.U(z1) - E) < 0) { dot(ctx, X(z1), Y(E), 4, col.s[1], col.panel); } }
    const bx = X(x), by = Y(S.U(x)) - 8; dot(ctx, bx, by, 8, col.s[0], col.panel);
    const F = -dU(x); arrow(ctx, bx, by - 14, bx + F * 28, by - 14, col.bad, 3); text(ctx, 'F', bx + F * 28 + (F > 0 ? 8 : -8), by - 14, { color: col.bad, size: 12, weight: 700, align: 'center' });
    text(ctx, 'U(x)', 12, 14, { color: col.ink, size: 12, weight: 700 }); text(ctx, 'drag the ball', w - 8, h - 8, { color: col.muted, size: 10, align: 'right' });
    text(ctx, 'dots: turning points (U = E)', 8, h - 8, { color: col.muted, size: 10 });
  };
  show();
}
