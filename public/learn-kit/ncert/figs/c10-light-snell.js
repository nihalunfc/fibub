// Class 10 Light: refraction at a boundary and Snell's law. Choose the second medium and the angle of incidence.
// Going from a rarer medium (air) into a denser one the ray bends TOWARDS the normal, and the other way it bends
// AWAY from it. The constant ratio sin i / sin r is the refractive index n of the second medium relative to the first;
// n = c / v tells how much slower light travels there (c = 3 x 10^8 m/s). Dots show the pulse speeds in each medium.
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout, loop } from '../../kit.js';

const MED = { water: ['Water', 1.33], glass: ['Glass', 1.5], diamond: ['Diamond', 2.42] };
export default function (host) {
  let med = 'glass', ang = 50, dirn = 'in', t = 0;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 290, label: 'A ray of light bending at the boundary between air and a denser medium' });
  const ctl = row(host);
  choice(ctl, 'Medium', Object.entries(MED).map(([k, v]) => [k, v[0]]), med, (v) => { med = v; update(); });
  choice(ctl, 'Light goes', [['in', 'Air → medium'], ['out', 'Medium → air']], dirn, (v) => { dirn = v; update(); });
  slider(ctl, { label: 'Angle of incidence', min: 0, max: 80, step: 1, value: ang, fmt: (v) => `${v}°`, oninput: (v) => { ang = v; update(); } });
  const out = readout(host);
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const rad = Math.PI / 180, calc = () => {
    const n = MED[med][1], n1 = dirn === 'in' ? 1 : n, n2 = dirn === 'in' ? n : 1, s = (n1 * Math.sin(ang * rad)) / n2;
    return { n, n1, n2, tir: s > 1, r: s > 1 ? NaN : Math.asin(s) / rad };
  };
  function update() {
    const { n, n1, n2, tir, r } = calc();
    out.innerHTML = tir ? `Angle too big: no refracted ray exists (n₁ sin i = ${(n1 * Math.sin(ang * rad)).toFixed(2)} is more than n₂). The light is all reflected (total internal reflection).`
      : `i = ${ang}°, r = <b>${r.toFixed(1)}°</b>. sin i / sin r = <b>${(Math.sin(ang * rad) / Math.sin(r * rad) || n1 / n2).toFixed(2)}</b>. The ray bends <b>${n2 > n1 ? 'towards' : n2 < n1 ? 'away from' : 'neither way from'}</b> the normal. Light speed in ${MED[med][0].toLowerCase()} = 3.0 × 10⁸ / ${n} = <b>${(3 / n).toFixed(2)} × 10⁸ m/s</b>.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const { n1, n2, tir, r } = calc(), top = dirn === 'in' ? 'Air' : MED[med][0], bot = dirn === 'in' ? MED[med][0] : 'Air';
    title(ctx, 'Refraction: light bends at the boundary', col);
    const by = Math.round(h * 0.52), px = w / 2, L = Math.min(w * 0.4, h * 0.42);
    ctx.save(); ctx.globalAlpha = 0.16; ctx.fillStyle = col.s[0]; ctx.fillRect(0, dirn === 'in' ? by : 0, w, dirn === 'in' ? h - by : by); ctx.restore();
    line(ctx, [[0, by], [w, by]], col.ink, 2);
    // slab labels: the denser medium is always the shaded one
    text(ctx, dirn === 'in' ? 'air (n = 1)' : `${MED[med][0].toLowerCase()} (n = ${MED[med][1]})`, 10, by - 12 - (dirn === 'in' ? 0 : 0), { color: col.muted, size: 11, weight: 700 });
    text(ctx, dirn === 'in' ? `${MED[med][0].toLowerCase()} (n = ${MED[med][1]})` : 'air (n = 1)', 10, by + 14, { color: col.muted, size: 11, weight: 700 });
    line(ctx, [[px, by - L - 8], [px, by + L + 8]], col.muted, 1.4, [5, 4]); text(ctx, 'normal', px + 5, by + L + 2, { color: col.muted, size: 10.5 });
    const a = ang * rad, S = [px - L * Math.sin(a), by - L * Math.cos(a)];
    arrow(ctx, S[0], S[1], px - 1, by - 1, col.s[0], 2.4, 9);
    // faint reflected ray
    line(ctx, [[px, by], [px + L * 0.7 * Math.sin(a), by - L * 0.7 * Math.cos(a)]], col.s[0], 1.2, [3, 4]);
    const pts = [S, [px, by]];
    if (!tir) { const b = r * rad, E = [px + L * Math.sin(b), by + L * Math.cos(b)]; arrow(ctx, px, by, E[0], E[1], col.s[1], 2.4, 9); pts.push(E); } else arrow(ctx, px, by, px + L * Math.sin(a), by - L * Math.cos(a), col.s[1], 2.4, 9);
    // angle labels
    const arc = (R, a0, a1, c) => { ctx.strokeStyle = c; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(px, by, R, a0, a1); ctx.stroke(); };
    arc(36, -Math.PI / 2 - a, -Math.PI / 2, col.s[0]); text(ctx, 'i', px - 52 * Math.sin(a / 2) - 6, by - 52 * Math.cos(a / 2), { color: col.s[0], size: 13, weight: 700, halo: col.panel });
    if (!tir) { const b = r * rad; arc(36, Math.PI / 2 - b, Math.PI / 2, col.s[1]); text(ctx, 'r', px + 52 * Math.sin(b / 2) + 2, by + 52 * Math.cos(b / 2) + 4, { color: col.s[1], size: 13, weight: 700, halo: col.panel }); }
    // pulses: speed ~ 1/n in each medium
    const sp = (n) => 1 / n, len1 = L, len2 = L;
    const tt = (t * 0.45) % 1.6; let d1 = tt * sp(n1) * L * 0.9;
    if (d1 <= len1) dot(ctx, S[0] + (px - S[0]) * (d1 / len1), S[1] + (by - S[1]) * (d1 / len1), 5, col.s[3]);
    else if (!tir) { const d2 = Math.min(len2, (tt - len1 / (sp(n1) * L * 0.9)) * sp(n2) * L * 0.9); if (d2 >= 0 && d2 <= len2) { const b = r * rad; dot(ctx, px + Math.sin(b) * d2, by + Math.cos(b) * d2, 5, col.s[3]); } }
    text(ctx, `orange dot: pulse moves slower in the denser medium`, 10, h - 8, { color: col.muted, size: 10.5 });
  };
  update();
}
