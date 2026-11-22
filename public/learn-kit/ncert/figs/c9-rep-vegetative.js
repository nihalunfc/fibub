// Class 9 Reproduction: vegetative propagation, where a new plant grows from a part of the parent (root, stem or
// leaf) instead of from a seed. Potato: buds in the "eyes" of a tuber sprout. Ginger: buds on the rhizome (underground
// stem). Bryophyllum: tiny plantlets grow at the notches on the leaf edge and drop off. Stem cutting (rose, sugarcane,
// money plant): a piece with a node grows roots when planted. Drag the time slider to watch each one grow.
import { canvas, text, title, dot, line, row, slider, choice, readout } from '../../kit.js';

const INFO = {
  potato: 'Potato: each “eye” is a bud. Cut a tuber into pieces that each have an eye, plant them, and every piece sprouts a shoot upward and roots downward.',
  ginger: 'Ginger: the underground stem (rhizome) has buds at its joints. A piece with a bud grows into a new plant.',
  bryo: 'Bryophyllum (“patharchatta”): small plantlets with roots grow in the notches of the leaf edge, then fall and grow into new plants.',
  cut: 'Stem cutting (rose, sugarcane, money plant): a piece with a node, planted in damp soil, grows roots from the node and a shoot above it.',
};
export default function (host) {
  let mode = 'potato', d = 0.5;
  const cv = canvas(host, { aspect: 0.78, max: 420, min: 300, label: 'Vegetative propagation in potato, ginger, bryophyllum and a stem cutting growing over time' });
  const ctl = row(host);
  choice(ctl, 'Plant', [['potato', 'Potato'], ['ginger', 'Ginger'], ['bryo', 'Bryophyllum'], ['cut', 'Stem cutting']], mode, (v) => { mode = v; upd(); });
  slider(ctl, { label: 'Time', min: 0, max: 1, step: 0.01, value: d, fmt: (v) => `${Math.round(v * 20)} days`, oninput: (v) => { d = v; cv.redraw(); } });
  const out = readout(host);
  function upd() { out.textContent = INFO[mode]; cv.redraw(); }
  const leaf = (ctx, x, y, s, a, c) => { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(s * 0.5, 0, s * 0.5, s * 0.25, 0, 0, 7); ctx.fill(); ctx.restore(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, { potato: 'Potato eyes sprout', ginger: 'Ginger rhizome buds', bryo: 'Bryophyllum leaf plantlets', cut: 'A stem cutting takes root' }[mode], col);
    const gy = h * 0.55, G = col.s[2], B = col.s[3];
    if (mode !== 'bryo') { ctx.fillStyle = col.soft; ctx.fillRect(0, gy, w, h - gy); line(ctx, [[0, gy], [w, gy]], col.muted, 2); text(ctx, 'soil', 8, gy + 12, { color: col.muted, size: 10 }); }
    const sc = Math.min(1, w / 400);
    if (mode === 'potato') {
      [0.3, 0.7].forEach((fx, k) => {
        const x = w * fx, y = gy + 46 * sc; ctx.fillStyle = B; ctx.beginPath(); ctx.ellipse(x, y, 44 * sc, 26 * sc, k ? 0.2 : -0.2, 0, 7); ctx.fill();
        dot(ctx, x - 14 * sc, y - 6 * sc, 3, col.ink); dot(ctx, x + 12 * sc, y + 6 * sc, 3, col.ink);
        const sh = d * 110 * sc, ro = d * 40 * sc;
        const ex = x - 14 * sc, ey = y - 14 * sc;
        if (d > 0.1) { line(ctx, [[ex, ey], [ex, ey - sh]], G, 4); if (d > 0.4) { leaf(ctx, ex, ey - sh * 0.7, 20 * sc * d, -0.5, G); leaf(ctx, ex, ey - sh * 0.9, 20 * sc * d, Math.PI + 0.5, G); } }
        if (d > 0.2) for (let r = -1; r <= 1; r++) line(ctx, [[x + r * 6, y + 24 * sc], [x + r * 14, y + 24 * sc + ro]], col.s[4], 2);
      });
      text(ctx, 'eye (bud)', w * 0.3 - 40, gy + 22, { color: col.ink, size: 10.5 });
    }
    if (mode === 'ginger') {
      const x0 = w * 0.18, y = gy + 40 * sc; ctx.fillStyle = B; ctx.beginPath(); ctx.roundRect(x0, y - 12, w * 0.64, 24, 12); ctx.fill();
      [0.3, 0.55, 0.8].forEach((f, k) => { const x = x0 + w * 0.64 * f, g = Math.max(0, Math.min(1, d * 1.4 - k * 0.2)); dot(ctx, x, y - 12, 3.5, col.ink); if (g > 0.05) { line(ctx, [[x, y - 12], [x, y - 12 - g * (gy - y + 90 * sc)]], G, 4); if (g > 0.5) leaf(ctx, x, y - 12 - g * (gy - y + 70 * sc), 26 * sc * g, -0.6, G); } if (g > 0.3) line(ctx, [[x, y + 12], [x + 4, y + 12 + 26 * g]], col.s[4], 2); });
      text(ctx, 'rhizome (underground stem)', w / 2, y + 40, { color: col.ink, size: 10.5, align: 'center' });
    }
    if (mode === 'bryo') {
      const cx = w / 2, cy = h * 0.38; ctx.fillStyle = G; ctx.beginPath(); ctx.ellipse(cx, cy, w * 0.3, h * 0.17, 0, 0, 7); ctx.fill();
      for (let k = 0; k < 7; k++) {
        const a = Math.PI * (0.08 + k * 0.14) * 1 + Math.PI * 0.95, ex = cx + Math.cos(a) * w * 0.3, ey = cy + Math.sin(a) * h * 0.17 * -1, g = Math.max(0, Math.min(1, d * 1.5 - k * 0.07)), drop = Math.max(0, (d - 0.75) * 4);
        if (g > 0.05) { const y2 = ey + 8 + drop * (h * 0.85 - ey - 40) * 0.8; line(ctx, [[ex, y2], [ex, y2 + 8 * g]], col.s[4], 2); leaf(ctx, ex, y2 - 2, 14 * g, -2.4, B); leaf(ctx, ex, y2 - 2, 14 * g, -0.7, B); }
      }
      text(ctx, 'parent leaf', cx, cy + 4, { color: '#fff', size: 11, weight: 700, align: 'center' });
      text(ctx, 'plantlets at the notches', w / 2, h - 12, { color: col.s[3], size: 10.5, weight: 700, align: 'center' });
    }
    if (mode === 'cut') {
      const x = w / 2, top = gy - 74 * sc - d * 70 * sc;
      line(ctx, [[x, gy - 74 * sc + 0], [x, gy + 34 * sc]], col.s[3], 5);
      line(ctx, [[x - 6, gy - 20], [x + 6, gy - 20]], col.ink, 3); text(ctx, 'node', x + 12, gy - 20, { color: col.ink, size: 10.5 });
      if (d > 0.15) line(ctx, [[x, gy - 74 * sc], [x, top]], G, 4);
      if (d > 0.4) { leaf(ctx, x, top + 6, 30 * sc * d, -0.5, G); leaf(ctx, x, top + 18, 30 * sc * d, Math.PI + 0.5, G); }
      if (d > 0.1) for (let r = -2; r <= 2; r++) line(ctx, [[x, gy + 22 * sc], [x + r * 14 * d, gy + 22 * sc + 40 * d + Math.abs(r) * -4]], col.s[4], 2);
      text(ctx, 'roots grow', x + 54, gy + 52, { color: col.s[4], size: 10.5, weight: 700 });
    }
  };
  upd();
}
