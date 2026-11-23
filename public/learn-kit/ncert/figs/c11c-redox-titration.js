// Class 11 Chemistry, Redox Reactions: a redox titration. 0.020 M KMnO4 (purple) from the burette into 25.0 mL of Fe2+ in dilute H2SO4.
// MnO4- + 5Fe2+ + 8H+ -> Mn2+ + 5Fe3+ + 4H2O. Each drop of purple is decolourised while Fe2+ remains; the first permanent pink marks the end point
// (KMnO4 is its own indicator). moles Fe2+ = 5 x moles MnO4- at the end point.
import { canvas, text, title, slider, readout, row } from '../../kit.js';

export default function (host) {
  let cF = 0.1, V = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A burette of potassium permanganate being added to iron(II) with the flask colour changing at the end point' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'unknown [Fe²⁺] (M)', min: 0.05, max: 0.2, step: 0.01, value: cF, fmt: (v) => v.toFixed(2), oninput: (v) => { cF = v; go(); } });
  slider(ctl, { label: 'KMnO₄ added (mL)', min: 0, max: 45, step: 0.5, value: V, fmt: (v) => v.toFixed(1), oninput: (v) => { V = v; go(); } });
  const eqV = () => (25 * cF) / 5 / 0.02;
  const go = () => {
    const nM = V * 0.02, nF = 25 * cF, left = Math.max(0, nF - 5 * nM), e = eqV();
    ro.textContent = `Fe²⁺ at start ${nF.toFixed(2)} mmol; MnO₄⁻ added ${nM.toFixed(2)} mmol (reacts with ${(5 * nM).toFixed(2)} mmol Fe²⁺); Fe²⁺ left ${left.toFixed(2)} mmol. End point at ${e.toFixed(1)} mL: [Fe²⁺] = 5 × 0.020 × ${e.toFixed(1)} ÷ 25 = ${cF.toFixed(2)} M.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Titration of Fe²⁺ with KMnO₄', col);
    const e = eqV(), bx = w * 0.25, fx = w * 0.62, bt = 48, bh = 150;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(bx - 12, bt, 24, bh); const fill = Math.max(0, 1 - V / 50);
    ctx.fillStyle = '#8e2a8e'; ctx.globalAlpha = 0.85; ctx.fillRect(bx - 10, bt + bh * (1 - fill), 20, bh * fill); ctx.globalAlpha = 1;
    for (let i = 0; i <= 5; i++) { const y = bt + (bh * i) / 5; ctx.beginPath(); ctx.moveTo(bx + 12, y); ctx.lineTo(bx + 18, y); ctx.stroke(); text(ctx, String(i * 10), bx + 22, y, { color: col.muted, size: 9.5 }); }
    text(ctx, 'KMnO₄', bx, bt - 10, { color: col.ink, size: 11, weight: 700, align: 'center' });
    // flask
    const fy = bt + bh + 24, state = V < e - 0.25 ? 0 : V <= e + 0.25 ? 1 : 2, cl = ['#e8dca0', '#e9a0c8', '#8e2a8e'][state];
    ctx.beginPath(); ctx.moveTo(fx - 12, fy - 40); ctx.lineTo(fx - 12, fy - 10); ctx.lineTo(fx - 44, fy + 40); ctx.lineTo(fx + 44, fy + 40); ctx.lineTo(fx + 12, fy - 10); ctx.lineTo(fx + 12, fy - 40); ctx.closePath();
    ctx.fillStyle = cl; ctx.globalAlpha = 0.8; ctx.fill(); ctx.globalAlpha = 1; ctx.lineWidth = 2; ctx.strokeStyle = col.ink; ctx.stroke();
    if (V > 0 && V < 45) { ctx.beginPath(); ctx.arc(bx, bt + bh + 6, 3, 0, 7); ctx.fillStyle = '#8e2a8e'; ctx.fill(); }
    text(ctx, ['pale yellow: Fe²⁺ still left, purple used up', 'first permanent pink: END POINT', 'purple: excess MnO₄⁻'][state], w / 2, h - 22, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
  };
  go();
}
