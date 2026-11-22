// The respiratory electron transport chain in the inner mitochondrial membrane. NADH and FADH₂ hand electrons to
// complexes I to IV; the energy pumps H⁺ out of the matrix, and the H⁺ flowing back through ATP synthase makes ATP.
// Oxygen is the last electron acceptor and becomes water. Try each poison: it shows which step the others depend on.
import { canvas, loop, row, choice, readout, text, title } from '../kit.js';

const MODES = {
  none: { name: 'Normal', e: 1, pump: 1, atp: 1, txt: 'Electrons flow, protons are pumped, ATP synthase turns. About 2.5 ATP per NADH and 1.5 per FADH₂.' },
  cn: { name: 'Cyanide (blocks IV)', e: 0, pump: 0, atp: 0, txt: 'Complex IV cannot pass electrons to O₂, so the whole chain backs up: no pumping, no gradient, no ATP, no O₂ use.' },
  oligo: { name: 'Oligomycin (blocks ATP synthase)', e: 0.15, pump: 0.15, atp: 0, txt: 'Protons cannot flow back, the gradient builds until pumping stops: electron flow and O₂ use slow right down and no ATP is made.' },
  unc: { name: 'Uncoupler (dinitrophenol)', e: 1.6, pump: 1, atp: 0, txt: 'The membrane leaks H⁺, so the chain runs faster and uses more O₂, but the energy leaves as heat and little ATP is made.' },
};

export default function (host) {
  let mode = 'none', t = 0;
  const cv = canvas(host, { aspect: 1.0, max: 430, min: 340, label: 'The inner mitochondrial membrane with four complexes, ATP synthase and proton flow' });
  const ctl = row(host);
  loop(host, (dt) => { t += dt * MODES[mode].e; cv.redraw(); }).button(ctl);
  choice(ctl, 'Condition', Object.entries(MODES).map(([k, v]) => [k, v.name]), mode, (v) => { mode = v; show(); });
  const out = readout(host);
  const show = () => { out.innerHTML = `<b>${MODES[mode].name}.</b> ${MODES[mode].txt}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const M = MODES[mode], my = h * 0.5, hgt = 28;
    title(ctx, 'Inner mitochondrial membrane', col);
    ctx.fillStyle = col.s[4]; ctx.globalAlpha = 0.14; ctx.fillRect(0, 44, w, my - 44 - hgt / 2); ctx.globalAlpha = 1; ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.12; ctx.fillRect(0, my + hgt / 2, w, h - my - hgt / 2 - 30); ctx.globalAlpha = 1;
    text(ctx, 'intermembrane space (H⁺ high, acidic)', w - 8, 54, { color: col.s[4], size: 10.5, weight: 700, align: 'right' });
    text(ctx, 'matrix (H⁺ low)', w - 8, h - 38, { color: col.s[1], size: 10.5, weight: 700, align: 'right' });
    ctx.fillStyle = col.line; ctx.fillRect(0, my - hgt / 2, w, hgt); ctx.strokeStyle = col.muted; ctx.strokeRect(0, my - hgt / 2, w, hgt);
    const cx = [0.12, 0.27, 0.42, 0.57], names = ['I', 'II', 'III', 'IV'];
    cx.forEach((f, i) => { ctx.beginPath(); ctx.roundRect(f * w - 18, my - hgt / 2 - 6, 36, hgt + 12, 8); ctx.fillStyle = col.s[i === 1 ? 5 : 0]; ctx.globalAlpha = 0.85; ctx.fill(); ctx.globalAlpha = 1; text(ctx, names[i], f * w, my, { color: '#fff', size: 12, weight: 700, align: 'center' }); });
    // ATP synthase
    const ax = 0.82 * w; ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.roundRect(ax - 14, my - hgt / 2 - 4, 28, hgt + 8, 6); ctx.fill(); ctx.beginPath(); ctx.arc(ax, my + hgt / 2 + 22, 18, 0, 7); ctx.fill();
    text(ctx, 'ATP synthase', ax, my + hgt / 2 + 54, { color: col.s[2], size: 10, weight: 700, align: 'center', fit: true });
    if (M.atp) { const a = t * 3; ctx.strokeStyle = col.panel; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ax, my + hgt / 2 + 22); ctx.lineTo(ax + 14 * Math.cos(a), my + hgt / 2 + 22 + 14 * Math.sin(a)); ctx.stroke(); }
    // electron flow: NADH -> I -> Q -> III -> cyt c -> IV -> O2 (dots along the membrane)
    const ey = my + hgt / 2 + 20; ctx.strokeStyle = col.bad; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(cx[0] * w, ey); ctx.lineTo(cx[3] * w, ey); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'NADH', cx[0] * w - 4, ey + 16, { color: col.ink, size: 10, weight: 700, align: 'center', fit: false }); text(ctx, 'FADH₂', cx[1] * w, ey + 30, { color: col.ink, size: 10, weight: 700, align: 'center', fit: false });
    text(ctx, 'O₂ → H₂O', cx[3] * w + 4, ey + 16, { color: col.ink, size: 10, weight: 700, align: 'center', fit: false });
    if (M.e > 0) for (let i = 0; i < 4; i++) { const f = ((t * 0.25 + i / 4) % 1); ctx.beginPath(); ctx.arc(cx[0] * w + f * (cx[3] - cx[0]) * w, ey, 4, 0, 7); ctx.fillStyle = col.bad; ctx.fill(); }
    // protons: pumped up at I, III, IV; flow back down through ATP synthase (or leak)
    const HY = my - hgt / 2 - 18;
    [0, 2, 3].forEach((i) => { if (M.pump) for (let j = 0; j < 3; j++) { const f = ((t * 0.5 * M.pump + j / 3) % 1); ctx.beginPath(); ctx.arc(cx[i] * w + (j - 1) * 6, my - hgt / 2 - 8 - f * 30, 3, 0, 7); ctx.fillStyle = col.warn; ctx.fill(); } });
    const pile = mode === 'cn' ? 0 : mode === 'unc' ? 4 : mode === 'oligo' ? 14 : 8;
    for (let i = 0; i < pile; i++) { ctx.beginPath(); ctx.arc(20 + ((i * 53) % (w - 40)), HY - 14 - (i % 3) * 8, 3, 0, 7); ctx.fillStyle = col.warn; ctx.fill(); }
    if (M.atp) for (let j = 0; j < 3; j++) { const f = ((t * 0.5 + j / 3) % 1); ctx.beginPath(); ctx.arc(ax + (j - 1) * 5, my - 30 + f * 70, 3, 0, 7); ctx.fillStyle = col.warn; ctx.fill(); }
    if (mode === 'unc') { for (let j = 0; j < 3; j++) { const f = ((t * 0.6 + j / 3) % 1); ctx.beginPath(); ctx.arc(w * 0.68 + j * 12, my - 28 + f * 60, 3, 0, 7); ctx.fillStyle = col.warn; ctx.fill(); } text(ctx, 'leak (heat)', w * 0.68, my + hgt / 2 + 48, { color: col.bad, size: 10, weight: 700, fit: false }); }
    text(ctx, M.atp ? 'ADP + Pi → ATP' : 'no ATP made', ax, h - 12, { color: M.atp ? col.s[2] : col.bad, size: 11, weight: 700, align: 'center' });
    text(ctx, 'yellow = H⁺, red = electrons', 8, h - 12, { color: col.muted, size: 9.5 });
  };
  show();
}
