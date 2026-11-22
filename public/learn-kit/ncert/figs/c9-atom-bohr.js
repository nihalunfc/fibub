// Class 9 Journey Inside the Atom (step player): Bohr's idea in five steps. Electrons move in fixed shells and do not
// radiate while they stay in one, so the atom is stable. Shell 1 has the lowest energy, shell 2 more. An electron can jump
// up when it absorbs exactly the right amount of energy, and falls back by giving that energy out as light.
import { canvas, text, title, dot, line, arrow, loop } from '../../kit.js';

const CAP = ['Rutherford’s problem: a circling electron should lose energy and spiral into the nucleus. Real atoms do not collapse.', 'Bohr’s answer: electrons move only in fixed circular paths called shells (orbits), each with a fixed energy. In a shell, they do not lose energy.', 'The electron stays in shell 1 (lowest energy, the “ground state”). The atom is stable.', 'Give the atom exactly the right amount of energy (heat, light) and the electron jumps up to shell 2. It cannot stay between shells.', 'It soon falls back to shell 1 and gives out the same energy as a flash of light. This is why each element glows with its own colours.'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'An electron in fixed shells jumping up when it absorbs energy and giving out light when it falls' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, ['Why would an atom collapse?', 'Bohr: fixed shells', 'Ground state', 'Absorb energy: jump up', 'Fall back: give out light'][step], col);
    const cx = w / 2, cy = h * 0.43, r1 = Math.min(w, h) * 0.17, r2 = r1 * 2;
    if (step >= 1) { [r1, r2].forEach((r) => { ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.strokeStyle = col.s[4]; ctx.lineWidth = 1.5; ctx.stroke(); }); text(ctx, 'shell 1', cx + r1 * 0.72, cy - r1 * 0.9, { color: col.muted, size: 10 }); text(ctx, 'shell 2', cx + r2 * 0.72, cy - r2 * 0.92, { color: col.muted, size: 10 }); }
    dot(ctx, cx, cy, 10, col.s[1]);
    let r = r1, a = t * 2;
    if (step === 0) { const f = (t * 0.25) % 1; r = r2 * (1 - f) + 12 * f; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.arc(cx, cy, r2, 0, 7); ctx.strokeStyle = col.line; ctx.stroke(); ctx.setLineDash([]); a = t * (2 + f * 6); text(ctx, 'spiralling in (does not happen)', cx, h - 56, { color: col.bad, size: 11, weight: 700, align: 'center' }); }
    if (step === 3) { const f = Math.min(1, (t % 3) / 1.2); r = r1 + (r2 - r1) * f; if (f < 1) { for (let k = 0; k < 3; k++) { const p = ((t * 0.7 + k / 3) % 1); line(ctx, [[10 + p * 20, cy - 60 + k * 10], [10 + p * 20 + 14, cy - 60 + k * 10]], col.s[3], 2); } arrow(ctx, 12, cy - 56, r1 + cx - 40, cy - 6, col.s[3], 2); text(ctx, 'energy in', 14, cy - 74, { color: col.s[3], size: 11, weight: 700 }); } }
    if (step === 4) { const T = t % 3.2, f = Math.min(1, T / 1.2); r = r2 - (r2 - r1) * f; if (T > 1.2) { const p = Math.min(1, (T - 1.2) / 1.2); const px = cx + r1 + p * (w - cx - r1 - 12), py = cy - r1 * 0.5 - p * 30; for (let k = 0; k < 4; k++) dot(ctx, px - k * 7, py + Math.sin(k + t * 8) * 4 + k * 1.5, 2.4, col.s[2]); text(ctx, 'light out', w - 12, cy - 78, { color: col.s[2], size: 11, weight: 700, align: 'right' }); } }
    dot(ctx, cx + Math.cos(a) * r, cy + Math.sin(a) * r, 6, col.s[2]);
    const wds = CAP[step].split(' '); const L = []; let cur = ''; wds.forEach((wd) => { if ((cur + ' ' + wd).trim().length > w / 6.3) { L.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, w / 2, h - 12 - (L.length - 1 - i) * 14, { color: col.ink, size: 10.5, align: 'center' }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); t = 0; cv.redraw(); } };
}
