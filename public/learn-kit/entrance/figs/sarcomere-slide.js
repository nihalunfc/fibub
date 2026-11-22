// Locomotion: the sliding filament theory in one sarcomere. Move the slider to contract: thin (actin) filaments,
// fixed to the Z lines, slide over the thick (myosin) filaments towards the M line. The A band keeps its length
// (it is the length of myosin, 1.6 µm); the I band and H zone shrink. Lengths are typical textbook values.
import { canvas, text, row, slider, readout, line } from '../../kit.js';

const MY = 1.6, AC = 1.0; // myosin length; actin length from each Z line (µm)
export default function (host) {
  let Ls = 2.5;
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 220, label: 'One sarcomere with actin and myosin filaments, contracting' });
  const ctl = row(host);
  slider(ctl, { label: 'Sarcomere length', min: 1.8, max: 2.8, step: 0.05, value: Ls, fmt: (v) => `${v.toFixed(2)} µm`, oninput: (v) => { Ls = v; cv.redraw(); show(); } });
  const out = readout(host);
  const bands = () => ({ A: MY, I: Math.max(0, Ls - MY), H: Math.max(0, Ls - 2 * AC) });
  const show = () => {
    const b = bands();
    out.innerHTML = `Sarcomere ${Ls.toFixed(2)} µm: <b>A band ${b.A.toFixed(2)} µm</b> (never changes), I band ${b.I.toFixed(2)} µm, H zone ${b.H.toFixed(2)} µm. ` +
      (b.H === 0 ? 'The H zone has vanished: the thin filaments meet (or overlap) at the M line. ' : '') +
      'Neither filament gets shorter; they slide past each other as myosin heads pull actin inward using ATP, after Ca²⁺ binds troponin.';
  };
  cv.draw = (ctx, w, h, col) => {
    const cx = w / 2, scale = Math.min((w - 40) / 3.0, 140), X = (um) => cx + um * scale, top = 40, bot = h - 56;
    const zl = -Ls / 2, zr = Ls / 2;
    // Z lines
    [zl, zr].forEach((z) => { line(ctx, [[X(z), top - 10], [X(z), bot + 10]], col.ink, 3); text(ctx, 'Z', X(z), top - 20, { color: col.ink, size: 12, weight: 700, align: 'center' }); });
    line(ctx, [[cx, top], [cx, bot]], col.muted, 1, [3, 3]);
    text(ctx, 'M', cx, top - 20, { color: col.muted, size: 12, weight: 700, align: 'center' });
    const rows = 4, gap = (bot - top) / rows;
    for (let r = 0; r < rows; r++) {
      const y = top + gap * (r + 0.5);
      // myosin (thick) with heads
      line(ctx, [[X(-MY / 2), y], [X(MY / 2), y]], col.s[0], 6);
      for (let u = -MY / 2 + 0.08; u < MY / 2; u += 0.12) if (Math.abs(u) > 0.1) { const d = u < 0 ? -1 : 1; line(ctx, [[X(u), y - 3], [X(u + d * 0.05), y - 9]], col.s[0], 1.5); }
      // actin (thin) from each Z line, above and below the myosin
      [-gap * 0.3, gap * 0.3].forEach((dy) => { line(ctx, [[X(zl), y + dy], [X(zl + AC), y + dy]], col.s[1], 2.5); line(ctx, [[X(zr), y + dy], [X(zr - AC), y + dy]], col.s[1], 2.5); });
    }
    // band brackets
    const b = bands(), by = bot + 22;
    const brk = (a, c, s, colr, yy) => { if (c - a < 1e-3) return; line(ctx, [[X(a), yy], [X(c), yy]], colr, 2); line(ctx, [[X(a), yy - 4], [X(a), yy + 4]], colr, 2); line(ctx, [[X(c), yy - 4], [X(c), yy + 4]], colr, 2); text(ctx, s, (X(a) + X(c)) / 2, yy + 12, { color: colr, size: 11, weight: 700, align: 'center' }); };
    brk(-MY / 2, MY / 2, `A band ${b.A.toFixed(1)}`, col.s[0], by);
    if (b.H > 0) brk(-b.H / 2, b.H / 2, 'H', col.ink, top - 4);
    brk(zl, -MY / 2, 'I/2', col.s[1], by - 14 > top ? bot + 6 : by);
    brk(MY / 2, zr, 'I/2', col.s[1], bot + 6);
  };
  cv.redraw(); show();
}
