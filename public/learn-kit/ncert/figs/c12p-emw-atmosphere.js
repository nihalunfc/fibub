// Class 12 Electromagnetic Waves: what the atmosphere does to each part of the spectrum. Radio below about 30 MHz is
// reflected by the ionosphere (about 100 km up), so short-wave radio goes round the Earth; FM and satellite microwaves pass
// straight through, so a tower or a dish needs a clear line of sight; ozone absorbs most UV; X-rays and gamma rays are
// absorbed high up. Visible light and radio waves are the two "windows" that reach the ground.
import { canvas, line, dot, text, title, row, slider, readout, arrow } from '../../kit.js';

export default function (host) {
  const E = [
    ['AM radio 1 MHz', 'reflect', 'Reflected by the ionosphere, strongly at night: you hear distant AM stations after dark.'],
    ['Short-wave 15 MHz', 'reflect', 'Reflected by the ionosphere: used for long-distance broadcasting and ham radio.'],
    ['FM radio 100 MHz', 'pass', 'Passes through the ionosphere: it only reaches as far as the horizon.'],
    ['DTH satellite 12 GHz', 'sat', 'Microwaves pass through the air and reach the satellite 36,000 km up; rain can weaken them.'],
    ['Far infrared', 'lowabs', 'Mostly absorbed by water vapour and CO₂ low down: this is the greenhouse effect.'],
    ['Visible light', 'light', 'Passes through: this is the window your eyes use.'],
    ['Ultraviolet (UV-C)', 'ozone', 'Absorbed by the ozone layer at about 25 km, which protects life.'],
    ['X-rays and gamma rays', 'high', 'Absorbed high up (above 50 km): telescopes for them must go to space.'],
  ];
  let i = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 290, label: 'A wave from the ground meeting the atmosphere and being reflected, absorbed or passed through' });
  const ctl = row(host);
  slider(ctl, { label: 'Pick a wave', min: 0, max: E.length - 1, step: 1, value: i, fmt: (v) => E[v][0], oninput: (v) => { i = v; upd(); } });
  const out = readout(host);
  function upd() { out.innerHTML = `<b>${E[i][0]}</b>. ${E[i][2]}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, E[i][0] + ' from a ground antenna', col);
    const gy = h - 30, iono = top + 50, ozone = top + (gy - top) * 0.5, tx = w * 0.22, mid = w / 2;
    ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.5; ctx.fillRect(0, gy, w, 30); ctx.globalAlpha = 1; text(ctx, 'ground', 8, gy + 15, { color: col.ink, size: 10.5, weight: 700 });
    ctx.fillStyle = col.s[4]; ctx.globalAlpha = 0.25; ctx.fillRect(0, iono - 12, w, 24); ctx.fillRect(0, ozone - 7, w, 14); ctx.globalAlpha = 1;
    text(ctx, 'ionosphere (~100 km)', w - 8, iono - 18, { color: col.s[4], size: 10.5, weight: 700, align: 'right' }); text(ctx, 'ozone (~25 km)', w - 8, ozone - 14, { color: col.s[4], size: 10.5, weight: 700, align: 'right' });
    line(ctx, [[tx, gy], [tx, gy - 14]], col.ink, 3);
    const k = E[i][1], c = col.s[3];
    const P = (x, y) => [x, y];
    if (k === 'reflect') { line(ctx, [P(tx, gy - 14), P(mid, iono), P(w * 0.8, gy)], c, 2.5); arrow(ctx, mid - 6, iono + 4, mid + 4, iono + 4, c, 2, 7); text(ctx, 'reflected', mid, iono + 24, { color: c, size: 11.5, weight: 700, align: 'center' }); }
    if (k === 'pass') { line(ctx, [P(tx, gy - 14), P(w * 0.5, iono - 30), P(w * 0.62, top + 4)], c, 2.5); text(ctx, 'goes on into space', w * 0.45, top + 22, { color: c, size: 11.5, weight: 700 }); line(ctx, [P(tx, gy - 14), P(w * 0.62, gy - 20)], c, 2, [4, 4]); text(ctx, 'horizon limit', w * 0.66, gy - 24, { color: col.muted, size: 10.5 }); }
    if (k === 'sat') { line(ctx, [P(tx, gy - 14), P(w * 0.55, top + 8)], c, 2.5); ctx.fillStyle = col.ink; ctx.fillRect(w * 0.55 + 2, top + 2, 14, 8); text(ctx, 'satellite', w * 0.55 + 22, top + 8, { color: col.ink, size: 10.5, weight: 700 }); text(ctx, 'reaches the satellite', w * 0.6, top + 34, { color: c, size: 11.5, weight: 700 }); }
    if (k === 'lowabs') { line(ctx, [P(tx, gy - 14), P(w * 0.4, gy - 70)], c, 2.5); dot(ctx, w * 0.4, gy - 70, 5, c); text(ctx, 'absorbed by water vapour and CO₂', w * 0.4 + 8, gy - 74, { color: c, size: 11, weight: 700 }); }
    if (k === 'light') { line(ctx, [P(tx, gy - 14), P(w * 0.55, top + 8)], col.s[5], 3); text(ctx, 'passes: a window', w * 0.57, top + 34, { color: c, size: 11.5, weight: 700 }); }
    if (k === 'ozone') { line(ctx, [P(tx, gy - 14), P(w * 0.4, ozone)], c, 2.5); dot(ctx, w * 0.4, ozone, 5, c); text(ctx, 'absorbed by ozone', w * 0.4 + 10, ozone + 18, { color: c, size: 11.5, weight: 700 }); }
    if (k === 'high') { line(ctx, [P(tx, gy - 14), P(w * 0.42, iono - 20)], c, 2.5); dot(ctx, w * 0.42, iono - 20, 5, c); text(ctx, 'absorbed very high up', w * 0.42 + 10, iono - 30, { color: c, size: 11.5, weight: 700 }); }
    line(ctx, [[tx, gy], [tx, gy - 14]], col.ink, 3);
  };
  upd();
}
