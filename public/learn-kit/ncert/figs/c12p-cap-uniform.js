// Class 12 Electrostatic Potential and Capacitance: potential difference in a uniform field. Between two oppositely charged plates E is uniform, so the potential
// falls by the same amount for each centimetre: V = E d (the equipotentials are planes spaced evenly and perpendicular to E). Moving a charge from A to B takes work q(V_A - V_B)
// whichever path is used; a detour adds nothing because sideways steps along an equipotential cost no work.
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let E = 400, x = 6, detour = 'direct';
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 280, label: 'Equipotential planes between charged plates with a test charge moving from A to B' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'field E (V/m)', min: 100, max: 1000, step: 100, value: E, fmt: (v) => v.toFixed(0), oninput: (v) => { E = v; go(); } });
  slider(ctl, { label: 'B is x cm from A along the field', min: 1, max: 10, step: 1, value: x, fmt: (v) => v.toFixed(0), oninput: (v) => { x = v; go(); } });
  choice(ctl, 'Path', [['direct', 'Straight'], ['detour', 'Detour']], detour, (v) => { detour = v; go(); });
  const go = () => { const dv = E * x / 100; ro.textContent = `ΔV = E × x = ${E} × ${x / 100} m = ${dv.toFixed(1)} V.  Work on +1 µC from A to B against the field = ${(dv).toFixed(1)} µJ (same for either path).`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'V falls evenly along the field: ΔV = E d', col) + 8, L = 40, R = w - 20, T = top, B = h - 18, sx = (R - L) / 10;
    ctx.fillStyle = col.s[2]; ctx.fillRect(L - 6, T, 6, B - T); ctx.fillStyle = col.s[0]; ctx.fillRect(R, T, 6, B - T);
    text(ctx, '+', L - 3, T - 6, { color: col.s[2], size: 14, weight: 700, align: 'center' }); text(ctx, '−', R + 3, T - 6, { color: col.s[0], size: 14, weight: 700, align: 'center' });
    for (let i = 0; i <= 10; i++) { const xx = L + i * sx; line(ctx, [[xx, T], [xx, B]], col.line, i % 5 === 0 ? 1.5 : 1, [4, 3]); if (i % 2 === 0) text(ctx, (E * (10 - i) / 100 * 0 + (10 - i) * E / 100).toFixed(0) + ' V', xx, B + 10, { color: col.muted, size: 9.5, align: 'center' }); }
    for (let k = 1; k <= 4; k++) { const y = T + k * (B - T) / 5; arrow(ctx, L + 6, y, R - 6, y, col.muted, 1.3, 6); }
    const ay = (T + B) / 2, ax = L + 0 * sx, bx = L + x * sx;
    const path = detour === 'direct' ? [[ax, ay], [bx, ay]] : [[ax, ay], [ax, ay - 50], [ax + (bx - ax) * 0.5, ay - 50], [ax + (bx - ax) * 0.5, ay + 40], [bx, ay + 40], [bx, ay]];
    line(ctx, path, col.s[3], 3);
    dot(ctx, ax, ay, 7, col.s[2], col.panel); dot(ctx, bx, ay, 7, col.s[0], col.panel);
    text(ctx, 'A', ax - 11, ay - 12, { color: col.ink, size: 13, weight: 700, align: 'center' }); text(ctx, 'B', bx + 11, ay - 12, { color: col.ink, size: 13, weight: 700, align: 'center' });
    text(ctx, 'E →', L + 12, T + 12, { color: col.muted, size: 12, weight: 700 });
  };
  go();
}
