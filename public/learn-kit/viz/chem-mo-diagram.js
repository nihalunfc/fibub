// Molecular orbital diagrams for the second-period homonuclear molecules and their ions. Pick the molecule and a
// charge: electrons fill the MO levels from the bottom (Hund's rule in the π pair), and the readout gives the bond
// order and whether it is paramagnetic. Watch the σ2p and π2p levels swap places after N₂ (O₂, F₂, Ne₂).
import { canvas, text, row, choice, readout, title } from '../kit.js';

const MOL = [['H₂', 2, 'H'], ['He₂', 4, 'H'], ['Li₂', 2, 'L'], ['Be₂', 4, 'L'], ['B₂', 6, 'L'], ['C₂', 8, 'L'], ['N₂', 10, 'L'], ['O₂', 12, 'L'], ['F₂', 14, 'L'], ['Ne₂', 16, 'L']];
export default function (host) {
  let mi = 7, ch = 0;
  const cv = canvas(host, { aspect: 1.0, max: 460, min: 340, label: 'Molecular orbital energy diagram filled with electrons' });
  const c1 = row(host), c2 = row(host);
  choice(c1, 'Molecule', MOL.map((m, i) => [i, m[0]]), mi, (v) => { mi = v; set(); });
  choice(c2, 'Charge', [[1, '+1'], [0, 'neutral'], [-1, '−1']], ch, (v) => { ch = v; set(); });
  const out = readout(host);
  function levels() {
    const [name, ve, kind] = MOL[mi], e = ve - ch;
    let L;
    if (kind === 'H') L = [['σ1s', 1, 1], ['σ*1s', 1, 0]];
    else if (mi >= 7) L = [['σ2s', 1, 1], ['σ*2s', 1, 0], ['σ2p', 1, 1], ['π2p', 2, 1], ['π*2p', 2, 0], ['σ*2p', 1, 0]];
    else L = [['σ2s', 1, 1], ['σ*2s', 1, 0], ['π2p', 2, 1], ['σ2p', 1, 1], ['π*2p', 2, 0], ['σ*2p', 1, 0]];
    let left = Math.max(0, e); const filled = L.map(([n, b, bond]) => { const c = Math.min(left, 2 * b); left -= c; return { n, b, bond, c }; });
    return { name, e, filled };
  }
  function set() {
    const { name, e, filled } = levels();
    const nb = filled.reduce((s, l) => s + (l.bond ? l.c : 0), 0), na = filled.reduce((s, l) => s + (l.bond ? 0 : l.c), 0);
    let un = 0; filled.forEach((l) => { const up = Math.min(l.c, l.b), dn = l.c - up; un += up - dn; });
    const bo = (nb - na) / 2, sup = ch > 0 ? '⁺' : ch < 0 ? '⁻' : '';
    out.innerHTML = `<b>${name}${sup}</b> (${e} valence electrons${MOL[mi][2] === 'L' ? '; the 1s core pairs are not drawn' : ''}). Bonding ${nb}, antibonding ${na}: bond order = (${nb} − ${na}) ÷ 2 = <b>${bo}</b>${bo <= 0 ? ' (no stable molecule)' : ''}. Unpaired electrons: <b>${un}</b> (${un ? 'paramagnetic' : 'diamagnetic'}).${name === 'O₂' && !ch ? ' The two unpaired π* electrons explain why liquid O₂ sticks to a magnet.' : ''}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const { name, filled } = levels(), kind = MOL[mi][2];
    title(ctx, `MO diagram of ${name}${ch > 0 ? '⁺' : ch < 0 ? '⁻' : ''}`, col);
    const top = 50, bot = h - 22, n = filled.length, dy = (bot - top) / (n - 0.2), slot = (i) => bot - 14 - i * dy;
    const xm = w / 2, aoL = w * 0.12, aoR = w * 0.88, bw = Math.min(26, w * 0.07);
    const lev = (x, y, len, color, lw = 2) => { ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x - len / 2, y); ctx.lineTo(x + len / 2, y); ctx.stroke(); };
    // AO levels
    const aos = kind === 'H' ? [['1s', 0.5, 1]] : [['2s', 0.5, 1], ['2p', 3.5, 3]];
    aos.forEach(([nm, s, c]) => {
      const y = slot(s);
      [aoL, aoR].forEach((x) => { for (let k = 0; k < c; k++) lev(x + (k - (c - 1) / 2) * (bw * 0.8 + 3), y, bw * 0.8, col.muted); text(ctx, nm, x, y + 14, { color: col.muted, size: 11, align: 'center', fit: false }); });
    });
    // MO levels with arrows and dashed links
    filled.forEach((l, i) => {
      const y = slot(i), isS = /2s|1s/.test(l.n) && !/2p/.test(l.n);
      const srcY = slot(aos.length === 1 ? 0.5 : isS ? 0.5 : 3.5);
      ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = col.line; ctx.lineWidth = 1;
      [[aoL + bw * 0.5, xm - l.b * bw * 0.6], [aoR - bw * 0.5, xm + l.b * bw * 0.6]].forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(a, srcY); ctx.lineTo(b, y); ctx.stroke(); });
      ctx.restore();
      let upLeft = Math.min(l.c, l.b), dnLeft = l.c - upLeft;
      for (let k = 0; k < l.b; k++) {
        const x = xm + (k - (l.b - 1) / 2) * (bw + 6);
        lev(x, y, bw, l.bond ? col.s[0] : col.s[1], 2.5);
        [[k < upLeft, -bw * 0.22, 1], [k < dnLeft, bw * 0.22, -1]].forEach(([has, dx, dir]) => {
          if (!has) return;
          const px = x + dx; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px, y + (dir === 1 ? -2 : -16)); ctx.lineTo(px, y + (dir === 1 ? -16 : -2)); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(px - 3.5, y + (dir === 1 ? -12 : -6)); ctx.lineTo(px, y + (dir === 1 ? -17 : -1)); ctx.lineTo(px + 3.5, y + (dir === 1 ? -12 : -6)); ctx.stroke();
        });
      }
      text(ctx, l.n, xm + l.b * (bw + 6) / 2 + 8, y - 6, { color: l.bond ? col.s[0] : col.s[1], size: 11, weight: 700, fit: false });
    });
    text(ctx, 'Energy ↑', 8, top - 8, { color: col.muted, size: 10 });
    text(ctx, 'blue = bonding, orange = antibonding', w - 8, h - 8, { color: col.muted, size: 10, align: 'right' });
  };
  set();
}
