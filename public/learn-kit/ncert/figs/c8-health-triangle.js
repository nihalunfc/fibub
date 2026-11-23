// Class 8 Science, Health: health has three sides: physical (body), mental (mind and feelings) and social (family,
// friends, community). Move each slider (how well it is looked after) and watch the triangle: one weak side shrinks
// the whole shape, the way a three-legged stool wobbles when one leg is short.
import { canvas, text, title, line, row, slider, readout } from '../../kit.js';

export default function (host) {
  const v = { p: 8, m: 8, s: 8 };
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A triangle whose three corners are physical, mental and social health' });
  const ctl = row(host);
  [['p', 'Physical (food, sleep, exercise)'], ['m', 'Mental (feelings, stress)'], ['s', 'Social (family, friends)']].forEach(([k, nm]) => slider(ctl, { label: nm, min: 1, max: 10, step: 1, value: v[k], fmt: (x) => `${x}/10`, oninput: (x) => { v[k] = x; upd(); } }));
  const out = readout(host);
  function upd() {
    const w = Object.entries(v).sort((a, b) => a[1] - b[1])[0], nm = { p: 'physical', m: 'mental', s: 'social' }[w[0]];
    out.innerHTML = Math.min(...Object.values(v)) >= 7 ? 'All three sides are strong: good health is more than not being ill.' : `The weakest side is <b>${nm}</b> health (${w[1]}/10). Look after it: for example a long sleepless week hurts mood and friendships too.`; cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Health has three sides', col);
    const cx = w / 2, cy = h * 0.58, R = Math.min(w, h) * 0.36, ang = [-Math.PI / 2, Math.PI / 6, 5 * Math.PI / 6], keys = ['p', 'm', 's'], names = ['Physical', 'Mental', 'Social'];
    const P = (i, f) => [cx + Math.cos(ang[i]) * R * f, cy + Math.sin(ang[i]) * R * f];
    ctx.beginPath(); [0, 1, 2].forEach((i) => ctx.lineTo(...P(i, 1))); ctx.closePath(); ctx.strokeStyle = col.line; ctx.lineWidth = 2; ctx.stroke();
    [0, 1, 2].forEach((i) => line(ctx, [[cx, cy], P(i, 1)], col.line, 1));
    ctx.beginPath(); keys.forEach((k, i) => ctx.lineTo(...P(i, v[k] / 10))); ctx.closePath(); ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.35; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2.5; ctx.stroke();
    keys.forEach((k, i) => { const [x, y] = P(i, 1.14); text(ctx, `${names[i]} ${v[k]}`, x, y, { color: col.ink, size: 11.5, weight: 700, align: 'center' }); });
  };
  upd();
}
