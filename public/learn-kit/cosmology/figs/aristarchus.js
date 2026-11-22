// 1.5 Aristarchus's half-moon triangle. At half moon the angle at the Moon is 90°, so measuring the
// Moon-Earth-Sun angle gives how much farther the Sun is. Slide the angle and watch the Sun run away.
import { canvas, text, line, dot, row, slider, readout, fmt } from '../../kit.js';

const D = Math.PI / 180;
export default function (host) {
  const cv = canvas(host, { aspect: 0.42, max: 300, min: 200, label: 'The right-angled triangle of Earth, half moon and Sun' });
  let ang = 87;
  const ctl = row(host);
  slider(ctl, { label: 'Angle between Moon and Sun', min: 80, max: 89.9, step: 0.05, value: ang, fmt: (v) => `${v.toFixed(2)}°`, oninput: (v) => { ang = v; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    const ratio = 1 / Math.cos(ang * D);
    out.innerHTML = `The Sun is <b>${fmt(ratio)}</b> times farther than the Moon. Aristarchus measured about 87° (ratio ≈ 19). The true angle is about 89.85°, which gives about <b>390</b>.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const ratio = 1 / Math.cos(ang * D);
    const E = [30, h - 60], sunX = w - 40;
    const em = (sunX - E[0]) / ratio; // Earth-Moon length on screen
    const M = [E[0] + em * Math.cos(ang * D), E[1] - em * Math.sin(ang * D)];
    const S = [sunX, E[1]];
    line(ctx, [E, S], col.muted, 1.5);
    line(ctx, [E, M], col.s[0], 2);
    line(ctx, [M, S], col.s[3], 2);
    // right angle mark at the Moon
    const ux = (E[0] - M[0]), uy = (E[1] - M[1]), ul = Math.hypot(ux, uy) || 1, vx = S[0] - M[0], vy = S[1] - M[1], vl = Math.hypot(vx, vy);
    const q = 10;
    if (ul > 14) line(ctx, [[M[0] + ux / ul * q, M[1] + uy / ul * q], [M[0] + ux / ul * q + vx / vl * q, M[1] + uy / ul * q + vy / vl * q], [M[0] + vx / vl * q, M[1] + vy / vl * q]], col.muted, 1);
    // angle at Earth
    ctx.beginPath(); ctx.arc(E[0], E[1], 26, -ang * D, 0); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke();
    text(ctx, `${ang.toFixed(2)}°`, E[0] + 30, E[1] - 12, { color: col.ink, size: 12, weight: 600, halo: col.panel });
    dot(ctx, E[0], E[1], 7, col.s[0]);
    text(ctx, 'Earth', E[0], E[1] + 20, { color: col.ink, size: 12, weight: 600, align: 'center' });
    // half moon: lit half faces the Sun
    ctx.beginPath(); ctx.arc(M[0], M[1], 6, 0, Math.PI * 2); ctx.fillStyle = col.line; ctx.fill();
    { const dir = Math.atan2(vy, vx); ctx.beginPath(); ctx.arc(M[0], M[1], 6, dir - Math.PI / 2, dir + Math.PI / 2); ctx.closePath(); ctx.fillStyle = col.s[3]; ctx.fill(); }
    text(ctx, 'Half moon (90° corner)', M[0] + 10, M[1] - 10, { color: col.ink, size: 12, weight: 600, halo: col.panel });
    dot(ctx, S[0], S[1], 14, col.s[3]);
    text(ctx, 'Sun', S[0], S[1] + 26, { color: col.ink, size: 12, weight: 600, align: 'center' });
    text(ctx, 'Not to scale: the Sun stays at the right edge, so the Moon\'s distance shrinks instead', 10, h - 8, { color: col.muted, size: 10.5, base: 'bottom' });
  };
  cv.redraw(); show();
}
