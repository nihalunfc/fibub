// Class 11 Maths, Complex Numbers: polar form z = r(cos θ + i sin θ), with r = |z| and θ the argument, measured from the positive real axis, between −π and π (principal value).
// A calculator's tan⁻¹(y/x) only gives angles from −90° to 90°, so in quadrants II and III the angle must be corrected. Drag z and compare.
import { canvas, text, title, row, button, readout, touchGuard, dot, arrow } from '../../kit.js';
import { argandPlot, cstr, r2, pos } from '../c11m-lib.js';

export default function (host) {
  let z = [-2, 2], drag = false, P = null;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 290, label: 'A complex number on the Argand plane with its modulus, principal argument and the calculator angle' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Polar form: distance r and angle θ', col);
    P = argandPlot(ctx, w, h, col, { x: 22, y: 26, w: w - 34, h: h - 40 }, 4);
    const [x, y] = z, m = Math.hypot(x, y), th = Math.atan2(y, x), nv = x === 0 ? Math.sign(y) * Math.PI / 2 : Math.atan(y / x), O = [P.X(0), P.Y(0)];
    if (m > 0.2 && Math.abs(nv - th) > 1e-9) { ctx.setLineDash([3, 3]); ctx.strokeStyle = col.bad; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(O[0], O[1], 34, 0, -nv, nv > 0); ctx.stroke(); ctx.setLineDash([]); }
    if (m > 0.2) { ctx.strokeStyle = col.s[2]; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(O[0], O[1], 22, 0, -th, th > 0); ctx.stroke(); }
    arrow(ctx, ...O, P.X(x), P.Y(y), col.s[0], 2.6, 9); dot(ctx, P.X(x), P.Y(y), 8, col.s[0], col.panel);
    text(ctx, `r = ${r2(m, 2)}`, (O[0] + P.X(x)) / 2 + 8, (O[1] + P.Y(y)) / 2 - 8, { color: col.s[0], size: 12, weight: 800 });
    const q = x >= 0 && y >= 0 ? 'I' : x < 0 && y > 0 ? 'II' : x < 0 && y <= 0 ? 'III' : 'IV', d = (v) => r2((v * 180) / Math.PI, 0) + '°';
    const fix = Math.abs(nv - th) > 1e-9;
    out.innerHTML = `z = ${cstr(x, y)} is in quadrant ${q}. r = <b>${r2(m, 2)}</b>. Calculator tan⁻¹(y/x) = ${d(nv)}${fix ? ' (<b style="color:' + col.bad + '">wrong quadrant</b>, dashed)' : ' (correct here)'}. Principal argument θ = <b>${d(th)}</b> = ${r2(th, 3)} rad. Polar form: ${r2(m, 2)}(cos ${d(th)} + i sin ${d(th)}).`;
  };
  const hit = (px, py) => P && Math.hypot(P.X(z[0]) - px, P.Y(z[1]) - py) < 20;
  const set = (e) => { const [px, py] = pos(cv.c, e); z = [Math.max(-3.5, Math.min(3.5, Math.round(P.ix(px)))), Math.max(-3.5, Math.min(3.5, Math.round(P.iy(py))))]; cv.redraw(); };
  cv.c.addEventListener('pointerdown', (e) => { if (hit(...pos(cv.c, e))) { drag = true; cv.c.setPointerCapture(e.pointerId); set(e); } });
  cv.c.addEventListener('pointermove', (e) => { if (drag) set(e); }); cv.c.addEventListener('pointerup', () => { drag = false; });
  touchGuard(cv.c, hit);
  const r = row(host);
  [['1 + i', [1, 1]], ['−1 + i', [-1, 1]], ['−1 − i', [-1, -1]], ['1 − i', [1, -1]], ['−2', [-2, 0]]].forEach(([n, v]) => button(r, n, () => { z = v; cv.redraw(); }));
  cv.redraw();
}
