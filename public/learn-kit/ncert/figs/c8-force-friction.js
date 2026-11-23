// Class 8 Forces: friction depends on the two surfaces (rougher = more friction) and acts opposite to the push.
// While the block is at rest, friction matches the push (static) up to a limit; beyond that the block slides and the
// friction is a bit smaller (kinetic). Coefficients are typical round numbers, shown as the friction limit in newtons
// for a 2 kg block (weight about 20 N, g = 10 m/s^2).
import { canvas, text, title, line, arrow, row, slider, choice, loop, readout, clamp } from '../../kit.js';

const SURF = { ice: ['Ice', 0.05, '#9cd'], wood: ['Wood', 0.4, '#b85'], sand: ['Sandpaper', 0.9, '#a96'] };
export default function (host) {
  let key = 'wood', push = 0, pos = 0, vel = 0;
  const cv = canvas(host, { aspect: 0.6, max: 440, min: 270, label: 'A block pushed along ice, wood or sandpaper with the friction arrow shown' });
  const W = 20;
  loop(host, (dt) => {
    const mu = SURF[key][1], limit = mu * W, kin = limit * 0.85;
    if (vel === 0 && push <= limit) { pos = pos; } else { vel += ((push - kin) / 2) * dt; if (vel < 0) vel = 0; pos += vel * dt * 25; if (pos > 100) { pos = 0; } }
    cv.redraw();
  });
  const ctl = row(host);
  choice(ctl, 'Surface', [['ice', 'Ice'], ['wood', 'Wood'], ['sand', 'Sandpaper']], key, (v) => { key = v; pos = 0; vel = 0; upd(); });
  slider(ctl, { label: 'Push', min: 0, max: 20, step: 0.5, value: push, fmt: (z) => `${z} N`, oninput: (z) => { push = z; if (z <= SURF[key][1] * W) { vel = 0; } upd(); } });
  const out = readout(host);
  function upd() {
    const lim = SURF[key][1] * W;
    out.innerHTML = push <= lim ? `Block at rest: friction <b>${push.toFixed(1)} N</b> exactly cancels the push. The most friction can hold is <b>${lim.toFixed(1)} N</b> on ${SURF[key][0].toLowerCase()}.` : `Push ${push.toFixed(1)} N is more than the limit ${lim.toFixed(1)} N, so the block <b>slides</b> and friction is about ${(lim * 0.85).toFixed(1)} N.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Friction: a force that opposes sliding', col);
    const mu = SURF[key][1], lim = mu * W, moving = vel > 0 || push > lim, fr = moving ? lim * 0.85 : push;
    const gy = h * 0.62, bx = 40 + pos * (w - 150) / 100;
    ctx.fillStyle = key === 'ice' ? col.soft : col.line; ctx.fillRect(10, gy, w - 20, 18);
    for (let i = 0; i < 70; i++) { const rx = 12 + (i * 37) % (w - 26); if (key !== 'ice') line(ctx, [[rx, gy], [rx + 2, gy - mu * 5 - 1]], col.muted, 1.2); }
    text(ctx, SURF[key][0], 14, gy + 9, { color: col.ink, size: 10.5, weight: 700 });
    ctx.fillStyle = col.s[0]; ctx.fillRect(bx, gy - 44, 60, 44); text(ctx, '2 kg', bx + 30, gy - 22, { color: '#fff', size: 11, weight: 700, align: 'center' });
    if (push > 0) arrow(ctx, bx - 2 - push * 3.6, gy - 22, bx - 2, gy - 22, col.s[1], 4, 9);
    if (fr > 0.2) arrow(ctx, bx + 62, gy + 2, bx + 62 - fr * 3.6, gy + 2, col.s[3], 4, 9);
    text(ctx, `push ${push.toFixed(1)} N`, 14, h * 0.2 + 12, { color: col.s[1], size: 11, weight: 700 });
    text(ctx, `friction ${fr.toFixed(1)} N`, 14, h * 0.2 + 30, { color: col.s[3], size: 11, weight: 700 });
    text(ctx, moving ? 'sliding' : 'at rest', w - 14, h - 14, { color: moving ? col.s[1] : col.good, size: 12, weight: 700, align: 'right' });
    text(ctx, 'Smoother surface: smaller limit', 14, h - 14, { color: col.muted, size: 10.5 });
  };
  upd();
}
