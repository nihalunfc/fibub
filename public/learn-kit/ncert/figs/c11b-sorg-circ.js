// Class 11 Structural Organisation in Animals: three ways to circulate. Earthworm: closed, blood stays in vessels. Cockroach: open, haemolymph leaves the heart and bathes the organs
// in sinuses (oxygen comes by air tubes, not the blood). Frog: closed with a three-chambered heart (two atria, one ventricle) where oxygenated and deoxygenated blood partly mix.
import { canvas, text, title, row, choice, loop } from '../../kit.js';
import { ellipse, footer } from '../c11b-ex-util.js';

const NOTE = {
  ew: 'Closed: blood always inside vessels. It runs forwards in the dorsal vessel, passes down through the hearts and returns in the ventral vessel.',
  co: 'Open: the tube-like heart (13 chambers) pushes haemolymph into spaces (haemocoel) where it bathes the organs directly, then it returns to the heart through holes (ostia). It carries food, not oxygen.',
  fr: 'Closed, one circuit with three chambers: the right atrium (body blood) and the left atrium (lung and skin blood) both empty into the single ventricle, where the blood mixes a little before going on.',
};
export default function (host) {
  let k = 'ew', t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Animated blood flow in an earthworm (closed), a cockroach (open) and a frog (three-chambered heart)' });
  const ctl = row(host);
  choice(ctl, 'Animal', [['ew', 'Earthworm'], ['co', 'Cockroach'], ['fr', 'Frog']], k, (v) => { k = v; cv.redraw(); });
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }); anim.button(ctl);
  const along = (P, f) => { const segs = [], L = []; let tot = 0; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length], d = Math.hypot(b[0] - a[0], b[1] - a[1]); segs.push([a, b, d]); tot += d; } let d = ((f % 1) + 1) % 1 * tot; for (const [a, b, l] of segs) { if (d <= l) return [a[0] + (b[0] - a[0]) * d / l, a[1] + (b[1] - a[1]) * d / l]; d -= l; } return P[0]; };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, { ew: 'Earthworm: closed circulation', co: 'Cockroach: open circulation', fr: 'Frog: three-chambered heart' }[k], col), fy = footer(ctx, w, h, col, NOTE[k]);
    const x0 = 24, x1 = w - 24, y0 = t0 + 22, y1 = fy - 26, cy = (y0 + y1) / 2, red = col.bad ?? col.s[4];
    const dots = (P, n, c, sp = 0.12) => { for (let i = 0; i < n; i++) { const [x, y] = along(P, t * sp + i / n); ellipse(ctx, x, y, 3.5, 3.5, c, null); } };
    const loopPath = (P, c) => { ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.stroke(); };
    if (k === 'ew') {
      const P = [[x0, y0 + 8], [x1, y0 + 8], [x1, y1 - 8], [x0, y1 - 8]].map(([x, y]) => [x, y]);
      // dorsal on top (forwards = leftwards), ventral at the bottom
      const Pd = [[x1, y0 + 20], [x0 + 20, y0 + 20], [x0 + 20, y1 - 20], [x1, y1 - 20]];
      ctx.strokeStyle = red; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x1, y0 + 20); ctx.lineTo(x0 + 20, y0 + 20); ctx.stroke();
      ctx.strokeStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(x0 + 20, y1 - 20); ctx.lineTo(x1, y1 - 20); ctx.stroke();
      [0.55, 0.7, 0.85].forEach((f, i) => { const xx = x0 + 20 + (x1 - x0 - 20) * f; ctx.strokeStyle = col.s[3]; ctx.beginPath(); ctx.moveTo(xx, y0 + 20); ctx.lineTo(xx, y1 - 20); ctx.stroke(); });
      ctx.strokeStyle = col.s[3]; ctx.beginPath(); ctx.moveTo(x0 + 20, y0 + 20); ctx.lineTo(x0 + 20, y1 - 20); ctx.stroke();
      ellipse(ctx, x0 + 20, cy, 9, 14, col.s[3], col.ink, 1.5);
      const Pc = [[x1, y1 - 20], [x0 + 20, y1 - 20], [x0 + 20, y0 + 20], [x1, y0 + 20]];
      for (let i = 0; i < 12; i++) { const f = (t * 0.1 + i / 12) % 1; const L = (x1 - x0 - 20) * 2 + (y1 - y0 - 40); let d = f * L, x, y; if (d < x1 - x0 - 20) { x = x0 + 20 + d; y = y1 - 20; ellipse(ctx, x, y, 3.5, 3.5, col.s[0]); } else if (d < x1 - x0 - 20 + (y1 - y0 - 40)) { const dd = d - (x1 - x0 - 20); x = x0 + 20; y = y1 - 20 - dd; ellipse(ctx, x, y, 3.5, 3.5, col.s[3]); } else { x = x0 + 20 + (d - (x1 - x0 - 20) - (y1 - y0 - 40)); y = y0 + 20; ellipse(ctx, x, y, 3.5, 3.5, red); } }
      text(ctx, 'dorsal vessel', x1, y0 + 8, { color: red, size: 10.5, weight: 700, align: 'right' }); text(ctx, 'ventral vessel', x1, y1 - 7, { color: col.s[0], size: 10.5, weight: 700, align: 'right' }); text(ctx, 'hearts (loops)', x0 + 34, cy, { color: col.ink, size: 10.5, weight: 700 });
    } else if (k === 'co') {
      ctx.fillStyle = col.s[4] + '33'; ctx.strokeStyle = col.s[4]; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(x0, y0 + 10, x1 - x0, y1 - y0 - 20, 28); ctx.fill(); ctx.stroke();
      const hy = y0 + 30, n = 13; for (let i = 0; i < n; i++) { const cx = x0 + 20 + (x1 - x0 - 40) * i / (n - 1); ellipse(ctx, cx, hy, (x1 - x0 - 40) / n / 2 + 1, 6 + 2 * Math.sin(t * 3 - i * 0.4), col.s[3], col.ink, 1); }
      text(ctx, 'tube-like heart (13 chambers)', x1 - 4, hy - 12, { color: col.ink, size: 10, weight: 700, align: 'right', fit: false });
      for (let i = 0; i < 14; i++) { const ph = (t * 0.4 + i / 14) % 1, hx = x0 + 30 + ((i * 53) % 100) / 100 * (x1 - x0 - 60), ty = hy + 8 + ph * (y1 - hy - 30); ellipse(ctx, hx + Math.sin(ph * 6 + i) * 10, ty, 3, 3, col.s[2]); }
      [0.2, 0.5, 0.8].forEach((f, i) => { ellipse(ctx, x0 + (x1 - x0) * f, y1 - 34, 18, 10, col.panel, col.s[5], 1.5); text(ctx, ['gut', 'ovary', 'nerve cord'][i], x0 + (x1 - x0) * f, y1 - 34, { color: col.ink, size: 10, align: 'center', fit: false }); });
      text(ctx, 'haemolymph bathes the organs in the haemocoel (blood spaces)', w / 2, y1 - 8, { color: col.muted, size: 10, align: 'center' });
    } else {
      const cx = w / 2, vy = y0 + 70, ra = [cx - 42, y0 + 20], la = [cx + 42, y0 + 20];
      const heart = [[cx - 70, y0 + 12], [cx + 70, y0 + 12], [cx + 40, vy + 50], [cx - 40, vy + 50]];
      ellipse(ctx, ra[0], ra[1] + 10, 28, 20, col.s[0] + '88', col.ink, 1.5); ellipse(ctx, la[0], la[1] + 10, 28, 20, red + '88', col.ink, 1.5); ellipse(ctx, cx, vy + 36, 38, 28, col.s[4] + 'aa', col.ink, 1.5);
      text(ctx, 'R atrium', ra[0], ra[1] + 10, { color: col.ink, size: 10, align: 'center', weight: 700, fit: false }); text(ctx, 'L atrium', la[0], la[1] + 10, { color: col.ink, size: 10, align: 'center', weight: 700, fit: false }); text(ctx, 'ventricle', cx, vy + 36, { color: col.ink, size: 10.5, align: 'center', weight: 700, fit: false });
      const body = [[x0 + 10, y1 - 40], [x0 + 10, y0 + 10], [ra[0] - 24, y0 + 10]], lung = [[x1 - 10, y1 - 40], [x1 - 10, y0 + 10], [la[0] + 24, y0 + 10]];
      ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.beginPath(); body.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
      ctx.strokeStyle = red; ctx.beginPath(); lung.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
      ctx.strokeStyle = col.s[4]; ctx.beginPath(); ctx.moveTo(cx, vy + 64); ctx.lineTo(cx, y1 - 10); ctx.lineTo(x0 + 10, y1 - 10); ctx.lineTo(x0 + 10, y1 - 40); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx, y1 - 10); ctx.lineTo(x1 - 10, y1 - 10); ctx.lineTo(x1 - 10, y1 - 40); ctx.stroke();
      dots([[x0 + 10, y1 - 40], [x0 + 10, y0 + 10], [ra[0] - 24, y0 + 10]], 5, col.s[0], 0.3); dots([[x1 - 10, y1 - 40], [x1 - 10, y0 + 10], [la[0] + 24, y0 + 10]], 5, red, 0.3);
      for (let i = 0; i < 6; i++) { const f = (t * 0.35 + i / 6) % 1; ellipse(ctx, cx + (i % 2 ? 1 : -1) * 12 * (1 - f) , vy + 18 + f * 46, 3.5, 3.5, i % 2 ? red : col.s[0]); }
      text(ctx, 'body (deoxygenated)', x0 + 14, y1 - 24, { color: col.s[0], size: 10, weight: 700, fit: false }); text(ctx, 'lungs + skin (oxygenated)', x1 - 14, y1 - 24, { color: red, size: 10, weight: 700, align: 'right', fit: false });
      text(ctx, 'mixed blood goes out', cx, y1 + 2, { color: col.s[4], size: 10, weight: 700, align: 'center', fit: false });
    }
  };
}
