// Class 11 Biology, Biological Classification: virus structure. A virus is genetic material (DNA or RNA, never both) inside a protein coat (the capsid, made of capsomeres). Tobacco mosaic virus is a helical rod of RNA;
// a bacteriophage has a head, a tail and tail fibres and carries DNA; influenza virus has RNA pieces and an envelope. Choose a virus and switch between whole and cut open.
import { canvas, text, title, row, choice, readout } from '../../kit.js';
import { rr, ell, tag, curve, poly } from '../c11b-lib.js';

const INFO = { tmv: 'Tobacco mosaic virus (TMV) infects plants. Its single-stranded RNA is wound inside a spiral of identical protein units.', phage: 'A bacteriophage infects bacteria. The head holds double-stranded DNA; the tail and fibres attach to a bacterium and inject the DNA.', flu: 'Influenza virus infects animals. It has RNA in several pieces, a capsid and an outer envelope with spikes.' };
export default function (host) {
  let v = 'tmv', cut = false;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Structure of a virus with labels for the capsid and genetic material' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Virus', [['tmv', 'TMV (plants)'], ['phage', 'Bacteriophage'], ['flu', 'Influenza']], v, (x) => { v = x; upd(); });
  choice(ctl, 'View', [[false, 'Whole'], [true, 'Cut open']], cut, (x) => { cut = x; upd(); });
  const upd = () => { ro.textContent = INFO[v]; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, { tmv: 'TMV: helical RNA virus', phage: 'Bacteriophage: DNA virus', flu: 'Influenza: enveloped RNA virus' }[v], col), cx = w / 2, cy = y0 + (h - y0) / 2 - 6;
    if (v === 'tmv') {
      const L = Math.min(w - 120, 240), x0 = cx - L / 2, hh = 44;
      rr(ctx, x0, cy - hh / 2, L, hh, 8, col.s[0], col.ink, 1.5);
      for (let i = 0; i < 16; i++) { ctx.strokeStyle = col.panel; ctx.globalAlpha = 0.6; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x0 + 6 + i * (L - 12) / 15, cy - hh / 2 + 3); ctx.lineTo(x0 + 14 + i * (L - 12) / 15, cy + hh / 2 - 3); ctx.stroke(); ctx.globalAlpha = 1; }
      if (cut) { ctx.save(); ctx.beginPath(); ctx.rect(x0 + L * 0.18, cy - hh / 2 - 2, L * 0.5, hh + 4); ctx.clip(); ctx.fillStyle = col.panel; ctx.fillRect(x0, cy - hh / 2, L, hh); ctx.restore(); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 3; ctx.beginPath(); for (let u = 0; u <= 1; u += 0.02) { const X = x0 + L * 0.18 + u * L * 0.5, Y = cy + 10 * Math.sin(u * 22); u ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke(); tag(ctx, 'RNA (genome)', x0 + L * 0.43, cy + 10, x0 + L * 0.43, cy + hh + 22, col, 'left', col.s[3]); }
      tag(ctx, 'capsid (protein units)', x0 + L * 0.9, cy - hh / 2 + 2, x0 + L * 0.55, cy - hh - 18, col, 'left');
      text(ctx, '~300 nm long', cx, cy + hh + 54, { color: col.muted, size: 11, align: 'center' });
    }
    if (v === 'phage') {
      const hx = cx, hy = cy - 52, r = 34;
      poly(ctx, [[hx - r, hy - r * 0.4], [hx - r * 0.5, hy - r], [hx + r * 0.5, hy - r], [hx + r, hy - r * 0.4], [hx + r, hy + r * 0.4], [hx + r * 0.5, hy + r], [hx - r * 0.5, hy + r], [hx - r, hy + r * 0.4]], col.s[0], col.ink, 1.5, 0.85);
      if (cut) { ctx.strokeStyle = col.s[3]; ctx.lineWidth = 3; ctx.beginPath(); for (let u = 0; u < 12; u++) { ctx.moveTo(hx - 20 + (u % 4) * 12, hy - 20 + Math.floor(u / 4) * 14); ctx.lineTo(hx - 10 + (u % 4) * 12, hy - 14 + Math.floor(u / 4) * 14); } ctx.stroke(); tag(ctx, 'DNA', hx + 12, hy, hx + r + 22, hy - 6, col, 'left', col.s[3]); }
      rr(ctx, hx - 7, hy + r, 14, 62, 3, col.s[1], col.ink, 1.2); for (let k = 0; k < 6; k++) { ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(hx - 7, hy + r + 6 + k * 9); ctx.lineTo(hx + 7, hy + r + 6 + k * 9); ctx.stroke(); }
      poly(ctx, [[hx - 18, hy + r + 62], [hx + 18, hy + r + 62], [hx + 12, hy + r + 74], [hx - 12, hy + r + 74]], col.s[2], col.ink, 1.2);
      [[-34, 30], [-22, 36], [22, 36], [34, 30]].forEach(([dx, dy]) => { ctx.strokeStyle = col.ink; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(hx + dx / 2, hy + r + 70); ctx.lineTo(hx + dx * 1.3, hy + r + 70 + dy); ctx.stroke(); });
      tag(ctx, 'head (capsid)', hx - r, hy - 20, hx - r - 14, hy - 20, col, 'right'); tag(ctx, 'tail', hx - 7, hy + r + 30, hx - 22, hy + r + 30, col, 'right'); tag(ctx, 'tail fibres', hx - 28, hy + r + 96, hx - 40, hy + r + 96, col, 'right');
    }
    if (v === 'flu') {
      const r = 56; ell(ctx, cx, cy, r, r, col.s[2], col.ink, 2, 0.35);
      for (let a = 0; a < 24; a++) { const th = a * Math.PI / 12; ctx.strokeStyle = col.s[4]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx + Math.cos(th) * r, cy + Math.sin(th) * r); ctx.lineTo(cx + Math.cos(th) * (r + 11), cy + Math.sin(th) * (r + 11)); ctx.stroke(); }
      ell(ctx, cx, cy, r - 12, r - 12, col.s[0], col.ink, 1.2, 0.5);
      if (cut) { [[-18, -14, 0.4], [10, -22, -0.5], [20, 8, 1], [-10, 14, 0.2], [-24, 6, -1]].forEach(([dx, dy, rt]) => { ctx.save(); ctx.translate(cx + dx, cy + dy); ctx.rotate(rt); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 3.2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-9, 0); ctx.lineTo(9, 0); ctx.stroke(); ctx.restore(); }); tag(ctx, 'RNA pieces', cx + 20, cy + 8, cx + r + 20, cy + 40, col, 'left', col.s[3]); }
      tag(ctx, 'spikes', cx + r * 0.7 + 7, cy - r * 0.7 - 7, cx + r + 22, cy - r - 8, col, 'left'); tag(ctx, 'envelope', cx - r + 2, cy + 8, cx - r - 12, cy + 30, col, 'right'); tag(ctx, 'capsid', cx - r * 0.6, cy - r * 0.5, cx - r - 12, cy - r - 4, col, 'right');
    }
  };
  upd();
}
