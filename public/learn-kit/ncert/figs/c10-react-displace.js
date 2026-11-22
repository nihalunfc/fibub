// Class 10 Chemical Reactions: a displacement reaction. An iron nail in blue copper sulphate solution slowly gets
// a brown copper coat while the blue colour fades to pale green (Fe + CuSO4 -> FeSO4 + Cu). A copper strip in
// iron sulphate does nothing: copper is less reactive than iron, so it cannot push iron out.
import { canvas, text, title, line, dot, row, slider, choice, readout, clamp, lerp, rng } from '../../kit.js';

export default function (host) {
  let mode = 'fe', min = 0;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 290, label: 'A metal strip in a salt solution, with atoms swapping places if the metal is more reactive' });
  const ctl = row(host);
  choice(ctl, 'Try', [['fe', 'Fe nail in CuSO₄'], ['cu', 'Cu strip in FeSO₄']], mode, (v) => { mode = v; say(); });
  slider(ctl, { label: 'Time', min: 0, max: 30, step: 1, value: 0, fmt: (v) => `${v} min`, oninput: (v) => { min = v; say(); } });
  const out = readout(host);
  function say() {
    out.innerHTML = mode === 'fe' ? 'Fe + CuSO₄ (blue) → FeSO₄ (pale green) + Cu (brown). <b>Iron is more reactive than copper</b>, so it pushes Cu²⁺ out of the solution; each Fe atom goes in as Fe²⁺ and each Cu²⁺ comes out as a Cu atom on the nail.'
      : 'Cu + FeSO₄ → <b>no reaction</b>. Copper is less reactive than iron, so it cannot displace it. The solution stays pale green and the strip stays clean.'; cv.redraw();
  }
  const R = rng(3), pts = Array.from({ length: 24 }, () => [R(), R(), R()]);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, mode === 'fe' ? 'Iron nail in copper sulphate solution' : 'Copper strip in iron sulphate solution', col) + 8;
    const f = mode === 'fe' ? clamp(min / 30, 0, 1) : 0, bw = w * 0.5, bx = 14, by = top + 16, bh = h - by - 34;
    const sol = mode === 'fe' ? [lerp(60, 170, f), lerp(130, 200, f), lerp(220, 150, f)] : [170, 200, 150];
    ctx.fillStyle = `rgba(${sol[0]},${sol[1]},${sol[2]},0.55)`; ctx.fillRect(bx + 1, by + bh * 0.25, bw - 2, bh * 0.75 - 1);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by); ctx.stroke();
    const sx = bx + bw / 2 - 6, sy = by - 6, sh = bh * 0.8;
    ctx.fillStyle = mode === 'fe' ? '#8f949a' : '#c8773a'; ctx.fillRect(sx, sy, 12, sh);
    if (mode === 'fe') { ctx.fillStyle = `rgba(184,100,40,${f})`; ctx.fillRect(sx - 1 * f * 3, sy + bh * 0.3, 12 + 6 * f, (sh - bh * 0.3) * 1); }
    text(ctx, mode === 'fe' ? 'iron nail' : 'copper strip', bx + bw / 2, by + bh + 14, { color: col.muted, size: 11, align: 'center' });
    // atoms panel
    const px = bx + bw + 14, pw = w - px - 8, py = by + 6;
    text(ctx, 'atom level', px, py + 4, { color: col.muted, size: 10.5 });
    const nFe = Math.round(6 * f * 1), cy = py + 30;
    for (let i = 0; i < 6; i++) { const x = px + 10 + i * Math.min(24, (pw - 20) / 6); const shown = mode === 'fe' && i < Math.round(6 * f * 1);
      dot(ctx, x, cy, 8, mode === 'fe' ? (shown ? col.s[1] : '#8f949a') : '#c8773a');
    }
    text(ctx, mode === 'fe' ? 'nail surface: Fe → Cu' : 'copper strip: unchanged', px, cy + 20, { color: col.ink, size: 10, fit: true });
    pts.slice(0, 12).forEach(([a, b, s], i) => { const x = px + 8 + a * (pw - 16), y = by + bh * 0.4 + b * bh * 0.45;
      const isCu = mode === 'fe' && i < 12 * (1 - f); const isFe = mode === 'fe' ? i >= 12 * (1 - f) : true;
      dot(ctx, x + Math.sin(min * 0.5 + s * 9) * 2, y, 6, isFe ? col.s[2] : col.s[0]); });
    text(ctx, mode === 'fe' ? `Cu²⁺ (blue): ${12 - Math.round(12 * f)}   Fe²⁺ (green): ${Math.round(12 * f)}` : 'Fe²⁺ (green) stays in solution', px, by + bh - 4, { color: col.muted, size: 10 });
  };
  say();
}
