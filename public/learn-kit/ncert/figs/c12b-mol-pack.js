// Class 12 Molecular Basis of Inheritance: packaging of DNA. A human cell holds about 2 m of DNA in a nucleus a few micrometres across.
// Slide through the levels: double helix (2 nm), nucleosome beads (11 nm), chromatin fibre (30 nm), looped domains, metaphase chromosome (about 1400 nm).
import { canvas, text, title, line, row, slider, readout } from '../../kit.js';

const LV = [
  ['DNA double helix', '2 nm wide', 'Two strands twisted together; 0.34 nm between base pairs. 6.6 billion base pairs would stretch about 2.2 m.'],
  ['Nucleosomes: beads on a string', '11 nm', 'About 200 bp of DNA: 146 bp wrapped around a core of 8 histone proteins (positively charged, so they grip the negative DNA), the rest links the beads.'],
  ['Chromatin fibre', '30 nm', 'The beads coil up into a thicker fibre, helped by histone H1. Loosely packed chromatin is euchromatin (genes active); dense chromatin is heterochromatin.'],
  ['Looped domains', '300 nm', 'The fibre forms loops fixed to a scaffold of non-histone proteins.'],
  ['Metaphase chromosome', '1400 nm', 'The loops coil and fold again into the compact X seen under the microscope during cell division.'],
];
export default function (host) {
  let lv = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'DNA drawn at five levels of packaging from the double helix to a metaphase chromosome' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'Level of packing', min: 0, max: 4, step: 1, value: 0, fmt: (v) => String(v + 1), oninput: (v) => { lv = v; go(); } });
  const go = () => { ro.textContent = `${LV[lv][0]} (${LV[lv][1]}): ${LV[lv][2]}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, `${lv + 1}. ${LV[lv][0]}  (${LV[lv][1]})`, col), cx = w / 2, cy = t0 + (h - t0) / 2 - 4, S = Math.min(w, h - t0) * 0.42;
    ctx.save(); ctx.lineWidth = 3;
    if (lv === 0) {
      const pts1 = [], pts2 = [];
      for (let i = 0; i <= 80; i++) { const x = cx - S * 1.1 + (i / 80) * S * 2.2, ph = i / 80 * 6 * Math.PI; pts1.push([x, cy + Math.sin(ph) * 28]); pts2.push([x, cy - Math.sin(ph) * 28]); }
      for (let i = 2; i < 80; i += 3) { const [x, y1] = pts1[i], y2 = pts2[i][1]; line(ctx, [[x, y1], [x, y2]], col.muted, 1.5); }
      line(ctx, pts1, col.s[0], 3.5); line(ctx, pts2, col.s[3], 3.5);
    } else if (lv === 1) {
      line(ctx, [[cx - S * 1.15, cy], [cx + S * 1.15, cy]], col.s[0], 2);
      for (let i = 0; i < 6; i++) { const x = cx - S * 0.95 + i * S * 0.38; ctx.beginPath(); ctx.arc(x, cy, 16, 0, 7); ctx.fillStyle = col.s[2]; ctx.fill(); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, cy, 20, 0, 7); ctx.stroke(); }
      text(ctx, 'histone core (8 proteins)', cx, cy + 46, { color: col.muted, size: 11, align: 'center' });
    } else if (lv === 2) {
      for (let i = 0; i < 9; i++) { const x = cx - S * 1.05 + i * S * 0.26; ctx.beginPath(); ctx.ellipse(x, cy, 17, 34, 0.45, 0, 7); ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.85; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.stroke(); }
    } else if (lv === 3) {
      line(ctx, [[cx, cy - S * 0.95], [cx, cy + S * 0.95]], col.ink, 8);
      for (let i = 0; i < 6; i++) { const y = cy - S * 0.8 + i * S * 0.32; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(cx + sd * 44, y, 42, 20, 0, 0, 7); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 3; ctx.stroke(); } }
      text(ctx, 'protein scaffold', cx, cy + S + 4, { color: col.muted, size: 11, align: 'center' });
    } else {
      const arm = (dx, dy) => { for (let k = 0; k < 11; k++) { const y = cy + dy * (k / 10) * S * 0.9; ctx.beginPath(); ctx.ellipse(cx + dx, y, 20, 9, 0, 0, 7); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.9; ctx.fill(); ctx.globalAlpha = 1; } };
      arm(-24, -1); arm(24, -1); arm(-24, 1); arm(24, 1);
      ctx.beginPath(); ctx.arc(cx, cy, 11, 0, 7); ctx.fillStyle = col.s[3]; ctx.fill();
      text(ctx, 'centromere', cx + 34, cy, { color: col.muted, size: 11 });
    }
    ctx.restore();
    const bw = w - 40; for (let i = 0; i < 5; i++) { ctx.fillStyle = i <= lv ? col.s[0] : col.line; ctx.fillRect(20 + (bw / 5) * i + 1, h - 12, bw / 5 - 3, 5); }
  };
  go();
}
