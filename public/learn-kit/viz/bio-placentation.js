// Placentation: how the ovules are attached inside the ovary. Pick a type and the ovary is shown in cross-section (top view)
// with the ovule positions highlighted. Matching the pattern to its example is a common exam question.
import { canvas, row, choice, readout, text, title } from '../kit.js';

const T = {
  marginal: { n: 'Marginal', ex: 'pea, bean (one chamber, ovules on the ventral suture)', pts: [[0.0, -0.78], [0.0, -0.5], [0.0, -0.22]], ch: 1 },
  axile: { n: 'Axile', ex: 'China rose, tomato, lemon (chambers with a central axis)', pts: [[-0.25, -0.1], [0.25, -0.1], [-0.25, 0.35], [0.25, 0.35]], ch: 3 },
  parietal: { n: 'Parietal', ex: 'mustard, Argemone (one chamber, ovules on the wall)', pts: [[-0.8, 0], [0.8, 0], [0, -0.8], [0, 0.8]], ch: 1 },
  central: { n: 'Free central', ex: 'Dianthus, Primrose (central column, no septa)', pts: [[-0.15, 0], [0.15, 0], [0, -0.2], [0, 0.2]], ch: 1 },
  basal: { n: 'Basal', ex: 'sunflower, marigold (one ovule at the base)', pts: [[0, 0.7]], ch: 1 },
};
export default function (host) {
  let key = 'axile';
  const cv = canvas(host, { aspect: 0.85, max: 360, min: 290, label: 'Cross-section of an ovary showing where the ovules attach' });
  const c = row(host);
  choice(c, 'Type', Object.entries(T).map(([k, v]) => [k, v.n]), key, (v) => { key = v; show(); });
  const out = readout(host);
  function show() { const t = T[key]; out.innerHTML = `<b>${t.n} placentation</b>: ${t.ex}. ${key === 'axile' ? 'Ovary is multilocular (chambers), ovules on the central axis where the septa meet.' : key === 'parietal' ? 'Carpels are fused but the ovary is usually one chamber (sometimes divided by a false septum).' : key === 'central' ? 'The septa have disappeared, leaving a central column bearing ovules.' : key === 'basal' ? 'A single ovule sits at the base of the ovary.' : 'Ovules sit along one margin of a single carpel.'}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, T[key].n + ' placentation (cross-section)', col);
    const cx = w / 2, cy = h * 0.52, R = Math.min(w * 0.34, h * 0.36);
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.2; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[2]; ctx.lineWidth = 3; ctx.stroke();
    ctx.strokeStyle = col.muted; ctx.lineWidth = 2;
    if (key === 'axile') for (let i = 0; i < 3; i++) { const a = i * 2 * Math.PI / 3 - Math.PI / 2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); ctx.stroke(); }
    if (key === 'marginal') { ctx.beginPath(); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy); ctx.stroke(); }
    if (key === 'central') { ctx.beginPath(); ctx.arc(cx, cy, R * 0.12, 0, 7); ctx.fillStyle = col.muted; ctx.fill(); }
    const pts = T[key].pts;
    const place = key === 'axile' ? [[0.0, -0.5], [0.12, -0.52], [-0.45, 0.3], [-0.33, 0.37], [0.45, 0.3], [0.33, 0.37]] : null;
    (place || pts).forEach(([x, y], i) => { ctx.beginPath(); ctx.ellipse(cx + x * R * (key === 'marginal' ? 1 : 0.9), cy + y * R * (key === 'marginal' ? 1 : 0.9), 8, 6, 0.3, 0, 7); ctx.fillStyle = col.s[1]; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.stroke(); });
    text(ctx, 'ovary wall', cx + R + 6, cy - R * 0.3, { color: col.s[2], size: 10, weight: 700, fit: true });
    text(ctx, 'orange = ovules', w / 2, h - 10, { color: col.s[1], size: 11, weight: 700, align: 'center' });
  };
  show();
}
