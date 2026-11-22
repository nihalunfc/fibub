// Phase portraits you can poke. Pick a system, then drag the round handle to any starting point (position x across,
// velocity v up): the curve is the motion from there and the arrows show the flow. Pendulum: closed loops (swinging),
// wavy lines (rotating) and the separatrix between them. Damped: spirals into the rest point. Van der Pol: every
// start ends on the same limit cycle. Double well: loops inside either well or around both.
import { canvas, text, row, choice, readout, loop, button, line, dot, arrow } from '../kit.js';
import { drag } from './_mech.js';

const SYS = {
  pend: { n: 'Pendulum', f: (x, v) => [v, -Math.sin(x)], box: [-6.3, 6.3, -3, 3], fp: [[0, 0, 'stable'], [Math.PI, 0, 'saddle'], [-Math.PI, 0, 'saddle']], note: 'Energy is conserved, so every path is a level curve of ½v² − cos x. The path through the saddle points is the separatrix.' },
  damp: { n: 'Damped pendulum', f: (x, v) => [v, -Math.sin(x) - 0.3 * v], box: [-6.3, 6.3, -3, 3], fp: [[0, 0, 'stable'], [Math.PI, 0, 'saddle'], [-Math.PI, 0, 'saddle'], [2 * Math.PI, 0, 'stable'], [-2 * Math.PI, 0, 'stable']], note: 'Friction removes energy, so the loops tighten into a spiral that ends at a rest point (x = 0, ±2π, … are the same hanging position).' },
  vdp: { n: 'Van der Pol', f: (x, v) => [v, 1.2 * (1 - x * x) * v - x], box: [-4, 4, -4, 4], fp: [[0, 0, 'unstable']], note: 'Small oscillations grow, large ones shrink: every start approaches the same closed curve, a limit cycle.' },
  duff: { n: 'Double well', f: (x, v) => [v, x - x * x * x], box: [-2.2, 2.2, -1.6, 1.6], fp: [[0, 0, 'saddle'], [1, 0, 'stable'], [-1, 0, 'stable']], note: 'U = x⁴/4 − x²/2: two wells. Low energy: stuck in one well; higher: loops around both.' },
};
export default function (host) {
  let sys = 'pend', x0 = [1.2, 0.5], tr = [], head = 0;
  const cv = canvas(host, { aspect: 0.75, max: 400, min: 280, label: 'A phase portrait with a draggable starting point and the path from it' });
  const c1 = row(host);
  choice(c1, 'System', Object.keys(SYS).map((k) => [k, SYS[k].n]), sys, (v) => { sys = v; x0 = v === 'pend' || v === 'damp' ? [1.2, 0.5] : v === 'vdp' ? [0.5, 0] : [0.3, 0.4]; run(); });
  const anim = loop(host, (dt) => { head = Math.min(tr.length - 1, head + Math.round(dt * 240)); if (head >= tr.length - 1 && tr.length) head = 0; cv.redraw(); });
  anim.button(c1);
  const out = readout(host);
  const bx = () => SYS[sys].box;
  const sc = () => { const [a, b, c, d] = bx(); return [(cv.w - 16) / (b - a), (cv.h - 16) / (d - c)]; };
  const sx = (x) => 8 + (x - bx()[0]) * sc()[0], sy = (v) => cv.h - 8 - (v - bx()[2]) * sc()[1];
  drag(cv, () => [[sx(x0[0]), sy(x0[1])]], (i, px, py) => { const [a, b, c, d] = bx(); x0 = [a + ((px - 8) / (cv.w - 16)) * (b - a), c + ((cv.h - 8 - py) / (cv.h - 16)) * (d - c)]; run(true); });
  function run(keep) {
    const f = SYS[sys].f; let s = [x0[0], x0[1]]; tr = [s.slice()];
    const h = 0.02;
    for (let i = 0; i < 1800; i++) { const k1 = f(...s), k2 = f(s[0] + (h / 2) * k1[0], s[1] + (h / 2) * k1[1]), k3 = f(s[0] + (h / 2) * k2[0], s[1] + (h / 2) * k2[1]), k4 = f(s[0] + h * k3[0], s[1] + h * k3[1]); s = [s[0] + (h / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]), s[1] + (h / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1])]; tr.push(s); if (Math.abs(s[0]) > 40) break; }
    if (!keep) head = 0;
    const E = sys === 'pend' || sys === 'damp' ? 0.5 * x0[1] ** 2 - Math.cos(x0[0]) : 0.5 * x0[1] ** 2 + (x0[0] ** 4 / 4 - x0[0] ** 2 / 2);
    out.innerHTML = `Start: x = ${x0[0].toFixed(2)}, v = ${x0[1].toFixed(2)}` + (sys !== 'vdp' ? `, energy E = ${E.toFixed(2)}` + (sys === 'pend' ? (E < 1 ? ' (< 1: swings back and forth)' : E > 1.005 ? ' (> 1: goes right round)' : ' (= 1: on the separatrix, takes forever to reach the top)') : '') : '') + `. ${SYS[sys].note}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const [a, b, c, d] = bx(), f = SYS[sys].f;
    line(ctx, [[sx(a), sy(0)], [sx(b), sy(0)]], col.line, 1); line(ctx, [[sx(0), sy(c)], [sx(0), sy(d)]], col.line, 1);
    for (let i = 1; i < 14; i++) for (let j = 1; j < 9; j++) { const x = a + ((b - a) * i) / 14, v = c + ((d - c) * j) / 9, q = f(x, v), px = q[0] * sc()[0], py = -q[1] * sc()[1], m = Math.hypot(px, py) || 1, L = 9; arrow(ctx, sx(x) - (px / m) * L / 2, sy(v) - (py / m) * L / 2, sx(x) + (px / m) * L / 2, sy(v) + (py / m) * L / 2, col.line, 1.3, 4); }
    if (sys === 'pend') { const s = []; for (let x = -Math.PI * 2; x <= Math.PI * 2; x += 0.05) { s.push([sx(x), sy(Math.sqrt(2 + 2 * Math.cos(x)))]); } ctx.save(); ctx.setLineDash([5, 4]); line(ctx, s, col.s[1], 1.5); line(ctx, s.map(([X, Y]) => [X, sy(0) * 2 - Y]), col.s[1], 1.5); ctx.restore(); }
    SYS[sys].fp.forEach(([x, v, k]) => { ctx.beginPath(); ctx.arc(sx(x), sy(v), 4, 0, 7); if (k === 'stable') { ctx.fillStyle = col.s[2]; ctx.fill(); } else { ctx.strokeStyle = col.bad; ctx.lineWidth = 2; ctx.stroke(); } });
    line(ctx, tr.map((q) => [sx(q[0]), sy(q[1])]), col.s[0], 1.8);
    if (tr[head]) dot(ctx, sx(tr[head][0]), sy(tr[head][1]), 5, col.s[0], col.panel);
    dot(ctx, sx(x0[0]), sy(x0[1]), 8, col.bad, col.panel);
    text(ctx, 'x →', w - 10, sy(0) - 8, { color: col.muted, size: 10, align: 'right' }); text(ctx, 'v ↑', sx(0) + 6, 12, { color: col.muted, size: 10 });
    text(ctx, 'filled = stable, ring = unstable, dashed = separatrix', 8, h - 6, { color: col.muted, size: 9, fit: true });
  };
  run();
}
