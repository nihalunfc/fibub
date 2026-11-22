// Class 9 Sound (step player): how an echo is timed. The sound travels to the cliff (distance d) and back (another d),
// so the total path is 2d = v x t, which gives d = v t / 2. The ear keeps a sound for about 0.1 s, so an echo is heard
// as separate only if it comes back more than 0.1 s later; at 343 m/s that means a wall at least 17 m away.
import { canvas, text, title, dot, line, arrow, loop, font } from '../../kit.js';

const D = 85, V = 343, T = 2 * D / V;
const TITLES = ['Clap in front of a cliff', 'The sound travels to the cliff', 'It reflects off the cliff', 'The echo travels back', 'Work out the distance'];
const CAP = [`You clap near a cliff ${D} m away. The clap spreads out through the air as a wave.`, 'Sound moves at about 343 m/s. The clock runs while the sound crosses the distance d to the cliff.', 'A hard, large surface reflects sound the way a wall bounces a ball: the sound turns back.', `The reflected sound comes back to you. Total path = 2 × ${D} m = ${2 * D} m, taking ${T.toFixed(2)} s.`, `2d = v × t, so d = v × t ÷ 2 = 343 × ${T.toFixed(2)} ÷ 2 = ${D} m. The echo is heard as separate because ${T.toFixed(2)} s is more than 0.1 s.`];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A person clapping in front of a cliff and the sound going to the cliff and back' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  function arcs(ctx, x, y, dir, col, a) {
    ctx.save(); ctx.lineWidth = 2.4; ctx.lineCap = 'round';
    for (let k = 0; k < 3; k++) { ctx.globalAlpha = a * (1 - k * 0.28); ctx.strokeStyle = col; ctx.beginPath(); ctx.arc(x - dir * k * 9 - dir * 6, y, 20 - k * 2, dir > 0 ? -0.9 : Math.PI - 0.9 + 0.0, dir > 0 ? 0.9 : Math.PI + 0.9); ctx.stroke(); }
    ctx.restore();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, TITLES[step], col);
    const gy = h * 0.58, px = 40, cx = w - 58;
    line(ctx, [[8, gy + 28], [w - 8, gy + 28]], col.muted, 2);
    // person
    dot(ctx, px, gy - 24, 7, col.ink); line(ctx, [[px, gy - 16], [px, gy + 10]], col.ink, 3); line(ctx, [[px, gy + 10], [px - 6, gy + 28]], col.ink, 3); line(ctx, [[px, gy + 10], [px + 6, gy + 28]], col.ink, 3); line(ctx, [[px, gy - 8], [px + 10, gy - 14]], col.ink, 3);
    // cliff
    ctx.fillStyle = col.line; ctx.beginPath(); ctx.moveTo(cx, gy + 28); ctx.lineTo(cx, gy - 70); ctx.lineTo(w - 10, gy - 60); ctx.lineTo(w - 10, gy + 28); ctx.closePath(); ctx.fill();
    text(ctx, 'cliff', cx + 6, gy - 40, { color: col.muted, size: 10.5 });
    // distance bracket
    const by = gy + 44;
    line(ctx, [[px, by], [cx, by]], col.s[3], 1.5); line(ctx, [[px, by - 4], [px, by + 4]], col.s[3], 1.5); line(ctx, [[cx, by - 4], [cx, by + 4]], col.s[3], 1.5);
    text(ctx, `d = ${D} m`, (px + cx) / 2, by + 12, { color: col.s[3], size: 11, weight: 700, align: 'center' });
    const ph = (t % 3) / 2.2, p = Math.min(1, ph), e = 0.06;
    let clock = 0;
    if (step === 0) { arcs(ctx, px + 18 + (t % 1.2) * 14, gy - 12, 1, col.s[2], 1 - (t % 1.2) / 1.5); text(ctx, 'clap!', px, gy - 44, { color: col.s[1], size: 11, weight: 700, align: 'center' }); }
    if (step === 1) { const x = px + 14 + (cx - px - 14) * p; arcs(ctx, x, gy - 12, 1, col.s[2], 1); clock = p * D / V; }
    if (step === 2) { const f = 0.5 + 0.5 * Math.sin(t * 8); ctx.save(); ctx.globalAlpha = 0.35 + 0.35 * f; dot(ctx, cx, gy - 12, 16, col.s[1]); ctx.restore(); arcs(ctx, cx - 4, gy - 12, 1, col.s[2], 0.7); clock = D / V; }
    if (step === 3) { const x = cx - (cx - px - 14) * p; arcs(ctx, x, gy - 12, -1, col.s[0], 1); clock = D / V + p * D / V; }
    if (step === 4) { arrow(ctx, px + 14, gy - 52, cx - 4, gy - 52, col.s[2], 2, 8); arrow(ctx, cx - 4, gy - 38, px + 14, gy - 38, col.s[0], 2, 8); text(ctx, 'there', (px + cx) / 2, gy - 62, { color: col.s[2], size: 10.5, align: 'center' }); text(ctx, 'and back', (px + cx) / 2, gy - 25, { color: col.s[0], size: 10.5, align: 'center' }); clock = T; }
    if (step >= 1) {
      text(ctx, `time ${clock.toFixed(2)} s`, w / 2, 40, { color: col.ink, size: 12, weight: 700, align: 'center' });
      if (step === 4) text(ctx, 'echo heard (more than 0.1 s)', w / 2, 56, { color: col.good, size: 10.5, align: 'center' });
    }
    ctx.font = font(10.5, 400);
    const wds = CAP[step].split(' '); const L = []; let cur = ''; wds.forEach((wd) => { const tryS = cur ? cur + ' ' + wd : wd; if (ctx.measureText(tryS).width > w - 24) { L.push(cur); cur = wd; } else cur = tryS; }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, 12, h - 10 - (L.length - 1 - i) * 14, { color: col.ink, size: 10.5 }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(Math.max(0, i), 4); t = 0; cv.redraw(); } };
}
