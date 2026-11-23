// Class 11 Structural Organisation in Animals: muscle tissue. Skeletal muscle: long, striated, many nuclei, voluntary. Smooth: spindle cells, one nucleus, involuntary.
// Cardiac: branched, striated, one nucleus, joined by intercalated discs, involuntary. The animation shows the cells shortening when they contract.
import { canvas, text, title, row, choice, loop, button } from '../../kit.js';
import { ellipse, footer } from '../c11b-ex-util.js';

const T = {
  sk: ['Skeletal', 'Long cylinder fibres with stripes (striations) and many nuclei at the edge. Voluntary: you decide when to move. Attached to bones by tendons (biceps).'],
  sm: ['Smooth', 'Spindle-shaped cells with one central nucleus and no stripes. Involuntary: in the walls of the gut, blood vessels and bladder.'],
  ca: ['Cardiac', 'Branching striated cells, one nucleus each, joined end to end by intercalated discs that pass the signal quickly. Involuntary, never tires: the heart wall.'],
};
export default function (host) {
  let k = 'sk', t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Skeletal, smooth and cardiac muscle cells that shorten when they contract' });
  const ctl = row(host);
  choice(ctl, 'Muscle', Object.entries(T).map(([v, a]) => [v, a[0]]), k, (v) => { k = v; cv.redraw(); });
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }); anim.button(ctl);
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, T[k][0] + ' muscle', col), fy = footer(ctx, w, h, col, T[k][1]);
    const c = 0.5 + 0.5 * Math.sin(t * 2.2), sh = 1 - 0.22 * c, x0 = 16, W = w - 32, cy = (t0 + fy) / 2;
    text(ctx, c > 0.5 ? 'contracting' : 'relaxed', w - 14, t0 + 8, { color: c > 0.5 ? col.s[3] : col.muted, size: 11, weight: 700, align: 'right', fit: false });
    const stripes = (x, y, len, hh, n) => { ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; for (let i = 1; i < n; i++) { const xx = x + len * i / n; ctx.beginPath(); ctx.moveTo(xx, y + 2); ctx.lineTo(xx, y + hh - 2); ctx.stroke(); } };
    if (k === 'sk') {
      const len = W * sh, hh = 34;
      for (let r = -1; r <= 1; r++) { const y = cy + r * 46 - hh / 2, x = x0 + (W - len) / 2; ctx.fillStyle = col.s[4] + '44'; ctx.fillRect(x, y, len, hh); ctx.strokeStyle = col.s[4]; ctx.lineWidth = 1.5; ctx.strokeRect(x, y, len, hh); stripes(x, y, len, hh, Math.floor(W / 14)); for (let j = 1; j < 5; j++) ellipse(ctx, x + len * j / 5, y + 5, 5, 3, col.s[0]); }
      text(ctx, 'many nuclei at the edge', w / 2, cy + 74, { color: col.ink, size: 10.5, align: 'center' });
    } else if (k === 'sm') {
      const len = W * 0.5 * sh, hh = 26 + 12 * c;
      for (let r = -1; r <= 1; r++) { const y = cy + r * 46, xc = x0 + W / 2 + r * 24; ctx.fillStyle = col.s[2] + '55'; ctx.strokeStyle = col.s[2]; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(xc - len / 2, y); ctx.quadraticCurveTo(xc, y - hh / 2, xc + len / 2, y); ctx.quadraticCurveTo(xc, y + hh / 2, xc - len / 2, y); ctx.fill(); ctx.stroke(); ellipse(ctx, xc, y, len * 0.1, 4 + 2 * c, col.s[0]); }
      text(ctx, 'one nucleus, no stripes, tapered ends', w / 2, cy + 74, { color: col.ink, size: 10.5, align: 'center' });
    } else {
      const len = W * 0.4 * sh, hh = 30, band = (x1, y1, x2, y2) => { ctx.fillStyle = col.s[3] + '44'; ctx.strokeStyle = col.s[3]; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x1 - 8, y1); ctx.lineTo(x1 + 8, y1); ctx.lineTo(x2 + 8, y2); ctx.lineTo(x2 - 8, y2); ctx.closePath(); ctx.fill(); ctx.stroke(); };
      const cell = (x, y) => { ctx.fillStyle = col.s[3] + '44'; ctx.strokeStyle = col.s[3]; ctx.lineWidth = 1.5; ctx.fillRect(x, y, len, hh); ctx.strokeRect(x, y, len, hh); stripes(x, y, len, hh, 7); ellipse(ctx, x + len / 2, y + hh / 2, 5, 4, col.s[0]); };
      const ya = cy - 54, xa = x0 + 6, yc = ya + 70, step = len + 8, xc = xa + step / 2 + (W - 12 - 2 * len - 8) / 2;
      band(xa + len * 0.5, ya + hh, xc + len * 0.25, yc); band(xa + step + len * 0.5, ya + hh, xc + len * 0.75, yc);
      cell(xa, ya); cell(xa + step, ya); cell(xc, yc);
      ctx.fillStyle = col.s[4]; ctx.fillRect(xa + len + 2, ya - 3, 4, hh + 6);
      text(ctx, 'intercalated disc', xa + len + 4, ya - 12, { color: col.s[4], size: 10.5, weight: 700, align: 'center' });
      text(ctx, 'branches join cells into a net', w / 2, yc + hh + 14, { color: col.ink, size: 10.5, align: 'center' });
    }
  };
}
