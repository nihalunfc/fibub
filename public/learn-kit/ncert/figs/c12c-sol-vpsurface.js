// Class 12 Chemistry, Solutions (step player): why a non-volatile solute lowers the vapour pressure of a solvent.
// Only solvent molecules at the surface can escape. Solute particles take up surface places and cannot escape themselves, so fewer solvent molecules leave:
// the rate of escape (and so the vapour pressure) falls in proportion to the mole fraction of the solvent: p = x1 p*, i.e. (p* - p)/p* = x2.
import { canvas, text, title, line, loop, rng, row, slider, readout } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0, x2 = 0.3;
  const TITLES = ['Pure solvent: molecules escape from the surface', 'Add a non-volatile solute', 'Surface places are taken by solute', 'Fewer solvent molecules escape: lower vapour pressure', 'Relative lowering of vapour pressure = x₂'];
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 320, label: 'Surface of a solvent with and without solute particles showing fewer molecules escaping' });
  const ctl = row(host), ro = readout(host), R = rng(3);
  slider(ctl, { label: 'mole fraction of solute x₂', min: 0, max: 0.6, step: 0.05, value: x2, fmt: (v) => v.toFixed(2), oninput: (v) => { x2 = v; go(); } });
  const N = 12, M = 4, cells = Array.from({ length: N * M }, (_, i) => ({ r: R(), ph: R() * 6 }));
  const go = () => { const sh = step === 0 ? 0 : x2; ro.textContent = step === 0 ? 'Pure solvent at the surface: p = p*.' : `x₂ = ${sh.toFixed(2)}: solvent fraction x₁ = ${(1 - sh).toFixed(2)}, so p = x₁p* = ${(1 - sh).toFixed(2)} p*.  Relative lowering (p* − p)/p* = ${sh.toFixed(2)} = x₂.`; cv.redraw(); };
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, TITLES[step], col) + 10, sh = step === 0 ? 0 : x2, L = 22, W = w - 44, cw = W / N, ch = 20;
    const surf = t0 + 70, top = surf - 4;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.14; ctx.fillRect(L, surf, W, M * ch + 10); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(L, top - 50, W, surf - top + 50 + M * ch + 10);
    let esc = 0, nsolv = 0;
    for (let k = 0; k < N * M; k++) {
      const c = cells[k], i = k % N, j = Math.floor(k / N), cx = L + cw * (i + 0.5), cy = surf + 14 + j * ch, isSolute = c.r < sh;
      ctx.beginPath(); ctx.arc(cx, cy, isSolute ? 8 : 6, 0, 7); ctx.fillStyle = isSolute ? col.s[2] : col.s[0]; ctx.fill();
      if (j === 0 && !isSolute) { nsolv++; const ph = (t * 0.7 + c.ph) % 5; if (ph < 1.2) { const u = ph / 1.2; ctx.globalAlpha = 1 - u * 0.6; ctx.beginPath(); ctx.arc(cx, cy - 12 - u * 50, 5, 0, 7); ctx.fillStyle = col.s[0]; ctx.fill(); ctx.globalAlpha = 1; esc++; } }
    }
    const shown = Math.round((1 - sh) * 100);
    text(ctx, 'vapour', L + 6, top - 36, { color: col.muted, size: 11 }); text(ctx, 'solution', L + 6, surf + M * ch + 24 - 4, { color: col.muted, size: 11 });
    const by = surf + M * ch + 44;
    text(ctx, `● solvent  ● solute (cannot escape)`, L, by, { color: col.muted, size: 10.5 });
    if (step >= 1) { text(ctx, `Surface places held by solvent: ${shown} %`, L, by + 20, { color: col.s[0], size: 12, weight: 700 }); }
    if (step >= 3) { const bw = W * 0.7; ctx.fillStyle = col.line; ctx.fillRect(L, by + 38, bw, 14); ctx.fillStyle = col.s[3]; ctx.fillRect(L, by + 38, bw * (1 - sh), 14); text(ctx, `p = ${(1 - sh).toFixed(2)} p*  (bar shows p against p*)`, L, by + 64, { color: col.s[3], size: 11.5, weight: 700 }); }
    if (step >= 4) text(ctx, `(p* − p)/p* = x₂ = ${sh.toFixed(2)}`, L, by + 84, { color: col.ink, size: 12.5, weight: 700 });
  };
  go();
  return { step(i) { step = Math.min(i, 4); go(); } };
}
