// Class 11 Biology, Plant Growth and Development: photoperiodism. A short-day plant flowers when the unbroken NIGHT is longer than its critical length; a long-day plant when the night is shorter;
// a day-neutral plant ignores it. A short flash of light in the middle of a long night cuts it in two and stops a short-day plant flowering. (The critical dark period is set at 12 hours here as a teaching value.)
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';
import { rr } from '../c11b-lib.js';

export default function (host) {
  let night = 14, kind = 'sdp', flash = false;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A 24 hour bar of light and dark with a flowering result for short-day, long-day and day-neutral plants' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Plant', [['sdp', 'Short-day'], ['ldp', 'Long-day'], ['dnp', 'Day-neutral']], kind, (v) => { kind = v; go(); });
  choice(ctl, 'Flash of light at midnight', [[false, 'Off'], [true, 'On']], flash, (v) => { flash = v; go(); });
  slider(ctl, { label: 'Night length', min: 6, max: 18, step: 0.5, value: night, fmt: (v) => v + ' h', oninput: (v) => { night = v; go(); } });
  const longest = () => (flash ? night / 2 : night);
  const bloom = () => (kind === 'dnp' ? true : kind === 'sdp' ? longest() >= 12 : longest() < 12);
  const go = () => { ro.textContent = `Longest unbroken dark period: ${longest().toFixed(1)} h (critical value 12 h). ${kind === 'dnp' ? 'A day-neutral plant (tomato, cotton) flowers whatever the day length.' : kind === 'sdp' ? 'A short-day plant (rice, chrysanthemum, soybean) needs a long enough unbroken night.' : 'A long-day plant (wheat, spinach, radish) needs a short night.'} Result: ${bloom() ? 'FLOWERS' : 'does not flower'}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Is it the day or the night that counts?', col), x0 = 16, bw = w - 32, y = t0 + 24;
    const dw = bw * night / 24;
    ctx.fillStyle = col.s[3]; ctx.fillRect(x0, y, bw, 34); ctx.fillStyle = '#222'; ctx.fillRect(x0 + (bw - dw) / 2, y, dw, 34);
    if (flash) { ctx.fillStyle = col.s[3]; ctx.fillRect(x0 + bw / 2 - 3, y, 6, 34); }
    text(ctx, 'day', x0 + 6, y + 17, { color: '#222', size: 10.5, weight: 700 }); text(ctx, `night ${night} h`, x0 + bw / 2 + (flash ? 14 : 0), y + 17, { color: '#fff', size: 11, weight: 700, align: flash ? 'left' : 'center' });
    text(ctx, flash ? 'amber line: a flash of light in the middle of the night' : 'the bar is 24 hours: day at both ends, night in the middle', x0, y + 48, { color: col.muted, size: 10 });
    const by = y + 74, fl = bloom();
    rr(ctx, w / 2 - 70, by, 140, 90, 10, fl ? col.soft : col.panel, fl ? col.s[2] : col.line, 2);
    ctx.strokeStyle = col.s[2]; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(w / 2, by + 86); ctx.lineTo(w / 2, by + 36); ctx.stroke();
    ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.ellipse(w / 2 - 14, by + 62, 13, 5, -0.5, 0, 7); ctx.ellipse(w / 2 + 14, by + 70, 13, 5, 0.5, 0, 7); ctx.fill();
    if (fl) { for (let k = 0; k < 6; k++) { ctx.fillStyle = col.s[4]; ctx.beginPath(); ctx.ellipse(w / 2 + Math.cos(k * 1.047) * 10, by + 30 + Math.sin(k * 1.047) * 10, 7, 5, k, 0, 7); ctx.fill(); } ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(w / 2, by + 30, 5, 0, 7); ctx.fill(); }
    text(ctx, fl ? 'FLOWERING' : 'vegetative only', w / 2, by + 104, { color: fl ? col.s[2] : col.muted, size: 12, weight: 700, align: 'center' });
  };
  go();
}
