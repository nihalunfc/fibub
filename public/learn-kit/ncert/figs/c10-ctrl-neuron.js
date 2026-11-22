// Class 10 Control and Coordination (step player): how a nerve impulse travels. Stimulus -> receptor -> dendrite tip of
// the sensory neuron -> (chemical signal in) -> cell body -> axon (electrical impulse) -> axon end, where a chemical
// is released across the gap (synapse) -> dendrite of the next neuron or a muscle or gland. A moving pulse shows where the
// signal is at each step. Impulses in a neuron move one way only: dendrite to axon.
import { canvas, text, title, line, dot, loop } from '../../kit.js';

const CAP = ['A receptor (here a touch receptor in the skin) detects a stimulus and starts a signal.', 'The tip of the dendrite picks up the signal; a chemical reaction makes an electrical impulse.', 'The impulse passes through the cell body (with the nucleus) to the start of the axon.', 'It runs along the long axon, which may be a metre long; the myelin sheath makes it faster.', 'At the axon end the impulse releases a chemical across the tiny gap (synapse) to the next cell.', 'The next neuron (or muscle or gland) receives it and the message goes on, in one direction only.'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 290, label: 'A nerve impulse travelling along a neuron from dendrite to axon end and across a synapse' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Journey of a signal: step ' + (step + 1) + ' of 6', col) + 6, cy = top + (h - top) * 0.36, X = (f) => f * w;
    // dendrites
    for (let i = -2; i <= 2; i++) line(ctx, [[X(0.28), cy], [X(0.14), cy + i * 12], [X(0.06), cy + i * 18]], col.s[3], 2);
    // cell body
    dot(ctx, X(0.3), cy, 17, col.panel, col.s[3]); dot(ctx, X(0.3), cy, 6, col.s[3]);
    // axon with myelin
    line(ctx, [[X(0.35), cy], [X(0.8), cy]], col.s[3], 3);
    for (let i = 0; i < 5; i++) { ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.5; ctx.fillRect(X(0.4) + i * X(0.075), cy - 5, X(0.055), 10); ctx.globalAlpha = 1; }
    // axon end + next cell
    [-1, 0, 1].forEach((i) => { line(ctx, [[X(0.8), cy], [X(0.86), cy + i * 12]], col.s[3], 2); dot(ctx, X(0.865), cy + i * 12, 3, col.s[3]); });
    ctx.strokeStyle = col.s[4]; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(X(0.97), cy, 22, 1.9, 4.4); ctx.stroke();
    text(ctx, 'dendrites', X(0.12), cy - 40, { color: col.muted, size: 10, align: 'center' }); text(ctx, 'cell body', X(0.3), cy + 30, { color: col.muted, size: 10, align: 'center' }); text(ctx, 'axon (myelin sheath)', X(0.58), cy + 22, { color: col.muted, size: 10, align: 'center' }); text(ctx, 'synapse', X(0.88), cy - 36, { color: col.muted, size: 10, align: 'center' }); text(ctx, 'next cell', X(0.95), cy + 36, { color: col.muted, size: 9.5, align: 'center' });
    // stimulus
    if (step === 0) { dot(ctx, X(0.02), cy, 6 + Math.sin(t * 6) * 2, col.s[7]); text(ctx, 'stimulus', X(0.06), cy + 44, { color: col.s[7], size: 10.5, weight: 700, align: 'center' }); }
    // moving pulse
    const f = (t * 0.5) % 1, xs = [[0.02, 0.28], [0.06, 0.28], [0.24, 0.35], [0.35, 0.8], [0.8, 0.88], [0.88, 0.97]][step];
    const px = X(xs[0] + (xs[1] - xs[0]) * f); dot(ctx, px, cy, 7, col.s[7], col.panel);
    if (step === 4) for (let i = 0; i < 6; i++) { const g = ((t * 0.8 + i / 6) % 1); dot(ctx, X(0.865 + 0.09 * g), cy + Math.sin(i * 2) * 10, 2.6, col.s[2]); }
    text(ctx, ['receptor', 'dendrite', 'cell body', 'axon', 'axon end', 'next cell'][step], X(0.5), top + 8, { color: col.s[7], size: 12, weight: 700, align: 'center' });
    const words = CAP[step].split(' '); let ls = ['', '', '']; let k = 0; words.forEach((wd) => { if ((ls[k] + ' ' + wd).length > w / 6 && k < 2) k++; ls[k] = (ls[k] + ' ' + wd).trim(); });
    ls.forEach((l, i) => l && text(ctx, l, w / 2, h - 44 + i * 14, { color: col.ink, size: 10.5, align: 'center' }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
