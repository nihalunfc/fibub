// 8.3 The Bullet Cluster (1E 0657-558) as a step player. Two clusters, each made of galaxies, hot gas and (if it
// exists) dark matter, pass through each other. Galaxies are far apart and sail through. The hot gas clouds hit
// each other, are slowed and heated, and are left behind in the middle (the smaller one swept into a bullet shape
// with a shock in front). The mass seen by lensing (blue contours) went on with the galaxies, away from the gas,
// although the gas holds most of the ordinary matter. Last step: where lensing would point if there were no dark
// matter (on the gas), which is not what is seen. Positions are a sketch, not a simulation.
import { canvas, text, title, dot, rng, lerp, ease, calm } from '../../kit.js';

// keyframes for [main cluster mass, bullet mass, main gas, bullet gas] x positions (−1 … 1 across the frame)
const KEYS = [
  [0.55, -0.75, 0.55, -0.75], // far apart
  [0.32, -0.32, 0.32, -0.32], // closing in
  [0.08, -0.02, 0.06, 0.02], // passing through: the gas clouds collide
  [-0.48, 0.58, -0.16, 0.24], // today, about 150 million years later
  [-0.48, 0.58, -0.16, 0.24], // the same, with the no-dark-matter prediction
];
const TITLES = ['Two clusters on a collision course', 'Closing in at thousands of km/s', 'Collision: the gas clouds crash and slow', 'Today: the mass is not where the gas is', 'Without dark matter, lensing would follow the gas'];

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 270, label: 'Two galaxy clusters colliding: galaxies and lensing mass pass through, hot gas is left behind in the middle' });
  let step = 0, from = KEYS[0], pos = KEYS[0], raf = 0;
  const r = rng(11), galsM = [], galsB = [];
  for (let i = 0; i < 26; i++) galsM.push([(r() + r() - 1) * 0.16, (r() + r() - 1) * 0.3]);
  for (let i = 0; i < 12; i++) galsB.push([(r() + r() - 1) * 0.09, (r() + r() - 1) * 0.17]);
  const go = (i) => {
    cancelAnimationFrame(raf);
    from = pos; const to = KEYS[i], t0 = performance.now(), dur = calm() ? 0 : 1400;
    const tick = (now) => {
      const k = dur ? Math.min(1, (now - t0) / dur) : 1, e = ease(k);
      pos = from.map((v, j) => lerp(v, to[j], e)); cv.redraw();
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };
  const contours = (ctx, x, y, rx, ry, color, dash) => {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 1.8; if (dash) ctx.setLineDash(dash);
    for (const f of [1, 0.66, 0.36]) { ctx.beginPath(); ctx.ellipse(x, y, rx * f, ry * f, 0, 0, Math.PI * 2); ctx.stroke(); }
    ctx.restore();
  };
  const gas = (ctx, x, y, rx, ry, a) => {
    ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, `rgba(232,123,164,${a})`); g.addColorStop(0.6, `rgba(232,123,164,${a * 0.5})`); g.addColorStop(1, 'rgba(232,123,164,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rx, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  };
  cv.draw = (ctx, w, h, col) => {
    const cy = h * 0.5, S = w * 0.42, X = (v) => w / 2 + v * S, U = Math.min(w, h * 1.4);
    const [mM, mB, gM, gB] = pos;
    const merged = step >= 2;
    // hot gas (X-rays): the smaller cloud becomes a bullet with a bow shock in front once it has hit
    gas(ctx, X(gM), cy, U * 0.2, U * 0.17, 0.55);
    gas(ctx, X(gB), cy, U * (merged ? 0.1 : 0.11), U * (merged ? 0.12 : 0.1), 0.7);
    if (step >= 3) {
      ctx.save(); ctx.strokeStyle = col.s[4]; ctx.lineWidth = 2; ctx.beginPath();
      ctx.arc(X(gB) - U * 0.05, cy, U * 0.15, -0.95, 0.95); ctx.stroke(); ctx.restore();
      text(ctx, 'shock front', X(gB) + U * 0.1, cy - U * 0.17, { color: col.s[4], size: 10.5, weight: 600, align: 'center', halo: col.panel });
    }
    // galaxies ride with the dark matter
    for (const [x, y] of galsM) dot(ctx, X(mM) + x * S, cy + y * U * 0.6, 2.3, col.muted);
    for (const [x, y] of galsB) dot(ctx, X(mB) + x * S, cy + y * U * 0.6, 2.3, col.muted);
    // mass from lensing
    contours(ctx, X(mM), cy, U * 0.17, U * 0.2, col.s[0]);
    contours(ctx, X(mB), cy, U * 0.1, U * 0.12, col.s[0]);
    if (step === 4) {
      contours(ctx, X(gM), cy, U * 0.14, U * 0.13, col.s[7], [5, 4]);
      contours(ctx, X(gB), cy, U * 0.08, U * 0.09, col.s[7], [5, 4]);
    }
    if (step <= 1) {
      text(ctx, '→', X(mB) + U * 0.15, cy, { color: col.ink, size: 18, weight: 700, align: 'center' });
      text(ctx, '←', X(mM) - U * 0.21, cy, { color: col.ink, size: 18, weight: 700, align: 'center' });
    }
    if (step >= 3) {
      const yb = cy + U * 0.27;
      ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(X(gB), yb); ctx.lineTo(X(mB), yb);
      ctx.moveTo(X(gB), yb - 4); ctx.lineTo(X(gB), yb + 4); ctx.moveTo(X(mB), yb - 4); ctx.lineTo(X(mB), yb + 4); ctx.stroke(); ctx.restore();
      text(ctx, 'offset', (X(gB) + X(mB)) / 2, yb + 11, { color: col.ink, size: 10.5, weight: 600, align: 'center', halo: col.panel });
    }
    const ly = h - 12;
    text(ctx, '◯ mass (lensing)', 10, ly - 30, { color: col.s[0], size: 11, weight: 700, halo: col.panel });
    text(ctx, '● hot gas (X-rays)', 10, ly - 15, { color: col.s[4], size: 11, weight: 700, halo: col.panel });
    text(ctx, '· galaxies', 10, ly, { color: col.muted, size: 11, weight: 700, halo: col.panel });
    if (step === 4) text(ctx, '◌ no-dark-matter prediction', w - 10, ly, { color: col.s[7], size: 11, weight: 700, align: 'right', halo: col.panel });
    title(ctx, TITLES[step], col);
  };
  cv.redraw();
  return { step(i) { step = i; go(i); } };
}
