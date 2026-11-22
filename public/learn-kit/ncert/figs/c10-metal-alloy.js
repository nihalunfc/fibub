// Class 10 Metals and Non-metals: why alloys are harder than pure metals. In a pure metal the atoms are all one size,
// so whole layers slide over each other when pushed (soft, bends). In an alloy, atoms of another size roughen the layers
// and block the slipping, so a bigger force is needed: harder and stronger (steel = iron + carbon, brass = copper + zinc).
import { canvas, text, title, dot, row, slider, choice, readout, loop, clamp, lerp, rng } from '../../kit.js';

export default function (host) {
  let k = 'pure', F = 0;
  const cv = canvas(host, { aspect: 0.68, max: 440, min: 300, label: 'Layers of metal atoms being pushed, sliding easily in a pure metal and resisting in an alloy' });
  const ctl = row(host);
  choice(ctl, 'Material', [['pure', 'Pure metal'], ['alloy', 'Alloy']], k, (v) => { k = v; say(); });
  slider(ctl, { label: 'Push (force)', min: 0, max: 1, step: 0.01, value: 0, fmt: (v) => `${Math.round(v * 100)}%`, oninput: (v) => { F = v; say(); } });
  const out = readout(host);
  const thr = () => (k === 'pure' ? 0.25 : 0.72), slip = () => clamp((F - thr()) * 3, 0, 1.6);
  function say() { out.innerHTML = k === 'pure' ? `Pure metal: layers start to slide at only about 25% of the force, so it <b>bends easily</b>. Slip so far: ${slip().toFixed(1)} atoms.` : `Alloy: the odd-sized atoms jam the layers, so you need about 72% of the force before they slide. It is <b>harder and stronger</b>. Steel, brass, bronze and solder are all alloys.`; cv.redraw(); }
  const R = rng(6), odd = new Set(); for (let i = 0; i < 9; i++) odd.add(Math.floor(R() * 40));
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, k === 'pure' ? 'Pure metal: layers slip' : 'Alloy: odd atoms block slipping', col) + 10, cols = 10, rows = 5, d = Math.min(30, (w - 40) / (cols + 2)), gx = (w - cols * d) / 2, gy = top + 24;
    const s = slip() * d;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const isOdd = k === 'alloy' && odd.has(r * cols + c), top2 = r < 2, x = gx + c * d + d / 2 + (r % 2) * d * 0.5 + (top2 ? s : 0), y = gy + r * d * 0.9 + d / 2;
      dot(ctx, x, y, isOdd ? d * 0.46 : d * 0.38, isOdd ? col.s[1] : col.s[0], col.ink);
    }
    const ay = gy + d * 0.45; for (let i = 0; i < 3; i++) { ctx.strokeStyle = col.s[7]; ctx.fillStyle = col.s[7]; ctx.lineWidth = 2.5; const x0 = gx - 6, y0 = ay + i * 14; ctx.beginPath(); ctx.moveTo(x0 - 16 - 22 * F, y0); ctx.lineTo(x0, y0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x0 + 6, y0); ctx.lineTo(x0 - 3, y0 - 4); ctx.lineTo(x0 - 3, y0 + 4); ctx.fill(); }
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(gx - 6, gy + 2 * d * 0.9 + d * 0.0 + 2); ctx.lineTo(gx + cols * d + d, gy + 2 * d * 0.9 + 2); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'the layers slide here', gx + cols * d / 2, gy + 2 * d * 0.9 - 4 + 8, { color: col.muted, size: 9.5, align: 'center', halo: col.panel });
    const by = h - 26; ctx.fillStyle = col.soft; ctx.fillRect(gx, by, cols * d, 10); ctx.fillStyle = F >= thr() ? col.bad : col.s[2]; ctx.fillRect(gx, by, cols * d * F, 10); const tx = gx + cols * d * thr(); ctx.fillStyle = col.ink; ctx.fillRect(tx - 1, by - 4, 2, 18);
    text(ctx, `slips above ${Math.round(thr() * 100)}%`, tx, by + 24, { color: col.muted, size: 10, align: 'center' });
  };
  say();
}
