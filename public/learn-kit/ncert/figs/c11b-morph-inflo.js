// Class 11 Biology, Morphology of Flowering Plants: two kinds of inflorescence. In a racemose inflorescence the main axis keeps growing and flowers open in order from the base towards the tip (acropetal): oldest at the bottom.
// In a cymose inflorescence the main axis ends in a flower, so it stops growing; younger flowers open on side branches below it (basipetal order). Slide time to see which flowers have opened.
import { canvas, text, title, row, choice, slider, readout } from '../../kit.js';
import { ell, note } from '../c11b-lib.js';

export default function (host) {
  let k = 'rac', t = 6;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 300, label: 'A racemose and a cymose inflorescence with flowers numbered in the order they open' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Inflorescence', [['rac', 'Racemose'], ['cym', 'Cymose']], k, (v) => { k = v; go(); });
  slider(ctl, { label: 'time', min: 0, max: 6, step: 1, value: t, fmt: (v) => 'stage ' + v, oninput: (v) => { t = v; go(); } });
  const go = () => { ro.textContent = k === 'rac' ? 'Racemose: the axis never ends in a flower and keeps growing. The oldest flower is at the base, the youngest near the tip (examples: mustard, radish, Crotalaria; a spike, a raceme, an umbel, a head).' : 'Cymose: the first flower ends the main axis. New flowers open below it on side branches, so the oldest flower is at the top or centre (examples: Bougainvillea, cotton, jasmine).'; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, k === 'rac' ? 'Racemose: oldest at the bottom' : 'Cymose: oldest at the top', col), cx = w / 2, bot = h - 36, top = y0 + 24;
    const flower = (x, y, n, on) => { for (let p = 0; p < 5; p++) { const a = p * 1.2566; ell(ctx, x + Math.cos(a) * 8, y + Math.sin(a) * 8, 5.5, 5.5, on ? col.s[3] : col.soft, col.ink, 1, on ? 0.85 : 0.5); } ell(ctx, x, y, 4, 4, on ? col.s[4] : col.panel, col.ink, 1); text(ctx, String(n), x + 20, y, { color: on ? col.ink : col.muted, size: 11, weight: 700 }); };
    if (k === 'rac') {
      const last = Math.min(6, t) + 1; ctx.strokeStyle = col.s[1]; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx, bot); ctx.lineTo(cx, top + 6 + (6 - Math.min(t, 6)) * 0); ctx.stroke();
      for (let i = 0; i < 7; i++) { const y = bot - 10 - i * ((bot - top - 30) / 6), on = i <= t, sg = i % 2 ? 1 : -1; ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, y); ctx.lineTo(cx + sg * 22, y - 2); ctx.stroke(); flower(cx + sg * 30, y - 2, i + 1, on); }
      ell(ctx, cx, top + 4, 5, 5, col.s[1], null, 0); text(ctx, 'axis keeps growing', cx + 12, top + 2, { color: col.muted, size: 10.5 }); text(ctx, 'oldest (base)', 12, bot - 10, { color: col.muted, size: 10.5 });
    } else {
      // terminal flower 1 at the top, then 2 and 3 on side branches, 4-7 below
      const P = [[0, 0], [-1, 1], [1, 1], [-1.7, 2], [-0.5, 2], [0.5, 2], [1.7, 2]];
      const dy = (bot - top - 30) / 3.2;
      ctx.strokeStyle = col.s[1]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, bot); ctx.lineTo(cx, top + 10); ctx.stroke();
      const pos = (i) => [cx + P[i][0] * Math.min(46, (w - 80) / 5), top + 10 + P[i][1] * dy * 0.9];
      [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]].forEach(([a, b]) => { const A = pos(a), B = pos(b); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); });
      for (let i = 0; i < 7; i++) { const [x, y] = pos(i); flower(x - 4, y, i + 1, i <= t); }
      text(ctx, 'main axis ends in flower 1', 12, top + 30 + 0, { color: col.muted, size: 10.5 });
    }
    text(ctx, 'dark flowers have opened at this stage', w / 2, h - 12, { color: col.muted, size: 10.5, align: 'center' });
  };
  go();
}
