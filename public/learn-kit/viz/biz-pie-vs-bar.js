// Pie versus bars. Five shares; B and C are close. Slide the gap between B and C and see when each chart lets you tell which
// is bigger. Our eyes compare lengths on a common line far better than angles and areas. Switch on the numbers to check.
import { canvas, text, title, row, slider, choice, readout } from '../kit.js';

export default function (host) {
  let view = 'both', nums = false;
  const cv = canvas(host, { aspect: 0.62, max: 330, min: 250, label: 'Five shares drawn as a pie and as bars' });
  const ctl = row(host);
  choice(ctl, 'Draw as', [['pie', 'Pie'], ['bar', 'Bars'], ['both', 'Both']], view, (v) => { view = v; cv.redraw(); });
  choice(ctl, 'Numbers', [[false, 'Hidden'], [true, 'Shown']], nums, (v) => { nums = v; cv.redraw(); });
  const gap = slider(ctl, { label: 'Gap between B and C', min: 0, max: 8, step: 0.5, value: 2, fmt: (v) => v + ' points', oninput: () => cv.redraw() });
  const out = readout(host);
  const vals = () => { const g = gap.value, b = 22 + g / 2, c = 22 - g / 2, rest = 100 - b - c, a = rest * 0.45, d = rest * 0.3, e = rest * 0.25; return [a, b, c, d, e]; };
  cv.draw = (ctx, w, h, col) => {
    const v = vals(), L = ['A', 'B', 'C', 'D', 'E'];
    title(ctx, 'Which is bigger, B or C?', col);
    const both = view === 'both', pw = both ? w * 0.5 : w, bx = both ? w * 0.5 : 0;
    if (view !== 'bar') {
      const cx = pw / 2, cy = h / 2 + 14, r = Math.min(pw / 2 - 12, h / 2 - 34); let a0 = -Math.PI / 2;
      v.forEach((x, i) => { const a1 = a0 + (x / 100) * Math.PI * 2; ctx.fillStyle = col.s[i]; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, a0, a1); ctx.fill(); ctx.strokeStyle = col.panel; ctx.lineWidth = 2; ctx.stroke(); const am = (a0 + a1) / 2; text(ctx, L[i] + (nums ? ' ' + x.toFixed(1) : ''), cx + Math.cos(am) * r * 0.66, cy + Math.sin(am) * r * 0.66, { color: col.bg, size: 11, weight: 800, align: 'center', fit: false }); a0 = a1; });
    }
    if (view !== 'pie') {
      const x0 = bx + 22, bw = (both ? w * 0.5 : w) - 40, top = 40, rh = (h - top - 14) / 5;
      v.forEach((x, i) => { const y = top + i * rh; text(ctx, L[i], x0 - 10, y + rh / 2, { color: col.ink, size: 12, weight: 700, align: 'center', fit: false }); ctx.fillStyle = col.s[i]; ctx.fillRect(x0, y + 3, (bw * x) / 40, rh - 7); if (nums) text(ctx, x.toFixed(1) + '%', x0 + (bw * x) / 40 + 4, y + rh / 2, { color: col.muted, size: 10, fit: false }); });
    }
  };
  const upd = () => {}; void upd;
  cv.redraw();
}
