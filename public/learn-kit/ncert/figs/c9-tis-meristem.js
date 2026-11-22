// Class 9 Tissues: where meristematic tissue is and what it does. Apical meristem (tips of roots and shoots) makes the
// plant LONGER; lateral meristem (cambium) makes the stem THICKER (annual rings); intercalary meristem (at the base of
// leaves or internodes, as in grass) lets a mown lawn regrow. Pick a type and press play: the stem grows in the place
// that the meristem sits.
import { canvas, text, title, dot, line, row, choice, loop } from '../../kit.js';

const TXT = { api: 'Apical meristem at the tips: the shoot and the root grow longer.', lat: 'Lateral meristem (cambium) in a ring: the stem and root grow thicker, adding a ring each year.', int: 'Intercalary meristem at the base of a leaf or between joints: grass regrows from the base after mowing.' };
export default function (host) {
  let kind = 'api', g = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'A plant growing longer at the tips, thicker in the middle or from the base depending on the meristem' });
  const ctl = row(host);
  choice(ctl, 'Meristem', [['api', 'Apical'], ['lat', 'Lateral'], ['int', 'Intercalary']], kind, (v) => { kind = v; g = 0; cv.redraw(); });
  const an = loop(host, (dt) => { g = (g + dt * 0.12) % 1; cv.redraw(); }); an.button(ctl);
  cv.draw = (ctx, w, h, col) => {
    title(ctx, { api: 'Apical meristem: grow longer', lat: 'Lateral meristem: grow thicker', int: 'Intercalary meristem: regrow' }[kind], col);
    const cx = w / 2, gy = h * 0.74, base = 30;
    ctx.fillStyle = col.soft; ctx.fillRect(10, gy, w - 20, h * 0.1); text(ctx, 'soil', 16, gy + 10, { color: col.muted, size: 10 });
    const e = g;
    if (kind === 'api') {
      const len = (h * 0.34) + e * h * 0.16, rt = h * 0.08 + e * h * 0.06;
      line(ctx, [[cx, gy], [cx, gy - len]], col.s[2], 8); dot(ctx, cx, gy - len, 8, col.s[0]);
      line(ctx, [[cx, gy], [cx, gy + rt]], col.s[4], 5); dot(ctx, cx, gy + rt, 5, col.s[0]);
      text(ctx, 'apical meristem (shoot tip)', cx + 14, gy - len, { color: col.s[0], size: 10.5, weight: 700 }); text(ctx, 'root tip', cx + 12, gy + rt, { color: col.s[0], size: 10.5, weight: 700 });
      line(ctx, [[cx - 40, gy - len + 20], [cx - 40, gy - len]], col.good, 2);
    } else if (kind === 'lat') {
      const wd = 14 + e * 18, len = h * 0.45;
      ctx.fillStyle = col.s[2]; ctx.fillRect(cx - wd / 2, gy - len, wd, len);
      for (let r = 0; r < 3 + Math.floor(e * 4); r++) { ctx.strokeStyle = col.panel; ctx.lineWidth = 1; ctx.strokeRect(cx - wd / 2 + 2 + r * 2.2, gy - len + 4, wd - 4 - r * 4.4, len - 4); }
      ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.strokeRect(cx - wd / 2 - 3, gy - len, wd + 6, len);
      text(ctx, 'cambium ring', cx + wd / 2 + 10, gy - len * 0.5, { color: col.s[0], size: 10.5, weight: 700 });
      // cross section
      const R2 = 18 + e * 22, sx = w * 0.2, sy = gy - len * 0.55; for (let r = 0; r < 2 + Math.floor(e * 4); r++) { ctx.beginPath(); ctx.arc(sx, sy, R2 - r * 6, 0, 7); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 1.5; ctx.stroke(); } ctx.beginPath(); ctx.arc(sx, sy, R2 + 2, 0, 7); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.stroke(); text(ctx, 'cross-section', sx, sy + R2 + 16, { color: col.muted, size: 10, align: 'center' });
    } else {
      const grow = e * h * 0.26;
      for (let i = -2; i <= 2; i++) { const x = cx + i * 14, len0 = h * 0.2; line(ctx, [[x, gy], [x + i * 2, gy - len0 - grow - (i === 0 ? 8 : 0)]], col.good, 4); }
      ctx.fillStyle = col.s[0]; ctx.fillRect(cx - 40, gy - 8, 80, 6); text(ctx, 'intercalary meristem at the base', cx, gy - 16 - h * 0.2 - grow - 14, { color: col.s[0], size: 10.5, weight: 700, align: 'center' }); line(ctx, [[10, gy - h * 0.2 - 16], [w - 10, gy - h * 0.2 - 16]], col.bad, 1, [4, 3]); text(ctx, 'mower cut here', w - 12, gy - h * 0.2 - 24, { color: col.bad, size: 10, align: 'right' });
    }
    const words = TXT[kind].split(' '); const L = []; let cur = ''; ctx.font = '11px system-ui'; words.forEach((wd) => { if (ctx.measureText((cur + ' ' + wd).trim()).width > w - 24 && cur) { L.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, w / 2, h - 12 - (L.length - 1 - i) * 15, { color: col.ink, size: 11, align: 'center' }));
    void base;
  };
}
