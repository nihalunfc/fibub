// Class 12 Maths, Probability: independent events. The whole square is the sample space (area 1). A is the left strip (width P(A)); B's area P(B) is stacked up from the bottom
// inside A and outside A. B is independent of A exactly when it fills the same fraction of both parts, that is when P(A ∩ B) = P(A) P(B), equivalently P(B | A) = P(B).
import { canvas, text, title, row, slider, button, readout } from '../../kit.js';

export default function (host) {
  let pA = 0.4, pB = 0.5, t = 0.2;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A unit square split into A and not A, with B filling a fraction of each part, to test independence' });
  const ctl = row(host), ro = readout(host);
  const lo = () => Math.max(0, pA + pB - 1), hi = () => Math.min(pA, pB);
  const sA = slider(ctl, { label: 'P(A)', min: 0.1, max: 0.9, step: 0.1, value: pA, fmt: (v) => v.toFixed(1), oninput: (v) => { pA = v; clampT(); go(); } });
  const sB = slider(ctl, { label: 'P(B)', min: 0.1, max: 0.9, step: 0.1, value: pB, fmt: (v) => v.toFixed(1), oninput: (v) => { pB = v; clampT(); go(); } });
  const sT = slider(ctl, { label: 'P(A ∩ B)', min: 0, max: 0.9, step: 0.01, value: t, fmt: (v) => v.toFixed(2), oninput: (v) => { t = v; clampT(); go(); } });
  button(ctl, 'Make them independent', () => { t = pA * pB; sT.set(t); go(); });
  const clampT = () => { t = Math.min(hi(), Math.max(lo(), t)); sT.set(t); };
  void sA; void sB;
  const go = () => {
    const ind = Math.abs(t - pA * pB) < 0.0051;
    ro.textContent = `P(A)P(B) = ${pA.toFixed(1)} × ${pB.toFixed(1)} = ${(pA * pB).toFixed(3)};  P(A ∩ B) = ${t.toFixed(2)}.  ${ind ? 'They match: A and B are independent, and P(B | A) = ' + (t / pA).toFixed(2) + ' = P(B).' : `They differ: A and B are dependent. P(B | A) = ${(t / pA).toFixed(2)} is not P(B) = ${pB.toFixed(1)}.`}  (The sliders keep the numbers possible.)`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Is B independent of A?', col) + 8, S = Math.min(w - 40, h - top - 30), x0 = (w - S) / 2, y0 = top, wa = S * pA, hIn = pA ? t / pA : 0, hOut = pA < 1 ? (pB - t) / (1 - pA) : 0;
    ctx.save(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.16; ctx.fillRect(x0, y0, wa, S); ctx.restore();
    ctx.save(); ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.55; ctx.fillRect(x0 + wa, y0 + S * (1 - hOut), S - wa, S * hOut); ctx.restore();
    ctx.save(); ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.75; ctx.fillRect(x0, y0 + S * (1 - hIn), wa, S * hIn); ctx.restore();
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, S, S); ctx.beginPath(); ctx.moveTo(x0 + wa, y0); ctx.lineTo(x0 + wa, y0 + S); ctx.stroke();
    text(ctx, 'A', x0 + wa / 2, y0 + 12, { color: col.s[0], size: 13, weight: 700, align: 'center' });
    text(ctx, 'not A', x0 + wa + (S - wa) / 2, y0 + 12, { color: col.muted, size: 12, weight: 700, align: 'center' });
    if (hIn > 0.12) text(ctx, `A∩B ${t.toFixed(2)}`, x0 + wa / 2, y0 + S * (1 - hIn / 2), { color: col.panel, size: 11, weight: 700, align: 'center' });
    if (hOut > 0.12) text(ctx, `B only ${(pB - t).toFixed(2)}`, x0 + wa + (S - wa) / 2, y0 + S * (1 - hOut / 2), { color: col.ink, size: 11, weight: 700, align: 'center' });
    text(ctx, `B fills ${(hIn * 100).toFixed(0)}% of A and ${(hOut * 100).toFixed(0)}% of not-A`, w / 2, y0 + S + 16, { color: Math.abs(hIn - hOut) < 0.015 ? col.good : col.ink, size: 11.5, weight: 700, align: 'center' });
  };
  clampT(); go();
}
