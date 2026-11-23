// Class 11 Chemistry, Chemical Bonding (step player): filling the molecular orbitals of O2 with its 12 valence electrons.
// Order for O2: sigma2s < sigma*2s < sigma2pz < pi2p (2) < pi*2p (2) < sigma*2pz. Fill from the bottom, Hund's rule for the degenerate pi*.
// Bond order = (bonding - antibonding electrons)/2 = (8 - 4)/2 = 2. Two unpaired electrons in pi*2p: paramagnetic.
import { canvas, text, title } from '../../kit.js';

export default function (host) {
  let step = 0;
  const TITLES = ['Set out the energy ladder', 'Fill σ2s and σ*2s (4 electrons)', 'Fill σ2pz and the two π2p (6 electrons)', 'Two electrons left: one each into π*2p', 'Bond order and magnetism'];
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 340, label: 'Molecular orbital energy diagram of oxygen filled step by step' });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, TITLES[step], col), top = t0 + 24, bot = h - 56, Y = (i) => bot - (bot - top) * i / 6.6;
    // levels: [name, rank, x slots, electrons by step]
    const L = [['σ2s', 0, 1, 2, 1], ['σ*2s', 1, 1, 2, 1], ['σ2pz', 2, 1, 2, 2], ['π2p', 3, 2, 4, 2], ['π*2p', 4.2, 2, 2, 3], ['σ*2pz', 6, 1, 0, 9]];
    const cx = w / 2, lw = 44;
    // atomic orbital sides
    const ao = [[0.6, '2s'], [2.8, '2p ×3']];
    [[w * 0.12, 'O'], [w * 0.88, 'O']].forEach(([x, lab], s) => { ao.forEach(([r, nm]) => { ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x - 20, Y(r + 0.2)); ctx.lineTo(x + 20, Y(r + 0.2)); ctx.stroke(); text(ctx, nm, x, Y(r + 0.2) - 11, { color: col.muted, size: 10.5, align: 'center' }); }); text(ctx, lab + ' (atom)', x, h - 34, { color: col.muted, size: 10.5, align: 'center' }); });
    ctx.setLineDash([3, 4]); ctx.strokeStyle = col.line; ao.forEach(([r]) => { [0.12, 0.88].forEach((fx) => { /* connectors drawn below */ }); });
    ctx.setLineDash([]);
    L.forEach(([nm, r, slots, e, st]) => {
      const bonding = !nm.includes('*');
      for (let s = 0; s < slots; s++) {
        const x = cx + (slots === 2 ? (s ? 1 : -1) * 32 : 0), y = Y(r + 0.2);
        ctx.strokeStyle = bonding ? col.s[2] : col.s[3]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x - lw / 2, y); ctx.lineTo(x + lw / 2, y); ctx.stroke();
        const n = step >= st ? (slots === 2 ? (e === 4 ? 2 : (step >= 3 ? 1 : 0)) : e) : 0;
        const arrowUp = (xx, up) => { ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); const y0 = y - 4, y1 = y - 20; if (up) { ctx.moveTo(xx, y0); ctx.lineTo(xx, y1); ctx.moveTo(xx - 3.5, y1 + 5); ctx.lineTo(xx, y1); ctx.lineTo(xx + 3.5, y1 + 5); } else { ctx.moveTo(xx, y1); ctx.lineTo(xx, y0); ctx.moveTo(xx - 3.5, y0 - 5); ctx.lineTo(xx, y0); ctx.lineTo(xx + 3.5, y0 - 5); } ctx.stroke(); };
        if (n >= 1) arrowUp(x - 6, true); if (n >= 2) arrowUp(x + 6, false);
      }
      text(ctx, nm, cx + (slots === 2 ? 80 : 40), Y(r + 0.2), { color: bonding ? col.s[2] : col.s[3], size: 11.5, weight: 700 });
    });
    if (step === 0) text(ctx, 'green = bonding, orange = antibonding (higher)', w / 2, h - 12, { color: col.muted, size: 11, align: 'center' });
    if (step === 1) text(ctx, 'σ2s² σ*2s²: they cancel, no net bond', w / 2, h - 12, { color: col.muted, size: 11, align: 'center' });
    if (step === 2) text(ctx, '8 electrons in bonding levels so far', w / 2, h - 12, { color: col.muted, size: 11, align: 'center' });
    if (step === 3) text(ctx, 'Hund: put one in each π* before pairing', w / 2, h - 12, { color: col.muted, size: 11, align: 'center' });
    if (step === 4) { text(ctx, 'bond order = (8 − 4) / 2 = 2', w / 2, h - 28, { color: col.s[2], size: 13, weight: 700, align: 'center' }); text(ctx, '2 unpaired e⁻: paramagnetic (sticks to a magnet)', w / 2, h - 10, { color: col.ink, size: 11.5, weight: 700, align: 'center' }); }
  };
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
