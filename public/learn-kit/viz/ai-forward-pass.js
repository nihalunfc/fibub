// A tiny neural network (2 inputs, 3 hidden neurons, 1 output) you can poke. Move the two inputs, tap a line to choose
// that weight (or a neuron to choose its bias) and change it with the slider: line thickness is the size of the weight
// (blue positive, orange negative) and each neuron fills in as it activates. Try: switch the activation, or set a
// hidden neuron's weights to zero and watch the output stop listening to it.
import { canvas, text, row, slider, choice, button, readout, title, line, dot } from '../kit.js';
import { pointer, sig } from './_ai.js';

const ACT = { relu: ['ReLU', (z) => Math.max(0, z)], tanh: ['tanh', Math.tanh], sigmoid: ['sigmoid', sig] };
export default function (host) {
  const W1 = [[1.2, -0.8], [-1.0, 1.4], [0.7, 0.9]], B1 = [0.1, -0.2, -0.5], W2 = [1.1, -0.9, 1.3], B2 = [0.0];
  let act = 'relu', x = [0.8, -0.4], sel = { k: 'w2', i: 0 };
  const cv = canvas(host, { aspect: 0.8, max: 420, min: 290, label: 'A small neural network with weights and activations' });
  const ctl = row(host), ctl2 = row(host);
  choice(ctl, 'Activation', Object.entries(ACT).map(([k, a]) => [k, a[0]]), act, (v) => { act = v; show(); });
  slider(ctl2, { label: 'Input x₁', min: -1.5, max: 1.5, value: x[0], fmt: (v) => v.toFixed(2), oninput: (v) => { x[0] = v; show(); } });
  slider(ctl2, { label: 'Input x₂', min: -1.5, max: 1.5, value: x[1], fmt: (v) => v.toFixed(2), oninput: (v) => { x[1] = v; show(); } });
  const sl = slider(ctl2, { label: 'Chosen weight', min: -2.5, max: 2.5, value: 1.1, fmt: (v) => v.toFixed(2), oninput: (v) => { setSel(v); show(); } });
  button(ctl2, 'Random weights', () => { W1.forEach((r) => r.forEach((_, j) => (r[j] = +(Math.random() * 4 - 2).toFixed(2)))); W2.forEach((_, j) => (W2[j] = +(Math.random() * 4 - 2).toFixed(2))); getSel(); show(); });
  const out = readout(host);
  const getSel = () => { const v = sel.k === 'w1' ? W1[sel.i][sel.j] : sel.k === 'w2' ? W2[sel.i] : sel.k === 'b1' ? B1[sel.i] : B2[0]; sl.set(v); };
  const setSel = (v) => { if (sel.k === 'w1') W1[sel.i][sel.j] = v; else if (sel.k === 'w2') W2[sel.i] = v; else if (sel.k === 'b1') B1[sel.i] = v; else B2[0] = v; };
  const f = () => ACT[act][1];
  function run() {
    const z1 = W1.map((r, i) => r[0] * x[0] + r[1] * x[1] + B1[i]), a1 = z1.map(f());
    const z2 = W2.reduce((s, w, i) => s + w * a1[i], 0) + B2[0];
    return { z1, a1, z2, y: f()(z2) };
  }
  let P = [];
  function layout(w, h) {
    const T = 44, H = h - T - 12, xs = [w * 0.12, w * 0.46, w * 0.84];
    const yAt = (n, i) => T + (H * (i + 0.5)) / n;
    return { xs, yAt };
  }
  pointer(cv, (px, py, k) => {
    if (k !== 'down') return;
    const { xs, yAt } = layout(cv.w, cv.h); let best = null, bd = 18;
    for (let i = 0; i < 3; i++) { const d = Math.hypot(px - xs[1], py - yAt(3, i)); if (d < bd) { bd = d; best = { k: 'b1', i }; } }
    { const d = Math.hypot(px - xs[2], py - yAt(1, 0)); if (d < bd) { bd = d; best = { k: 'b2', i: 0 }; } }
    const seg = (ax, ay, bx, by) => { const dx = bx - ax, dy = by - ay, t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy))); return Math.hypot(px - ax - t * dx, py - ay - t * dy); };
    if (!best) {
      let md = 12;
      for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { const d = seg(xs[0], yAt(2, j), xs[1], yAt(3, i)); if (d < md) { md = d; best = { k: 'w1', i, j }; } }
      for (let i = 0; i < 3; i++) { const d = seg(xs[1], yAt(3, i), xs[2], yAt(1, 0)); if (d < md) { md = d; best = { k: 'w2', i }; } }
    }
    if (best) { sel = best; getSel(); show(); }
  });
  function show() {
    const r = run(), nm = ACT[act][0];
    let what = sel.k === 'w1' ? `weight from x${sel.j + 1} into hidden neuron ${sel.i + 1}` : sel.k === 'w2' ? `weight from hidden neuron ${sel.i + 1} into the output` : sel.k === 'b1' ? `bias of hidden neuron ${sel.i + 1}` : 'bias of the output neuron';
    out.innerHTML = `Output = <b>${r.y.toFixed(3)}</b> (${nm} of ${r.z2.toFixed(3)}). Hidden neurons: ${r.a1.map((a, i) => `h${i + 1} = ${a.toFixed(2)}`).join(', ')}. Chosen: <b>${what}</b>. Each neuron adds up (weight × input) over its lines plus its bias, then applies ${nm}.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const { xs, yAt } = layout(w, h), r = run();
    title(ctx, 'Tap a line or neuron, then use the slider', col);
    const edge = (ax, ay, bx, by, wt, on) => {
      ctx.save(); ctx.strokeStyle = wt >= 0 ? col.s[0] : col.s[1]; ctx.lineWidth = 1 + Math.abs(wt) * 2.2; ctx.globalAlpha = on ? 1 : 0.55;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); ctx.restore();
      if (on) { ctx.save(); ctx.strokeStyle = col.ink; ctx.setLineDash([4, 4]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ax, ay - 5); ctx.lineTo(bx, by - 5); ctx.stroke(); ctx.restore(); }
      const mx = (ax + bx) / 2 + (bx > ax ? 0 : 0), my = (ay + by) / 2;
      text(ctx, wt.toFixed(1), mx, my - 8, { color: on ? col.ink : col.muted, size: 10, weight: on ? 700 : 400, halo: col.panel, align: 'center' });
    };
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) edge(xs[0], yAt(2, j), xs[1], yAt(3, i), W1[i][j], sel.k === 'w1' && sel.i === i && sel.j === j);
    for (let i = 0; i < 3; i++) edge(xs[1], yAt(3, i), xs[2], yAt(1, 0), W2[i], sel.k === 'w2' && sel.i === i);
    const node = (cx, cy, a, label, sub, on, big) => {
      dot(ctx, cx, cy, 20, col.panel, on ? col.ink : col.muted);
      ctx.save(); ctx.globalAlpha = Math.min(1, Math.abs(a) / 1.5); ctx.fillStyle = a >= 0 ? col.s[2] : col.s[5]; ctx.beginPath(); ctx.arc(cx, cy, 19, 0, 7); ctx.fill(); ctx.restore();
      text(ctx, label, cx, cy, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel });
      text(ctx, sub, cx, cy + 32, { color: on ? col.ink : col.muted, size: 10, align: 'center', weight: on ? 700 : 400 });
    };
    x.forEach((v, j) => node(xs[0], yAt(2, j), v, v.toFixed(2), `x${j + 1}`, false));
    r.a1.forEach((a, i) => node(xs[1], yAt(3, i), a, a.toFixed(2), `b = ${B1[i].toFixed(1)}`, sel.k === 'b1' && sel.i === i));
    node(xs[2], yAt(1, 0), r.y, r.y.toFixed(2), `output, b = ${B2[0].toFixed(1)}`, sel.k === 'b2');
    text(ctx, 'input', xs[0], h - 4, { color: col.muted, size: 10, align: 'center' });
    text(ctx, 'hidden layer', xs[1], h - 4, { color: col.muted, size: 10, align: 'center' });
    text(ctx, 'output', xs[2], h - 4, { color: col.muted, size: 10, align: 'center' });
  };
  getSel(); show();
}
