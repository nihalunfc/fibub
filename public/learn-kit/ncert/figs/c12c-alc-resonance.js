// Class 12 Chemistry, Alcohols, Phenols and Ethers: why phenol is acidic and why its ring is so reactive (step player).
// One lone pair on the O of -OH can overlap with the pi system of the ring and move onto the ortho and para carbons. Phenol has these resonance structures; so does phenoxide, which is why it forms easily.
// The same ortho/para electron richness explains why bromine and nitric acid attack phenol at the ortho and para positions.
import { canvas, text, title, arrow, loop, ease } from '../../kit.js';

const TT = ['Phenol: lone pair on oxygen', 'Lone pair moves into the ring', 'Charge sits on the ortho carbon', 'Then on the para carbon', 'Then on the other ortho carbon'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.92, max: 400, min: 310, label: 'Resonance structures of phenol showing negative charge on ortho and para carbons' });
  loop(host, (dt) => { t = Math.min(1, t + dt * 0.8); cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col), r = Math.min(w, h) * 0.2, cx = w / 2, cy = top + (h - top) * 0.45 + 4, e = ease(t);
    const P = (i) => [cx + r * Math.cos(-Math.PI / 2 + i * Math.PI / 3), cy + r * Math.sin(-Math.PI / 2 + i * Math.PI / 3)];
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < 6; i++) { const [x, y] = P(i); ctx[i ? 'lineTo' : 'moveTo'](x, y); } ctx.closePath(); ctx.stroke();
    [[0, 1], [2, 3], [4, 5]].forEach(([a, b]) => { const A = P(a), B = P(b), mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2, k = 0.14; ctx.beginPath(); ctx.moveTo(A[0] + (cx - A[0]) * k + (B[0] - A[0]) * 0.12, A[1] + (cy - A[1]) * k + (B[1] - A[1]) * 0.12); ctx.lineTo(B[0] + (cx - B[0]) * k - (B[0] - A[0]) * 0.12, B[1] + (cy - B[1]) * k - (B[1] - A[1]) * 0.12); ctx.stroke(); });
    const O = P(0), Ox = O[0], Oy = O[1] - 36;
    ctx.strokeStyle = col.ink; ctx.beginPath(); ctx.moveTo(O[0], O[1]); ctx.lineTo(Ox, Oy + 10); ctx.stroke();
    text(ctx, 'O', Ox, Oy, { color: col.s[3], size: 16, weight: 700, align: 'center', halo: col.panel }); text(ctx, 'H', Ox + 20, Oy - 2, { color: col.muted, size: 12, align: 'center' });
    if (step === 0) { ctx.fillStyle = col.s[0]; [-7, 7].forEach((d) => { ctx.beginPath(); ctx.arc(Ox + d - 12, Oy - 14, 2.6, 0, 7); ctx.fill(); }); text(ctx, 'lone pair', Ox - 40, Oy - 24, { color: col.s[0], size: 10.5, align: 'center' }); }
    const marks = [[], [], [1], [1, 3], [1, 3, 5]], mk = marks[step], pts = [1, 3, 5].map((i) => P(i));
    if (step >= 1) arrow(ctx, Ox - 10, Oy + 12, O[0] - 3, O[1] + 4, col.s[3], 2.4, 8);
    [1, 3, 5].forEach((i) => { if (!mk.includes(i) && !(step === 1)) return; const [x, y] = P(i); const o = i === 3 ? 'para' : 'ortho'; const a = i === step * 2 - 3 || (step === 1) ? 1 : 0.55; ctx.globalAlpha = step === 1 ? 0.5 : (i === (step === 2 ? 1 : step === 3 ? 3 : 5) ? 1 : 0.5); text(ctx, '−', x + (x - cx) * 0.34, y + (y - cy) * 0.34, { color: col.s[3], size: 24, weight: 700, align: 'center' }); ctx.globalAlpha = 1; text(ctx, o, x + (x - cx) * 0.75, y + (y - cy) * 0.75 + 6, { color: col.muted, size: 10, align: 'center' }); });
    if (step >= 1) { text(ctx, '+', Ox + 14, Oy + 24, { color: col.s[0], size: 15, weight: 700, align: 'center' }); }
    const L = (a, b) => { text(ctx, a, w / 2, h - 40, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, b, w / 2, h - 22, { color: col.muted, size: 11, align: 'center' }); };
    if (step === 0) L('The O is bonded to an sp² ring carbon.', 'Its lone pair lies next to the ring’s π cloud, so they can overlap.');
    if (step === 1) L('The lone pair is pulled into the ring (curved arrow).', 'Oxygen now carries a partial + charge; the ring gets extra electron density.');
    if (step === 2) L('Resonance structure 1: − on an ortho carbon.', 'The ring gets electron-rich at the positions next to and opposite OH.');
    if (step === 3) L('Structure 2: − on the para carbon.', 'The charge is shared over three ring positions: ortho, para, ortho.');
    if (step === 4) L('Structure 3: − on the second ortho carbon.', 'So Br₂ and HNO₃ attack ortho and para, and phenoxide is stable.');
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); t = 0; cv.redraw(); } };
}
