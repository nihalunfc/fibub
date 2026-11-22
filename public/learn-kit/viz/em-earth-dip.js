// The Earth as a bar magnet. Slide the latitude λ and watch a dip needle: at the equator the field is horizontal, at the
// magnetic poles vertical, and in between tan δ = 2 tan λ (δ = angle of dip). The field lines are those of a dipole at the
// centre, r = L cos²λ. The readout gives the horizontal and vertical components, B_H = B₀cosλ and B_V = 2B₀sinλ.
import { canvas, text, row, slider, readout, arrow, line, dot } from '../kit.js';

export default function (host) {
  let lat = 40;
  const cv = canvas(host, { aspect: 0.85, max: 360, min: 270, label: 'Earth as a magnetic dipole with a dip needle at a chosen latitude' });
  const ctl = row(host);
  slider(ctl, { label: 'Magnetic latitude λ', min: -90, max: 90, value: lat, step: 1, fmt: (x) => `${Math.abs(x)}° ${x >= 0 ? 'N' : 'S'}`, oninput: (x) => { lat = x; upd(); } });
  const out = readout(host);
  const B0 = 3.0e-5;
  function upd() { const l = lat * Math.PI / 180, bh = B0 * Math.cos(l), bv = 2 * B0 * Math.sin(l), d = Math.atan2(bv, bh) * 180 / Math.PI;
    out.innerHTML = `B<sub>H</sub> = B₀cosλ = <b>${(bh * 1e6).toFixed(1)} µT</b>, B<sub>V</sub> = 2B₀sinλ = <b>${(bv * 1e6).toFixed(1)} µT</b> (down if positive), total ${(Math.hypot(bh, bv) * 1e6).toFixed(1)} µT. Dip δ = <b>${d.toFixed(1)}°</b> (tan δ = 2 tan λ = ${Math.abs(lat) === 90 ? '∞' : (2 * Math.tan(l)).toFixed(2)}). B₀ = 30 µT is the equatorial value. Over Kerala (about 10° N) δ is small, and a dip circle reads close to horizontal.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const cx = w / 2, cy = h / 2 + 4, R = Math.min(w, h) * 0.17;
    [1.6, 2.4, 3.6].forEach((L) => { const pts = []; for (let k = -88; k <= 88; k += 2) { const a = k * Math.PI / 180, r = L * Math.cos(a) ** 2; pts.push([cx + r * R * Math.cos(a), cy - r * R * Math.sin(a)]); } line(ctx, pts, col.s[0], 1.2); const pts2 = pts.map(([x, y]) => [2 * cx - x, y]); line(ctx, pts2, col.s[0], 1.2);
      // arrows at the equator and a few other points: direction = toward increasing latitude
      [-50, 0, 50].forEach((k) => { const a = k * Math.PI / 180, a2 = (k + 3) * Math.PI / 180, r1 = L * Math.cos(a) ** 2, r2 = L * Math.cos(a2) ** 2; arrow(ctx, cx + r1 * R * Math.cos(a), cy - r1 * R * Math.sin(a), cx + r2 * R * Math.cos(a2), cy - r2 * R * Math.sin(a2), col.s[0], 1.4, 6); arrow(ctx, cx - r1 * R * Math.cos(a), cy - r1 * R * Math.sin(a), cx - r2 * R * Math.cos(a2), cy - r2 * R * Math.sin(a2), col.s[0], 1.4, 6); }); });
    ctx.fillStyle = col.soft; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill(); ctx.stroke();
    text(ctx, 'N', cx, cy - R - 8, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, 'S', cx, cy + R + 10, { color: col.ink, size: 11, weight: 700, align: 'center' });
    const l = lat * Math.PI / 180, px = cx + R * Math.cos(l), py = cy - R * Math.sin(l), bh = Math.cos(l), bv = 2 * Math.sin(l), rx = Math.cos(l), ry = Math.sin(l);
    // field in the picture: B = BH * north_unit + Br * radial, Br = -BV
    const nx = -Math.sin(l), ny = Math.cos(l), fx = bh * nx - bv * rx, fy = bh * ny - bv * ry, m = Math.hypot(fx, fy) || 1, Ls = 34;
    arrow(ctx, px - fx / m * Ls / 2, py + fy / m * Ls / 2, px + fx / m * Ls / 2, py - fy / m * Ls / 2, col.s[5], 3.2, 10);
    dot(ctx, px, py, 4.5, col.ink, col.panel);
    line(ctx, [[px - nx * 26, py + ny * 26], [px + nx * 26, py - ny * 26]], col.muted, 1.2, [3, 3]);
    text(ctx, `dip δ = ${(Math.atan2(2 * Math.sin(l), Math.cos(l)) * 180 / Math.PI).toFixed(0)}°`, w - 10, h - 12, { color: col.s[5], size: 12, weight: 700, align: 'right' });
    text(ctx, 'Orange needle = dip needle; dashed = local horizontal', 10, h - 12, { color: col.muted, size: 10.5 });
  };
  upd();
}
