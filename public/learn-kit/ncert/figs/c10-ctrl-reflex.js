// Class 10 Control and Coordination: reflex arc versus voluntary action. A reflex (hand pulled from a hot pan) goes
// receptor -> sensory neuron -> spinal cord -> motor neuron -> muscle without waiting for the brain. A voluntary action
// goes up to the brain and back. Time = path length / impulse speed + 0.5 ms per synapse (typical). Slide the speed.
import { canvas, text, title, line, dot, row, slider, choice, readout, loop, arrow } from '../../kit.js';

export default function (host) {
  let mode = 'reflex', speed = 60, t = 0, run = 0;
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 290, label: 'A signal travelling round a reflex arc or up to the brain and back, with the time taken' });
  const ctl = row(host);
  choice(ctl, 'Action', [['reflex', 'Reflex (touch a hot pan)'], ['vol', 'Voluntary (decide to move)']], mode, (v) => { mode = v; run = 0; say(); });
  slider(ctl, { label: 'Impulse speed', min: 1, max: 120, step: 1, value: speed, fmt: (v) => v + ' m/s', oninput: (v) => { speed = v; say(); } });
  const anim = loop(host, (dt) => { run += dt * 0.4; if (run > 1.2) run = 0; cv.redraw(); });
  const out = readout(host);
  const L = () => (mode === 'reflex' ? 1.2 : 2.9), syn = () => (mode === 'reflex' ? 2 : 5);
  const ms = () => (L() / speed) * 1000 + syn() * 0.5;
  function say() { out.innerHTML = `${mode === 'reflex' ? 'Reflex' : 'Voluntary'}: path ${L()} m at ${speed} m/s plus ${syn()} synapses (0.5 ms each) = <b>${ms().toFixed(1)} ms</b>. ${mode === 'reflex' ? 'The signal turns round in the spinal cord, so the hand moves before the brain even knows it hurts.' : 'The brain adds the long trip up and down the spinal cord and many more synapses, so it is slower; but the response is thought out and can be different each time.'}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, mode === 'reflex' ? 'Reflex arc' : 'Voluntary action through the brain', col) + 6, ph = h - top - 40, cx = w * 0.5;
    const hand = [w * 0.82, top + ph * 0.86], cord = [w * 0.5, top + ph * 0.5], brain = [w * 0.5, top + ph * 0.1], muscle = [w * 0.82, top + ph * 0.62];
    // spinal cord
    ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.3; ctx.fillRect(cx - 14, top + ph * 0.18, 28, ph * 0.7); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(cx - 14, top + ph * 0.18, 28, ph * 0.7);
    text(ctx, 'spinal cord', cx - 30, top + ph * 0.7, { color: col.muted, size: 10, align: 'right' });
    ctx.fillStyle = col.s[4]; ctx.globalAlpha = mode === 'vol' ? 0.55 : 0.25; ctx.beginPath(); ctx.ellipse(brain[0], brain[1] + 6, 44, 28, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1; ctx.stroke(); text(ctx, 'brain', brain[0], brain[1] + 6, { color: col.ink, size: 11, weight: 700, align: 'center' });
    // hand and muscle
    ctx.fillStyle = col.s[1]; ctx.beginPath(); ctx.arc(hand[0], hand[1], 14, 0, 7); ctx.fill(); text(ctx, 'hot pan', hand[0], hand[1] + 26, { color: col.s[7], size: 10, weight: 700, align: 'center' });
    ctx.fillStyle = col.s[5]; ctx.fillRect(muscle[0] - 20, muscle[1] - 9, 40, 18); text(ctx, 'muscle', muscle[0], muscle[1], { color: col.panel, size: 9.5, weight: 700, align: 'center', fit: false });
    const inP = [hand, [w * 0.7, hand[1]], [w * 0.62, cord[1] + 30], [cx + 14, cord[1] + 30]];
    const motor = [[cx + 14, cord[1] - 16], [w * 0.64, cord[1] - 16], [w * 0.7, muscle[1]], [muscle[0] - 20, muscle[1]]];
    const up = [[cx, cord[1] + 30], [cx, brain[1] + 34]], down = [[cx, brain[1] + 34], [cx, cord[1] - 16]];
    const paths = [[inP, col.s[3]], [motor, col.s[7]]]; if (mode === 'vol') paths.push([up, col.s[3]], [down, col.s[7]]);
    paths.forEach(([P, c]) => line(ctx, P, c, 2.5));
    text(ctx, 'sensory neuron', w * 0.64, hand[1] - 10, { color: col.s[3], size: 10, weight: 700, align: 'center' }); text(ctx, 'motor neuron', w * 0.77, cord[1] - 26, { color: col.s[7], size: 10, weight: 700, align: 'center' });
    // moving pulse along full route
    const route = mode === 'reflex' ? [...inP, ...motor] : [...inP, ...up, ...down, ...motor];
    const lens = []; let tot = 0; for (let i = 0; i < route.length - 1; i++) { const d = Math.hypot(route[i + 1][0] - route[i][0], route[i + 1][1] - route[i][1]); lens.push(d); tot += d; }
    let d = Math.min(1, run / 1.0) * tot, px = route[0][0], py = route[0][1]; for (let i = 0; i < lens.length; i++) { if (d <= lens[i]) { px = route[i][0] + (route[i + 1][0] - route[i][0]) * d / lens[i]; py = route[i][1] + (route[i + 1][1] - route[i][1]) * d / lens[i]; break; } d -= lens[i]; }
    dot(ctx, px, py, 7, col.s[1], col.ink);
    text(ctx, `time for the signal: ${ms().toFixed(1)} ms`, w / 2, h - 22, { color: col.s[2], size: 12.5, weight: 700, align: 'center' });
    text(ctx, mode === 'reflex' ? 'turns round in the spinal cord: no brain needed' : 'up to the brain, a decision, down again', w / 2, h - 7, { color: col.muted, size: 10, align: 'center' });
  };
  say();
}
