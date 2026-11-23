// Class 11 Work, Energy and Power: spring potential energy. Pulling a spring by x needs a force that grows from 0 to kx, so the work stored is the
// triangle under the F-x line: U = 1/2 k x^2. Release the block (mass 0.5 kg, no friction) and it swaps U for kinetic energy: x(t) = x0 cos(wt), w = sqrt(k/m).
import { canvas, axes, line, text, title, row, slider, button, readout, loop, dot } from '../../kit.js';

export default function (host) {
  const m = 0.5; let k = 100, x0 = 0.2, x = 0.2, t = 0, going = false;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 300, label: 'A block on a spring and the force-extension graph with the stored energy shaded' });
  const ctl = row(host);
  const sk = slider(ctl, { label: 'Spring stiffness k', min: 20, max: 200, step: 5, value: 100, fmt: (v) => v + ' N/m', oninput: (v) => { k = v; cv.redraw(); } });
  const sx = slider(ctl, { label: 'Stretch x', min: -0.3, max: 0.3, step: 0.01, value: 0.2, fmt: (v) => (v * 100).toFixed(0) + ' cm', oninput: (v) => { x0 = x = v; going = false; t = 0; cv.redraw(); } });
  const b2 = row(host);
  button(b2, 'Release', () => { going = true; t = 0; x0 = sx.value; });
  button(b2, 'Hold again', () => { going = false; x = x0 = sx.value; cv.redraw(); });
  const ro = readout(host);
  loop(host, (dt) => { if (!going) return; t += dt; x = x0 * Math.cos(Math.sqrt(k / m) * t); cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Spring energy U = ½ k x²', col);
    const wallX = 24, y0 = top + 38, restX = w * 0.5, sc = (w * 0.3) / 0.3, bx = restX + x * sc, bw = 40;
    ctx.fillStyle = col.line; ctx.fillRect(wallX - 8, y0 - 26, 8, 52);
    ctx.save(); ctx.beginPath(); ctx.moveTo(wallX, y0);
    const n = 14, x1 = bx - bw / 2; for (let i = 1; i <= n; i++) ctx.lineTo(wallX + (x1 - wallX) * i / (n + 1), y0 + (i % 2 ? -10 : 10)); ctx.lineTo(x1, y0);
    ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2.5; ctx.stroke(); ctx.restore();
    ctx.fillStyle = col.s[0]; ctx.fillRect(bx - bw / 2, y0 - 18, bw, 36);
    line(ctx, [[wallX - 8, y0 + 22], [w - 10, y0 + 22]], col.muted, 1.5);
    line(ctx, [[restX, y0 - 30], [restX, y0 + 30]], col.muted, 1, [3, 3]);
    text(ctx, 'rest', restX, y0 - 38, { color: col.muted, size: 11, align: 'center' });
    const A = axes(ctx, w, h, col, { x: [-30, 30], y: [-60, 60], xt: [-30, -15, 0, 15, 30], yt: [-60, -30, 0, 30, 60], xlabel: 'stretch x (cm)', ylabel: 'pull needed F (N)', t: y0 + 50, l: 46 });
    line(ctx, [[A.X(-30), A.Y(-k * 0.3)], [A.X(30), A.Y(k * 0.3)]], col.s[0], 2.5);
    const xc = Math.max(-30, Math.min(30, x * 100)), Fc = k * x;
    ctx.save(); ctx.beginPath(); ctx.moveTo(A.X(0), A.Y(0)); ctx.lineTo(A.X(xc), A.Y(Fc)); ctx.lineTo(A.X(xc), A.Y(0)); ctx.closePath(); ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.35; ctx.fill(); ctx.restore();
    dot(ctx, A.X(xc), A.Y(Fc), 5, col.s[2], col.panel);
    const U = 0.5 * k * x * x, E = 0.5 * k * x0 * x0;
    text(ctx, `stored U = ${U.toFixed(2)} J`, A.R - 6, A.T + 12, { color: col.ink, size: 13, weight: 700, align: 'right', halo: col.panel });
    ro.textContent = `U = ½ × ${k} × ${x.toFixed(2)}² = ${U.toFixed(2)} J. Kinetic energy now ${(E - U).toFixed(2)} J, total ${E.toFixed(2)} J${going ? ', speed ' + Math.sqrt(2 * (E - U) / m).toFixed(2) + ' m/s' : ''}. Stretching or squeezing by the same amount stores the same energy.`;
  };
  cv.redraw();
}
