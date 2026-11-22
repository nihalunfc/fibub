// Class 12 Chemistry, Biomolecules: base pairing in nucleic acids. Tap a base on the top strand to change it (A, T, G, C); the partner strand follows the pairing rules.
// DNA: A pairs with T (2 hydrogen bonds), G pairs with C (3 hydrogen bonds). In RNA, U replaces T, so A pairs with U. The more G-C pairs, the more hydrogen bonds and the higher the melting temperature.
// Rough melting temperature (Wallace rule for short DNA): Tm = 2 x (A + T) + 4 x (G + C) in deg C.
import { canvas, text, title, row, choice, button, readout } from '../../kit.js';

const NEXT = { A: 'T', T: 'G', G: 'C', C: 'A' }, PAIR = { A: 'T', T: 'A', G: 'C', C: 'G' };
export default function (host) {
  let seq = ['A', 'T', 'G', 'C', 'C', 'A', 'T', 'G'], mode = 'DNA';
  const cv = canvas(host, { aspect: 0.9, max: 380, min: 320, label: 'Two strands of nucleic acid whose bases pair A with T (or U) and G with C' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'partner strand', [['DNA', 'DNA (T)'], ['RNA', 'RNA (U)']], mode, (v) => { mode = v; go(); });
  button(ctl, 'AT-rich', () => { seq = ['A', 'T', 'T', 'A', 'A', 'T', 'A', 'T']; go(); });
  button(ctl, 'GC-rich', () => { seq = ['G', 'C', 'C', 'G', 'G', 'C', 'G', 'C']; go(); });
  button(ctl, 'Random', () => { seq = seq.map(() => 'ATGC'[Math.floor(Math.random() * 4)]); go(); });
  const partner = (b) => (mode === 'RNA' && b === 'A' ? 'U' : PAIR[b]), pairs = () => seq.map((b) => (b === 'A' || b === 'T' ? 2 : 3));
  const go = () => { const hb = pairs().reduce((a, b) => a + b, 0), gc = seq.filter((b) => b === 'G' || b === 'C').length; ro.textContent = `Top strand 5′-${seq.join('')}-3′; partner 3′-${seq.map(partner).join('')}-5′. ${hb} hydrogen bonds, GC content ${(100 * gc / seq.length).toFixed(0)} %.` + (mode === 'DNA' ? ` Rough melting temperature (Wallace rule) ${2 * (seq.length - gc) + 4 * gc} °C.` : ' RNA is normally a single strand; here its partner pairs with the DNA template, as in transcription.'); cv.redraw(); };
  const geo = (w, h) => { const n = seq.length, L = 20, sp = (w - 2 * L) / n; return { n, L, sp, y1: 82, y2: 82 + 118 }; };
  cv.c.addEventListener('click', (e) => { const r = cv.c.getBoundingClientRect(), g = geo(cv.w, cv.h), x = e.clientX - r.left, y = e.clientY - r.top; const i = Math.floor((x - g.L) / g.sp); if (i >= 0 && i < g.n && y > g.y1 - 22 && y < g.y1 + 22) { seq[i] = NEXT[seq[i]]; go(); } });
  cv.c.style.cursor = 'pointer';
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Tap a base on the top strand to change it', col), g = geo(w, h), C = { A: col.s[0], T: col.s[3], G: col.s[1], C: col.s[2], U: col.s[3] };
    text(ctx, "5′", 6, g.y1, { color: col.muted, size: 10 }); text(ctx, "3′", 6, g.y2, { color: col.muted, size: 10 }); text(ctx, "3′", w - 6, g.y1, { color: col.muted, size: 10, align: 'right' }); text(ctx, "5′", w - 6, g.y2, { color: col.muted, size: 10, align: 'right' });
    ctx.strokeStyle = col.muted; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(g.L, g.y1 - 24); ctx.lineTo(w - g.L, g.y1 - 24); ctx.moveTo(g.L, g.y2 + 24); ctx.lineTo(w - g.L, g.y2 + 24); ctx.stroke(); text(ctx, 'sugar–phosphate backbone', w / 2, g.y1 - 36, { color: col.muted, size: 10, align: 'center' });
    seq.forEach((b, i) => {
      const x = g.L + g.sp * (i + 0.5), p = partner(b), nb = b === 'A' || b === 'T' ? 2 : 3;
      ctx.save(); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.setLineDash([3, 3]); for (let k = 0; k < nb; k++) { const dx = (k - (nb - 1) / 2) * 6; ctx.beginPath(); ctx.moveTo(x + dx, g.y1 + 20); ctx.lineTo(x + dx, g.y2 - 20); ctx.stroke(); } ctx.restore();
      const cell = (l, y, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(x - g.sp * 0.38, y - 18, g.sp * 0.76, 36, 7); ctx.fill(); text(ctx, l, x, y, { color: col.panel, size: 17, weight: 700, align: 'center' }); };
      cell(b, g.y1, C[b]); cell(p, g.y2, C[p]);
      text(ctx, String(nb), x, (g.y1 + g.y2) / 2, { color: col.s[1], size: 11, weight: 700, align: 'center', halo: col.panel });
    });
    text(ctx, 'number between strands = hydrogen bonds in that pair', w / 2, g.y2 + 52, { color: col.muted, size: 10.5, align: 'center' });
    const hb = pairs().reduce((a, b) => a + b, 0), gc = seq.filter((b) => b === 'G' || b === 'C').length, by = g.y2 + 78, bw = w - 40;
    ctx.fillStyle = col.line; ctx.fillRect(20, by, bw, 12); ctx.fillStyle = col.s[1]; ctx.fillRect(20, by, bw * gc / seq.length, 12);
    text(ctx, `GC content ${(100 * gc / seq.length).toFixed(0)} %   hydrogen bonds ${hb}`, w / 2, by + 28, { color: col.ink, size: 12, weight: 700, align: 'center' });
  };
  go();
}
