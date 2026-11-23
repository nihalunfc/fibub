// Class 8 Algebra Play: patterns and expressions. A row of k triangles needs 2k + 1 matchsticks, a row of k squares needs 3k + 1.
// Add shapes with the slider; count the sticks and see the expression give the same number.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let kind = 'tri', k = 4;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 250, label: 'Matchstick shapes in a row with a count and an expression' });
  const ctl = row(host);
  choice(ctl, 'Shape', [['tri', 'Triangles'], ['sq', 'Squares']], kind, (v) => { kind = v; sync(); });
  slider(ctl, { label: 'How many shapes', min: 1, max: 8, step: 1, value: k, fmt: (v) => v, oninput: (v) => { k = v; sync(); } });
  const out = readout(host);
  const sticks = () => (kind === 'tri' ? 2 * k + 1 : 3 * k + 1);
  function sync() { out.innerHTML = kind === 'tri' ? `${k} triangle${k > 1 ? 's' : ''}: the first needs 3 sticks, each new one needs 2 more. Sticks = 2 × ${k} + 1 = <b>${sticks()}</b>. Expression: <b>2n + 1</b>.` : `${k} square${k > 1 ? 's' : ''}: the first needs 4 sticks, each new one needs 3 more. Sticks = 3 × ${k} + 1 = <b>${sticks()}</b>. Expression: <b>3n + 1</b>.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, kind === 'tri' ? 'Triangles from matchsticks' : 'Squares from matchsticks', col), s = Math.min((w - 30) / (kind === 'tri' ? k + 0.5 : k), 56), tw = kind === 'tri' ? (k + 0.5) * s : k * s, ox = (w - tw) / 2, hh = kind === 'tri' ? s * 0.866 : s, y1 = top + 34 + hh, y0 = y1 - hh;
    const stick = (x1, y1_, x2, y2, i) => { ctx.strokeStyle = col.s[i % 2 ? 3 : 0]; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x1, y1_); ctx.lineTo(x2, y2); ctx.stroke(); ctx.lineCap = 'butt'; ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(x2, y2, 2.4, 0, 7); ctx.fill(); };
    let c = 0;
    if (kind === 'tri') { const V = (i) => [ox + (i * s) / 2, i % 2 ? y0 : y1]; for (let i = 0; i <= k; i++) { stick(...V(i), ...V(i + 1), c++); } for (let i = 0; i < k; i++) stick(...V(i), ...V(i + 2), c++); }
    else { for (let i = 0; i <= k; i++) stick(ox + i * s, y0, ox + i * s, y1, c++); for (let i = 0; i < k; i++) { stick(ox + i * s, y0, ox + (i + 1) * s, y0, c++); stick(ox + i * s, y1, ox + (i + 1) * s, y1, c++); } }
    text(ctx, c + ' sticks', w / 2, y1 + 24, { color: col.ink, size: 14, weight: 700, align: 'center' });
    const tb = y1 + 54, cells = 8, cw = (w - 20) / (cells + 1);
    text(ctx, 'n', 10 + cw / 2, tb, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, kind === 'tri' ? '2n+1' : '3n+1', 10 + cw / 2, tb + 18, { color: col.muted, size: 10.5, align: 'center' });
    for (let i = 1; i <= cells; i++) { const hl = i === k, x = 10 + cw * (i + 0.5); if (hl) { ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.25; ctx.fillRect(x - cw / 2, tb - 12, cw, 42); ctx.globalAlpha = 1; } text(ctx, String(i), x, tb, { color: col.ink, size: 11, weight: hl ? 700 : 400, align: 'center' }); text(ctx, String(kind === 'tri' ? 2 * i + 1 : 3 * i + 1), x, tb + 18, { color: col.ink, size: 11, weight: hl ? 700 : 400, align: 'center' }); }
  };
  sync();
}
