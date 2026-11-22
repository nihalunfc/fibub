// Solving Laplace's equation by relaxation. The metal electrodes are held at fixed potentials; every other grid
// point is repeatedly replaced by the average of its four neighbours (that is what ∇²V = 0 means). Press play and
// watch the potential spread out from the electrodes. Click a point to check the average-of-neighbours rule there.
import { canvas, text, row, button, choice, readout, loop } from '../kit.js';

const NX = 44, NY = 30;
const SETUPS = {
  plates: { name: 'Parallel plates', f: (i, j) => (j === 6 && i > 8 && i < 35 ? 1 : j === 23 && i > 8 && i < 35 ? -1 : null) },
  box: { name: 'Hot lid on a box', f: (i, j) => (i === 0 || i === NX - 1 || j === NY - 1 ? 0 : j === 0 ? 1 : null) },
  rods: { name: 'Two rods', f: (i, j) => ((i - 13) ** 2 + (j - 15) ** 2 < 6 ? 1 : (i - 31) ** 2 + (j - 15) ** 2 < 6 ? -1 : null) },
  point: { name: 'Rod near a grounded plane', f: (i, j) => (j === NY - 1 ? 0 : (i - 22) ** 2 + (j - 9) ** 2 < 5 ? 1 : null) },
};
export default function (host) {
  let key = 'plates', V, fixed, it = 0, sel = null;
  const cv = canvas(host, { aspect: NY / NX, max: 340, min: 200, label: 'Potential in a region found by repeated averaging of neighbours' });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Electrodes', Object.entries(SETUPS).map(([k, s]) => [k, s.name]), key, (v) => { key = v; reset(); });
  const out = readout(host);
  const anim = loop(host, () => { for (let s = 0; s < 4; s++) sweep(); it += 4; cv.redraw(); show(); });
  anim.button(c2); button(c2, 'One sweep', () => { anim.pause(); sweep(); it++; cv.redraw(); show(); }); button(c2, 'Reset', () => reset());
  function reset() { V = new Float32Array(NX * NY); fixed = new Array(NX * NY).fill(null); for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) { const v = SETUPS[key].f(i, j); if (v !== null) { fixed[j * NX + i] = v; V[j * NX + i] = v; } } it = 0; sel = null; cv.redraw(); show(); }
  function sweep() { let d = 0; for (let j = 1; j < NY - 1; j++) for (let i = 1; i < NX - 1; i++) { const k = j * NX + i; if (fixed[k] !== null) continue; const n = (V[k - 1] + V[k + 1] + V[k - NX] + V[k + NX]) / 4; d = Math.max(d, Math.abs(n - V[k])); V[k] = n; } cv.last = d; }
  function show() { let t = `Sweeps so far: <b>${it}</b>; biggest change in the last sweep ${(cv.last || 0).toExponential(1)}. `; if (sel) { const k = sel[1] * NX + sel[0]; t += sel[0] > 0 && sel[0] < NX - 1 && sel[1] > 0 && sel[1] < NY - 1 ? `At the chosen point V = ${V[k].toFixed(3)}, average of its four neighbours = ${((V[k - 1] + V[k + 1] + V[k - NX] + V[k + NX]) / 4).toFixed(3)} (equal once it has settled).` : 'Choose a point inside the region.'; } else t += 'Click a point to compare V with the average of its neighbours.'; out.innerHTML = t; }
  cv.c.addEventListener('click', (e) => { const b = cv.c.getBoundingClientRect(); sel = [Math.floor((e.clientX - b.left) / cv.w * NX), Math.floor((e.clientY - b.top) / cv.h * NY)]; cv.redraw(); show(); });
  cv.draw = (ctx, w, h, col) => {
    const cw = w / NX, ch = h / NY;
    for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) { const v = V[j * NX + i]; ctx.globalAlpha = Math.min(1, Math.abs(v)) * 0.85; ctx.fillStyle = v > 0 ? col.s[5] : col.s[0]; ctx.fillRect(i * cw, j * ch, cw + 0.5, ch + 0.5); if (fixed[j * NX + i] !== null) { ctx.globalAlpha = 1; ctx.fillStyle = col.ink; ctx.fillRect(i * cw, j * ch, cw + 0.5, ch + 0.5); } }
    ctx.globalAlpha = 0.7; ctx.strokeStyle = col.ink; ctx.lineWidth = 1;
    for (const L of [-0.75, -0.5, -0.25, 0.25, 0.5, 0.75]) { ctx.beginPath(); for (let j = 0; j < NY - 1; j++) for (let i = 0; i < NX - 1; i++) { const a = V[j * NX + i] - L, b = V[j * NX + i + 1] - L, c = V[(j + 1) * NX + i] - L, p = [];
      if (a * b < 0) p.push([(i + a / (a - b) + 0.5) * cw, (j + 0.5) * ch]); if (a * c < 0) p.push([(i + 0.5) * cw, (j + a / (a - c) + 0.5) * ch]); if (p.length === 2) { ctx.moveTo(p[0][0], p[0][1]); ctx.lineTo(p[1][0], p[1][1]); } } ctx.stroke(); }
    ctx.globalAlpha = 1;
    if (sel) { ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.strokeRect(sel[0] * cw, sel[1] * ch, cw, ch); }
    text(ctx, 'Black: electrodes (+1 or −1). Red +, blue −.', 8, h - 9, { color: col.ink, size: 10.5, halo: col.panel });
  };
  reset();
}
