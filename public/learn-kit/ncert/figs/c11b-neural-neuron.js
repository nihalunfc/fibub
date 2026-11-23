// Class 11 Biology, Neural control: the neuron as the structural and functional unit of the nervous system. Dendrites receive signals, the cell body (with the nucleus and Nissl granules) integrates them,
// the axon carries the impulse away (insulated by myelin from Schwann cells, with bare nodes of Ranvier), and the axon terminals release neurotransmitter onto the next cell.
import { canvas, text, title, line, row, choice, readout } from '../../kit.js';

export default function (host) {
  let k = 'dend';
  const D = { dend: ['Dendrites', 'Short, branched. They receive signals from other neurons and bring them toward the cell body.'], soma: ['Cell body (cyton)', 'Holds the nucleus and Nissl granules (protein-making machinery). Adds up the incoming signals.'], axon: ['Axon', 'One long fibre that carries the impulse away from the cell body, sometimes over a metre.'], myelin: ['Myelin sheath and nodes', 'Fatty sheath made by Schwann cells. Gaps between them are the nodes of Ranvier, where the impulse jumps.'], term: ['Axon terminals', 'The tips swell into synaptic knobs holding vesicles of neurotransmitter, released onto the next cell.'] };
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 290, label: 'A neuron with dendrites, cell body, myelinated axon and axon terminals; choose a part to highlight it' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Part', [['dend', 'Dendrites'], ['soma', 'Cell body'], ['axon', 'Axon'], ['myelin', 'Myelin + nodes'], ['term', 'Terminals']], k, (v) => { k = v; go(); });
  const go = () => { ro.textContent = `${D[k][0]}: ${D[k][1]}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, D[k][0], col), cy = t0 + (h - t0) * 0.45, sx = w * 0.2, ax0 = sx + 22, ax1 = w * 0.8, c = (n) => (k === n ? col.s[3] : col.muted), wd = (n) => (k === n ? 4 : 2);
    [[-1, -40], [-0.4, -48], [0.4, -48], [1, -34], [0.9, 40], [-0.2, 46]].forEach(([a, b], i) => { const ex = sx - 54 - Math.abs(a) * 4, ey = cy + b; line(ctx, [[sx - 10, cy], [(sx + ex) / 2, (cy + ey) / 2 - 6], [ex, ey]], c('dend'), wd('dend')); line(ctx, [[ex, ey], [ex - 12, ey - 8 * Math.sign(b)]], c('dend'), wd('dend')); line(ctx, [[ex, ey], [ex - 10, ey + 6 * Math.sign(b)]], c('dend'), wd('dend')); void i; });
    ctx.beginPath(); ctx.arc(sx, cy, 20, 0, 7); ctx.fillStyle = k === 'soma' ? col.s[3] : col.soft; ctx.fill(); ctx.lineWidth = wd('soma'); ctx.strokeStyle = c('soma'); ctx.stroke(); ctx.beginPath(); ctx.arc(sx, cy, 7, 0, 7); ctx.fillStyle = col.ink; ctx.fill();
    line(ctx, [[ax0, cy], [ax1, cy]], c('axon'), wd('axon'));
    const n = 4, seg = (ax1 - ax0 - 20) / n; for (let i = 0; i < n; i++) { ctx.fillStyle = k === 'myelin' ? col.s[3] : col.s[0]; ctx.globalAlpha = k === 'myelin' ? 1 : 0.45; ctx.beginPath(); ctx.roundRect(ax0 + 14 + i * seg, cy - 8, seg - 10, 16, 7); ctx.fill(); ctx.globalAlpha = 1; }
    if (k === 'myelin') for (let i = 0; i < n; i++) text(ctx, 'node', ax0 + 14 + i * seg - 5, cy - 18, { color: col.ink, size: 9.5, align: 'center' });
    [-26, -9, 9, 26].forEach((dy) => { line(ctx, [[ax1, cy], [ax1 + 16, cy + dy]], c('term'), wd('term')); ctx.beginPath(); ctx.arc(ax1 + 20, cy + dy * 1.05, 5, 0, 7); ctx.fillStyle = k === 'term' ? col.s[3] : col.muted; ctx.fill(); });
    text(ctx, 'impulse travels this way →', w / 2, cy + 70, { color: col.muted, size: 10.5, align: 'center' });
  };
  go();
}
