// Class 10 Colourful World (step player): how one raindrop makes a rainbow. Sunlight refracts as it enters the drop (and
// splits into colours), reflects once off the back of the drop (internal reflection), and refracts again as it leaves.
// Violet (n = 1.343) bends more than red (n = 1.331), so they leave at slightly different angles: red at about 42 degrees
// from the direction back towards the Sun's opposite, violet at about 40 degrees. The paths are traced with Snell's law
// for a ray that hits the drop at an angle of incidence of about 59 degrees, close to the angle that sends the most light
// to the eye, which is why a rainbow is bright at 40-42 degrees.
import { canvas, text, title, line, dot, arrow, loop } from '../../kit.js';

const dot2 = (a, b) => a[0] * b[0] + a[1] * b[1];
const refr = (d, N, n1, n2) => { const r = n1 / n2, ci = -dot2(d, N), k = 1 - r * r * (1 - ci * ci); return [d[0] * r + N[0] * (r * ci - Math.sqrt(k)), d[1] * r + N[1] * (r * ci - Math.sqrt(k))]; };
const T = ['Sunlight meets a spherical raindrop', 'Refraction on the way in: the colours start to separate', 'Internal reflection at the back of the drop', 'Refraction on the way out: the spectrum emerges', 'Why you see a bow: red from higher drops, violet from lower ones'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'Sunlight entering a raindrop, reflecting inside it and leaving as separate colours' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const path = (n, C, R, b) => {
    const P1 = [C[0] - R * Math.sqrt(1 - b * b), C[1] - b * R], d0 = [1, 0], N1 = [(P1[0] - C[0]) / R, (P1[1] - C[1]) / R];
    const d1 = refr(d0, N1, 1, n); let tt = -2 * ((P1[0] - C[0]) * d1[0] + (P1[1] - C[1]) * d1[1]); const P2 = [P1[0] + d1[0] * tt, P1[1] + d1[1] * tt];
    const N2 = [(P2[0] - C[0]) / R, (P2[1] - C[1]) / R], dn = dot2(d1, N2), d2 = [d1[0] - 2 * dn * N2[0], d1[1] - 2 * dn * N2[1]];
    tt = -2 * ((P2[0] - C[0]) * d2[0] + (P2[1] - C[1]) * d2[1]); const P3 = [P2[0] + d2[0] * tt, P2[1] + d2[1] * tt], N3 = [(P3[0] - C[0]) / R, (P3[1] - C[1]) / R];
    const d3 = refr(d2, [-N3[0], -N3[1]], n, 1), ang = Math.abs(Math.atan2(-d3[1], -d3[0]) * 180 / Math.PI);
    return { P1, P2, P3, d3, ang };
  };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, T[step], col);
    if (step === 4) {
      const E = [26, h * 0.86], L = Math.min(w, h) * 0.8, red = [E[0] + L * Math.cos(42 * Math.PI / 180), E[1] - L * Math.sin(42 * Math.PI / 180)], vio = [E[0] + L * Math.cos(40 * Math.PI / 180) * 0.9, E[1] - L * Math.sin(40 * Math.PI / 180) * 0.9];
      ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(E[0], E[1] - 10, 8, 0, 7); ctx.stroke(); ctx.restore(); text(ctx, 'you', E[0] + 12, E[1] + 8, { color: col.ink, size: 11, weight: 700 });
      line(ctx, [E, [E[0] + L, E[1]]], col.line, 1.2, [5, 4]); text(ctx, 'direction away from the Sun', E[0] + L * 0.55, E[1] + 14, { color: col.muted, size: 10, align: 'center' });
      [[red, '#e5241d', '42°', 'red'], [vio, '#8a2be2', '40°', 'violet']].forEach(([D, c, a, nm]) => {
        dot(ctx, D[0], D[1], 8, col.panel, col.ink); line(ctx, [[D[0] - 80, D[1]], D], col.ink, 1.4); line(ctx, [D, E], c, 2.4);
        text(ctx, `${nm} drop: ${a}`, D[0] + 12, D[1], { color: c, size: 11, weight: 700, halo: col.panel });
      });
      text(ctx, 'sunlight comes from the left', 8, 44, { color: col.s[3], size: 11, weight: 700 });
      return;
    }
    const R = Math.min(w, h) * 0.24, C = [w * 0.56, h * 0.36], b = 0.86, red = path(1.331, C, R, b), vio = path(1.343, C, R, b);
    ctx.save(); ctx.fillStyle = col.soft; ctx.globalAlpha = 0.55; ctx.beginPath(); ctx.arc(C[0], C[1], R, 0, 7); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2.2; ctx.stroke(); ctx.restore();
    const y0 = C[1] - b * R, sun = [[8, y0], red.P1];
    line(ctx, sun, '#d4a000', 3); text(ctx, 'sunlight', 10, y0 + 14, { color: col.ink, size: 11, weight: 700 });
    // normal at entry
    const N = [(red.P1[0] - C[0]) / R, (red.P1[1] - C[1]) / R]; line(ctx, [[red.P1[0] + N[0] * 22, red.P1[1] + N[1] * 22], [red.P1[0] - N[0] * 30, red.P1[1] - N[1] * 30]], col.muted, 1.2, [4, 4]);
    const parts = [];
    if (step >= 1) parts.push(['in', red.P1, red.P2, vio.P1, vio.P2]);
    if (step >= 2) parts.push(['back', red.P2, red.P3, vio.P2, vio.P3]);
    for (const [k, a, b2, c, d] of parts) { line(ctx, [a, b2], '#e5241d', 2.2); line(ctx, [c, d], '#8a2be2', 2.2); }
    if (step === 2) { dot(ctx, red.P2[0], red.P2[1], 4, col.ink); text(ctx, 'reflects', red.P2[0] + 8, red.P2[1] + 14, { color: col.ink, size: 11, weight: 700, halo: col.panel }); }
    if (step >= 3) {
      const out = (p, c) => { const tEnd = 175; line(ctx, [p.P3, [p.P3[0] + p.d3[0] * tEnd, p.P3[1] + p.d3[1] * tEnd]], c, 2.6); };
      out(red, '#e5241d'); out(vio, '#8a2be2');
      text(ctx, `red ${red.ang.toFixed(0)}°`, red.P3[0] + red.d3[0] * 100 - 4, red.P3[1] + red.d3[1] * 100 + 14, { color: '#e5241d', size: 11, weight: 700, align: 'right', halo: col.panel });
      text(ctx, `violet ${vio.ang.toFixed(0)}°`, vio.P3[0] + vio.d3[0] * 110 - 4, vio.P3[1] + vio.d3[1] * 110 + 28, { color: '#8a2be2', size: 11, weight: 700, align: 'right', halo: col.panel });
      text(ctx, 'angles measured from the line back to the Sun', 8, h - 8, { color: col.muted, size: 10 });
    }
    // sun pulses
    const ph = (t * 0.4) % 1; dot(ctx, 8 + ph * (red.P1[0] - 8), y0, 4, '#ffffff', '#d4a000');
    if (step >= 1) { const all = [red.P1, red.P2, red.P3]; const seg = (a, b2) => Math.hypot(b2[0] - a[0], b2[1] - a[1]); const l = [seg(all[0], all[1]), seg(all[1], all[2])], tot = l[0] + l[1]; let d = ph * tot; const i = d < l[0] ? 0 : 1; if (i === 1) d -= l[0]; const f = d / l[i]; if (step >= 1) dot(ctx, all[i][0] + f * (all[i + 1][0] - all[i][0]), all[i][1] + f * (all[i + 1][1] - all[i][1]), 3.5, '#ffffff', '#e5241d'); }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, T.length - 1); cv.redraw(); } };
}
