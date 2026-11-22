// Close-packed layers seen from above. Layer A is a hexagonal sheet of spheres; layer B sits in half of its hollows;
// the third layer can go straight above A (ABAB: hexagonal close-packed) or over the hollows that are still open
// (ABCABC: face-centred cubic). Use the layer buttons (or the step player) and the choice of third layer.
import { canvas, row, choice, readout, text, title, button } from '../kit.js';

const S3 = Math.sqrt(3);
// shift of each layer type in units of the sphere radius (the sheet spacing is 2)
const OFF = { A: [0, 0], B: [1, 1 / S3], C: [2, 2 / S3] };
export default function (host) {
  let n = 2, third = 'C';
  const seq = () => ['A', 'B', third, ...(third === 'C' ? ['A', 'B', 'C'] : ['B', 'A', 'B'])].slice(0, 6).map((v, i) => (third === 'A' && i > 2 ? ['B', 'A', 'B'][i - 3] : v));
  const cv = canvas(host, { aspect: 0.8, max: 380, min: 270, label: 'Close-packed layers of spheres seen from above' });
  const ctl = row(host);
  button(ctl, '− Layer', () => { n = Math.max(1, n - 1); cv.redraw(); show(); });
  button(ctl, '+ Layer', () => { n = Math.min(6, n + 1); cv.redraw(); show(); });
  choice(ctl, 'Third layer', [['A', 'Over A (ABA)'], ['C', 'Over the gaps (ABC)']], third, (v) => { third = v; cv.redraw(); show(); });
  const out = readout(host);
  const COL = (l, col) => ({ A: col.s[0], B: col.s[1], C: col.s[2] }[l]);
  function show() {
    const s = seq().slice(0, n).join('');
    const kind = n < 3 ? 'Two layers: every sphere in B rests on three spheres of A.' : third === 'A' ? 'Pattern ABAB…: hexagonal close-packed (hcp), as in Mg, Zn, Ti.' : 'Pattern ABCABC…: face-centred cubic (fcc, cubic close-packed), as in Cu, Al, Ag, Au.';
    out.innerHTML = `<b>Stack ${s}.</b> ${kind} Either way each sphere touches 12 others and the packing fraction is 74.05%. The layers differ only in how the third one is placed.`;
  }
  cv.draw = (ctx, w, h, col) => {
    const r = Math.min(w / 13, 22), cx = w / 2, cy = h / 2 - 2, L = seq().slice(0, n);
    const place = (l, fn) => {
      const [ox, oy] = OFF[l];
      for (let j = -4; j <= 4; j++) for (let i = -5; i <= 5; i++) {
        const x = (2 * i + j + ox) * r, y = (S3 * j + oy) * r;
        if (Math.abs(x) < w / 2 - r * 0.2 && Math.abs(y) < h / 2 - 40) fn(cx + x, cy + y);
      }
    };
    L.forEach((l, k) => {
      place(l, (x, y) => {
        ctx.beginPath(); ctx.arc(x, y, r * 0.96, 0, Math.PI * 2);
        ctx.globalAlpha = k === L.length - 1 ? 0.95 : 0.55 + 0.1 * k; ctx.fillStyle = COL(l, col); ctx.fill();
        ctx.globalAlpha = 1; ctx.strokeStyle = col.panel; ctx.lineWidth = 1.5; ctx.stroke();
      });
    });
    // mark the two kinds of hollow left for the next layer
    if (n < 6) {
      const nxt = seq()[n], other = n === 1 ? null : null;
      const mark = (l, label, c) => { let done = false; place(l, (x, y) => { if (!done && Math.abs(x - cx) < r * 2.2 && Math.abs(y - cy) < r * 1.6 && (x - cx) > 0) { done = true; ctx.setLineDash([4, 3]); ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r * 0.5, 0, 7); ctx.stroke(); ctx.setLineDash([]); } }); };
      if (n === 2) { mark('A', '', col.s[0]); mark('C', '', col.s[2]); }
      else if (n === 1) mark('B', '', col.s[1]);
    }
    title(ctx, 'Looking down on the stack: ' + L.join(' '), col);
    L.forEach((l, k) => { ctx.fillStyle = COL(l, col); ctx.fillRect(12 + k * 26, h - 26, 22, 14); text(ctx, l, 23 + k * 26, h - 19, { color: col.panel, size: 11, weight: 700, align: 'center' }); });
    if (n === 2) text(ctx, 'dashed rings = the two kinds of open hollow: over A, or over the gaps (C)', 12, h - 40, { color: col.muted, size: 10.5, fit: true });
  };
  show();
  return { step(i) { n = Math.min(6, i + 1); cv.redraw(); show(); } };
}
