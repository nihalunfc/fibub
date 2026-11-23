// Class 8 Science, Electricity (step player): making and using a simple electromagnet. Wind insulated copper wire
// round an iron nail, connect a cell, and the nail picks up clips; open the switch and they drop.
import { canvas, text, title, line, dot, loop } from '../../kit.js';

const NM = ['Take a nail', 'Wind the wire', 'Connect the cell', 'Close the switch', 'Open the switch'];
const CAP = ['Take a soft iron nail. On its own it picks up nothing: it is not a magnet.', 'Wind insulated copper wire round the nail in neat turns, all the same way. More turns will mean a stronger magnet.', 'Connect the two ends of the wire to a cell and a switch. The switch is open, so no current flows yet.', 'Close the switch. Current flows round the coil and the nail becomes a magnet: the clips jump up to it.', 'Open the switch. The current stops, the magnetism disappears and the clips fall. That is the big use of an electromagnet.'];
export default function (host) {
  let k = 0, t = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Steps of making an electromagnet with a nail, wire and cell' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, NM[k], col);
    const cx = w * 0.4, top = 56, len = 120;
    ctx.fillStyle = col.muted; ctx.fillRect(cx - 7, top, 14, len); dot(ctx, cx, top + len + 3, 7, col.muted);
    if (k >= 1) for (let i = 0; i < 9; i++) { const y = top + 14 + i * 10; line(ctx, [[cx - 15, y], [cx + 15, y + 5]], col.s[1], 3); }
    if (k >= 2) { const bx = w * 0.72; line(ctx, [[cx - 15, top + 14], [cx - 15, top - 12], [bx - 40, top - 12]], col.ink, 2); line(ctx, [[cx + 15, top + 99], [bx + 20, top + 99], [bx + 20, top + 10]], col.ink, 2);
      line(ctx, [[bx - 40, top - 12], [bx - 40, top + 10]], col.ink, 2); line(ctx, [[bx - 40, top + 10], [bx - 6, top + 10]], col.ink, 2); line(ctx, [[bx - 4, top - 2], [bx - 4, top + 22]], col.ink, 4); line(ctx, [[bx + 4, top + 4], [bx + 4, top + 16]], col.ink, 2); line(ctx, [[bx + 4, top + 10], [bx + 20, top + 10]], col.ink, 2);
      text(ctx, 'cell', bx, top + 36, { color: col.muted, size: 10.5, align: 'center' });
      const sx = bx - 60; ctx.fillStyle = col.panel; ctx.fillRect(sx - 6, top + 40, 52, 14); line(ctx, k === 3 ? [[sx, top + 48], [sx + 40, top + 48]] : [[sx, top + 48], [sx + 34, top + 30]], col.s[2], 3); text(ctx, k === 3 ? 'switch ON' : 'switch OFF', sx + 20, top + 64, { color: col.ink, size: 10.5, align: 'center' }); }
    const on = k === 3;
    if (k >= 3) for (let i = 0; i < 6; i++) { const hold = on; const x = cx - 18 + (i % 3) * 15, y = hold ? top + len + 18 + Math.floor(i / 3) * 11 : h * 0.62 + 40 + (i % 2) * 10 + Math.min(1, (t * 2)) * 0; ctx.strokeStyle = hold ? col.s[4] : col.muted; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x - 6, y - 3, 12, 7, 3); ctx.stroke(); }
    if (k < 3) for (let i = 0; i < 6; i++) { const x = cx - 40 + i * 16, y = h * 0.62 + 40; ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x - 6, y - 3, 12, 7, 3); ctx.stroke(); }
    ctx.font = '400 11px system-ui'; const L = []; let cur = '';
    CAP[k].split(' ').forEach((wd) => { const tt = cur ? cur + ' ' + wd : wd; if (ctx.measureText(tt).width > w - 24) { L.push(cur); cur = wd; } else cur = tt; }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, 12, h - 12 - (L.length - 1 - i) * 15, { color: col.ink, size: 11 }));
  };
  cv.redraw();
  return { step(i) { k = Math.min(Math.max(0, i), 4); t = 0; cv.redraw(); } };
}
