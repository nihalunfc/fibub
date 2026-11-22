// Helper for the em- figures: electric field lines and equipotential contours of point charges drawn on a canvas.
// charges: [{x, y, q}] in pixels; sc = pixels per unit (V = Σ q/(r/sc)).
export function fieldAt(Q, sc, px, py) {
  let ex = 0, ey = 0, v = 0;
  for (const c of Q) { const dx = (px - c.x) / sc, dy = (py - c.y) / sc, r2 = dx * dx + dy * dy + 1e-4, r = Math.sqrt(r2); ex += c.q * dx / (r2 * r); ey += c.q * dy / (r2 * r); v += c.q / r; }
  return [ex, ey, v];
}
/** Field lines from every + charge (or - if none), stopping on the other sign, at the edges or inside the clip box. */
export function lines(ctx, Q, sc, w, h, color, { per = 6, width = 1.3, clip = null } = {}) {
  const pos = Q.filter((c) => c.q > 0), src = pos.length ? pos : Q, sgn = pos.length ? 1 : -1;
  ctx.strokeStyle = color; ctx.lineWidth = width;
  for (const c of src) {
    const n = Math.round(Math.abs(c.q) * per);
    for (let k = 0; k < n; k++) {
      const a = (k + 0.5) / n * Math.PI * 2; let x = c.x + 7 * Math.cos(a), y = c.y + 7 * Math.sin(a); ctx.beginPath(); ctx.moveTo(x, y);
      for (let s = 0; s < 600; s++) {
        const [ex, ey] = fieldAt(Q, sc, x, y), m = Math.hypot(ex, ey) || 1; x += sgn * ex / m * 3; y += sgn * ey / m * 3;
        if (clip && (y > clip.y1 || y < clip.y0)) { break; }
        ctx.lineTo(x, y);
        if (x < 0 || x > w || y < 0 || y > h || Q.some((o) => o !== c && o.q * c.q < 0 && Math.hypot(o.x - x, o.y - y) < 6)) break;
      }
      ctx.stroke();
    }
  }
}
/** Equipotential lines at the given levels by marching squares over the box. */
export function contours(ctx, Q, sc, w, h, levels, colorFor, { cell = 7, y0 = 0, y1 = h, alpha = 0.6 } = {}) {
  const nx = Math.ceil(w / cell) + 1, ny = Math.ceil((y1 - y0) / cell) + 1, V = [];
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) V.push(fieldAt(Q, sc, i * cell, y0 + j * cell)[2]);
  ctx.lineWidth = 1; ctx.globalAlpha = alpha;
  for (const L of levels) {
    ctx.strokeStyle = colorFor(L); ctx.beginPath();
    for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
      const a = V[j * nx + i] - L, b = V[j * nx + i + 1] - L, c = V[(j + 1) * nx + i + 1] - L, d = V[(j + 1) * nx + i] - L, p = [], X = i * cell, Y = y0 + j * cell;
      if (a * b < 0) p.push([X + cell * a / (a - b), Y]); if (b * c < 0) p.push([X + cell, Y + cell * b / (b - c)]); if (d * c < 0) p.push([X + cell * d / (d - c), Y + cell]); if (a * d < 0) p.push([X, Y + cell * a / (a - d)]);
      if (p.length >= 2) { ctx.moveTo(p[0][0], p[0][1]); ctx.lineTo(p[1][0], p[1][1]); }
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}
