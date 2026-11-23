// Class 8 Forces: a tug of war. Two forces on a rope act along the same line; the net force is their difference
// (the bigger side wins) and the rope moves toward it. Equal forces are balanced: no change in motion.
import { canvas, text, title, dot, line, arrow, row, slider, button, loop, readout, clamp } from '../../kit.js';

export default function (host) {
  let L = 300, R = 200, x = 0, v = 0;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 270, label: 'A tug of war with a flag on the rope that moves toward the stronger team' });
  loop(host, (dt) => {
    const net = R - L; v += (net / 400) * dt * 1.2; v *= 0.985; x = clamp(x + v * dt, -0.42, 0.42);
    if (Math.abs(x) >= 0.42) v = 0; cv.redraw();
  });
  const ctl = row(host);
  slider(ctl, { label: 'Left team pulls', min: 0, max: 500, step: 50, value: L, fmt: (z) => `${z} N`, oninput: (z) => { L = z; upd(); } });
  slider(ctl, { label: 'Right team pulls', min: 0, max: 500, step: 50, value: R, fmt: (z) => `${z} N`, oninput: (z) => { R = z; upd(); } });
  button(ctl, 'Reset rope', () => { x = 0; v = 0; cv.redraw(); });
  const out = readout(host);
  function upd() {
    const net = R - L;
    out.innerHTML = net === 0 ? 'Forces are <b>balanced</b>: net force 0 N, so the rope keeps its state of motion.' : `Net force = ${Math.max(L, R)} − ${Math.min(L, R)} = <b>${Math.abs(net)} N</b> toward the ${net > 0 ? 'right' : 'left'} team: <b>unbalanced</b>, so the rope speeds up that way.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Balanced and unbalanced forces', col);
    const cy = h * 0.42, mid = w / 2 + x * w;
    line(ctx, [[10, cy + 34], [w - 10, cy + 34]], col.line, 2);
    line(ctx, [[w / 2, cy - 30], [w / 2, cy + 34]], col.muted, 1.2, [4, 4]);
    line(ctx, [[22, cy], [w - 22, cy]], col.ink, 3);
    dot(ctx, mid, cy, 7, col.s[3]);
    text(ctx, 'flag', mid, cy - 16, { color: col.s[3], size: 10.5, weight: 700, align: 'center' });
    [[1, 0, col.s[2], 'Left'], [-1, 1, col.s[1], 'Right']].forEach(([d, side, c, nm]) => {
      const px = side ? w - 30 : 30;
      [-1, 0, 1].forEach((k) => { const sx = px + (side ? -1 : 1) * k * 15; dot(ctx, sx, cy + 8, 6, c); line(ctx, [[sx, cy + 14], [sx, cy + 34]], c, 3); });
      text(ctx, nm, px, cy + 52, { color: c, size: 11, weight: 700, align: 'center' });
    });
    const sc = (w / 2 - 50) / 500;
    if (L > 0) arrow(ctx, w / 2 - 6, h * 0.78, w / 2 - 6 - L * sc * 0.9, h * 0.78, col.s[2], 4, 9);
    if (R > 0) arrow(ctx, w / 2 + 6, h * 0.78, w / 2 + 6 + R * sc * 0.9, h * 0.78, col.s[1], 4, 9);
    text(ctx, `${L} N`, 14, h * 0.78 - 14, { color: col.s[2], size: 11, weight: 700 });
    text(ctx, `${R} N`, w - 14, h * 0.78 - 14, { color: col.s[1], size: 11, weight: 700, align: 'right' });
    const net = R - L;
    text(ctx, net === 0 ? 'net force 0 N' : `net force ${Math.abs(net)} N ${net > 0 ? '→' : '←'}`, w / 2, h - 14, { color: net === 0 ? col.good : col.s[3], size: 12, weight: 700, align: 'center' });
  };
  upd();
}
