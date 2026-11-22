// The lanthanide contraction. Slide from La to Lu: each step adds a proton and a 4f electron, but 4f electrons shield the outer
// electrons poorly, so the ion shrinks steadily (La³⁺ 103 pm to Lu³⁺ 86 pm). Switch to "Zr and Hf twins" to see the effect
// on the d-block: 5d atoms end up the same size as the 4d atoms above them, so Zr/Hf and Nb/Ta behave almost identically.
import { canvas, axes, line, dot, text, row, slider, choice, button, readout, loop, title } from '../kit.js';

const LN = 'La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu'.split(' ');
const RAD = [103.2, 101, 99, 98.3, 97, 95.8, 94.7, 93.8, 92.3, 91.2, 90.1, 89, 88, 86.8, 86.1];
const F = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]; // 4f electrons in Ln3+ (La3+ 4f0 ... Lu3+ 4f14)
const TWINS = [['Ti', 'Zr', 'Hf', 147, 160, 159], ['V', 'Nb', 'Ta', 134, 146, 146], ['Cr', 'Mo', 'W', 128, 139, 139]];
export default function (host) {
  let i = 0, view = 'ln';
  const cv = canvas(host, { aspect: 0.95, max: 460, min: 330, label: 'Size of lanthanide ions across the series and metallic radii of group 4, 5 and 6 d-block metals' });
  choice(row(host), 'View', [['ln', 'Lanthanide ions'], ['tw', 'Zr and Hf twins']], view, (v) => { view = v; set(); });
  const c1 = row(host);
  const sl = slider(c1, { label: 'Element', min: 0, max: 14, step: 1, value: 0, fmt: (v) => LN[v] + '³⁺', oninput: (v) => { i = Math.round(v); set(); } });
  const an = loop(host, (dt, t) => { if (t - (an.l || 0) > 0.7) { an.l = t; i = i >= 14 ? 0 : i + 1; sl.set(i); set(); } }, { autoplay: false });
  an.button(c1);
  const out = readout(host);
  function set() {
    out.innerHTML = view === 'ln'
      ? `<b>${LN[i]}³⁺</b>: atomic number ${57 + i}, 4f<sup>${F[i]}</sup>, radius <b>${RAD[i]} pm</b> (${(RAD[0] - RAD[i]).toFixed(1)} pm smaller than La³⁺). Total shrink La → Lu is about 17 pm, only about 1.1 pm per step: small steps that add up because the extra nuclear charge outweighs the weak shielding of the 4f electrons. Result: similar chemistry makes the lanthanides hard to separate, and Zr ≈ Hf, Nb ≈ Ta.`
      : `Metallic radii (pm): going down a group should add a shell, and from 3d to 4d it does (+11 to +13 pm), but from 4d to 5d it adds almost nothing because the 4f electrons filled in between did not shield. Hf is 1 pm smaller than Zr; Ta is the same as Nb; W the same as Mo. This is why their densities and chemistry are so alike.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    if (view === 'ln') {
      title(ctx, 'Ln³⁺ radius across the series', col);
      const A = axes(ctx, w, h, col, { x: [-0.5, 14.5], y: [84, 106], xlabel: 'La → Lu', ylabel: 'ionic radius (pm)', t: 44, xt: [], fx: () => '', yt: [86, 90, 94, 98, 102, 106] });
      RAD.forEach((r, k) => { text(ctx, LN[k], A.X(k), A.B + 9, { color: k === i ? col.ink : col.muted, size: w < 400 ? 8 : 10, weight: k === i ? 700 : 400, align: 'center', fit: false }); });
      line(ctx, RAD.map((r, k) => [A.X(k), A.Y(r)]), col.s[0], 2.5);
      RAD.forEach((r, k) => dot(ctx, A.X(k), A.Y(r), k === i ? 6 : 3, k === i ? col.s[1] : col.s[0], k === i ? col.panel : null));
      // little ion picture
      const cx = A.R - 38, cy = A.B - 48, rr = 6 + RAD[i] * 0.27;
      ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 7); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.2; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.stroke();
      text(ctx, `+${57 + i}`, cx, cy, { color: col.ink, size: 10, weight: 700, align: 'center', fit: false });
      for (let k = 0; k < F[i]; k++) { const a = (k / 14) * 6.283; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * rr * 0.55, cy + Math.sin(a) * rr * 0.55, 2.2, 0, 7); ctx.fillStyle = col.s[1]; ctx.fill(); }
      text(ctx, '4f e⁻ (orange)', cx, cy + rr + 12, { color: col.s[1], size: 9, align: 'center' });
    } else {
      title(ctx, 'Metallic radii: 3d, 4d, 5d metals', col);
      const A = axes(ctx, w, h, col, { x: [-0.5, 8.5], y: [100, 170], xlabel: '', ylabel: 'radius (pm)', t: 44, xt: [], fx: () => '', yt: [100, 120, 140, 160] });
      TWINS.forEach((g, k) => { [3, 4, 5].forEach((idx, j) => { const x = k * 3 + j, r = g[idx], bw = (A.R - A.L) / 10; ctx.fillStyle = col.s[[0, 1, 2][j]]; ctx.fillRect(A.X(x) - bw / 2, A.Y(r), bw, A.B - A.Y(r)); text(ctx, g[j], A.X(x), A.B + 9, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, String(r), A.X(x), A.Y(r) - 8, { color: col.ink, size: 10, align: 'center' }); }); });
    }
  };
  set();
}
