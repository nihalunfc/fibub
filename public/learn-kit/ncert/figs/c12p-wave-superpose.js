// Class 12 Wave Optics: coherent and incoherent addition of two waves of equal intensity I0. Two waves y1 = a sin(kx - wt) and
// y2 = a sin(kx - wt + phi) add to a wave of amplitude 2a|cos(phi/2)|, so I = 4 I0 cos^2(phi/2): between 0 (phi = 180 deg) and 4 I0 (phi = 0).
// If the phase difference jumps about at random (incoherent sources) the intensity averages to 2 I0, which is just I1 + I2: no fringes.
import { canvas, text, title, row, slider, choice, readout, line, loop, rng } from '../../kit.js';
import { rad } from '../c12p-optlib.js';

export default function (host) {
  let mode = 'coh', phi = 0, th = 0, ph = 0, avg = 2, hold = 0;
  const rnd = rng(7);
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'Two waves adding with a chosen phase difference, and the intensity of the sum' });
  const ctl = row(host);
  choice(ctl, 'Sources', [['coh', 'Coherent'], ['inc', 'Incoherent']], mode, (v) => { mode = v; avg = 2; cv.redraw(); });
  slider(ctl, { label: 'Phase difference φ', min: 0, max: 360, step: 5, value: 0, fmt: (v) => `${v}°`, oninput: (v) => { phi = v; } });
  const anim = loop(host, (dt) => {
    th += dt * 4;
    if (mode === 'inc') { hold -= dt; if (hold <= 0) { ph = rnd() * 360; hold = 0.45; } } else ph = phi;
    const I = 2 + 2 * Math.cos(rad(ph)); avg += (I - avg) * Math.min(1, dt * 1.2);
    cv.redraw();
  });
  anim.button(ctl);
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, mode === 'coh' ? 'Coherent: steady phase difference' : 'Incoherent: phase jumps at random', col) + 8;
    const x0 = 10, x1 = w * 0.7, band = (h - top - 10) / 3, A = band * 0.22, k = (2 * Math.PI) / (w * 0.3);
    const ys = [top + band * 0.5, top + band * 1.5, top + band * 2.5], p = rad(ph);
    const tr = (y, f, c, wd) => { const pts = []; for (let x = x0; x <= x1; x += 3) pts.push([x, y - A * f(x)]); line(ctx, pts, c, wd); };
    for (const y of ys) line(ctx, [[x0, y], [x1, y]], col.line, 1);
    tr(ys[0], (x) => Math.sin(k * (x - x0) - th), col.s[0], 2); tr(ys[1], (x) => Math.sin(k * (x - x0) - th + p), col.s[1], 2);
    tr(ys[2], (x) => Math.sin(k * (x - x0) - th) + Math.sin(k * (x - x0) - th + p), col.s[2], 2.6);
    text(ctx, 'wave 1', x0 + 2, ys[0] - A - 2, { color: col.s[0], size: 11, weight: 700 }); text(ctx, 'wave 2', x0 + 2, ys[1] - A - 2, { color: col.s[1], size: 11, weight: 700 });
    text(ctx, 'sum', x0 + 2, ys[2] - A - 2, { color: col.s[2], size: 11, weight: 700 });
    // intensity bar
    const bx = w * 0.82, bw = w * 0.1, by0 = h - 24, bh = h - top - 50, I = 2 + 2 * Math.cos(p), sc = bh / 4;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(bx, by0 - bh, bw, bh);
    ctx.fillStyle = col.s[2]; ctx.fillRect(bx, by0 - I * sc, bw, I * sc);
    line(ctx, [[bx - 6, by0 - 2 * sc], [bx + bw + 6, by0 - 2 * sc]], col.ink, 1.2, [4, 3]);
    text(ctx, '2I₀', bx - 8, by0 - 2 * sc, { color: col.ink, size: 10.5, align: 'right' }); text(ctx, '4I₀', bx - 8, by0 - bh, { color: col.muted, size: 10.5, align: 'right' }); text(ctx, '0', bx - 8, by0, { color: col.muted, size: 10.5, align: 'right' });
    text(ctx, mode === 'inc' ? 'I now' : 'I', bx + bw / 2, top + 4, { color: col.ink, size: 11, weight: 700, align: 'center' });
    if (mode === 'inc') { line(ctx, [[bx - 3, by0 - avg * sc], [bx + bw + 3, by0 - avg * sc]], col.s[3], 3); text(ctx, 'average', bx + bw / 2, by0 + 12, { color: col.s[3], size: 10.5, weight: 700, align: 'center' }); }
    out.innerHTML = mode === 'coh'
      ? `φ = ${ph.toFixed(0)}°: I = 4I₀ cos²(φ/2) = <b>${(I / 2).toFixed(2)} × 2I₀</b>. ` + (Math.abs(I - 4) < 0.05 ? 'In step: crests meet crests, <b>constructive</b>, 4I₀.' : I < 0.05 ? 'Opposite: crest meets trough, <b>destructive</b>, zero.' : 'In between.')
      : `The phase difference keeps changing, so the intensity flickers between 0 and 4I₀ and averages <b>${avg.toFixed(2)} × I₀ ≈ 2I₀ = I₁ + I₂</b>. No steady bright and dark places: no fringes.`;
  };
  cv.redraw();
}
