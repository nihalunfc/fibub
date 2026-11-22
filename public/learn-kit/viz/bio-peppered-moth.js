// Natural selection in action: 100 moths rest on tree bark and birds eat the ones that stand out. Choose the bark
// (light lichen or sooty dark) and how sharp-eyed the birds are, then run generations. The dark form spreads when bark is
// dark and fades when it is light; with few moths, luck matters too. The line follows the dark allele's share.
import { canvas, loop, row, slider, choice, button, readout, rng, text, title, axes, line } from '../kit.js';

export default function (host) {
  let bark = 'dark', s = 0.4, gen = 0, p = 0.1, hist = [0.1], R = rng(11), acc = 0;
  const cv = canvas(host, { aspect: 0.95, max: 400, min: 320, label: 'A hundred moths on bark with the dark form rising or falling over generations' });
  const c1 = row(host), c2 = row(host);
  choice(c1, 'Bark', [['light', 'Light (clean air)'], ['dark', 'Dark (soot)']], bark, (v) => { bark = v; show(); });
  slider(c1, { label: 'Predation on the mismatched', min: 0.05, max: 0.8, step: 0.05, value: s, fmt: (v) => `${Math.round(v * 100)}%`, oninput: (v) => { s = v; } });
  button(c2, 'Next generation', () => step());
  loop(host, (dt) => { acc += dt; if (acc > 0.3) { acc = 0; if (gen < 200) step(); } }, { autoplay: false }).button(c2);
  button(c2, 'Reset', () => { gen = 0; p = 0.1; hist = [0.1]; show(); });
  const out = readout(host);
  function step() {
    const wd = bark === 'dark' ? 1 : 1 - s, wl = bark === 'dark' ? 1 - s : 1, q = p * wd / (p * wd + (1 - p) * wl);
    let n = 0; for (let i = 0; i < 100; i++) if (R() < q) n++;
    p = Math.min(1, Math.max(0, n / 100)); gen++; hist.push(p); show();
  }
  function show() { out.innerHTML = `Generation <b>${gen}</b>: <b>${Math.round(p * 100)}%</b> of moths are dark. On ${bark} bark the ${bark === 'dark' ? 'dark' : 'light'} form is hidden and survives better: fitness 1 against ${(1 - s).toFixed(2)} for the other, so its share changes each generation (selection pressure ${Math.round(s * 100)}%). Press "Play" to run many generations. A form that reaches 0% or 100% is lost or fixed.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `Moths on ${bark} bark`, col);
    const gx = 10, gy = 40, gs = Math.min(w * 0.5, 150), cell = gs / 10, nd = Math.round(p * 100);
    ctx.fillStyle = bark === 'dark' ? col.muted : col.soft; ctx.globalAlpha = bark === 'dark' ? 0.55 : 1; ctx.fillRect(gx, gy, gs, gs); ctx.globalAlpha = 1;
    const RR = rng(gen * 13 + 5), order = Array.from({ length: 100 }, (_, i) => i).sort(() => RR() - 0.5);
    for (let i = 0; i < 100; i++) { const isDark = order[i] < nd, x = gx + (i % 10) * cell + cell / 2, y = gy + Math.floor(i / 10) * cell + cell / 2; ctx.beginPath(); ctx.ellipse(x, y, cell * 0.38, cell * 0.28, 0.4, 0, 7); ctx.fillStyle = isDark ? '#1b1b1b' : '#f2efe6'; ctx.fill(); ctx.strokeStyle = isDark ? '#555' : '#999'; ctx.lineWidth = 0.8; ctx.stroke(); }
    text(ctx, `${nd} dark, ${100 - nd} light`, gx, gy + gs + 14, { color: col.ink, size: 11, weight: 700 });
    const A = axes(ctx, w, h, col, { x: [0, Math.max(20, gen)], y: [0, 100], xt: [0, 10, 20, 30, 40, 50, 100, 200].filter((v) => v <= Math.max(20, gen)), yt: [0, 50, 100], l: gx + gs + 36, t: 50, b: 58, r: 10, xlabel: 'Generation' });
    text(ctx, '% dark', A.L + 4, A.T + 10, { color: col.ink, size: 10.5, weight: 700 });
    line(ctx, hist.map((v, i) => [A.X(i), A.Y(v * 100)]), col.s[0], 2.5);
  };
  show();
}
