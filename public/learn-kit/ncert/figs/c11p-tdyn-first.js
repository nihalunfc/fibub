// Class 11 Thermodynamics: the first law dQ = dU + dW as an energy account. Gas in a cylinder: heat Q in, work W done BY the gas on the piston, change of internal energy dU = Q - W (it shows as faster molecules, higher temperature).
// Three situations: (1) piston locked, heat added: W = 0, dU = Q. (2) piston free at constant pressure, monatomic gas: dU = (3/5) Q, W = (2/5) Q. (3) insulated, piston pushed in: Q = 0, dU = -W (work done on the gas heats it).
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let mode = 'lock', s = 60, t = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 310, label: 'A gas in a cylinder with heat in, work out and change in internal energy shown as bars' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Set-up', [['lock', 'piston locked'], ['free', 'free piston'], ['ins', 'insulated, push']], mode, (v) => { mode = v; go(); });
  slider(ctl, { label: 'energy supplied (J)', min: -100, max: 100, step: 10, value: s, fmt: (v) => v + ' J', oninput: (v) => { s = v; go(); } });
  const calc = () => mode === 'lock' ? { Q: s, W: 0 } : mode === 'free' ? { Q: s, W: 0.4 * s } : { Q: 0, W: -s };
  const go = () => { const c = calc(); ro.textContent = `Q = ${c.Q} J in, W = ${c.W.toFixed(0)} J done by the gas, so ΔU = Q − W = ${(c.Q - c.W).toFixed(0)} J. ${c.Q - c.W > 0 ? 'The molecules speed up: it gets hotter.' : c.Q - c.W < 0 ? 'The molecules slow down: it cools.' : 'No change in internal energy.'}`; cv.redraw(); };
  const pts = Array.from({ length: 14 }, (_, i) => ({ x: (i * 0.37) % 1, y: (i * 0.61) % 1, a: i * 0.9 + 0.3 }));
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const tri = (u) => { u = ((u % 2) + 2) % 2; return u > 1 ? 2 - u : u; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'First law: Q = ΔU + W', col) + 6, c = calc(), dU = c.Q - c.W, cx0 = 24, cw = w * 0.4, cy1 = top + (h - top) * 0.62, ph = (mode === 'lock' ? 0 : mode === 'free' ? c.W * 0.6 : c.W * 0.6), pistonY = top + 40 - Math.max(-28, Math.min(28, -ph)) * 0.5 + 0;
    const py = top + 54 + Math.max(-26, Math.min(26, -c.W * 0.5)) * 1;
    line(ctx, [[cx0, top + 16], [cx0, cy1], [cx0 + cw, cy1], [cx0 + cw, top + 16]], col.ink, 3);
    ctx.fillStyle = col.s[2]; ctx.fillRect(cx0 + 2, py, cw - 4, 10); if (mode === 'lock') { line(ctx, [[cx0 - 4, py + 5], [cx0 + 2, py + 5]], col.bad, 4); line(ctx, [[cx0 + cw - 2, py + 5], [cx0 + cw + 4, py + 5]], col.bad, 4); }
    const sp = Math.sqrt(Math.max(0.15, 1 + dU / 120)), sc = (v) => Math.max(0.1, v);
    pts.forEach((q, i) => { const x = cx0 + 8 + tri(q.x * 2 + t * 0.55 * sp * Math.cos(q.a)) * (cw - 16), y = py + 18 + tri(q.y * 2 + t * 0.55 * sp * Math.sin(q.a + 1)) * (cy1 - py - 26); dot(ctx, x, y, 3.2, col.s[0]); });
    text(ctx, 'gas', cx0 + cw * 0.22, cy1 + 14, { color: col.ink, size: 11, weight: 700, align: 'center' });
    if (c.Q) { const ax = cx0 + cw * 0.7; c.Q > 0 ? arrow(ctx, ax, cy1 + 36, ax, cy1 + 4, col.s[1], 3, 7) : arrow(ctx, ax, cy1 + 4, ax, cy1 + 36, col.s[1], 3, 7); text(ctx, c.Q > 0 ? 'heat in' : 'heat out', ax + 8, cy1 + 24, { color: col.s[1], size: 10.5, weight: 700 }); }
    const bx = w * 0.58, bw = w * 0.11, mid = top + (cy1 - top) / 2 + 20, sc2 = (cy1 - top) / 2 / 120;
    line(ctx, [[bx - 10, mid], [w - 10, mid]], col.muted, 1);
    [['Q in', c.Q, col.s[1]], ['W out', c.W, col.s[2]], ['ΔU', dU, col.s[3]]].forEach(([n, v, cl], i) => { const x = bx + i * (bw + 8), hh = v * sc2; ctx.fillStyle = cl; ctx.fillRect(x, hh >= 0 ? mid - hh : mid, bw, Math.abs(hh)); text(ctx, n, x + bw / 2, cy1 + 14, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); text(ctx, v.toFixed(0), x + bw / 2, (hh >= 0 ? mid - hh - 9 : mid - hh + 10), { color: col.ink, size: 10.5, weight: 700, align: 'center' }); });
    text(ctx, 'positive Q: heat IN.  positive W: gas pushes OUT.', w / 2, h - 16, { color: col.muted, size: 10.5, align: 'center' });
  };
  go();
}
