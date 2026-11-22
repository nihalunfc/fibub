// Class 9 Science, Chapter 1: reading a scale and parallax error. The pointer (or object edge) sits a small gap above
// the scale. Looking straight down you read the true value; looking from the side the line of sight meets the scale at a
// different place: read = true + gap × tan(angle). A thinner gap (object touching the scale) cuts the error.
import { canvas, text, title, line, dot, row, slider, choice, readout, arrow } from '../../kit.js';

export default function (host) {
  let ang = 30, thick = 'thick';
  const cv = canvas(host, { aspect: 0.68, max: 440, min: 280, label: 'A ruler with a pointer above it and an eye that can look from different angles' });
  const ctl = row(host);
  slider(ctl, { label: 'Eye angle', min: -50, max: 50, step: 1, value: ang, fmt: (v) => `${v}°`, oninput: (v) => { ang = v; upd(); } });
  choice(ctl, 'Ruler', [['thick', 'Thick ruler (gap 4 mm)'], ['thin', 'Thin, touching (gap 0.5 mm)']], thick, (v) => { thick = v; upd(); });
  const out = readout(host);
  const gap = () => (thick === 'thick' ? 4 : 0.5), TRUE = 5.0;
  function upd() { const r = TRUE - gap() * Math.tan(ang * Math.PI / 180) / 10; out.innerHTML = `True reading <b>5.00 cm</b>. Eye at ${ang}°: you read <b>${r.toFixed(2)} cm</b>. Error <b>${(r - TRUE >= 0 ? '+' : '') + (r - TRUE).toFixed(2)} cm</b>. ${Math.abs(ang) < 2 ? 'Straight above: no parallax error.' : 'Always put your eye straight above the mark.'}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Parallax: where you look from changes what you read', col) + 10;
    const L = 20, R = w - 20, sy = h - 70, cm = (R - L) / 10, X = (v) => L + v * cm;
    // ruler
    ctx.fillStyle = col.soft; ctx.fillRect(L, sy, R - L, 26); ctx.strokeStyle = col.muted; ctx.lineWidth = 1.2; ctx.strokeRect(L, sy, R - L, 26);
    for (let i = 0; i <= 100; i++) { const x = X(i / 10); line(ctx, [[x, sy], [x, sy + (i % 10 === 0 ? 13 : i % 5 === 0 ? 9 : 5)]], col.ink, 1); }
    for (let i = 0; i <= 10; i++) text(ctx, String(i), X(i), sy + 20, { color: col.ink, size: 10, align: 'center', weight: 600 });
    // pointer with gap g (drawn with 4 px per mm)
    const g = gap() / 10 * cm, px = X(TRUE), py = sy - g;
    ctx.fillStyle = col.s[1]; ctx.beginPath(); ctx.moveTo(px - 6, py - 54); ctx.lineTo(px + 6, py - 54); ctx.lineTo(px, py); ctx.closePath(); ctx.fill();
    if (thick === 'thick') line(ctx, [[px, py], [px, sy]], col.muted, 1, [2, 2]);
    text(ctx, 'pointer tip', px + 10, py - 36, { color: col.s[1], size: 11, weight: 700 });
    text(ctx, `gap ${gap()} mm`, px + 10, py + (g > 10 ? g / 2 : -14), { color: col.muted, size: 10.5 });
    // eye on an arc
    const a = ang * Math.PI / 180, D = Math.min(sy - top - 20, 150), ex = px + D * Math.sin(a), ey = py - D * Math.cos(a);
    const ox = px + (D * 1.1) * Math.sin(a), oy = py - (D * 1.1) * Math.cos(a);
    ctx.save(); ctx.strokeStyle = col.line; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.arc(px, py, D, -Math.PI * 0.8, -Math.PI * 0.2); ctx.stroke(); ctx.restore();
    // line of sight from eye through tip to the scale
    const readX = px - g * Math.tan(a);
    line(ctx, [[ex, ey], [px, py], [readX, sy]], col.s[0], 1.6);
    dot(ctx, readX, sy, 4.5, col.s[0]); dot(ctx, px, sy, 3.5, col.s[1]);
    ctx.fillStyle = col.panel; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(ex, ey, 11, 6.5, -a + Math.PI / 2 * 0, 0, 7); ctx.fill(); ctx.stroke(); dot(ctx, ex, ey, 3, col.ink);
    text(ctx, 'eye', ex + (ex > w - 40 ? -14 : 16), ey - 10, { color: col.muted, size: 10.5, align: ex > w - 40 ? 'right' : 'left' });
    text(ctx, `you read ${(5 + (readX - px) / cm).toFixed(2)}`, readX, sy + 40, { color: col.s[0], size: 11, weight: 700, align: 'center', halo: col.panel });
  };
  upd();
}
