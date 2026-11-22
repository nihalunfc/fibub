// Class 10 Control and Coordination (step player): the synapse, the gap (about 20 nm) between two neurons. The electrical
// impulse reaches the axon end, which releases packets of chemical (neurotransmitter) into the gap. The chemical diffuses
// across and binds to receptors on the next neuron, starting a new electrical impulse there. Signals cross one way only.
import { canvas, text, title, line, dot, loop, rng } from '../../kit.js';

const CAP = ['An impulse runs down the axon of the first neuron toward its end.', 'At the axon end, packets (vesicles) of chemical move to the edge.', 'The vesicles release the chemical (neurotransmitter) into the gap.', 'The chemical drifts across the gap and fits receptors on the next neuron.', 'The receptors start a new electrical impulse in the second neuron. The chemical is then cleared away.'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 290, label: 'A synapse: chemical messenger molecules crossing the gap between two neurons' });
  const R = rng(8), Q = Array.from({ length: 14 }, () => [R(), R(), R()]);
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'The synapse, step ' + (step + 1) + ' of 5', col) + 8, cx = w / 2, gap = 26, ph = h - top - 56, y0 = top + 4;
    // neuron 1 (top) and neuron 2 (bottom)
    const n1 = y0 + ph * 0.42, n2 = n1 + gap;
    ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.28; ctx.beginPath(); ctx.moveTo(cx - 70, y0 - 10); ctx.lineTo(cx + 70, y0 - 10); ctx.lineTo(cx + 70, n1 - 14); ctx.quadraticCurveTo(cx + 40, n1 + 2, cx, n1); ctx.quadraticCurveTo(cx - 40, n1 + 2, cx - 70, n1 - 14); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = col.s[4]; ctx.globalAlpha = 0.28; ctx.beginPath(); ctx.moveTo(cx - 90, n2 + 14); ctx.quadraticCurveTo(cx - 40, n2 - 2, cx, n2); ctx.quadraticCurveTo(cx + 40, n2 - 2, cx + 90, n2 + 14); ctx.lineTo(cx + 90, y0 + ph + 4); ctx.lineTo(cx - 90, y0 + ph + 4); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; ctx.stroke();
    text(ctx, 'neuron 1 (axon end)', cx - 60, y0 + 8, { color: col.muted, size: 10 }); text(ctx, 'neuron 2 (dendrite)', cx - 60, y0 + ph - 6, { color: col.muted, size: 10 }); text(ctx, 'gap', cx + 80, (n1 + n2) / 2, { color: col.s[7], size: 10, weight: 700 });
    // receptors
    for (let i = -3; i <= 3; i++) { const x = cx + i * 18; ctx.fillStyle = step >= 3 ? col.s[7] : col.muted; ctx.fillRect(x - 4, n2 + 1 + Math.abs(i) * 1.2, 8, 6); }
    // impulse
    if (step === 0) { const f = (t * 0.7) % 1; dot(ctx, cx, y0 + 8 + f * (n1 - y0 - 24), 6, col.s[1], col.panel); }
    if (step === 4) { const f = (t * 0.7) % 1; dot(ctx, cx + 40 * 0, n2 + 14 + f * (y0 + ph - n2 - 20), 6, col.s[1], col.panel); }
    // vesicles
    const vs = (i) => [cx - 52 + (i % 5) * 26, n1 - 30 + Math.floor(i / 5) * 14];
    for (let i = 0; i < 10; i++) { const [x, y] = vs(i); let yy = y; if (step === 1) yy = y + 4 * Math.sin(t * 3 + i) + 4; if (step >= 2) { /* released */ } else dot(ctx, x, yy, 6, col.panel, col.s[2]); }
    // neurotransmitter dots
    if (step >= 2) Q.forEach(([a, b, c], i) => { let f = step === 2 ? 0.15 * ((t * 0.5 + c) % 1) : step === 3 ? 0.1 + 0.85 * ((t * 0.35 + c) % 1) : 0.9; if (step === 4) f = 0.95; const x = cx - 54 + a * 108 + Math.sin(t * 2 + i) * 3, y = n1 + 2 + f * (gap - 6); if (step === 4 && i % 2) return; dot(ctx, x, y, 3, col.s[7]); });
    const words = CAP[step].split(' '); let ls = ['', '']; let k = 0; words.forEach((wd) => { if ((ls[k] + ' ' + wd).length > w / 5.9 && k < 1) k++; ls[k] = (ls[k] + ' ' + wd).trim(); });
    ls.forEach((l, i) => l && text(ctx, l, w / 2, h - 32 + i * 14, { color: col.ink, size: 10.5, align: 'center' }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
