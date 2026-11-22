// Class 9 Work and Energy: KE = (1/2) m v^2 and PE = m g h. Sliders for mass, speed and height; two bars show the
// two energies. Doubling the speed makes the kinetic energy four times as big (v is squared); doubling the height
// only doubles the potential energy. A cricket ball moves along while a second ball sits on a shelf.
import { canvas, text, title, line, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let m = 0.16, v = 20, hgt = 5, t = 0;
  const g = 9.8;
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 300, label: 'Bars comparing kinetic energy and potential energy for a ball as mass speed and height change' });
  const ctl = row(host);
  slider(ctl, { label: 'Mass', min: 0.1, max: 2, step: 0.1, value: m, fmt: (x) => `${x.toFixed(1)} kg`, oninput: (x) => { m = x; upd(); } });
  slider(ctl, { label: 'Speed', min: 0, max: 30, step: 1, value: v, fmt: (x) => `${x} m/s`, oninput: (x) => { v = x; upd(); } });
  slider(ctl, { label: 'Height', min: 0, max: 20, step: 1, value: hgt, fmt: (x) => `${x} m`, oninput: (x) => { hgt = x; upd(); } });
  const out = readout(host);
  const KE = () => 0.5 * m * v * v, PE = () => m * g * hgt;
  function upd() { out.innerHTML = `KE = ½ × ${m.toFixed(1)} × ${v}² = <b>${KE().toFixed(1)} J</b> · PE = ${m.toFixed(1)} × 9.8 × ${hgt} = <b>${PE().toFixed(1)} J</b>. Try doubling the speed, then the height.`; cv.redraw(); }
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Kinetic energy and potential energy', col);
    const base = h * 0.6, r = 6 + m * 5;
    line(ctx, [[8, base], [w * 0.5, base]], col.ink, 2);
    // ball moving with speed ∝ v
    const px = 14 + ((t * v * 3) % (w * 0.5 - 40)); ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.arc(px, base - r, r, 0, 7); ctx.fill();
    if (v > 0) { ctx.setLineDash([3, 3]); line(ctx, [[px - 8 - v, base - r], [px - r - 2, base - r]], col.s[2], 2); }
    text(ctx, `moving at ${v} m/s`, 12, base + 16, { color: col.muted, size: 10.5 });
    // shelf ball
    const sh = base - Math.min(hgt, 20) / 20 * (base - 46) - 0;
    ctx.fillStyle = col.line; ctx.fillRect(w * 0.55, sh, 46, 5); ctx.fillRect(w * 0.55 + 39, sh, 5, base - sh);
    ctx.fillStyle = col.s[1]; ctx.beginPath(); ctx.arc(w * 0.55 + 22, sh - r, r, 0, 7); ctx.fill();
    line(ctx, [[w * 0.55 + 54, base], [w * 0.55 + 54, sh]], col.muted, 1, [3, 3]); text(ctx, `h = ${hgt} m`, w * 0.55 + 58, (base + sh) / 2, { color: col.muted, size: 10.5 });
    // bars
    const bb = h - 22, top = base + 26, maxE = 500, bh = (e) => Math.min(1, e / maxE) * (bb - top);
    const bx = [w * 0.62, w * 0.82];
    [[KE(), 'KE', col.s[2]], [PE(), 'PE', col.s[1]]].forEach(([e, n, c], i) => {
      ctx.fillStyle = c; const hh = Math.max(1, bh(e)); ctx.fillRect(bx[i] - 14, bb - hh, 28, hh);
      text(ctx, n, bx[i], bb + 10, { color: col.ink, size: 11, weight: 700, align: 'center' });
      text(ctx, e > maxE ? `${e.toFixed(0)} J ↑` : `${e.toFixed(0)} J`, bx[i], bb - hh - 8, { color: col.ink, size: 10.5, align: 'center' });
    });
    line(ctx, [[w * 0.55, bb], [w - 8, bb]], col.line, 1);
    text(ctx, 'speed is squared; height is not', 12, h - 12, { color: col.muted, size: 10.5 });
  };
  upd();
}
