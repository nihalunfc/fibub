// Any shape of a fixed string is a sum of its normal modes. Pluck the string at a chosen point and it vibrates as the sum
// of modes n = 1, 2, 3 ... with sizes b_n ∝ sin(nπ x₀/L)/n² and frequencies n f₁. Raise the number of modes included and the sum
// converges to the real plucked triangle; switch Play on to watch them move at different rates (all stay in step, so the
// string is periodic). Pluck exactly at the middle and the even modes vanish; at 1/3 the 3rd, 6th... vanish.
import { canvas, axes, line, text, title, row, slider, readout, loop } from '../kit.js';

export default function (host) {
  let x0 = 0.3, nm = 4, t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A plucked string built from its normal modes, with the mode amplitudes as bars' });
  const ctl = row(host);
  slider(ctl, { label: 'Pluck at x₀/L', min: 0.1, max: 0.5, step: 0.01, value: x0, fmt: (v) => v.toFixed(2), oninput: (v) => { x0 = v; upd(); } });
  const sM = slider(ctl, { label: 'Modes added', min: 1, max: 12, step: 1, value: nm, fmt: (v) => `${v}`, oninput: (v) => { nm = v; upd(); } });
  const lp = loop(host, (dt) => { t += dt * 0.25; cv.redraw(); }); const c2 = row(host); lp.button(c2);
  const out = readout(host);
  const b = (n) => (2 / (n * n * Math.PI * Math.PI)) * Math.sin(n * Math.PI * x0) / (x0 * (1 - x0));
  const tri = (u) => (u < x0 ? u / x0 : (1 - u) / (1 - x0));
  function upd() {
    const err = Math.max(...Array.from({ length: 101 }, (_, i) => Math.abs(tri(i / 100) - Array.from({ length: nm }, (_, k) => b(k + 1) * Math.sin((k + 1) * Math.PI * i / 100)).reduce((a, c) => a + c, 0))));
    out.innerHTML = `Plucked at ${x0.toFixed(2)} L. Mode amplitudes b<sub>n</sub> = 2h sin(nπx₀/L) / [n²π² (x₀/L)(1 − x₀/L)] with h = 1: ${Array.from({ length: Math.min(nm, 5) }, (_, k) => `b<sub>${k + 1}</sub> = ${b(k + 1).toFixed(3)}`).join(', ')}. With ${nm} mode${nm > 1 ? 's' : ''} the biggest error against the true triangle is ${(err * 100).toFixed(1)} % of its height. Each mode n oscillates at n f₁ = n v/2L, so the fundamental sets the pitch and the others set the timbre.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'String = sum of normal modes', col);
    ctx.save(); ctx.translate(0, 6);
    const A = axes(ctx, w, h * 0.5, col, { x: [0, 1], y: [-1.2, 1.2], xlabel: 'position x/L', ylabel: '', t: 24, b: 30, l: 12, yt: [], xt: [0, 0.5, 1] });
    const tr = []; for (let i = 0; i <= 100; i++) tr.push([A.X(i / 100), A.Y(tri(i / 100))]); line(ctx, tr, col.line, 4);
    for (let k = 1; k <= Math.min(nm, 4); k++) { const p = []; for (let i = 0; i <= 100; i++) p.push([A.X(i / 100), A.Y(b(k) * Math.sin(k * Math.PI * i / 100) * Math.cos(2 * Math.PI * k * t))]); line(ctx, p, col.s[k], 1.2, [3, 3]); }
    const sum = []; for (let i = 0; i <= 100; i++) { let y = 0; for (let k = 1; k <= nm; k++) y += b(k) * Math.sin(k * Math.PI * i / 100) * Math.cos(2 * Math.PI * k * t); sum.push([A.X(i / 100), A.Y(y)]); }
    line(ctx, sum, col.s[0], 3);
    ctx.restore();
    // bars of b_n
    const by = h * 0.5 + 18, bh = h - by - 26, bx = 30, bw = (w - 50) / 12;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(bx - 6, by + bh / 2); ctx.lineTo(w - 12, by + bh / 2); ctx.stroke();
    for (let n = 1; n <= 12; n++) { const v = b(n), x = bx + (n - 1) * bw; ctx.fillStyle = n <= nm ? col.s[0] : col.line; ctx.globalAlpha = n <= nm ? 0.85 : 0.6; ctx.fillRect(x + 2, v >= 0 ? by + bh / 2 - (v / b(1)) * (bh / 2) * 0.95 : by + bh / 2, bw - 4, Math.abs(v / b(1)) * (bh / 2) * 0.95); ctx.globalAlpha = 1; text(ctx, `${n}`, x + bw / 2, by + bh + 12, { color: col.muted, size: 10, align: 'center' }); }
    text(ctx, 'size b_n of each mode (n)', 10, by - 2, { color: col.muted, size: 10 });
  };
  upd();
  return { step(i) { nm = [1, 2, 4, 12][Math.min(3, i)]; sM.set(nm); upd(); } };
}
