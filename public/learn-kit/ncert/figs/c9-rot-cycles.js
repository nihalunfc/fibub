// Class 9 Rotation (repeating patterns in life): five things that repeat. Each has a period, the time for one full
// cycle. A marker walks along the repeating curve; the label tells how long one cycle takes.
import { canvas, text, title, row, choice, button, readout, loop } from '../../kit.js';

const D = {
  tick: { name: 'Seconds hand', period: 60, unit: 's', note: 'The seconds hand of a clock turns 360° in 60 s, so its tip’s height repeats every 60 s.', lo: 'bottom', hi: 'top', sp: 12 },
  heart: { name: 'Heartbeat', period: 0.8, unit: 's', note: 'A resting heart beats about 75 times a minute, so one beat takes about 0.8 s.', lo: 'rest', hi: 'beat', sp: 0.8 },
  tide: { name: 'Sea tide', period: 12.4, unit: 'h', note: 'At a seaside such as Mumbai the water rises and falls about twice a day: roughly every 12 h 25 min.', lo: 'low tide', hi: 'high tide', sp: 12.4 },
  day: { name: 'Daylight', period: 365, unit: 'days', note: 'Hours of daylight in a northern Indian city climb to a peak around 21 June and fall to a low around 21 December: a 365-day cycle.', lo: 'short days', hi: 'long days', sp: 365 },
  moon: { name: 'Moon phases', period: 29.5, unit: 'days', note: 'From one full moon to the next takes about 29.5 days (Poornima to Poornima).', lo: 'new moon', hi: 'full moon', sp: 29.5 },
};
export default function (host) {
  let k = 'tick', t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Five repeating patterns with their periods drawn as waves' });
  const ctl = row(host);
  choice(ctl, 'Pattern', Object.entries(D).map(([i, d]) => [i, d.name]), k, (v) => { k = v; t = 0; sync(); });
  const anim = loop(host, (dt) => { t = (t + dt * 0.18) % 3; cv.redraw(); });
  anim.button(ctl);
  const out = readout(host);
  function sync() { const d = D[k]; out.innerHTML = `<b>${d.name}</b>: one cycle takes <b>${d.period} ${d.unit}</b>. ${d.note}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const d = D[k], top = title(ctx, d.name + ': it repeats every ' + d.period + ' ' + d.unit, col), gx0 = 40, gx1 = w - 14, gy0 = top + 18, gy1 = h - 30, gm = (gy0 + gy1) / 2, X = (c) => gx0 + (c / 3) * (gx1 - gx0), Y = (v) => gm - v * ((gy1 - gy0) / 2 - 6);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(gx0, gm); ctx.lineTo(gx1, gm); ctx.stroke();
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(gx0, gy0 - 4); ctx.lineTo(gx0, gy1); ctx.stroke();
    text(ctx, d.hi, gx0 - 4, Y(1), { color: col.muted, size: 10, align: 'right', fit: true }); text(ctx, d.lo, gx0 - 4, Y(-1), { color: col.muted, size: 10, align: 'right' });
    for (let c = 0; c <= 3; c++) { ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(X(c), gy0); ctx.lineTo(X(c), gy1); ctx.stroke(); text(ctx, +(c * d.period).toPrecision(4) + '', X(c), gy1 + 12, { color: col.muted, size: 10, align: 'center' }); }
    const f = (c) => -Math.cos(2 * Math.PI * c);
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.beginPath(); for (let c = 0; c <= 3.001; c += 0.02) { c === 0 ? ctx.moveTo(X(c), Y(f(c))) : ctx.lineTo(X(c), Y(f(c))); } ctx.stroke();
    ctx.strokeStyle = col.s[2]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X(0), gm + 22); ctx.lineTo(X(1), gm + 22); ctx.stroke();
    text(ctx, 'one cycle', X(0.5), gm + 12, { color: col.s[2], size: 11, weight: 700, align: 'center' });
    ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.arc(X(t), Y(f(t)), 6, 0, 7); ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke();
    text(ctx, 'time in ' + d.unit + ' →', gx1, gy1 + 24, { color: col.muted, size: 10, align: 'right' });
  };
  sync();
}
