// Small drawing helpers for the chemistry figures (chem-*): an atom disc with a label, a bond line (single, double or
// dashed), a 2-line electron-pair arrow, and a spectrum colour for flames and emission lines. Import from a figure.
import { text, arrow } from '../kit.js';

/** An atom: filled disc with a centred label. */
export function atom(ctx, x, y, r, fill, label, col, ink) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
  ctx.lineWidth = 1.2; ctx.strokeStyle = col.muted; ctx.stroke();
  if (label) text(ctx, label, x, y, { color: ink || col.bg, size: Math.max(9, Math.min(15, r * 0.95)), weight: 700, align: 'center', fit: false });
}

/** A bond between two points: order 1, 2 or 3; dash for a partial (forming or breaking) bond. */
export function bond(ctx, x0, y0, x1, y1, color, order = 1, dash = false, w = 2) {
  const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a), ny = Math.cos(a), gap = 3.2;
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round';
  if (dash) ctx.setLineDash([4, 4]);
  for (let i = 0; i < order; i++) {
    const o = (i - (order - 1) / 2) * gap;
    ctx.beginPath(); ctx.moveTo(x0 + nx * o, y0 + ny * o); ctx.lineTo(x1 + nx * o, y1 + ny * o); ctx.stroke();
  }
  ctx.restore();
}

/** A curved electron-pair arrow from (x0,y0) to (x1,y1), bulging by `bend` pixels. */
export function curved(ctx, x0, y0, x1, y1, color, bend = 18) {
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, a = Math.atan2(y1 - y0, x1 - x0);
  const cx = mx - Math.sin(a) * bend, cy = my + Math.cos(a) * bend;
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(cx, cy, x1, y1); ctx.stroke(); ctx.restore();
  const t = 0.92, bx = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1, by = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1;
  arrow(ctx, bx, by, x1, y1, color, 2, 8);
}

/** Spectrum colour for a wavelength in nm (visible light 380 to 750), as a CSS colour. */
export function nm(w) {
  let r = 0, g = 0, b = 0;
  if (w < 440) { r = (440 - w) / 60; b = 1; } else if (w < 490) { g = (w - 440) / 50; b = 1; } else if (w < 510) { g = 1; b = (510 - w) / 20; }
  else if (w < 580) { r = (w - 510) / 70; g = 1; } else if (w < 645) { r = 1; g = (645 - w) / 65; } else r = 1;
  const f = w < 420 ? 0.4 + 0.6 * (w - 380) / 40 : w > 700 ? 0.4 + 0.6 * (750 - w) / 50 : 1;
  return `rgb(${Math.round(255 * r * f)},${Math.round(255 * g * f)},${Math.round(255 * b * f)})`;
}

/** Draw a small structural formula: atoms [{x,y,l}] in unit coordinates, bonds [{a,b,o,dash}] (indexes). Labels get a gap in the bond. */
export function mol(ctx, atoms, bonds, col, u, ox, oy, { ink, size = 13 } = {}) {
  const px = (a) => [ox + a.x * u, oy + a.y * u];
  bonds.forEach((b) => {
    const A = atoms[b.a], B = atoms[b.b], [x0, y0] = px(A), [x1, y1] = px(B), L = Math.hypot(x1 - x0, y1 - y0) || 1, ux = (x1 - x0) / L, uy = (y1 - y0) / L;
    const ga = A.l ? Math.min(L * 0.4, size * 0.9) : 0, gb = B.l ? Math.min(L * 0.4, size * 0.9) : 0;
    bond(ctx, x0 + ux * ga, y0 + uy * ga, x1 - ux * gb, y1 - uy * gb, b.c || ink || col.ink, b.o || 1, !!b.dash, b.w || 2.2);
  });
  atoms.forEach((a) => { if (a.l) { const [x, y] = px(a); text(ctx, a.l, x, y, { color: a.c || ink || col.ink, size, weight: 700, align: 'center', fit: false, halo: col.panel }); } });
}
