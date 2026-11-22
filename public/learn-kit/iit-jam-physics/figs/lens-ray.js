// 3.6 Thin-lens ray tracer. One lens or two lenses on an axis. Sliders: object distance, focal lengths (negative =
// diverging) and lens separation. Three rays from the top of the object are traced exactly with the thin-lens rule
// (each lens changes a ray's slope by -height/f); the image of each stage is found with 1/v - 1/u = 1/f (Cartesian).
import { canvas, line, dot, text, title, row, slider, choice, readout, fmt, arrow } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.55, max: 380, min: 250, label: 'Ray diagram for one or two thin lenses' });
  let n = 1, u = 30, f1 = 20, f2 = 15, d = 50;
  const ctl = row(host);
  choice(ctl, 'Lenses', [[1, 'One lens'], [2, 'Two lenses']], 1, (v) => { n = v; cv.redraw(); show(); });
  slider(ctl, { label: 'Object distance (cm)', min: 5, max: 80, step: 1, value: u, fmt: (v) => fmt(v, 3), oninput: (v) => { u = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'f₁ (cm, − = diverging)', min: -40, max: 40, step: 1, value: f1, fmt: (v) => fmt(v, 3), oninput: (v) => { f1 = v === 0 ? 1 : v; cv.redraw(); show(); } });
  slider(ctl, { label: 'f₂ (cm)', min: -40, max: 40, step: 1, value: f2, fmt: (v) => fmt(v, 3), oninput: (v) => { f2 = v === 0 ? 1 : v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Separation d (cm)', min: 5, max: 100, step: 1, value: d, fmt: (v) => fmt(v, 3), oninput: (v) => { d = v; cv.redraw(); show(); } });
  const out = readout(host);
  const image = (uu, f) => { const inv = 1 / f + 1 / uu; return Math.abs(inv) < 1e-9 ? Infinity : 1 / inv; }; // uu Cartesian (negative = real object)
  const solve = () => {
    const v1 = image(-u, f1), m1 = Number.isFinite(v1) ? v1 / -u : Infinity;
    if (n === 1) return { v: v1, m: m1, xImg: v1 };
    if (!Number.isFinite(v1)) return { v: f2, m: Infinity, xImg: d + f2, mid: v1 };
    const u2 = v1 - d, v2 = image(u2, f2), m = m1 * (Number.isFinite(v2) ? v2 / u2 : Infinity);
    return { v: v2, m, xImg: d + v2, mid: v1 };
  };
  const show = () => {
    const s = solve();
    const where = (v) => !Number.isFinite(v) ? 'at infinity (parallel rays)' : v > 0 ? `${fmt(v, 3)} cm after the last lens (real)` : `${fmt(-v, 3)} cm before the last lens (virtual)`;
    out.innerHTML = `Image ${where(s.v)}. Magnification ${Number.isFinite(s.m) ? `<b>${fmt(s.m, 3)}</b> (${s.m < 0 ? 'inverted' : 'upright'})` : '—'}.` + (n === 2 ? ` Equivalent focal length f₁f₂/(f₁ + f₂ − d) = ${Math.abs(f1 + f2 - d) < 1e-9 ? '∞ (afocal: a telescope)' : fmt(f1 * f2 / (f1 + f2 - d), 3) + ' cm'}.` : '');
  };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, n === 1 ? 'Thin lens: 1/v − 1/u = 1/f' : 'Two thin lenses', col);
    const xmin = -u - 10, xmax = (n === 2 ? d : 0) + 90, cy = h / 2 + 14, sx = (w - 20) / (xmax - xmin);
    const X = (x) => 10 + (x - xmin) * sx, Y = (y) => cy - y * sx * 1.6, hObj = Math.min(8, (h / 2 - 30) / (sx * 1.6) * 0.5);
    line(ctx, [[0, cy], [w, cy]], col.muted, 1);
    const lenses = n === 1 ? [[0, f1]] : [[0, f1], [d, f2]];
    for (const [i, [x, f]] of lenses.entries()) {
      const top = cy - h * 0.36, bot = cy + h * 0.36;
      line(ctx, [[X(x), top], [X(x), bot]], col.s[1], 2.5);
      text(ctx, `f${i ? '₂' : '₁'} = ${fmt(f, 3)}`, X(x), bot + 10, { color: col.s[1], size: 11, align: 'center' });
      for (const s of [-1, 1]) { const fx = X(x + s * f); if (fx > 0 && fx < w) dot(ctx, fx, cy, 3, col.s[1]); }
    }
    arrow(ctx, X(-u), cy, X(-u), Y(hObj), col.ink, 2.5);
    // trace rays: [height, slope] starting at the object tip
    // three rays from the object tip: parallel to the axis, through the centre of lens 1, and through (or towards) its
    // front focal point, which leaves lens 1 parallel to the axis
    const slopes = [0, -hObj / u, Math.abs(u - f1) > 0.5 ? -hObj / (u - f1) : -hObj / (2 * u)];
    const colours = [col.s[0], col.s[2], col.s[4]];
    const sl = solve();
    slopes.forEach((s0, i) => {
      let x = -u, y = hObj, s = s0; const pts = [[X(x), Y(y)]];
      for (const [lx, f] of lenses) { y += s * (lx - x); x = lx; pts.push([X(x), Y(y)]); s -= y / f; }
      const xe = xmax; pts.push([X(xe), Y(y + s * (xe - x))]);
      line(ctx, pts, colours[i], 1.5);
      if (sl.v < 0) { const back = x - 200; line(ctx, [[X(x), Y(y)], [X(back), Y(y + s * (back - x))]], colours[i], 0.8, [3, 4]); }
    });
    if (Number.isFinite(sl.v) && Number.isFinite(sl.m)) {
      const xi = sl.xImg, hi = hObj * sl.m;
      if (X(xi) > 0 && X(xi) < w) arrow(ctx, X(xi), cy, X(xi), Y(hi), sl.v > 0 ? col.s[3] : col.muted, 2.5);
    }
  };
  cv.redraw(); show();
}
