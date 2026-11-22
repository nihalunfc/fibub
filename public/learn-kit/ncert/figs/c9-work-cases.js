// Class 9 Work and Energy: when is the work zero? Four everyday cases drawn with the force arrow and the
// displacement arrow. Work = F s cos(theta): it is zero when F = 0, when s = 0 (nothing moves) or when F is at 90 degrees
// to the motion (carrying a bag along a level path, a satellite in a circle). Pushing a cart along is positive work;
// braking is negative work (force against the motion).
import { canvas, text, title, line, arrow, dot, row, choice, readout, loop } from '../../kit.js';

const CASES = {
  push: { name: 'Pushing a cart along', W: 'positive', msg: 'Force and motion point the same way (θ = 0°, cos θ = 1): W = F s, positive. The force adds energy to the cart.' },
  wall: { name: 'Pushing a wall', W: 'zero', msg: 'You tire yourself out, but the wall does not move: s = 0, so W = F × 0 = 0. (Your muscles use chemical energy inside you, but no work is done on the wall.)' },
  bag: { name: 'Carrying a bag along', W: 'zero', msg: 'Your hand holds the bag up (force is upward) while it moves sideways: the angle is 90°, cos 90° = 0, so your hand does no work on the bag along the path.' },
  brake: { name: 'Braking a cycle', W: 'negative', msg: 'Friction from the brake points opposite to the motion (θ = 180°, cos θ = −1): W is negative. The cycle loses kinetic energy.' },
};
export default function (host) {
  let k = 'push', t = 0;
  const cv = canvas(host, { aspect: 0.6, max: 440, min: 280, label: 'Four cases showing force and displacement and whether the work is positive, zero or negative' });
  const ctl = row(host);
  choice(ctl, 'Case', Object.entries(CASES).map(([v, c]) => [v, c.name]), k, (v) => { k = v; upd(); });
  const out = readout(host);
  function upd() { const c = CASES[k]; out.innerHTML = `<b>Work is ${c.W}.</b> ${c.msg}`; cv.redraw(); }
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, CASES[k].name, col);
    const floor = h * 0.7, ph = (t * 0.25) % 1;
    line(ctx, [[8, floor], [w - 8, floor]], col.ink, 2);
    let bx = w * 0.3 + (k === 'wall' ? 0 : ph * w * 0.3), by = floor - 34;
    if (k === 'brake') bx = w * 0.3 + (1 - Math.pow(1 - ph, 2)) * w * 0.3;
    if (k === 'wall') { ctx.fillStyle = col.line; ctx.fillRect(w * 0.7, floor - 90, 18, 90); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(w * 0.7, floor - 90, 18, 90); bx = w * 0.7 - 52 + Math.sin(t * 20) * 0.8; }
    if (k === 'bag') {
      dot(ctx, bx + 14, floor - 76, 9, col.soft, col.ink); line(ctx, [[bx + 14, floor - 67], [bx + 14, floor - 30]], col.ink, 3); line(ctx, [[bx + 14, floor - 30], [bx + 4, floor]], col.ink, 3); line(ctx, [[bx + 14, floor - 30], [bx + 26, floor]], col.ink, 3);
      line(ctx, [[bx + 14, floor - 58], [bx + 34, floor - 44]], col.ink, 3); ctx.fillStyle = col.s[4]; ctx.fillRect(bx + 28, floor - 44, 18, 20); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(bx + 28, floor - 44, 18, 20);
      arrow(ctx, bx + 37, floor - 46, bx + 37, floor - 82, col.s[0], 3); text(ctx, 'F (up)', bx + 42, floor - 70, { color: col.s[0], size: 11, weight: 700 });
      arrow(ctx, bx + 52, floor - 14, bx + 100, floor - 14, col.s[2], 3); text(ctx, 'motion', bx + 100, floor - 24, { color: col.s[2], size: 11, weight: 700, align: 'center' });
      text(ctx, 'angle between F and motion = 90°', w / 2, h - 14, { color: col.muted, size: 11, align: 'center' });
      return;
    }
    ctx.fillStyle = col.soft; ctx.fillRect(bx, by, 56, 34); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(bx, by, 56, 34);
    ctx.beginPath(); ctx.arc(bx + 12, floor, 6, 0, 7); ctx.arc(bx + 44, floor, 6, 0, 7); ctx.fillStyle = col.ink; ctx.fill();
    if (k === 'push') { arrow(ctx, bx - 40, by + 17, bx - 2, by + 17, col.s[0], 3); text(ctx, 'F', bx - 22, by + 4, { color: col.s[0], size: 12, weight: 700, align: 'center' }); arrow(ctx, bx, by - 14, bx + 60, by - 14, col.s[2], 3); text(ctx, 's', bx + 30, by - 26, { color: col.s[2], size: 12, weight: 700, align: 'center' }); }
    if (k === 'wall') { arrow(ctx, bx + 12, by + 17, bx + 52, by + 17, col.s[0], 3); text(ctx, 'F', bx + 32, by + 4, { color: col.s[0], size: 12, weight: 700, align: 'center' }); text(ctx, 's = 0', bx + 28, by - 14, { color: col.s[2], size: 12, weight: 700, align: 'center' }); }
    if (k === 'brake') { arrow(ctx, bx + 28, by + 17, bx - 14, by + 17, col.s[0], 3); text(ctx, 'F (brake)', bx - 10, by + 4, { color: col.s[0], size: 11, weight: 700, align: 'center' }); arrow(ctx, bx, by - 14, bx + 60, by - 14, col.s[2], 3); text(ctx, 'motion', bx + 30, by - 26, { color: col.s[2], size: 11, weight: 700, align: 'center' }); }
    const sign = CASES[k].W === 'positive' ? '+' : CASES[k].W === 'negative' ? '−' : '0';
    text(ctx, `W = ${sign === '0' ? '0' : sign + ' (' + CASES[k].W + ')'}`, w / 2, h - 14, { color: col.s[3], size: 13, weight: 700, align: 'center' });
  };
  upd();
}
