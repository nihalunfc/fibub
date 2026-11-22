// Why a wire obeys Hooke's law: a block of atoms joined by springs. Drag the stress slider and every row of atoms
// moves apart a little (strain is drawn exaggerated 60 times), so the whole wire stretches by e = stress / E. Pick a
// material to see that a stiffer one (bigger Young's modulus E) stretches less; past the elastic limit it stops being
// a straight line and the stretch stays when you let go.
import { canvas, axes, line, dot, text, title, arrow, row, slider, choice, readout } from '../kit.js';

const MAT = { steel: ['Steel', 200, 250], copper: ['Copper', 120, 70], alu: ['Aluminium', 70, 150], glass: ['Glass fibre', 85, 300] };
const EXAG = 60, L0 = 2, AREA = 1, A0 = 0.25; // wire 2 m long, 1 mm², atom spacing 0.25 nm
export default function (host) {
  let mat = 'steel', s = 100;
  const cv = canvas(host, { aspect: 0.88, max: 420, min: 300, label: 'A lattice of atoms and springs stretching under stress, with its stress-strain line' });
  const ctl = row(host);
  choice(ctl, 'Material', Object.entries(MAT).map(([k, v]) => [k, v[0]]), mat, (v) => { mat = v; upd(); });
  slider(ctl, { label: 'Stress', min: 0, max: 320, step: 5, value: s, fmt: (v) => `${v} MPa`, oninput: (v) => { s = v; upd(); } });
  const out = readout(host);
  const upd = () => {
    const [name, E, Y] = MAT[mat], e = Math.min(s, Y) / (E * 1000), past = s > Y;
    out.innerHTML = `<b>${name}</b>: E = ${E} GPa. Stress ${s} MPa (force ${s * AREA} N on a 1 mm² wire) gives strain e = σ/E = <b>${(e * 100).toFixed(3)} %</b>, so the ${L0} m wire stretches by <b>${(e * L0 * 1000).toFixed(2)} mm</b>. Each atomic "spring" has stiffness k = E·a = ${(E * 1e9 * A0 * 1e-9).toFixed(0)} N/m (a = 0.25 nm).${past ? ' <b>Past the elastic limit: Hooke\'s law no longer holds and part of the stretch is permanent.</b>' : ''}`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const [name, E, Y] = MAT[mat], e = Math.min(s, Y) / (E * 1000), past = s > Y;
    title(ctx, `${name}: stress ${s} MPa`, col);
    const cols = 5, rows = 6, top = 56, ax = w * 0.3, dx0 = Math.min(34, w * 0.09), dy0 = 24;
    const dy = dy0 * (1 + e * EXAG), dx = dx0 * (1 - 0.3 * e * EXAG * 0.5);
    const P = (i, j) => [ax + (i - (cols - 1) / 2) * dx, top + j * dy];
    ctx.save(); ctx.strokeStyle = col.muted; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(ax - 2.5 * dx0 - 10, top - 8); ctx.lineTo(ax + 2.5 * dx0 + 10, top - 8); ctx.stroke(); ctx.restore();
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const [x, y] = P(i, j);
      if (i < cols - 1) line(ctx, [[x, y], P(i + 1, j)], col.line, 1.5);
      if (j < rows - 1) line(ctx, [[x, y], P(i, j + 1)], past ? col.bad : col.s[1], 1.5 + e * 200);
    }
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const [x, y] = P(i, j); dot(ctx, x, y, 5, col.s[0]); }
    const yb = top + (rows - 1) * dy;
    ctx.fillStyle = col.ink; ctx.fillRect(ax - 22, yb + 14, 44, 16);
    arrow(ctx, ax, yb + 30, ax, yb + 30 + Math.min(50, 8 + s * 0.14), col.bad, 3);
    text(ctx, 'load', ax + 28, yb + 22, { color: col.muted, size: 11 });
    text(ctx, `spacing ×${(1 + e).toFixed(4)}; drawn ×${EXAG}`, ax - 2.5 * dx0, top - 22, { color: col.muted, size: 10 });
    // stress-strain inset
    const gx = w * 0.56, gw = w - gx - 8, gy = 46, gh = h * 0.42;
    ctx.save(); ctx.translate(gx, gy);
    const A = axes(ctx, gw, gh, col, { x: [0, 0.6], y: [0, 320], l: 36, r: 6, t: 6, b: 28, xlabel: 'strain (%)', ylabel: 'σ (MPa)', fx: (v) => v.toFixed(1), xt: [0, 0.3, 0.6], yt: [0, 160, 320] });
    line(ctx, [[A.X(0), A.Y(0)], [A.X(Math.min(Y, 320) / (E * 10)), A.Y(Math.min(Y, 320))]], col.s[0], 2.5);
    line(ctx, [[A.X(Y / (E * 10)), A.Y(Y)], [A.X(Math.min(0.6, 320 / (E * 10))), A.Y(320)]], col.bad, 2, [4, 3]);
    dot(ctx, A.X(Math.min(0.6, s / (E * 10))), A.Y(s), 5.5, col.s[3], col.panel);
    ctx.restore();
    text(ctx, 'slope = E', gx + gw * 0.5, gy + gh + 4, { color: col.muted, size: 10 });
  };
  upd();
}
