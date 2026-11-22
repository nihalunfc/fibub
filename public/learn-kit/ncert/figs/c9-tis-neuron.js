// Class 9 Tissues (step player): how a nerve impulse travels along a neuron and across a gap. Dendrites receive,
// the cell body (with the nucleus) passes the signal to the long axon, the impulse (an electrical wave) runs along the
// axon (faster with a fatty myelin sheath), and at the axon end chemicals cross the small gap (synapse) to the next
// neuron or a muscle or gland. Nervous tissue is made of neurons.
import { canvas, text, title, dot, line, loop } from '../../kit.js';

const CAP = ['A neuron has three parts: dendrites (short branches), a cell body with the nucleus, and a long axon. Nervous tissue is built of neurons.', 'A stimulus (a pinprick, a smell, a sound) excites the dendrites. They gather the signal.', 'The signal passes through the cell body into the axon.', 'The impulse runs down the axon as a wave of electrical change, like a Mexican wave. The fatty myelin sheath makes it faster.', 'At the axon end, tiny packets of chemical (neurotransmitter) cross the narrow gap, the synapse.', 'The chemical excites the next neuron, or a muscle which contracts, or a gland which releases a secretion.'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.64, max: 440, min: 300, label: 'A neuron passing an impulse along its axon and a chemical across the synapse to a muscle' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, ['Parts of a neuron', 'Dendrites receive', 'Cell body', 'Impulse along the axon', 'Across the synapse', 'Response'][step], col);
    const cy = h * 0.34, x0 = 20, bx = w * 0.2, ax1 = w * 0.74;
    for (let i = -2; i <= 2; i++) { line(ctx, [[bx - 14, cy + i * 2], [x0 + 10, cy + i * 14], [x0, cy + i * 18]], step === 1 ? col.s[3] : col.s[4], 2.2); }
    dot(ctx, bx, cy, 17, col.s[0]); dot(ctx, bx, cy, 6, col.panel);
    line(ctx, [[bx + 17, cy], [ax1, cy]], col.s[4], 3);
    for (let i = 0; i < 5; i++) { ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.roundRect(bx + 28 + i * ((ax1 - bx - 40) / 5), cy - 6, (ax1 - bx - 40) / 5 - 8, 12, 5); ctx.fill(); }
    dot(ctx, ax1 + 6, cy, 6, col.s[4]);
    // next target
    const gx = ax1 + 24; ctx.fillStyle = step === 5 ? col.good : col.s[1]; ctx.globalAlpha = 0.75; ctx.beginPath(); ctx.roundRect(gx, cy - 22 - (step === 5 ? Math.abs(Math.sin(t * 6)) * 4 : 0), w - gx - 8, 44 + (step === 5 ? Math.abs(Math.sin(t * 6)) * 8 : 0), 10); ctx.fill(); ctx.globalAlpha = 1;
    text(ctx, 'dendrites', 10, cy - 36, { color: col.muted, size: 10 }); text(ctx, 'cell body', bx, cy + 32, { color: col.muted, size: 10, align: 'center' }); text(ctx, 'axon + myelin', (bx + ax1) / 2, cy + 22, { color: col.muted, size: 10, align: 'center' }); text(ctx, 'muscle / next neuron', (gx + w) / 2, cy - 36, { color: col.muted, size: 10, align: 'center' });
    if (step === 1) for (let i = 0; i < 3; i++) { const p = (t * 0.8 + i / 3) % 1; dot(ctx, x0 - 6 + p * 40, cy - 28 + i * 28 - p * 8 * 0, 3, col.s[3]); }
    if (step === 2) dot(ctx, bx + Math.sin(t * 4) * 3, cy, 8, col.s[3]);
    if (step === 3) { const p = (t * 0.45) % 1, x = bx + 20 + p * (ax1 - bx - 24); ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(x, cy, 9, 0, 7); ctx.globalAlpha = 0.5; ctx.fill(); ctx.globalAlpha = 1; dot(ctx, x, cy, 4, col.s[3]); }
    if (step >= 4) for (let i = 0; i < 5; i++) { const p = step === 4 ? ((t * 0.7 + i / 5) % 1) : 1; dot(ctx, ax1 + 12 + p * 12, cy - 12 + i * 6, 2.4, col.s[3]); }
    text(ctx, 'synapse gap', ax1 + 14, cy + 40, { color: col.s[3], size: 10, weight: 700, align: 'center', halo: col.panel });
    const L = []; let cur = ''; ctx.font = '11px system-ui'; CAP[step].split(' ').forEach((wd) => { if (ctx.measureText((cur + ' ' + wd).trim()).width > w - 24 && cur) { L.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, w / 2, h * 0.6 + i * 15, { color: col.ink, size: 11, align: 'center' }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); t = 0; cv.redraw(); } };
}
