// Class 12 Maths, Linear Programming: the corner point theorem. Z = p x + q y is a family of parallel lines. Slide Z up (or press Slide) and the line sweeps across the
// feasible region; the last point it touches is a corner, so the maximum (or minimum) of Z is always at a corner point. Change p and q to tilt the lines and the best corner moves.
import { canvas, text, title, axes, line, row, slider, button, choice, readout, loop } from '../../kit.js';
import { shade, lineFull, corners, AX, mark } from '../c12m-lp.js';

export default function (host) {
  const C = [...AX, { a: 1, b: 1, c: 8, ge: false }, { a: 1, b: 3, c: 18, ge: false }, { a: 3, b: 1, c: 18, ge: false }];
  const cs = corners(C); let p = 4, q = 3, Z = 0, goal = 'max', play = false;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'A feasible region with the line Z = px + qy sliding across it to the best corner' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'p (profit on x)', min: 0, max: 8, step: 1, value: p, fmt: (v) => String(v), oninput: (v) => { p = v; fit(); } });
  slider(ctl, { label: 'q (profit on y)', min: 0, max: 8, step: 1, value: q, fmt: (v) => String(v), oninput: (v) => { q = v; fit(); } });
  const zs = slider(ctl, { label: 'Z', min: 0, max: 60, step: 0.5, value: Z, fmt: (v) => v.toFixed(1), oninput: (v) => { Z = v; play = false; go(); } });
  choice(ctl, 'find the', [['max', 'largest Z'], ['min', 'smallest Z']], goal, (v) => { goal = v; Z = v === 'min' ? zmax() : 0; zs.set(Z); go(); });
  button(ctl, 'Slide to the optimum', () => { Z = goal === 'max' ? 0 : zmax(); play = true; });
  const vals = () => cs.map((c) => p * c[0] + q * c[1]);
  const zmax = () => Math.max(...vals()), zmin = () => Math.min(...vals());
  const fit = () => { Z = Math.min(Z, 60); zs.set(Z); go(); };
  loop(host, (dt) => { if (!play) return; const tgt = goal === 'max' ? zmax() : zmin(), dir = Math.sign(tgt - Z) || 1; Z += dir * Math.max(8 * dt * (1 + zmax() / 30), 0.001); if ((dir > 0 && Z >= tgt) || (dir < 0 && Z <= tgt)) { Z = tgt; play = false; } zs.set(Z); go(); });
  const best = () => { const v = vals(), t = goal === 'max' ? zmax() : zmin(); return cs.filter((c, i) => Math.abs(v[i] - t) < 1e-9); };
  const go = () => {
    const v = vals(), t = goal === 'max' ? zmax() : zmin(), b = best();
    ro.textContent = `Z = ${p}x + ${q}y at the corners: ${cs.map((c, i) => `(${+c[0].toFixed(1)}, ${+c[1].toFixed(1)}) → ${+v[i].toFixed(1)}`).join(';  ')}.  The ${goal === 'max' ? 'largest' : 'smallest'} is ${+t.toFixed(1)}${b.length > 1 ? ' (a tie: every point on the edge between the two corners is also best)' : ' at ' + `(${+b[0][0].toFixed(1)}, ${+b[0][1].toFixed(1)})`}.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Slide the line Z = px + qy: it ends at a corner', col);
    const G = axes(ctx, w, h, col, { x: [0, 10], y: [0, 10], xlabel: 'x', ylabel: 'y', l: 34, t: top + 8, b: 34, xt: [0, 2, 4, 6, 8, 10], yt: [0, 2, 4, 6, 8, 10] });
    ctx.save(); G.clip(); shade(ctx, G, C, col.s[0], 0.28);
    if (p || q) lineFull(ctx, G, p, q, Z, col.s[3], 3);
    ctx.restore();
    const bs = best();
    if (p || q) cs.forEach((c) => { const isB = bs.includes(c); mark(ctx, G, c[0], c[1], isB ? col.s[3] : col.ink, col.panel, isB ? `best ${+(p * c[0] + q * c[1]).toFixed(1)}` : '', 8, -10); });
    void line;
  };
  go();
}
