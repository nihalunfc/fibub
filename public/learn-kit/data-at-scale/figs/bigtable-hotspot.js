// 4.3 Watch it happen: why a timestamp-first row key makes a hotspot. Four nodes each serve one range of row keys.
// With keys that start with the time, every new write sorts to the end and lands on the last node. Leading with the
// user ID spreads the same writes over all nodes, and then adding nodes really adds capacity.
import { canvas, text, title, line, ease, loop, calm } from '../../kit.js';

const rr = (ctx, x, y, w, h, r = 4) => { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); };
const ST = [
  { cap: 'Key = time#user: all writes hit one node', nodes: 4, load: [0, 0, 0, 100], key: '2026-11-22T10:00:07#u481', ranges: ['…T07', 'T07…T09', 'T09…T10', 'T10… (now)'] },
  { cap: 'Add two nodes: still one hot node', nodes: 6, load: [0, 0, 0, 0, 0, 100], key: '2026-11-22T10:00:08#u112', ranges: ['…', '…', '…', '…', '…', 'now'] },
  { cap: 'Key = user#reverse time: writes spread', nodes: 4, load: [26, 24, 25, 25], key: 'u481#9223370305', ranges: ['u0…u2', 'u2…u5', 'u5…u7', 'u7…u9'] },
  { cap: 'Now two more nodes really help', nodes: 6, load: [17, 16, 17, 17, 16, 17], key: 'u112#9223370304', ranges: ['u0…', 'u1…', 'u3…', 'u5…', 'u6…', 'u8…'] },
];
export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 320, min: 250, label: 'Write load bars on Bigtable nodes for two row key designs' });
  let step = 0, prev = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt / 0.8); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const s = ST[step], p = ST[prev], e = ease(k);
    title(ctx, s.cap, col);
    text(ctx, 'new row key: ' + s.key, 10, 40, { color: col.muted, size: 11.5 });
    const L = 12, R = w - 12, T = 62, B = h - 52, n = s.nodes, cw = (R - L) / n;
    line(ctx, [[L, B], [R, B]], col.muted, 1);
    for (let i = 0; i < n; i++) {
      const before = p.nodes === n ? p.load[i] : s.load[i] * e, v = before + (s.load[i] - before) * e, x = L + i * cw + 6, bh = ((B - T - 16) * v) / 100;
      ctx.fillStyle = v > 80 ? col.bad : col.s[0]; rr(ctx, x, B - bh, cw - 12, bh); ctx.fill();
      text(ctx, Math.round(v) + '%', x + (cw - 12) / 2, B - bh - 9, { color: col.ink, size: 11, weight: 700, align: 'center', fit: false });
      text(ctx, 'node ' + (i + 1), x + (cw - 12) / 2, B + 11, { color: col.muted, size: 10.5, align: 'center', fit: false });
      text(ctx, s.ranges[i], x + (cw - 12) / 2, B + 25, { color: col.muted, size: 9.5, align: 'center', fit: false });
    }
    text(ctx, step < 2 ? 'Capacity used: one node only' : `Capacity used: all ${n} nodes`, 8, h - 10, { color: col.ink, size: 12, weight: 700 });
  };
  cv.redraw();
  return { step(i) { prev = step; step = Math.min(i, 3); k = calm() ? 1 : 0; cv.redraw(); if (!calm()) anim.play(); } };
}
