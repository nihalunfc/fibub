// Mendel's crosses as a simulation: every offspring gets one random gamete from each parent. Pick a cross and the
// number of offspring, then run it again and again. With few offspring the counts wobble; with many they settle near
// the ratio (9:3:3:1 for two independent genes). "Linked" genes on one chromosome break the 9:3:3:1 pattern.
import { canvas, row, slider, choice, button, readout, rng, text, title } from '../kit.js';

const CROSSES = {
  di: { name: 'AaBb × AaBb', g1: ['AB', 'Ab', 'aB', 'ab'], g2: ['AB', 'Ab', 'aB', 'ab'], exp: [9, 3, 3, 1] },
  test: { name: 'Test cross AaBb × aabb', g1: ['AB', 'Ab', 'aB', 'ab'], g2: ['ab'], exp: [1, 1, 1, 1] },
  linked: { name: 'Linked AB/ab × AB/ab', g1: ['AB', 'ab'], g2: ['AB', 'ab'], exp: [3, 0, 0, 1] },
};
const CLASSES = ['A_ B_', 'A_ bb', 'aa B_', 'aa bb'];

export default function (host) {
  let key = 'di', n = 160, seed = 3, counts = [0, 0, 0, 0];
  const cv = canvas(host, { aspect: 0.62, max: 340, min: 260, label: 'Counts of four phenotypes among simulated offspring against the expected ratio' });
  const c1 = row(host);
  choice(c1, 'Cross', Object.entries(CROSSES).map(([k, v]) => [k, v.name]), key, (v) => { key = v; run(); });
  const c2 = row(host);
  slider(c2, { label: 'Offspring', min: 16, max: 1600, step: 16, value: n, fmt: (v) => `${v}`, oninput: (v) => { n = v; run(); } });
  button(c2, 'Run again', () => { seed++; run(); });
  const out = readout(host);
  function run() {
    const R = rng(seed * 7919), C = CROSSES[key]; counts = [0, 0, 0, 0];
    for (let i = 0; i < n; i++) {
      const a = C.g1[Math.floor(R() * C.g1.length)], b = C.g2[Math.floor(R() * C.g2.length)];
      const A = a[0] === 'A' || b[0] === 'A', B = a[1] === 'B' || b[1] === 'B';
      counts[A ? (B ? 0 : 1) : (B ? 2 : 3)]++;
    }
    const m = Math.min(...counts.filter((c) => c > 0)) || 1;
    out.innerHTML = `<b>${C.name}</b>, ${n} offspring: ${counts.join(' : ')}. Divided by the smallest: <b>${counts.map((c) => (c / m).toFixed(1)).join(' : ')}</b>. Expected ${C.exp.join(':')}${key === 'linked' ? ' (the genes travel together, only two classes appear)' : ''}.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Offspring by phenotype (bars: counted, line: expected)', col);
    const C = CROSSES[key], tot = C.exp.reduce((a, b) => a + b), L = 14, B = h - 46, T = 48, bw = (w - 2 * L) / 4, mx = Math.max(n * 0.6, ...counts) * 1.05;
    CLASSES.forEach((nm, i) => {
      const x = L + i * bw, bh = (counts[i] / mx) * (B - T), eh = (n * C.exp[i] / tot / mx) * (B - T);
      ctx.fillStyle = col.s[i === 3 ? 1 : i === 0 ? 0 : 2]; ctx.globalAlpha = 0.85; ctx.fillRect(x + 8, B - bh, bw - 16, bh); ctx.globalAlpha = 1;
      ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 4, B - eh); ctx.lineTo(x + bw - 4, B - eh); ctx.stroke();
      text(ctx, String(counts[i]), x + bw / 2, B - bh - 9, { color: col.ink, size: 12, weight: 700, align: 'center' });
      text(ctx, nm, x + bw / 2, B + 12, { color: col.ink, size: 11.5, align: 'center', weight: 600 });
      text(ctx, ['both dominant', 'A only', 'B only', 'both recessive'][i], x + bw / 2, B + 27, { color: col.muted, size: 9.5, align: 'center', fit: false });
    });
    ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(L, B); ctx.lineTo(w - L, B); ctx.stroke();
  };
  run();
}
