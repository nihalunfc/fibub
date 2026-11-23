// Class 8 Time and the skies: eclipses. The Moon's path is tilted about 5 degrees to the Earth's path round the Sun, so at most new Moons
// it passes just above or below the Sun-Earth line and there is no eclipse. A solar eclipse needs the Moon exactly between Sun and Earth
// (new Moon); a lunar eclipse needs the Earth exactly between Sun and Moon (full Moon). Sizes and distances are NOT to scale.
import { canvas, text, title, line, dot, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let kind = 'solar', off = 40;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 260, label: 'Sun, Moon and Earth in a line, with the Moon moved above or below the line' });
  const ctl = row(host);
  choice(ctl, 'Eclipse', [['solar', 'Solar (new Moon)'], ['lunar', 'Lunar (full Moon)']], kind, (v) => { kind = v; say(); });
  slider(ctl, { label: 'Moon above/below the line', min: -60, max: 60, step: 1, value: off, fmt: (v) => (v === 0 ? 'on the line' : v > 0 ? `${v} up` : `${-v} down`), oninput: (v) => { off = v; say(); } });
  const out = readout(host);
  const G = () => { const w = cv.w, sx = 30, Rs = 26, re = 12, rm = 5; return kind === 'solar' ? { sx, Rs, ex: w * 0.88, re, mx: w * 0.64, rm } : { sx, Rs, ex: w * 0.58, re, mx: w * 0.86, rm }; };
  const verdict = () => {
    const g = G(), a = Math.abs(off);
    if (kind === 'solar') { const u = g.re * 0.35; return a < u ? 'total' : a < g.re + 4 ? 'partial' : 'none'; }
    const ur = g.re * 0.75; return a < ur - g.rm ? 'total' : a < ur + g.rm ? 'partial' : 'none';
  };
  const say = () => {
    const v = verdict();
    out.innerHTML = kind === 'solar' ? (v === 'none' ? 'The Moon is above or below the Sun-Earth line, so its shadow <b>misses the Earth</b>: no solar eclipse this new Moon.' : v === 'total' ? 'The Moon is right on the line: its dark shadow falls on a small patch of Earth. People there see a <b>total solar eclipse</b>.' : 'Only the lighter shadow reaches Earth: people in it see a <b>partial solar eclipse</b>.') : (v === 'none' ? 'The Moon passes above or below the Earth\'s shadow: <b>no lunar eclipse</b> this full Moon.' : v === 'total' ? 'The Moon is inside the Earth\'s dark shadow: a <b>total lunar eclipse</b>. The Moon looks dim red, and everyone on the night side can see it.' : 'Part of the Moon is in the dark shadow: a <b>partial lunar eclipse</b>.');
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, kind === 'solar' ? 'Solar eclipse: Moon between Sun and Earth' : 'Lunar eclipse: Earth between Sun and Moon', col);
    const g = G(), cy = h * 0.55;
    line(ctx, [[g.sx, cy], [w - 8, cy]], col.line, 1, [4, 4]);
    // shadow cone of the middle body (umbra) shaded, pointing away from the Sun
    const mid = kind === 'solar' ? { x: g.mx, y: cy - off, r: g.rm } : { x: g.ex, y: cy, r: g.re };
    const dx = mid.x - g.sx, dy = mid.y - cy, dl = Math.hypot(dx, dy), ux = dx / dl, uy = dy / dl, apexLen = mid.r * dl / (g.Rs - mid.r);
    ctx.save(); ctx.fillStyle = col.ink; ctx.globalAlpha = 0.22;
    const nx = -uy, ny = ux, Lcone = Math.min(apexLen, w - mid.x + 20);
    ctx.beginPath(); ctx.moveTo(mid.x + nx * mid.r, mid.y + ny * mid.r); ctx.lineTo(mid.x + ux * apexLen, mid.y + uy * apexLen); ctx.lineTo(mid.x - nx * mid.r, mid.y - ny * mid.r); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 0.1; const pen = 1.9; ctx.beginPath(); ctx.moveTo(mid.x + nx * mid.r, mid.y + ny * mid.r); ctx.lineTo(mid.x + ux * 200 + nx * mid.r * pen * 5, mid.y + uy * 200 + ny * mid.r * pen * 5); ctx.lineTo(mid.x + ux * 200 - nx * mid.r * pen * 5, mid.y + uy * 200 - ny * mid.r * pen * 5); ctx.lineTo(mid.x - nx * mid.r, mid.y - ny * mid.r); ctx.closePath(); ctx.fill(); ctx.restore();
    dot(ctx, g.sx, cy, g.Rs, col.warn, col.ink); text(ctx, 'Sun', g.sx, cy + g.Rs + 13, { color: col.muted, size: 10.5, align: 'center' });
    dot(ctx, g.ex, cy, g.re, col.s[2], col.ink); text(ctx, 'Earth', g.ex, cy + g.re + 13, { color: col.muted, size: 10.5, align: 'center' });
    const my = kind === 'solar' ? cy - off : cy - off; const v = verdict();
    dot(ctx, g.mx, my, g.rm + 2, kind === 'lunar' && v !== 'none' ? col.bad : col.ink, col.panel); text(ctx, 'Moon', g.mx, my - g.rm - 9, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
    text(ctx, v === 'none' ? 'No eclipse' : v === 'total' ? 'Total eclipse' : 'Partial eclipse', w / 2, h - 12, { color: v === 'none' ? col.muted : col.bad, size: 12, weight: 700, align: 'center' });
    text(ctx, 'not to scale', w - 8, h - 12, { color: col.muted, size: 9.5, align: 'right' });
  };
  say();
}
