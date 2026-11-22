// Class 10 Colourful World: refraction through a glass prism and dispersion of white light. Each colour has a slightly
// different refractive index (violet the largest, red the smallest, so violet is slower and bends the most). The ray
// is traced with Snell's law at both faces (vector form), so the order of the spectrum, VIBGYOR from the base side
// to the apex side, comes out of the physics. The real spread is small; the slider makes it bigger so it is easy to see.
import { canvas, text, title, line, dot, row, slider, choice, readout, loop } from '../../kit.js';

const COL = [['Violet', '#8a2be2', 1.532], ['Indigo', '#4b3fd6', 1.528], ['Blue', '#2a6df4', 1.523], ['Green', '#2bb24c', 1.519], ['Yellow', '#e9c70a', 1.517], ['Orange', '#ff8c00', 1.515], ['Red', '#e5241d', 1.513]];
const dot2 = (a, b) => a[0] * b[0] + a[1] * b[1], add = (a, b, k = 1) => [a[0] + k * b[0], a[1] + k * b[1]], norm = (a) => { const l = Math.hypot(a[0], a[1]); return [a[0] / l, a[1] / l]; };
function refract(d, N, n1, n2) { // N points back towards the incident side
  const r = n1 / n2, ci = -dot2(d, N), k = 1 - r * r * (1 - ci * ci);
  if (k < 0) return null;
  return add([d[0] * r, d[1] * r], N, r * ci - Math.sqrt(k));
}
export default function (host) {
  let ang = 50, mode = 'white', amp = 6, t = 0;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 290, label: 'White light entering a glass prism and spreading into the colours of the rainbow' });
  const ctl = row(host);
  choice(ctl, 'Light', [['white', 'White'], ['red', 'Red only'], ['violet', 'Violet only']], mode, (v) => { mode = v; update(); });
  slider(ctl, { label: 'Angle of incidence', min: 30, max: 75, step: 1, value: ang, fmt: (v) => `${v}°`, oninput: (v) => { ang = v; update(); } });
  slider(ctl, { label: 'Spread of colours (exaggerated)', min: 1, max: 10, step: 1, value: amp, fmt: (v) => `×${v}`, oninput: (v) => { amp = v; update(); } });
  const out = readout(host);
  loop(host, (dt) => { t += dt; cv.redraw(); });
  function trace(n, w, h) {
    const side = Math.min(w * 0.4, h * 0.62), hh = side * 0.866, cx = w * 0.42, ty = h * 0.2, A = [cx, ty], B = [cx - side / 2, ty + hh], C = [cx + side / 2, ty + hh];
    const n1v = norm([-hh, -side / 2]), n2v = norm([hh, -side / 2]), tdn = norm([B[0] - A[0], B[1] - A[1]]);
    const M1 = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], i = ang * Math.PI / 180;
    const dir = [-(Math.cos(i) * n1v[0] + Math.sin(i) * tdn[0]), -(Math.cos(i) * n1v[1] + Math.sin(i) * tdn[1])];
    const S = add(M1, dir, -w * 0.38);
    const d1 = refract(dir, n1v, 1, n); if (!d1) return null;
    const M2 = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2], s = dot2([M2[0] - M1[0], M2[1] - M1[1]], n2v) / dot2(d1, n2v), P2 = add(M1, d1, s);
    const d2 = refract(d1, [-n2v[0], -n2v[1]], n, 1);
    if (!d2) return { A, B, C, S, M1, P2, d2: null, dir };
    const X = w - 26, E = add(P2, d2, (X - P2[0]) / d2[0]), dev = Math.atan2(dir[0] * d2[1] - dir[1] * d2[0], dot2(dir, d2)) * 180 / Math.PI;
    return { A, B, C, S, M1, P2, E, d2, dir, dev };
  }
  const nOf = (n0) => 1.517 + (n0 - 1.517) * amp;
  function update() {
    const set = mode === 'white' ? COL : COL.filter((c) => c[0] === (mode === 'red' ? 'Red' : 'Violet'));
    const tr = set.map((c) => trace(nOf(c[2]), 400, 290)).map((x) => x && x.dev);
    out.innerHTML = mode === 'white' ? 'White light is a <b>mixture</b> of colours. The prism bends violet the most and red the least, so the colours fan out in the order <b>VIBGYOR</b> (violet at the base side, red nearest the apex). This splitting is <b>dispersion</b>.'
      : `${mode === 'red' ? 'Red' : 'Violet'} light alone is not split. It is deviated by about <b>${tr[0] ? tr[0].toFixed(1) : '—'}°</b> (${mode === 'red' ? 'the smallest' : 'the largest'} deviation of all the colours).`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Dispersion of white light by a prism', col);
    const set = mode === 'white' ? COL : COL.filter((c) => c[0] === (mode === 'red' ? 'Red' : 'Violet')), base = trace(1.517, w, h);
    if (!base) return;
    const { A, B, C } = base;
    ctx.save(); ctx.fillStyle = col.soft; ctx.globalAlpha = 0.6; ctx.beginPath(); ctx.moveTo(...A); ctx.lineTo(...B); ctx.lineTo(...C); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke(); ctx.restore();
    text(ctx, 'glass prism', (B[0] + C[0]) / 2, B[1] - 8, { color: col.muted, size: 10.5, align: 'center' });
    line(ctx, [[w - 26, 40], [w - 26, h - 34]], col.ink, 3); text(ctx, 'screen', w - 26, 34, { color: col.muted, size: 10.5, align: 'center' });
    const white = mode === 'white';
    line(ctx, [base.S, base.M1], white ? col.ink : set[0][1], 2.6);
    const ys = [];
    set.forEach(([name, c, n0], k) => {
      const tr = trace(nOf(n0), w, h); if (!tr) return;
      line(ctx, [tr.M1, tr.P2], c, 2); if (tr.E) { line(ctx, [tr.P2, tr.E], c, 2.4); dot(ctx, tr.E[0], tr.E[1], 5, c); ys.push([name, c, tr.E[1], tr.dev]); }
      const pts = [tr.S || base.S, tr.M1, tr.P2].concat(tr.E ? [tr.E] : []), seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])), tot = seg.reduce((a, b) => a + b, 0); let d = ((t * 0.3 + k * 0.03) % 1) * tot;
      for (let i = 0; i < seg.length; i++) { if (d <= seg[i]) { const f = d / seg[i]; dot(ctx, pts[i][0] + f * (pts[i + 1][0] - pts[i][0]), pts[i][1] + f * (pts[i + 1][1] - pts[i][1]), 3, '#ffffff', c); break; } d -= seg[i]; }
    });
    // colour labels beside the screen (only when they do not collide)
    let last = -99; ys.sort((a, b) => a[2] - b[2]).forEach(([name, c, y]) => { const yy = Math.max(y, last + 12); last = yy; text(ctx, name, w - 36, yy, { color: c, size: 10.5, weight: 700, align: 'right', halo: col.panel }); });
    // base / apex hints
    text(ctx, 'base', B[0] - 6, B[1] + 14, { color: col.muted, size: 10.5, align: 'right' }); text(ctx, 'apex', A[0] + 6, A[1] - 6, { color: col.muted, size: 10.5 });
    text(ctx, 'the angle between the incident ray and the emergent ray is the angle of deviation', 8, h - 8, { color: col.muted, size: 9.5 });
    const dev = base.dev; if (dev !== undefined) text(ctx, `deviation ≈ ${dev.toFixed(0)}° (mean)`, 8, h - 24, { color: col.ink, size: 11, weight: 700 });
  };
  update();
}
