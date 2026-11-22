// Class 9 Tissues: the three kinds of muscle tissue. Skeletal (striated) muscle: long cylindrical cells with many
// nuclei and light-dark stripes; voluntary; moves bones. Smooth (unstriated) muscle: spindle-shaped cells with one
// nucleus, no stripes; involuntary; walls of gut, blood vessels. Cardiac muscle: short branched striated cells joined
// by intercalated discs, one nucleus; involuntary; never tires; heart. Press play: muscle cells shorten when they contract.
import { canvas, text, title, dot, line, row, choice, loop } from '../../kit.js';

const M = [
  ['Skeletal', 'Striated, voluntary', 'Attached to bones by tendons (arms, legs). Long cylinders, many nuclei at the edge. Contracts quickly, tires.'],
  ['Smooth', 'Unstriated, involuntary', 'Walls of the food pipe, stomach, blood vessels, bladder. Spindle-shaped, one nucleus. Slow, steady contraction.'],
  ['Cardiac', 'Striated, involuntary', 'Only in the heart. Short, branched cells joined end to end by discs. Beats about 70 times a minute without rest.'],
];
export default function (host) {
  let k = 0, t = 0;
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 300, label: 'Skeletal, smooth and cardiac muscle cells contracting and relaxing' });
  const ctl = row(host);
  choice(ctl, 'Muscle', M.map((m, i) => [i, m[0]]), 0, (v) => { k = v; cv.redraw(); });
  const an = loop(host, (dt) => { t += dt; cv.redraw(); }); an.button(ctl);
  const wrap = (ctx, s, w) => { ctx.font = '11px system-ui'; const L = []; let c = ''; s.split(' ').forEach((x) => { if (ctx.measureText((c + ' ' + x).trim()).width > w && c) { L.push(c); c = x; } else c = (c + ' ' + x).trim(); }); L.push(c); return L; };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, M[k][0] + ' muscle: ' + M[k][1], col);
    const X = 14, Y = 40, W = w - 28, H = h * 0.42, c = (Math.sin(t * 2.2 * (k === 2 ? 1.6 : k === 1 ? 0.5 : 1)) + 1) / 2; // 0 relaxed, 1 contracted
    ctx.fillStyle = col.soft; ctx.fillRect(X, Y, W, H);
    const sh = 1 - c * 0.28;
    if (k === 0) { for (let j = 0; j < 3; j++) { const y = Y + 16 + j * (H - 20) / 3, len = (W - 20) * sh, x0 = X + 10 + (W - 20 - len) / 2; ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.roundRect(x0, y, len, 20, 8); ctx.fill(); for (let s = 0; s < 22; s++) { const sx = x0 + 8 + s * (len - 16) / 21; line(ctx, [[sx, y + 2], [sx, y + 18]], s % 2 ? col.panel : col.s[4], 2); } [0.2, 0.5, 0.8].forEach((f) => dot(ctx, x0 + len * f, y + 3, 2.6, col.ink)); } }
    if (k === 1) { for (let j = 0; j < 3; j++) { const y = Y + 14 + j * (H - 14) / 3, len = (W * 0.55) * (1 - c * 0.25), wd = 14 + c * 9; for (let i = 0; i < 2; i++) { const x0 = X + 12 + i * (W * 0.46) + (j % 2) * 20; ctx.beginPath(); ctx.moveTo(x0, y + 12); ctx.quadraticCurveTo(x0 + len * 0.5, y + 12 - wd, x0 + len, y + 12); ctx.quadraticCurveTo(x0 + len * 0.5, y + 12 + wd, x0, y + 12); ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.75; ctx.fill(); ctx.globalAlpha = 1; dot(ctx, x0 + len * 0.5, y + 12, 3.2, col.ink); } } }
    if (k === 2) { const n = 4, cw = (W - 20) / n; for (let j = 0; j < 2; j++) for (let i = 0; i < n; i++) { const x0 = X + 10 + i * cw, y = Y + 18 + j * (H / 2 - 4), len = cw * (1 - c * 0.12); ctx.fillStyle = col.bad; ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.roundRect(x0, y, len - 6, 22, 6); ctx.fill(); ctx.globalAlpha = 1; for (let s = 0; s < 5; s++) line(ctx, [[x0 + 6 + s * (len - 20) / 4, y + 2], [x0 + 6 + s * (len - 20) / 4, y + 20]], col.panel, 1.5); dot(ctx, x0 + len / 2 - 3, y + 11, 3, col.ink); line(ctx, [[x0 + len - 6, y - 2], [x0 + len - 6, y + 24]], col.ink, 3); if (i === 1 && j === 0) line(ctx, [[x0 + len - 4, y + 22], [x0 + len + 8, y + H / 2 - 8]], col.bad, 5); } text(ctx, 'dark bars = intercalated discs', X + 8, Y + H - 6, { color: col.ink, size: 10, weight: 700, halo: col.soft }); }
    text(ctx, c > 0.6 ? 'CONTRACTED: cells shorten and thicken' : c < 0.4 ? 'relaxed' : '…', X + W - 6, Y + H + 14, { color: c > 0.6 ? col.good : col.muted, size: 11, weight: 700, align: 'right' });
    let y = Y + H + 14; wrap(ctx, M[k][2], W * 0.6).forEach((l) => { y += 15; text(ctx, l, X, y, { color: col.ink, size: 11 }); });
    y = Y + H + 52 + 20; void y;
  };
  cv.redraw();
}
