// Class 12 Moving Charges: the force between two long parallel currents, F/L = μ0 I1 I2 / 2πd.
// Wire 1 makes a field at wire 2 (crosses or dots); that field pushes on I2. Currents the same way attract, opposite ways repel.
// 1 A in each of two wires 1 m apart gives 2×10⁻⁷ N per metre: this is how the ampere is defined.
import { canvas, text, title, row, slider, choice, readout, arrow, line, dot, loop } from '../../kit.js';
import { into, outof, MU0, si } from '../c12p-mmlib.js';

export default function (host) {
  let I1 = 10, I2 = 10, d = 6, same = true, t = 0;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 270, label: 'Two parallel wires attracting or repelling' });
  const ctl = row(host);
  slider(ctl, { label: 'Current I₁', min: 1, max: 20, step: 1, value: I1, fmt: (x) => `${x} A`, oninput: (x) => { I1 = x; } });
  slider(ctl, { label: 'Current I₂', min: 1, max: 20, step: 1, value: I2, fmt: (x) => `${x} A`, oninput: (x) => { I2 = x; } });
  slider(ctl, { label: 'Distance d', min: 1, max: 20, step: 1, value: d, fmt: (x) => `${x} cm`, oninput: (x) => { d = x; } });
  choice(ctl, 'I₂ flows', [[true, 'Same way as I₁'], [false, 'Opposite way']], same, (x) => { same = x; });
  const out = readout(host);
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Same direction attract, opposite repel', col);
    const cy = (top + h) / 2 + 4, dp = 40 + d * 5, y1 = cy - dp / 2, y2 = cy + dp / 2, x0 = 26, x1 = w - 26;
    const F = (MU0 * I1 * I2) / (2 * Math.PI * (d / 100));
    line(ctx, [[x0, y1], [x1, y1]], col.ink, 4); line(ctx, [[x0, y2], [x1, y2]], col.ink, 4);
    const run = (y, dir, I, c) => { for (let k = 0; k < 7; k++) { const x = x0 + (((k / 7 + dir * t * 0.1 * (0.5 + I / 20)) % 1) + 1) % 1 * (x1 - x0); dot(ctx, x, y, 3.5, c); } arrow(ctx, x1 - 40, y - 12, x1 - 40 + dir * 26, y - 12, c, 2, 8); };
    run(y1, 1, I1, col.s[2]); run(y2, same ? 1 : -1, I2, col.s[3]);
    text(ctx, 'I₁', x0 + 4, y1 - 14, { color: col.s[2], size: 12, weight: 700 }); text(ctx, 'I₂', x0 + 4, y2 + 18, { color: col.s[3], size: 12, weight: 700 });
    for (let k = 1; k < 4; k++) into(ctx, x0 + (k * (x1 - x0)) / 4 - 8, y2 + 0, 6, col.s[0], 1.6);
    text(ctx, 'crosses: B₁ at wire 2', x0 + 6, y2 - 14, { color: col.s[0], size: 10.5 });
    const len = Math.max(14, Math.min(54, 14 + 8 * (Math.log10(F) + 6.5))), toward = same ? 1 : -1, xm = x0 + (x1 - x0) * 0.62, xm1 = x0 + (x1 - x0) * 0.42;
    arrow(ctx, xm, y2 - 4, xm, y2 - 4 - toward * len, col.s[1], 4, 11); arrow(ctx, xm1, y1 + 4, xm1, y1 + 4 + toward * len, col.s[1], 4, 11);
    text(ctx, 'F', xm + 12, y2 - 4 - toward * len / 2, { color: col.s[1], size: 13, weight: 700 }); text(ctx, 'F', xm1 + 12, y1 + 4 + toward * len / 2, { color: col.s[1], size: 13, weight: 700 });
    line(ctx, [[x1 - 14, y1], [x1 - 14, y2]], col.muted, 1); text(ctx, `d = ${d} cm`, x1 - 20, cy, { color: col.muted, size: 11, align: 'right' });
    out.innerHTML = `Force on each metre of wire: F/L = μ0 I₁ I₂ / 2πd = 2×10⁻⁷ × ${I1} × ${I2} ÷ ${(d / 100).toFixed(2)} = <b>${si(F, 'N')} per metre</b>, ${same ? 'attractive (the wires are pulled together)' : 'repulsive (the wires are pushed apart)'}. By Newton's third law the two forces are equal and opposite.`;
  };
  cv.redraw();
}
