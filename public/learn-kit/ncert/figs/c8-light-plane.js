// Class 8 Light: the image in a plane mirror. The image is virtual (rays only seem to come from it), upright, the same size as
// the object, and as far behind the mirror as the object is in front. Two rays from the top of the object reflect into the eye
// (dotted lines are where they seem to come from). A mirror also swaps left and right (lateral inversion).
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout, font } from '../../kit.js';

export default function (host) {
  let d = 100, mode = 'rays';
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 260, label: 'An object, a plane mirror and the virtual image the same distance behind it' });
  const ctl = row(host);
  choice(ctl, 'Show', [['rays', 'Rays'], ['text', 'Lateral inversion']], mode, (v) => { mode = v; say(); });
  slider(ctl, { label: 'Object distance', min: 30, max: 140, step: 5, value: d, fmt: (v) => `${v} cm`, oninput: (v) => { d = v; say(); } });
  const out = readout(host);
  const say = () => { out.innerHTML = mode === 'rays' ? `Object is <b>${d} cm</b> in front of the mirror, so the image is <b>${d} cm</b> behind it: <b>${2 * d} cm</b> from the object. The image is upright, the same size and cannot be caught on a screen (virtual).` : 'Look at the word in the mirror: left and right are swapped, so letters turn back to front. That is why AMBULANCE is printed reversed on the front of the van: a driver ahead reads it correctly in the rear-view mirror.'; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, mode === 'rays' ? 'Image in a plane mirror' : 'Lateral inversion', col);
    const mx = w / 2, gy = h * 0.82, s = (w / 2 - 24) / 160, ox = mx - d * s, ex = 22, ey = h * 0.35, oh = h * 0.22;
    line(ctx, [[mx, 34], [mx, gy + 6]], col.ink, 4); for (let y = 40; y < gy; y += 12) line(ctx, [[mx, y], [mx + 8, y + 8]], col.muted, 1.5);
    line(ctx, [[8, gy], [w - 8, gy]], col.line, 1.5);
    if (mode === 'text') {
      ctx.save(); ctx.font = font(Math.min(26, w / 15), 800); ctx.textBaseline = 'middle'; ctx.fillStyle = col.ink; ctx.textAlign = 'center';
      ctx.fillText('AMBULANCE', mx - w * 0.25, h * 0.45); ctx.translate(mx + w * 0.25, h * 0.45); ctx.scale(-1, 1); ctx.globalAlpha = 0.75; ctx.fillStyle = col.s[2]; ctx.fillText('AMBULANCE', 0, 0); ctx.restore();
      text(ctx, 'real word', mx - w * 0.25, h * 0.6, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, 'what you see in the mirror', mx + w * 0.25, h * 0.6, { color: col.muted, size: 10.5, align: 'center' });
      return;
    }
    const ty = gy - oh, im = mx + d * s;
    arrow(ctx, ox, gy, ox, gy - oh, col.s[1], 4, 9); text(ctx, 'object', ox, gy + 14, { color: col.s[1], size: 10.5, weight: 700, align: 'center' });
    ctx.save(); ctx.setLineDash([4, 4]); ctx.globalAlpha = 0.9; arrow(ctx, im, gy, im, gy - oh, col.s[2], 3, 9); ctx.restore();
    text(ctx, 'image', im, gy + 14, { color: col.s[2], size: 10.5, weight: 700, align: 'center' });
    const eyeY = gy - oh * 0.6, eyeX = 26;
    // a ray from the tip and one from the foot of the object each bounce off the mirror on the straight line from the eye to the image
    [[ty, col.s[0]], [gy, col.s[3]]].forEach(([py, c]) => {
      const ym = eyeY + (py - eyeY) * (mx - eyeX) / (im - eyeX);
      line(ctx, [[ox, py], [mx, ym]], c, 1.8); line(ctx, [[mx, ym], [eyeX + 8, eyeY]], c, 1.8); line(ctx, [[mx, ym], [im, py]], c, 1.2, [4, 4]);
    });
    dot(ctx, eyeX, eyeY, 8, col.panel, col.ink); dot(ctx, eyeX, eyeY, 3, col.ink); text(ctx, 'eye', eyeX, eyeY - 16, { color: col.muted, size: 10.5, align: 'center' });
    line(ctx, [[ox, gy + 28], [mx, gy + 28]], col.muted, 1); line(ctx, [[mx, gy + 28], [im, gy + 28]], col.muted, 1);
    text(ctx, `${d} cm`, (ox + mx) / 2, gy + 38, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, `${d} cm`, (mx + im) / 2, gy + 38, { color: col.muted, size: 10.5, align: 'center' });
  };
  say();
}
