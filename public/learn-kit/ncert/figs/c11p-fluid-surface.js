// Class 11 Mechanical Properties of Fluids: surface tension. (1) Molecules: a molecule inside a liquid is pulled equally all round; one at the surface has neighbours only below and the sides, so there is a net pull inward and the surface behaves
// like a stretched skin. (2) Film: a soap film on a wire frame with a slider wire of length l pulls with F = 2 S l (two surfaces); S = F/(2l), energy to enlarge area dA is S dA. (3) Drop and bubble: excess pressure inside a drop is 2S/r,
// in a soap bubble (two surfaces) 4S/r. S: water 0.073, soap solution 0.025 N/m.
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let mode = 'mol', S = 0.073, l = 0.1, r = 2, t = 0;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 300, label: 'Molecules at the surface of a liquid, a soap film on a frame, and the pressure inside a drop or bubble' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Show', [['mol', 'molecules'], ['film', 'soap film'], ['drop', 'drop and bubble']], mode, (m) => { mode = m; go(); });
  slider(ctl, { label: 'surface tension S (N/m)', min: 0.02, max: 0.08, step: 0.005, value: S, fmt: (x) => x.toFixed(3), oninput: (x) => { S = x; go(); } });
  slider(ctl, { label: 'length l of the sliding wire (cm) / radius r (mm)', min: 1, max: 10, step: 0.5, value: 5, fmt: (x) => x.toFixed(1), oninput: (x) => { l = x / 100; r = x * 0.4; go(); } });
  const go = () => { ro.textContent = mode === 'mol' ? 'Surface molecules are pulled inward by the ones below: the surface tries to be as small as possible.' : mode === 'film' ? `Pull on the wire: F = 2Sl = 2 × ${S.toFixed(3)} × ${l.toFixed(3)} = ${(2 * S * l * 1000).toPrecision(3)} mN (two surfaces, front and back).` : `r = ${r.toFixed(1)} mm: drop excess pressure 2S/r = ${(2 * S / (r / 1000)).toFixed(1)} Pa; soap bubble 4S/r = ${(4 * S / (r / 1000)).toFixed(1)} Pa. The smaller the drop, the higher the pressure.`; cv.redraw(); };
  loop(host, (dt) => { t += dt; if (mode === 'mol') cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, { mol: 'Why a liquid surface acts like a skin', film: 'Soap film: F = 2Sl', drop: 'Smaller bubbles have higher pressure' }[mode], col) + 12;
    if (mode === 'mol') {
      const sy = top + 40, nx = Math.max(6, Math.floor((w - 40) / 32)), x0 = (w - (nx - 1) * 32) / 2;
      ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.1; ctx.fillRect(10, sy, w - 20, h - sy - 16); ctx.globalAlpha = 1; line(ctx, [[10, sy], [w - 10, sy]], col.s[0], 1.5);
      const pos = (i, j) => [x0 + i * 32 + 3 * Math.sin(t * 2 + i * 1.3 + j), sy + 14 + j * 32 + 3 * Math.cos(t * 2.3 + j * 1.7 + i)];
      for (let j = 0; j < 4; j++) for (let i = 0; i < nx; i++) { const [x, y] = pos(i, j); dot(ctx, x, y, 5, col.s[0]); }
      const bi = Math.floor(nx / 2), [bx, by] = pos(bi, 2), [sx, sy2] = pos(bi - 2, 0);
      dot(ctx, bx, by, 6, col.s[3], col.panel); dot(ctx, sx, sy2, 6, col.s[1], col.panel);
      for (let a = 0; a < 6; a++) { const an = a * Math.PI / 3 + 0.5; arrow(ctx, bx, by, bx + Math.cos(an) * 24, by + Math.sin(an) * 24, col.s[3], 1.5, 5); }
      for (const an of [0.3, Math.PI - 0.3, Math.PI / 2 - 0.7, Math.PI / 2, Math.PI / 2 + 0.7]) arrow(ctx, sx, sy2, sx + Math.cos(an) * 22, sy2 + Math.sin(an) * 22, col.s[1], 1.5, 5);
      arrow(ctx, sx, sy2 - 4, sx, sy2 + 42, col.s[1], 3, 8);
      text(ctx, 'inside: pulls cancel', bx, by + 40, { color: col.s[3], size: 11, weight: 700, align: 'center', halo: col.panel }); text(ctx, 'surface: net pull inward', sx, sy - 14, { color: col.s[1], size: 11, weight: 700, align: 'center' }); text(ctx, 'air above', 14, sy - 14, { color: col.muted, size: 10.5 });
    } else if (mode === 'film') {
      const fx0 = 40, fy0 = top + 20, fw = w - 90, fh = h - fy0 - 36, sx = fx0 + fw * (0.9 - 0.5 * (l - 0.01) / 0.09);
      ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.2; ctx.fillRect(fx0, fy0, sx - fx0, fh); ctx.globalAlpha = 1;
      line(ctx, [[fx0 + fw, fy0], [fx0, fy0], [fx0, fy0 + fh], [fx0 + fw, fy0 + fh]], col.ink, 3);
      line(ctx, [[sx, fy0 - 4], [sx, fy0 + fh + 4]], col.s[3], 4);
      for (const y of [fy0 + fh * 0.3, fy0 + fh * 0.5, fy0 + fh * 0.7]) arrow(ctx, sx - 4, y, sx - 34, y, col.s[1], 2, 6);
      const F = 2 * S * l, pull = Math.min(70, F * 1000 * 8); arrow(ctx, sx + 4, fy0 + fh / 2, sx + 6 + pull, fy0 + fh / 2, col.s[2], 3, 8);
      text(ctx, 'film pulls the wire in: 2Sl', fx0 + 8, fy0 + fh * 0.18, { color: col.s[1], size: 10.5, weight: 700 }); text(ctx, 'you pull out with F = ' + (F * 1000).toPrecision(2) + ' mN', sx + 6, fy0 + fh / 2 + 18, { color: col.s[2], size: 10.5, weight: 700 });
      text(ctx, 'l', sx + 10, fy0 + 8, { color: col.s[3], size: 12, weight: 700 });
    } else {
      const cx = w * 0.3, cy = top + (h - top) * 0.45, rr = 14 + r * 4.2, Pd = 2 * S / (r / 1000), Pb = 2 * Pd;
      ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 7); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy, rr + 7, 0, 7); ctx.lineWidth = 1.5; ctx.stroke();
      text(ctx, 'soap bubble (2 surfaces)', cx, cy + rr + 24, { color: col.ink, size: 10.5, align: 'center' });
      const bx = w * 0.62, bw = w * 0.15, by = h - 40, scale = (h - top - 90) / 140, mx = 4 * 0.08 / 0.0004;
      [[Pd, 'drop 2S/r', col.s[0]], [Pb, 'bubble 4S/r', col.s[3]]].forEach(([p, lab, c], i) => { const x = bx + i * (bw + 10), hh = Math.min(by - top - 10, (p / mx) * (by - top - 20)); ctx.fillStyle = c; ctx.fillRect(x, by - hh, bw, hh); text(ctx, p.toFixed(0), x + bw / 2, by - hh - 8, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, lab, x + bw / 2, by + 14, { color: col.ink, size: 10, align: 'center' }); });
      text(ctx, 'pressure inside, above outside (Pa)', w - 8, top + 6, { color: col.muted, size: 10, align: 'right' });
    }
  };
  go();
}
