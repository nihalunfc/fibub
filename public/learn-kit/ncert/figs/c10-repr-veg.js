// Class 10 How do Organisms Reproduce?: vegetative propagation. New plants grow from a root, stem or leaf of the parent, so
// they are clones. Natural: potato eyes, Bryophyllum leaf buds. Artificial: stem cutting (rose, sugarcane), grafting (mango).
// Slide the growth to watch each method.
import { canvas, text, title, line, dot, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let m = 'potato', u = 0;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 290, label: 'Four methods of vegetative propagation: potato eyes, Bryophyllum, stem cutting and grafting' });
  const ctl = row(host);
  choice(ctl, 'Method', [['potato', 'Potato eyes'], ['bryo', 'Bryophyllum leaf'], ['cut', 'Stem cutting'], ['graft', 'Grafting']], m, (v) => { m = v; say(); });
  slider(ctl, { label: 'Growth', min: 0, max: 1, step: 0.01, value: 0, fmt: (v) => Math.round(v * 100) + '%', oninput: (v) => { u = v; say(); } });
  const out = readout(host);
  const TXT = { potato: 'Natural: each “eye” of a potato is a bud. Plant a piece with an eye and it sprouts shoots above and roots below. A potato plant can come from one tuber.', bryo: 'Natural: the leaf margin of Bryophyllum has notches with buds. Each bud grows into a tiny plant that falls off and roots in the soil.', cut: 'Artificial: a rose or sugarcane stem piece with a node (bud) is pushed into moist soil. Roots grow from the node, a shoot from the bud.', graft: 'Artificial: a cut shoot (scion) of a good mango tree is joined to a rooted plant (stock). Their growing layers must touch. The fruit is that of the scion.' };
  const ell = (ctx, x, y, rx, ry, f, s, lw = 1.8) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); if (f) { ctx.fillStyle = f; ctx.fill(); } if (s) { ctx.strokeStyle = s; ctx.lineWidth = lw; ctx.stroke(); } };
  const leaf = (ctx, x, y, s, a, col) => { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.globalAlpha = 0.5; ell(ctx, s * 0.5, 0, s * 0.5, s * 0.24, col.s[1]); ctx.restore(); };
  function say() { out.textContent = TXT[m]; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, { potato: 'Potato: sprouts from the eyes', bryo: 'Bryophyllum: plantlets on the leaf', cut: 'Stem cutting: roots from the node', graft: 'Grafting: two plants become one' }[m], col) + 8, gy = top + (h - top) * 0.55;
    ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = col.s[3]; ctx.fillRect(0, gy, w, h - gy); ctx.restore(); line(ctx, [[0, gy], [w, gy]], col.muted, 1.5);
    text(ctx, 'soil', 12, gy + 12, { color: col.muted, size: 10 });
    if (m === 'potato') {
      const cx = w / 2, cy = gy + 24;
      ctx.save(); ctx.globalAlpha = 0.6; ell(ctx, cx, cy, 52, 26, col.s[3], col.ink, 2); ctx.restore();
      [-24, 6, 30].forEach((dx, i) => { const k = Math.min(1, u * 1.3 - i * 0.1); dot(ctx, cx + dx, cy - 14, 2.5, col.ink); if (k > 0) { const L = 80 * k; line(ctx, [[cx + dx, cy - 16], [cx + dx + (i - 1) * 8, cy - 16 - L]], col.s[2], 3); if (k > 0.5) { leaf(ctx, cx + dx + (i - 1) * 8, cy - 16 - L, 26, -2.4, col); leaf(ctx, cx + dx + (i - 1) * 8, cy - 16 - L, 26, -0.7, col); } } });
      for (let i = 0; i < 5; i++) { const k = Math.max(0, u * 1.2 - 0.1 - i * 0.04); line(ctx, [[cx - 30 + i * 15, cy + 22], [cx - 40 + i * 20, cy + 22 + 40 * k]], col.muted, 1.6); }
      text(ctx, 'eye (bud)', cx - 62, cy - 28, { color: col.muted, size: 10, align: 'center' });
    } else if (m === 'bryo') {
      const cx = w / 2, cy = top + 40;
      ctx.save(); ctx.globalAlpha = 0.5; ell(ctx, cx, cy + 10, w * 0.35, 32, col.s[1], col.ink, 2); ctx.restore();
      [-0.28, -0.12, 0.05, 0.22].forEach((f, i) => { const k = Math.min(1, u * 1.4 - i * 0.12); const x = cx + f * w * 1.2, y = cy + 10 + (i % 2 ? 30 : -30); ell(ctx, x, y, 3, 3, col.ink);
        if (k > 0) { const drop = u > 0.8 ? (u - 0.8) * 5 * (gy - y - 18) : 0, yy = y + drop, s = 8 + 26 * k; line(ctx, [[x, yy], [x, yy - s * 0.8]], col.s[2], 2.5); leaf(ctx, x, yy - s * 0.6, s, -2.5, col); leaf(ctx, x, yy - s * 0.6, s, -0.6, col); if (u > 0.85) for (let j = 0; j < 3; j++) line(ctx, [[x, yy], [x + (j - 1) * 6, yy + 10 * (u - 0.85) * 6]], col.muted, 1.2); } });
      text(ctx, 'notch with a bud on the leaf edge', cx, cy + 54, { color: col.muted, size: 10, align: 'center' });
    } else if (m === 'cut') {
      const cx = w / 2, bot = gy + 34, sh = 80, k = Math.min(1, u * 1.3);
      line(ctx, [[cx, bot], [cx, bot - sh - 36]], col.s[2], 5);
      [[cx, gy + 4], [cx, bot - sh]].forEach(([x, y], i) => { dot(ctx, x + 5, y, 3, col.ink); });
      for (let i = 0; i < 6; i++) { const L = 40 * Math.max(0, u * 1.3 - 0.1 - i * 0.03); line(ctx, [[cx, gy + 4], [cx + (i - 2.5) * 12, gy + 4 + L]], col.muted, 1.6); }
      const s = 10 + 34 * k; if (u > 0.25) { leaf(ctx, cx, bot - sh - 10, s, -2.4, col); leaf(ctx, cx, bot - sh - 10, s, -0.7, col); }
      text(ctx, 'node (bud)', cx + 46, gy + 4, { color: col.muted, size: 10 }); text(ctx, 'cut piece of stem', cx - 90, bot - sh + 10, { color: col.muted, size: 10 });
    } else {
      const cx = w / 2 - 36, gt = gy - 36, join = Math.min(1, u * 3);
      line(ctx, [[cx, gy + 40], [cx, gt]], col.s[3] || col.ink, 8); for (let i = 0; i < 4; i++) line(ctx, [[cx, gy + 4], [cx + (i - 1.5) * 14, gy + 44]], col.muted, 1.6);
      const sy0 = gt - 46 - (1 - join) * 24, sx = cx + 46 * (1 - join);
      line(ctx, [[sx, sy0 + 46], [sx, sy0]], col.s[2], 5); dot(ctx, sx, sy0 + 8, 3, col.ink);
      if (join >= 1) { ctx.fillStyle = col.s[0]; ctx.fillRect(cx - 7, gt - 4, 14, 8); const g = Math.min(1, (u - 0.34) / 0.66); if (g > 0) { const L = 26 * g; line(ctx, [[cx, sy0 + 8], [cx + 12, sy0 + 8 - L]], col.s[2], 3); leaf(ctx, cx + 12, sy0 + 8 - L, 10 + 18 * g, -2.4, col); leaf(ctx, cx + 12, sy0 + 8 - L, 10 + 18 * g, -0.7, col); } }
      text(ctx, 'stock: rooted plant', cx + 16, gy + 52, { color: col.muted, size: 10 });
      text(ctx, join < 1 ? 'scion: cut shoot' : 'joined, tied with tape', cx + 62, gt - 20, { color: col.ink, size: 10, weight: 700 });
    }
    text(ctx, 'Every new plant is a clone of the parent.', w / 2, h - 10, { color: col.muted, size: 10.5, align: 'center' });
  };
  say();
}
