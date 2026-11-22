// Relative velocity, two ways. River and boat: set the heading and watch the boat's path (velocity over ground =
// velocity in water + river). Rain and umbrella: the faster you walk, the more you must tilt the umbrella.
// Try "Shortest time" and "Straight across" and compare the time and the drift.
import { canvas, text, row, choice, slider, readout, loop, button, arrow, line } from '../kit.js';

export default function (host) {
  let mode = 'river', t = 0;
  const cv = canvas(host, { aspect: 0.72, max: 420, min: 290, label: 'A boat crossing a river, or a walker with an umbrella in rain' });
  const c1 = row(host), c2 = row(host);
  choice(c1, 'Show', [['river', 'River and boat'], ['rain', 'Rain and umbrella']], mode, (v) => { mode = v; t = 0; build(); });
  const out = readout(host);
  let sa, sb, sc, anim;
  function build() {
    c2.innerHTML = '';
    if (mode === 'river') {
      sa = slider(c2, { label: 'Boat speed', min: 2, max: 8, step: 0.5, value: 5, fmt: (v) => v + ' m/s', oninput: () => { t = 0; } });
      sb = slider(c2, { label: 'River speed', min: 0, max: 6, step: 0.5, value: 3, fmt: (v) => v + ' m/s', oninput: () => { t = 0; } });
      sc = slider(c2, { label: 'Heading upstream of straight across', min: -30, max: 80, step: 1, value: 0, fmt: (v) => v + '°', oninput: () => { t = 0; } });
      button(c2, 'Shortest time', () => { sc.set(0); t = 0; });
      button(c2, 'Straight across', () => { const r = Math.min(1, sb.value / sa.value); sc.set(Math.round((Math.asin(r) * 180) / Math.PI)); t = 0; });
    } else {
      sa = slider(c2, { label: 'Rain speed', min: 4, max: 12, step: 1, value: 8, fmt: (v) => v + ' m/s' });
      sb = slider(c2, { label: 'Your speed', min: 0, max: 12, step: 1, value: 4, fmt: (v) => v + ' m/s' });
    }
    cv.redraw(); show();
  }
  const river = () => { const v = sa.value, u = sb.value, a = (sc.value * Math.PI) / 180; return { v, u, a, vx: u - v * Math.sin(a), vy: v * Math.cos(a) }; };
  function show() {
    if (mode === 'river') {
      const r = river(), W = 100;
      if (r.vy <= 0.01) { out.innerHTML = 'The boat is pointed too far upstream and never crosses.'; return; }
      const T = W / r.vy;
      out.innerHTML = `Ground velocity = (${r.vx.toFixed(2)} downstream, ${r.vy.toFixed(2)} across) m/s. Crossing 100 m takes <b>${T.toFixed(1)} s</b> and the boat drifts <b>${(r.vx * T).toFixed(1)} m</b> downstream. Fastest crossing is with heading 0°: ${(W / r.v).toFixed(1)} s. ${r.v > r.u ? `Straight across needs sin θ = u/v: θ = ${((Math.asin(r.u / r.v) * 180) / Math.PI).toFixed(1)}°.` : 'The river is faster than the boat: you cannot go straight across.'}`;
    } else {
      const th = (Math.atan2(sb.value, sa.value) * 180) / Math.PI;
      out.innerHTML = `Rain relative to you = ${sa.value} m/s down and ${sb.value} m/s backwards: ${Math.hypot(sa.value, sb.value).toFixed(1)} m/s at <b>${th.toFixed(1)}°</b> from the vertical, so tilt the umbrella ${th.toFixed(1)}° forward (tan θ = ${(sb.value / sa.value).toFixed(2)}).`;
    }
  }
  anim = loop(host, (dt) => { t += dt; cv.redraw(); show(); });
  anim.button(c1);
  cv.draw = (ctx, w, h, col) => {
    if (mode === 'river') {
      const r = river(), top = 40, bot = h - 40, W = 100, k = (bot - top) / W, x0 = w * 0.3;
      ctx.fillStyle = col.soft; ctx.fillRect(0, top, w, bot - top);
      line(ctx, [[0, top], [w, top]], col.muted, 2); line(ctx, [[0, bot], [w, bot]], col.muted, 2);
      for (let i = 0; i < 6; i++) { const y = top + (i + 0.5) * (bot - top) / 6; arrow(ctx, w * 0.55, y, w * 0.55 + 14 + r.u * 7, y, col.s[4], 1.5, 6); }
      text(ctx, 'river flow →', w - 8, top + 12, { color: col.muted, size: 10, align: 'right' });
      const T = r.vy > 0.01 ? W / r.vy : 1, tt = Math.min(t % (T + 1.2), T);
      const px = x0 + r.vx * tt * k * 0.6, py = bot - r.vy * tt * k;
      line(ctx, [[x0, bot], [x0 + r.vx * T * k * 0.6, bot - W * k]], col.s[0], 2);
      ctx.fillStyle = col.s[1]; ctx.beginPath(); ctx.ellipse(px, py, 11, 6, 0, 0, 7); ctx.fill();
      const h0 = (r.a * Math.PI) / 180 * 0, a = r.a;
      arrow(ctx, px, py, px - Math.sin(a) * r.v * 8, py - Math.cos(a) * r.v * 8, col.s[2], 2.5);
      arrow(ctx, px, py, px + r.u * 8, py, col.s[4], 2.5);
      arrow(ctx, px, py, px + r.vx * 8, py - r.vy * 8, col.bad, 3);
      text(ctx, 'boat in water', px - Math.sin(a) * r.v * 8 - 4, py - Math.cos(a) * r.v * 8 - 8, { color: col.s[2], size: 10, align: 'right' });
      text(ctx, 'over ground', px + r.vx * 8 + 6, py - r.vy * 8 - 6, { color: col.bad, size: 10 });
      text(ctx, 'Start', x0, bot + 14, { color: col.muted, size: 10, align: 'center' });
      title0(ctx, 'Boat velocity + river velocity = ground velocity', col);
    } else {
      const vr = sa.value, vw = sb.value, gx = w * 0.3;
      // ground frame (left) and walker frame (right)
      const half = w / 2;
      [0, 1].forEach((f) => {
        const cx = f ? half + half / 2 : half / 2, gy = h - 40, off = f ? 0 : (t * vw * 6) % 40;
        text(ctx, f ? 'Your frame' : 'Ground frame', cx, 18, { color: col.ink, size: 12, weight: 700, align: 'center' });
        line(ctx, [[f * half + 6, gy], [f * half + half - 6, gy]], col.muted, 2);
        for (let i = 0; i < 9; i++) {
          const sx = f * half + 10 + ((i * 37 + 13) % (half - 20)), sy = 34 + ((i * 53 + t * 60 * vr / 8 * 1) % (gy - 40)) ;
          const dx = f ? -vw * 4 : 0, dy = vr * 4;
          line(ctx, [[sx, sy], [sx + dx * 0.5, sy + dy * 0.5]], col.s[4], 2);
        }
        const mx = f ? cx : f * half + 20 + ((t * vw * 8) % (half - 40));
        const th = Math.atan2(vw, vr);
        line(ctx, [[mx, gy], [mx, gy - 34]], col.ink, 3);
        ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(mx, gy - 40, 6, 0, 7); ctx.fill();
        const ang = f ? th : 0;
        line(ctx, [[mx, gy - 30], [mx + Math.sin(ang) * 26, gy - 30 - Math.cos(ang) * 26]], col.s[1], 3);
        line(ctx, [[mx + Math.sin(ang) * 26 - Math.cos(ang) * 22, gy - 30 - Math.cos(ang) * 26 - Math.sin(ang) * 22], [mx + Math.sin(ang) * 26 + Math.cos(ang) * 22, gy - 30 - Math.cos(ang) * 26 + Math.sin(ang) * 22]], col.s[1], 4);
      });
      line(ctx, [[half, 24], [half, h - 10]], col.line, 1);
    }
  };
  function title0(ctx, s, col) { text(ctx, s, 8, 18, { color: col.ink, size: 12, weight: 700 }); }
  build();
}
