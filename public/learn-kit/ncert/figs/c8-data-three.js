// Class 8 Tales by Dots and Lines: the same data as a bar graph and as a pie chart. Bars compare amounts, the pie shows
// each part of the whole (angle = count / total x 360). Change one count and both pictures update.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

const CAT = [['Cricket', 16], ['Football', 10], ['Kabaddi', 8], ['Hockey', 6]];
export default function (host) {
  let kind = 'bar';
  const v = CAT.map((c) => c[1]);
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'Favourite sports of a class as a bar graph or a pie chart' });
  const ctl = row(host);
  choice(ctl, 'Show', [['bar', 'Bar graph'], ['pie', 'Pie chart']], kind, (x) => { kind = x; sync(); });
  slider(ctl, { label: 'Kabaddi fans', min: 0, max: 24, step: 1, value: v[2], fmt: (x) => x, oninput: (x) => { v[2] = x; sync(); } });
  const out = readout(host);
  const tot = () => v.reduce((a, b) => a + b, 0);
  function sync() { const t = tot(); out.innerHTML = `Total ${t} students. ` + CAT.map((c, i) => `${c[0]} ${v[i]} → ${+((v[i] / t) * 360).toFixed(0)}°`).join(', ') + '. The angles always add up to 360°.'; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Favourite sport in a class', col), t = tot();
    if (kind === 'bar') {
      const L = 34, B = h - 40, W = w - L - 14, H = B - top - 16, mx = 24, bw = W / 4;
      ctx.strokeStyle = col.line; ctx.lineWidth = 1;
      for (let g = 0; g <= 24; g += 6) { ctx.beginPath(); ctx.moveTo(L, B - (g / mx) * H); ctx.lineTo(L + W, B - (g / mx) * H); ctx.stroke(); text(ctx, String(g), L - 5, B - (g / mx) * H, { color: col.muted, size: 10, align: 'right' }); }
      CAT.forEach((c, i) => { const bh = (v[i] / mx) * H, x = L + i * bw + bw * 0.18; ctx.fillStyle = col.s[i]; ctx.globalAlpha = 0.75; ctx.fillRect(x, B - bh, bw * 0.64, bh); ctx.globalAlpha = 1; text(ctx, c[0], x + bw * 0.32, B + 14, { color: col.ink, size: 10.5, align: 'center' }); text(ctx, String(v[i]), x + bw * 0.32, B - bh - 8, { color: col.ink, size: 11, weight: 700, align: 'center' }); });
      text(ctx, 'Bars show how many; the gaps say these are separate groups.', w / 2, h - 10, { color: col.muted, size: 10.5, align: 'center' });
    } else {
      const r = Math.min(w * 0.3, (h - top - 20) / 2.1), cx = w * 0.36, cy = (top + h) / 2 + 2;
      let a = -Math.PI / 2;
      CAT.forEach((c, i) => { const da = (v[i] / (t || 1)) * 2 * Math.PI; if (da > 0) { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, a, a + da); ctx.closePath(); ctx.fillStyle = col.s[i]; ctx.globalAlpha = 0.75; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.panel; ctx.lineWidth = 2; ctx.stroke(); } a += da; });
      CAT.forEach((c, i) => { const y = top + 24 + i * 24; ctx.fillStyle = col.s[i]; ctx.fillRect(w * 0.7 - 6, y - 6, 12, 12); text(ctx, c[0] + ' ' + Math.round((v[i] / t) * 100) + '%', w * 0.7 + 12, y, { color: col.ink, size: 11 }); });
    }
  };
  sync();
}
