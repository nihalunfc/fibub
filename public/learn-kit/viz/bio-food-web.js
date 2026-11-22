// A small food web. Remove one species and see how the others are likely to respond: arrows go from food to eater.
// Down arrows mean less food or more hunting; up arrows mean less predation or a freed food source. It is a qualitative
// picture (real webs adjust in complex ways), but it shows why losing one species can ripple through a whole ecosystem.
import { canvas, row, choice, readout, text, title } from '../kit.js';

const SP = [['Grass', 0.5, 0.88, 'producer'], ['Grasshopper', 0.25, 0.66, 'primary consumer'], ['Mouse', 0.75, 0.66, 'primary consumer'], ['Frog', 0.12, 0.42, 'secondary consumer'], ['Small bird', 0.4, 0.42, 'secondary consumer'], ['Snake', 0.68, 0.42, 'secondary consumer'], ['Hawk', 0.5, 0.16, 'tertiary consumer']];
const EDGES = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6], [3, 5], [5, 6], [4, 6]];

export default function (host) {
  let gone = -1;
  const cv = canvas(host, { aspect: 0.9, max: 400, min: 330, label: 'A food web of seven species with one removed and the likely effects shown' });
  const c = row(host);
  choice(c, 'Remove', [[-1, 'None'], ...SP.map((s, i) => [i, s[0]])], gone, (v) => { gone = v; show(); });
  const out = readout(host);
  function effects() {
    const eff = SP.map(() => 0); if (gone < 0) return eff;
    const preyOf = (i) => EDGES.filter((e) => e[1] === i).map((e) => e[0]), predOf = (i) => EDGES.filter((e) => e[0] === i).map((e) => e[1]);
    eff[gone] = -9;
    predOf(gone).forEach((p) => { const alive = preyOf(p).filter((q) => q !== gone); eff[p] -= alive.length ? 1 : 3; });
    preyOf(gone).forEach((q) => { eff[q] += 2; });
    for (let round = 0; round < 1; round++) { const snap = eff.slice(); SP.forEach((_, i) => { if (i === gone) return; predOf(i).forEach((p) => { if (p !== gone) eff[p] += Math.sign(snap[i]) * 0.3; }); preyOf(i).forEach((q) => { if (q !== gone) eff[q] -= Math.sign(snap[i]) * 0.3; }); }); }
    return eff;
  }
  function show() {
    const e = effects(), dn = SP.filter((s, i) => i !== gone && e[i] <= -0.5).map((s) => s[0]), up = SP.filter((s, i) => i !== gone && e[i] >= 0.5).map((s) => s[0]);
    out.innerHTML = gone < 0 ? 'All species present. Energy flows from producers up through consumers, and each species usually has more than one food, which gives a web, not a single chain.' : `Without <b>${SP[gone][0]}</b>: likely <b>fewer</b> ${dn.join(', ') || 'none'}; likely <b>more</b> ${up.join(', ') || 'none'}. ${gone === 0 ? 'Removing the producers starves everything: all energy enters the web through them.' : SP[gone][3] === 'tertiary consumer' ? 'Removing the top predator lets its prey increase (a trophic cascade).' : ''}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Food web (arrow: eaten by)', col);
    const e = effects(), P = SP.map((s) => [s[1] * w, 30 + s[2] * (h - 44)]);
    EDGES.forEach(([a, b]) => { const dead = a === gone || b === gone; ctx.globalAlpha = dead ? 0.15 : 1; const [x0, y0] = P[a], [x1, y1] = P[b], ang = Math.atan2(y1 - y0, x1 - x0); const sx = x0 + Math.cos(ang) * 28, sy = y0 + Math.sin(ang) * 14, ex = x1 - Math.cos(ang) * 30, ey = y1 - Math.sin(ang) * 15; ctx.strokeStyle = col.muted; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke(); ctx.fillStyle = col.muted; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex - 8 * Math.cos(ang - 0.4), ey - 8 * Math.sin(ang - 0.4)); ctx.lineTo(ex - 8 * Math.cos(ang + 0.4), ey - 8 * Math.sin(ang + 0.4)); ctx.fill(); });
    ctx.globalAlpha = 1;
    SP.forEach((s, i) => {
      const [x, y] = P[i], d = i === gone, up = e[i] >= 0.5, dn = e[i] <= -0.5 && !d;
      ctx.beginPath(); ctx.ellipse(x, y, 34, 15, 0, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.lineWidth = 2.2; ctx.strokeStyle = d ? col.bad : up ? col.good : dn ? col.warn : col.s[i === 0 ? 2 : i < 3 ? 0 : i === 6 ? 5 : 1]; ctx.stroke();
      text(ctx, d ? '✕ ' + s[0] : s[0], x, y, { color: d ? col.bad : col.ink, size: 10.5, weight: 700, align: 'center', fit: false });
      if (up) text(ctx, '▲ more', x, y + 25, { color: col.good, size: 10, weight: 700, align: 'center', fit: false });
      if (dn) text(ctx, '▼ fewer', x, y + 25, { color: col.warn, size: 10, weight: 700, align: 'center', fit: false });
    });
    ['producer', 'primary consumer', 'secondary consumer', 'tertiary consumer'].forEach((l, i) => text(ctx, l, 4, [0.88, 0.66, 0.42, 0.16][i] * (h - 44) + 18, { color: col.muted, size: 8.5, fit: false }));
  };
  show();
}
