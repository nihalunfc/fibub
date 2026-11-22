// Inside a raindrop, step by step (use it as a step player or press the controls). Sunlight meets a spherical drop at impact
// height b (a fraction of the radius). It refracts in, reflects once off the back, refracts out. The total turning D = 180° +
// 2i − 4r depends on b, and it has a minimum (about 138° for red): rays near that b all leave in nearly the same direction,
// so that direction is bright. That is the rainbow, 42° from the line pointing away from the sun. Violet bends more (n is
// bigger), so its bright direction is at a slightly different angle: colours.
import { canvas, axes, line, text, row, slider, readout, arrow, dot } from '../kit.js';

const N = { red: 1.331, orange: 1.3325, yellow: 1.334, green: 1.336, cyan: 1.338, blue: 1.34, violet: 1.343 };
const CI = { red: 5, orange: 1, yellow: 6, green: 2, cyan: 4, blue: 0, violet: 3 };
const refr = (d, Nv, a, b) => { const c = -(d[0] * Nv[0] + d[1] * Nv[1]), r = a / b, q = 1 - r * r * (1 - c * c); if (q < 0) return null; const f = r * c - Math.sqrt(q); return [r * d[0] + f * Nv[0], r * d[1] + f * Nv[1]]; };
function trace(b, n) { // y up; drop radius 1, light travels to +x at height b; returns points and deviation D in degrees
  const A = [-Math.sqrt(1 - b * b), b], d1 = refr([1, 0], A, 1, n), t1 = -2 * (A[0] * d1[0] + A[1] * d1[1]), B = [A[0] + d1[0] * t1, A[1] + d1[1] * t1];
  const dot2 = d1[0] * B[0] + d1[1] * B[1], d2 = [d1[0] - 2 * dot2 * B[0], d1[1] - 2 * dot2 * B[1]], t2 = -2 * (B[0] * d2[0] + B[1] * d2[1]), C = [B[0] + d2[0] * t2, B[1] + d2[1] * t2];
  const d3 = refr(d2, [-C[0], -C[1]], n, 1); const D = Math.atan2(-(d3[1] * 1), d3[0]); // angle of the exit ray measured from +x (down is negative y)
  const turn = Math.acos(Math.max(-1, Math.min(1, d3[0]))) * 180 / Math.PI; // deviation angle from original direction
  return { A, B, C, d3, D: turn };
}
const bmin = (n) => { let bb = 0.5, best = 999; for (let b = 0.5; b < 0.99; b += 0.001) { const D = trace(b, n).D; const dev = D; if (dev < best) { best = dev; bb = b; } } return [bb, best]; };
export default function (host) {
  let b = 0.86, stage = 4, all = false;
  const cv = canvas(host, { aspect: 1.3, max: 500, min: 420, label: 'A light ray inside a spherical raindrop, with the deviation graph that explains the rainbow' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Impact height b (fraction of radius)', min: 0.3, max: 0.98, value: b, step: 0.01, fmt: (x) => x.toFixed(2), oninput: (x) => { b = x; upd(); } });
  const out = readout(host);
  function upd() { const tr = trace(b, N.green), i = Math.asin(b) * 180 / Math.PI, r = Math.asin(b / N.green) * 180 / Math.PI, [bm, Dm] = bmin(N.green);
    out.innerHTML = `b = ${b.toFixed(2)}: i = ${i.toFixed(1)}°, r = ${r.toFixed(1)}°, deviation D = 180° + 2i − 4r = <b>${tr.D.toFixed(1)}°</b> (green light, n = ${N.green}). Smallest possible D = <b>${Dm.toFixed(1)}°</b> at b ≈ ${bm.toFixed(2)}, which is a viewing angle of ${(180 - Dm).toFixed(1)}° from the antisolar point. Red: ${(180 - bmin(N.red)[1]).toFixed(1)}°, violet: ${(180 - bmin(N.violet)[1]).toFixed(1)}°.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const cx = w * 0.5, cy = 108, R = Math.min(w * 0.26, 78), P = ([x, y]) => [cx + x * R, cy - y * R];
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.globalAlpha = 0.15; ctx.fillStyle = col.s[4]; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke();
    const show = (ptsArr, c, wd, a = 1) => { ctx.globalAlpha = a; line(ctx, ptsArr.map(P), c, wd); ctx.globalAlpha = 1; };
    if (stage >= 0) { for (let k = -3; k <= 3; k++) { const yy = k * 0.3; if (Math.abs(yy - b) < 0.12 && Math.abs(yy) > 0.5) continue; line(ctx, [P([-2.4, yy]), P([-Math.sqrt(Math.max(0, 1 - yy * yy)) - (Math.abs(yy) > 1 ? 1.4 : 0), yy])].slice(0, Math.abs(yy) > 1 ? 0 : 2), col.muted, 1); } show([[-2.6, b], trace(b, N.green).A], col.s[6], 2.6); text(ctx, 'sunlight', 8, P([0, b])[1] - 8, { color: col.s[6], size: 11, weight: 700, halo: col.panel }); }
    const T = trace(b, N.green);
    if (stage >= 1) show([T.A, T.B], col.s[2], 2.6); if (stage >= 2) show([T.B, T.C], col.s[2], 2.6);
    if (stage >= 3 && !all) show([T.C, [T.C[0] + T.d3[0] * 2.2, T.C[1] + T.d3[1] * 2.2]], col.s[2], 2.6);
    if (stage === 1) text(ctx, `refraction in: i = ${(Math.asin(b) * 180 / Math.PI).toFixed(0)}°, r = ${(Math.asin(b / N.green) * 180 / Math.PI).toFixed(0)}°`, 10, h - 205, { color: col.ink, size: 11 });
    if (stage >= 3) { text(ctx, `D = ${T.D.toFixed(1)}°`, w - 10, 16 + 18, { color: col.s[2], size: 12, weight: 700, align: 'right' }); }
    if (stage >= 4) { for (const [nm, n] of Object.entries(N)) { const [bm] = bmin(n), t = trace(bm, n); ctx.globalAlpha = 0.9; line(ctx, [P(t.C), P([t.C[0] + t.d3[0] * 2.4, t.C[1] + t.d3[1] * 2.4])], col.s[CI[nm]], 1.8); ctx.globalAlpha = 1; } text(ctx, 'each colour at its own minimum deviation', 10, 16, { color: col.ink, size: 11, weight: 700 }); }
    else text(ctx, ['1. Sunlight arrives', '2. Refraction into the drop', '3. Reflection at the back', '4. Refraction out: deviation D', '5. The bright direction: why a bow'][stage] || '', 10, 16, { color: col.ink, size: 11.5, weight: 700 });
    // D vs b curve
    if (stage >= 3) { const G = axes(ctx, w, h, col, { x: [0.3, 1], y: [135, 190], xlabel: 'impact height b', ylabel: 'D (degrees)', l: 44, t: 238, b: 34, xt: [0.4, 0.6, 0.8, 1], yt: [140, 160, 180] }); const f = (nn) => Array.from({ length: 71 }, (_, i) => { const bb = 0.3 + i * 0.01; return [G.X(bb), G.Y(Math.min(190, trace(Math.min(bb, 0.995), nn).D))]; });
      G.clip && (ctx.save(), G.clip()); if (stage >= 4) { line(ctx, f(N.red), col.s[5], 1.8); line(ctx, f(N.violet), col.s[3], 1.8); } line(ctx, f(N.green), col.s[2], 2.4); ctx.restore(); dot(ctx, G.X(b), G.Y(Math.min(190, T.D)), 5, col.s[1], col.panel); const [bm, Dm] = bmin(N.green); text(ctx, 'minimum', G.X(bm), G.Y(Dm) + 14, { color: col.muted, size: 10, align: 'center' }); }
  };
  upd();
  return { step(i, n) { stage = Math.max(0, Math.min(4, Math.round(i * 4 / Math.max(1, n - 1)))); cv.redraw(); } };
}
