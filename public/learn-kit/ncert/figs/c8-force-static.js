// Class 8 Forces: electrostatic force. Rubbing a comb (or balloon) charges it. A charged object attracts light
// uncharged paper bits through the force between charges, a non-contact force. When that pull is bigger than the
// weight of a bit, the bit jumps up. More rubbing gives more charge; bits at a larger distance feel less pull.
import { canvas, text, title, dot, line, arrow, row, slider, button, loop, readout, rng } from '../../kit.js';

export default function (host) {
  let rub = 0, ht = 0.5, t = 0;
  const R = rng(5), bits = Array.from({ length: 9 }, (_, i) => ({ x: (i + 0.5) / 9, w: 0.7 + R() * 0.6, y: 0, vy: 0 }));
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 270, label: 'A charged comb lifting small paper bits depending on charge and height' });
  loop(host, (dt) => {
    t += dt;
    bits.forEach((b) => { const pull = rub / 10 / (0.2 + ht * ht * 2) * 3.2, up = pull > b.w; if (up) { b.vy += (pull - b.w) * 3 * dt; } else b.vy -= 4 * dt; b.vy *= 0.92; b.y = Math.max(0, Math.min(ht, b.y + b.vy * dt)); if (b.y >= ht) b.vy = 0; });
    cv.redraw();
  });
  const ctl = row(host);
  slider(ctl, { label: 'Rubbing strokes', min: 0, max: 10, step: 1, value: rub, fmt: (z) => `${z}`, oninput: (z) => { rub = z; upd(); } });
  slider(ctl, { label: 'Comb height', min: 0.2, max: 0.8, step: 0.05, value: ht, fmt: (z) => `${Math.round(z * 10)} cm`, oninput: (z) => { ht = z; upd(); } });
  button(ctl, 'Drop all bits', () => { bits.forEach((b) => { b.y = 0; b.vy = 0; }); });
  const out = readout(host);
  function upd() { out.innerHTML = rub === 0 ? 'The comb is uncharged: no pull. Rub it!' : `Charge on comb: <b>${rub}</b> units. Closer comb, more charge: the pull beats the weight of more paper bits. The bits are never touched.`; }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Static charge pulls paper without touching', col);
    const gy = h - 40, top = gy - 30 - ht * (h - 130);
    ctx.fillStyle = col.line; ctx.fillRect(10, gy, w - 20, 8);
    ctx.fillStyle = rub ? col.s[1] : col.muted; ctx.fillRect(w * 0.15, top - 10, w * 0.7, 10);
    for (let i = 0; i < 14; i++) text(ctx, rub ? '−' : '', w * 0.17 + i * (w * 0.66 / 13), top - 5, { color: '#fff', size: 12, weight: 700, align: 'center' });
    bits.forEach((b) => { const bx = 20 + b.x * (w - 40), by = gy - 4 - b.y * (gy - top - 14) / ht * (ht === 0 ? 1 : 1); ctx.fillStyle = col.s[2]; ctx.fillRect(bx - 6, by - 3, 12, 5); });
    text(ctx, `${rub} rubs`, w - 14, h - 14, { color: col.s[1], size: 11, weight: 700, align: 'right' });
  };
  upd();
}
