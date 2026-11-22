// A meteor shower is a stream of parallel particles, but perspective makes the trails seem to fly out of one point, the radiant
// (like rain streaming from a point in the sky as you drive). Slide the radiant's height: the top picture shows why the hourly
// rate is ZHR × sin(height) (a low radiant catches fewer particles across the same patch of sky), the bottom one is the all-sky
// view with streaks drawn live. Use the preset showers or set your own ZHR.
import { canvas, text, row, slider, button, readout, loop, rng, title, arrow, dot } from '../kit.js';

const D = Math.PI / 180;
export default function (host) {
  let h = 50, zhr = 100; const R = rng(5), ms = []; let acc = 0;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 330, label: 'Parallel meteoroid rays meeting the sky and an all-sky view of trails radiating from one point' });
  const c1 = row(host), c2 = row(host);
  slider(c1, { label: 'Radiant height', min: 3, max: 90, step: 1, value: h, fmt: (v) => `${Math.round(v)}°`, oninput: (v) => { h = v; ms.length = 0; show(); } });
  slider(c1, { label: 'Zenithal hourly rate (ZHR)', min: 5, max: 200, step: 1, value: zhr, fmt: (v) => Math.round(v), oninput: (v) => { zhr = v; show(); } });
  [['Perseids (ZHR 100)', 100], ['Geminids (150)', 150], ['Quadrantids (120)', 120], ['Lyrids (18)', 18]].forEach(([n, v]) => button(c2, n, () => { zhr = v; show(); }));
  const anim = loop(host, (dt) => {
    acc += dt * Math.max(0.3, zhr * Math.sin(h * D) / 25); while (acc > 1) { acc -= 1; spawn(); }
    for (const m of ms) m.t += dt; while (ms.length && ms[0].t > 0.9) ms.shift(); cv.redraw();
  });
  anim.button(c2);
  const out = readout(host);
  const vec = (alt, az) => [Math.cos(alt) * Math.sin(az), Math.sin(alt), -Math.cos(alt) * Math.cos(az)];
  function spawn() {
    const rad = vec(h * D, 0), a = R() * 2 * Math.PI, ref = [0, 1, 0]; let q = [Math.cos(a), Math.sin(a), 0];
    const dot3 = rad[0] * q[0] + rad[1] * q[1] + rad[2] * q[2]; q = q.map((v, i) => v - dot3 * rad[i]); const l = Math.hypot(...q); q = q.map((v) => v / l);
    ms.push({ rad, q, a1: (10 + 60 * R()) * D, len: (10 + 12 * R()) * D, t: 0 });
  }
  function show() {
    out.innerHTML = `Radiant ${Math.round(h)}° up: hourly rate ≈ ZHR × sin(h) = ${zhr} × ${Math.sin(h * D).toFixed(2)} = <b>${(zhr * Math.sin(h * D)).toFixed(0)} meteors an hour</b> under a perfect sky (ZHR is defined for the radiant at the zenith, limiting magnitude 6.5). Radiants below the horizon give none: that is why you wait until after midnight, when the radiant has climbed and you face the side of Earth moving into the stream.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, hh, col) => {
    title(ctx, 'Parallel particles, one radiant', col);
    // top panel
    const ty = 34, th = hh * 0.34, hy = ty + th - 14, x0 = 24, x1 = w - 24, dx = Math.cos(h * D), dy = Math.sin(h * D);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, hy); ctx.lineTo(x1, hy); ctx.stroke();
    text(ctx, 'a patch of sky (horizontal)', x0, hy + 12, { color: col.muted, size: 10 });
    const sp = 18; let n = 0;
    for (let k = -14; k < 40; k++) { const bx = x0 + k * sp / dy, sx = bx; /* ray hits horizon at x = sx, comes from up-left */ const ex = sx - dx * th * 1.2 / Math.max(dy, 0.05) * 0, len = th * 1.1; const px = sx - dx * len / 1 * 0.9, py = hy - dy * len * 0.9; if (sx < x0 || sx > x1) { ctx.globalAlpha = 0.25; } else { ctx.globalAlpha = 1; n++; } arrow(ctx, px, py, sx, hy, sx < x0 || sx > x1 ? col.muted : col.s[2], 1.3, 5); ctx.globalAlpha = 1; }
    text(ctx, `${n} streams cross the patch`, x1, ty + 4, { color: col.s[2], size: 10.5, align: 'right', weight: 700 });
    // all-sky
    const cx = w / 2, cy = ty + th + 20 + (hh - ty - th - 28) / 2, Rr = Math.min(w * 0.42, (hh - ty - th - 36) / 2);
    ctx.beginPath(); ctx.arc(cx, cy, Rr, 0, 7); ctx.fillStyle = '#05060a'; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke();
    text(ctx, 'N', cx, cy - Rr - 8, { color: col.ink, size: 10.5, align: 'center' });
    const P = (v) => { const alt = Math.asin(v[1]), az = Math.atan2(v[0], -v[2]), r = ((Math.PI / 2 - alt) / (Math.PI / 2)) * Rr; return [cx + r * Math.sin(az), cy - r * Math.cos(az), alt]; };
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, Rr, 0, 7); ctx.clip();
    for (const m of ms) {
      const f = Math.sin(Math.PI * Math.min(1, m.t / 0.9)); ctx.strokeStyle = `rgba(240,240,255,${0.9 * f})`; ctx.lineWidth = 1.6; ctx.beginPath();
      for (let i = 0; i <= 10; i++) { const a = m.a1 + (i / 10) * m.len, v = [0, 1, 2].map((k) => m.rad[k] * Math.cos(a) + m.q[k] * Math.sin(a)), p = P(v); if (v[1] < 0) continue; i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
      ctx.stroke();
    }
    ctx.restore();
    const pr = P(vec(h * D, 0)); dot(ctx, pr[0], pr[1], 4, col.s[1]); text(ctx, 'radiant', pr[0] + 7, pr[1] - 6, { color: col.s[1], size: 11, weight: 700, halo: '#05060a' });
  };
  show();
}
