// Class 8 Proportional Reasoning 1: a ratio is a recipe. Mix red and white paint in the ratio r : w, or scale the recipe up by k cups.
// Mixes with the same ratio (2:3 = 4:6 = 6:9) give exactly the same shade; changing the ratio changes the shade.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let r = 2, wt = 3, k = 1;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 250, label: 'Cups of red and white paint in a ratio and the shade they make' });
  const ctl = row(host);
  slider(ctl, { label: 'Red cups (r)', min: 1, max: 6, step: 1, value: r, fmt: (v) => String(Math.round(v)), oninput: (v) => { r = Math.round(v); upd(); } });
  slider(ctl, { label: 'White cups (w)', min: 1, max: 6, step: 1, value: wt, fmt: (v) => String(Math.round(v)), oninput: (v) => { wt = Math.round(v); upd(); } });
  slider(ctl, { label: 'Make it × k', min: 1, max: 4, step: 1, value: k, fmt: (v) => '×' + Math.round(v), oninput: (v) => { k = Math.round(v); upd(); } });
  const out = readout(host);
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Red : White = ' + r + ' : ' + wt + (k > 1 ? '  →  ' + r * k + ' : ' + wt * k : ''), col), R = r * k, W = wt * k, n = R + W, cs = Math.min(26, (w - 150) / 12), x0 = 16, y0 = t + 24;
    for (let i = 0; i < n; i++) { const cx = x0 + (i % 12) * (cs + 2), cy = y0 + Math.floor(i / 12) * (cs + 4); ctx.fillStyle = i < R ? col.s[3] : col.panel; ctx.globalAlpha = i < R ? 0.85 : 1; ctx.fillRect(cx, cy, cs, cs); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.2; ctx.strokeRect(cx, cy, cs, cs); }
    const f = R / n, by = h - 76, bx = 16, bw = w - 32;
    text(ctx, 'Red is ' + R + ' of ' + n + ' cups = ' + R + '/' + n + (R / gcd(R, n) !== R ? ' = ' + R / gcd(R, n) + '/' + n / gcd(R, n) : ''), w / 2, by - 12, { color: col.ink, size: 13, weight: 700, align: 'center' });
    ctx.fillStyle = col.panel; ctx.fillRect(bx, by, bw, 26); ctx.save(); ctx.globalAlpha = 0.85; ctx.fillStyle = col.s[3]; ctx.fillRect(bx, by, bw * f, 26); ctx.restore(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(bx, by, bw, 26);
    text(ctx, Math.round(f * 100) + '% red', bx + 8, by + 13, { color: col.ink, size: 12, weight: 700, halo: col.panel });
    text(ctx, 'Same ratio → same shade. Change r or w to change the shade.', w / 2, h - 18, { color: col.muted, size: 11, align: 'center' });
  };
  function upd() { const g = gcd(r, wt); out.innerHTML = `Simplest form of ${r}:${wt} is <b>${r / g}:${wt / g}</b>. Scaled by ${k}: ${r * k} red, ${wt * k} white (${r * k + wt * k} cups in all). Multiplying both parts by the same number keeps the ratio.`; cv.redraw(); }
  upd();
}
