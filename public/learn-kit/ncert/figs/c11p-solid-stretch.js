// Class 11 Mechanical Properties of Solids: a wire stretched by a hanging load. stress = F/A, strain = dL/L, Young's modulus Y = stress/strain, so dL = F L / (A Y).
// The drawn stretch is exaggerated (the real strain is about 1e-4 to 1e-3) so you can see it; the readout gives the true numbers. Y values are typical handbook values.
import { canvas, text, title, line, arrow, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  const MAT = { steel: ['steel', 200e9], copper: ['copper', 110e9], alum: ['aluminium', 70e9], lead: ['lead', 16e9] };
  let mat = 'steel', M = 40, L = 2, d = 1;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 300, label: 'A wire stretched by a hanging mass, showing stress, strain and extension' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Material', Object.entries(MAT).map(([k, v]) => [k, v[0]]), mat, (v) => { mat = v; go(); });
  slider(ctl, { label: 'load (kg)', min: 5, max: 150, step: 5, value: M, fmt: (v) => v + ' kg', oninput: (v) => { M = v; go(); } });
  slider(ctl, { label: 'length L (m)', min: 1, max: 4, step: 0.5, value: L, fmt: (v) => v + ' m', oninput: (v) => { L = v; go(); } });
  slider(ctl, { label: 'diameter (mm)', min: 0.5, max: 3, step: 0.1, value: d, fmt: (v) => v.toFixed(1) + ' mm', oninput: (v) => { d = v; go(); } });
  const calc = () => { const F = M * 9.8, A = Math.PI * (d / 2000) ** 2, Y = MAT[mat][1], stress = F / A, strain = stress / Y; return { F, A, Y, stress, strain, dL: strain * L }; };
  const go = () => { const c = calc(); ro.textContent = `F = ${c.F.toFixed(0)} N, stress = ${(c.stress / 1e6).toPrecision(3)} MPa, strain = ${c.strain.toExponential(2)}, extension = ${(c.dL * 1000).toPrecision(3)} mm.${c.stress > 250e6 && mat !== 'lead' ? ' Beyond about 250 MPa a real steel or copper wire would stop being elastic.' : ''}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `Wire of ${MAT[mat][0]}: ΔL = F L / (A Y)`, col) + 14, c = calc(), cx = w * 0.36, y0 = top + 8;
    const Lpx = (h - top - 110) * (0.35 + 0.65 * L / 4), ext = Math.min(60, c.strain * 4000 * Lpx / 100);
    ctx.fillStyle = col.line; ctx.fillRect(cx - 50, y0 - 8, 100, 8);
    for (let i = 0; i < 10; i++) line(ctx, [[cx - 50 + i * 11, y0], [cx - 40 + i * 11, y0 - 8]], col.muted, 1);
    line(ctx, [[cx, y0], [cx, y0 + Lpx]], col.muted, 1.5, [3, 3]);
    line(ctx, [[cx, y0], [cx, y0 + Lpx + ext]], col.s[0], 1 + d * 1.2);
    const by = y0 + Lpx + ext, bw = 34 + M * 0.2;
    ctx.fillStyle = col.s[3]; ctx.fillRect(cx - bw / 2, by, bw, 14 + M * 0.15); text(ctx, M + ' kg', cx, by + 7 + M * 0.075, { color: col.panel, size: 11, weight: 700, align: 'center' });
    arrow(ctx, cx - 40, y0 + Lpx + 4, cx - 40, y0 + Lpx + ext + 4, col.s[2], 2.5, 6);
    text(ctx, 'ΔL (drawn bigger)', cx - 46, y0 + Lpx / 2 + ext / 2, { color: col.s[2], size: 10.5, weight: 700, align: 'right' });
    arrow(ctx, cx + 30, by + 4, cx + 30, by + 34, col.s[1], 2.5, 6); text(ctx, 'F = mg', cx + 36, by + 34, { color: col.s[1], size: 11, weight: 700 });
    const x = w * 0.62, tx = (s, i, b) => text(ctx, s, x, top + 18 + i * 22, { color: b || col.ink, size: 11.5, weight: b ? 700 : 400 });
    tx('stress = F/A', 0); tx((c.stress / 1e6).toPrecision(3) + ' MPa', 1, col.s[3]); tx('strain = ΔL/L', 2); tx(c.strain.toExponential(1), 3, col.s[0]); tx('Y = ' + (c.Y / 1e9) + ' GPa', 4, col.s[4]); tx('ΔL = ' + (c.dL * 1000).toPrecision(2) + ' mm', 5, col.s[2]);
  };
  go();
}
