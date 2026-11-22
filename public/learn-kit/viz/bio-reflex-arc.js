// A reflex arc as a step player: a pinprick travels receptor, sensory neuron, spinal cord (with a synapse), motor
// neuron and muscle. The reflex needs only the spinal cord, so the hand moves away before the brain has been told.
import { text, title } from '../kit.js';
import { stepper, mix, wrap } from './_bio-kit.js';

const NAMES = ['1. Stimulus: sharp pin', '2. Receptor, then sensory neuron', '3. Spinal cord: synapse', '4. Motor neuron', '5. Effector: muscle contracts'];
const TXT = ['Pain receptors in the skin are excited.', 'An impulse goes along the sensory (afferent) neuron through the dorsal root.', 'The impulse crosses a synapse in the grey matter (often via an interneuron); a branch also goes up to the brain.', 'The motor (efferent) neuron carries the command out through the ventral root.', 'The muscle (effector) contracts and the hand is pulled away; the brain feels the pain a moment later.'];

export default function (host) {
  return stepper(host, { aspect: 0.95, max: 400, min: 330, stages: 5, label: 'A reflex arc from skin to spinal cord to muscle' }, (ctx, w, h, col, st, k, t, pv) => {
    title(ctx, NAMES[st], col);
    const sc = [w * 0.5, h * 0.52], skin = [w * 0.86, h * 0.26], musc = [w * 0.86, h * 0.8];
    // spinal cord (grey matter butterfly)
    ctx.fillStyle = col.line; ctx.beginPath(); ctx.roundRect(w * 0.34, h * 0.28, w * 0.32, h * 0.46, 14); ctx.fill(); ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = col.s[4]; ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.ellipse(sc[0] - 16, sc[1], 14, 28, -0.2, 0, 7); ctx.ellipse(sc[0] + 16, sc[1], 14, 28, 0.2, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
    text(ctx, 'spinal cord', sc[0], h * 0.77, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, 'grey matter', sc[0], sc[1] + 40, { color: col.muted, size: 9, align: 'center', fit: false });
    // path points: skin -> ganglion -> cord synapse -> out -> muscle
    const path = [skin, [w * 0.66, h * 0.4], [sc[0] + 10, sc[1] - 8], [sc[0] + 10, sc[1] + 18], [w * 0.66, h * 0.64], musc];
    ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.strokeStyle = col.s[0]; ctx.beginPath(); path.slice(0, 3).forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
    ctx.strokeStyle = col.s[1]; ctx.beginPath(); path.slice(3).forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
    ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(path[2][0], path[2][1]); ctx.lineTo(path[3][0], path[3][1]); ctx.stroke();
    text(ctx, 'sensory neuron', w * 0.66, h * 0.36, { color: col.s[0], size: 10.5, weight: 700, align: 'center' });
    text(ctx, 'motor neuron', w * 0.64, h * 0.7, { color: col.s[1], size: 10.5, weight: 700, align: 'center' });
    text(ctx, 'dorsal root ganglion', w * 0.5, h * 0.2, { color: col.muted, size: 9.5, align: 'center', fit: false });
    ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(w * 0.66, h * 0.4, 7, 0, 7); ctx.fill();
    // brain branch
    ctx.setLineDash([4, 4]); ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(path[2][0], path[2][1] - 4); ctx.lineTo(w * 0.3, h * 0.16); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.4; ctx.beginPath(); ctx.ellipse(w * 0.2, h * 0.14, 30, 18, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1; text(ctx, 'brain', w * 0.2, h * 0.14, { color: col.ink, size: 11, weight: 700, align: 'center' });
    // skin / muscle
    ctx.fillStyle = col.s[5]; ctx.globalAlpha = 0.3; ctx.fillRect(w * 0.78, skin[1] - 34, w * 0.2, 56); ctx.globalAlpha = 1; text(ctx, 'skin + receptor', w * 0.88, skin[1] - 44, { color: col.s[5], size: 10, weight: 700, align: 'center', fit: false });
    const mh = st === 4 ? mix(22, 12, k) : st < 4 && pv === 4 ? 22 : 22;
    ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.45; ctx.beginPath(); ctx.ellipse(musc[0], musc[1], 38, mh, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1; text(ctx, 'muscle (effector)', musc[0], musc[1] + 34, { color: col.s[1], size: 10, weight: 700, align: 'center', fit: false });
    if (st === 0) { ctx.strokeStyle = col.bad; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(skin[0] + 14, skin[1] - 30); ctx.lineTo(skin[0], skin[1] - 8 + 8 * k); ctx.stroke(); text(ctx, 'pin', skin[0] - 6, skin[1] - 52 + 4, { color: col.bad, size: 10, weight: 700, align: 'right', fit: false }); }
    // impulse dot along the path
    const stop = [0, 2, 3, 4, 5], total = path.length - 1;
    const u = mix(stop[pv] === 0 && pv === st ? 0 : [0, 0, 2, 3, 5][pv], [0, 2, 3, 5, 5][st], k);
    const f = Math.min(total - 1e-6, u), i = Math.floor(f), r = f - i, x = mix(path[i][0], path[i + 1][0], r), y = mix(path[i][1], path[i + 1][1], r);
    ctx.beginPath(); ctx.arc(x, y, 8, 0, 7); ctx.fillStyle = col.bad; ctx.fill(); ctx.strokeStyle = col.panel; ctx.lineWidth = 2; ctx.stroke();
    wrap(ctx, TXT[st] + ' (red dot = impulse)', w / 2, h - 40, w - 24, { color: col.ink, size: 11 });
  });
}
