// Class 10 Light: power of a lens. Power P = 1/f with f in metres, in dioptres (D): a short focal length means a
// strong lens. Convex lenses have positive power (they converge parallel rays), concave lenses negative power
// (they spread them). When thin lenses touch, their powers simply add: P = P1 + P2, so the combined focal length
// is f = 100/P cm. Rays here are drawn with the small-angle rule: a ray at height y is turned by y x P.
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let mode = 'one', P1 = 4, P2 = -2;
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 280, label: 'Parallel rays through one lens or two thin lenses in contact, showing power in dioptres and focal length' });
  const ctl = row(host);
  choice(ctl, 'Show', [['one', 'One lens'], ['two', 'Two lenses touching']], mode, (m) => { mode = m; w2.style.display = m === 'two' ? '' : 'none'; update(); });
  slider(ctl, { label: 'Power of lens 1', min: -10, max: 10, step: 0.5, value: P1, fmt: (v) => `${v > 0 ? '+' : ''}${v} D`, oninput: (v) => { P1 = v; update(); } });
  slider(ctl, { label: 'Power of lens 2', min: -10, max: 10, step: 0.5, value: P2, fmt: (v) => `${v > 0 ? '+' : ''}${v} D`, oninput: (v) => { P2 = v; update(); } });
  const w2 = ctl.lastElementChild; w2.style.display = 'none';
  const out = readout(host);
  const total = () => (mode === 'one' ? P1 : P1 + P2);
  function update() {
    const P = total(), f = P === 0 ? Infinity : 100 / P;
    out.innerHTML = mode === 'one' ? `P = 1/f = 1/(${Number.isFinite(f) ? (f / 100).toFixed(2) : '∞'} m) = <b>${P > 0 ? '+' : ''}${P} D</b>. ${P > 0 ? 'Convex: converges the rays' : P < 0 ? 'Concave: spreads the rays' : 'Zero power: a plain sheet of glass'}. f = <b>${Number.isFinite(f) ? f.toFixed(1) : '∞'} cm</b>.`
      : `P = P₁ + P₂ = ${P1} + (${P2}) = <b>${P > 0 ? '+' : ''}${P} D</b>, so f = 100/P = <b>${Number.isFinite(f) ? f.toFixed(1) : '∞'} cm</b>. ${P > 0 ? 'The pair acts as a convex lens.' : P < 0 ? 'The pair acts as a concave lens.' : 'The pair cancels: no bending at all.'}`;
    cv.redraw();
  }
  const lensShape = (ctx, x, cy, hh, p, col) => {
    const bulge = Math.max(-9, Math.min(12, p * 1.6)), edge = p >= 0 ? 1.5 : 4 + Math.min(6, -p * 0.8);
    ctx.save(); ctx.strokeStyle = col.ink; ctx.fillStyle = col.soft; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x - edge, cy - hh);
    ctx.quadraticCurveTo(x - edge - bulge * 1.4, cy, x - edge, cy + hh); ctx.lineTo(x + edge, cy + hh); ctx.quadraticCurveTo(x + edge + bulge * 1.4, cy, x + edge, cy - hh); ctx.closePath();
    ctx.globalAlpha = 0.6; ctx.fill(); ctx.globalAlpha = 1; ctx.stroke(); ctx.restore();
  };
  cv.draw = (ctx, w, h, col) => {
    const P = total();
    title(ctx, mode === 'one' ? 'Power of a lens: P = 1/f' : 'Lenses in contact: powers add', col);
    const cy = Math.round(h * 0.5), lx = Math.round(w * 0.3), hh = h * 0.3, k = 1 / 160; // slope per px height per dioptre (f = 100/P cm -> 160 px at 1 D)
    line(ctx, [[6, cy], [w - 6, cy]], col.line, 1);
    for (const y of [-0.8, -0.5, -0.2, 0.2, 0.5, 0.8]) {
      const yy = y * hh, slope = -yy * P * k * 160 / 160; // px of drop per px of travel
      const ye = (x) => yy + slope * (x - lx) / 1;
      line(ctx, [[8, cy + yy], [lx, cy + yy]], col.s[0], 1.6);
      // end at the focus region or edge
      const xEnd = w - 8; line(ctx, [[lx, cy + yy], [xEnd, cy + ye(xEnd)]], col.s[1], 1.6);
    }
    if (mode === 'one') lensShape(ctx, lx, cy, hh, P1, col); else { lensShape(ctx, lx - 7, cy, hh, P1, col); lensShape(ctx, lx + 7, cy, hh, P2, col); }
    if (P !== 0) { const fx = lx + (160 / P); if (P > 0 && fx < w - 8) { dot(ctx, fx, cy, 5, col.s[3], col.panel); text(ctx, `F  (f = ${(100 / P).toFixed(0)} cm)`, fx, cy + 20, { color: col.s[3], size: 11, weight: 700, align: 'center', halo: col.panel }); }
      if (P < 0 && lx + 160 / P > 8) { const fx2 = lx + 160 / P; dot(ctx, fx2, cy, 5, col.s[3], col.panel); text(ctx, `F  (virtual, f = ${(100 / P).toFixed(0)} cm)`, fx2, cy + 20, { color: col.s[3], size: 11, weight: 700, align: 'center', halo: col.panel }); } }
    // power gauge
    const gx = 12, gw = w - 24, gy = h - 26; line(ctx, [[gx, gy], [gx + gw, gy]], col.line, 6);
    const mid = gx + gw / 2, px = mid + (P / 10) * (gw / 2); line(ctx, [[mid, gy], [px, gy]], P >= 0 ? col.s[0] : col.s[1], 6);
    text(ctx, '−10 D', gx, gy - 12, { color: col.muted, size: 10 }); text(ctx, '0', mid, gy - 12, { color: col.muted, size: 10, align: 'center' }); text(ctx, '+10 D', gx + gw, gy - 12, { color: col.muted, size: 10, align: 'right' });
    text(ctx, `P = ${P > 0 ? '+' : ''}${P} D`, Math.min(gx + gw - 30, Math.max(gx + 30, px)), gy + 12, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
  };
  update();
}
