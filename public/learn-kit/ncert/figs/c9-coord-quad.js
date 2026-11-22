// Class 9 Coordinates: the four quadrants and the signs of x and y in each. Explore mode: click to see the signs.
// Game mode: a coordinate pair is shown and you click the quadrant (or the axis) where it belongs; the score counts right answers.
import { canvas, text, title, row, choice, button, readout, dot } from '../../kit.js';
import { plane } from './c9-coord-plane.js';

const num = (v) => String(v).replace('-', '−');
const QN = { 1: 'I (+, +)', 2: 'II (−, +)', 3: 'III (−, −)', 4: 'IV (+, −)' };
const which = (x, y) => (Math.abs(x) < 0.5 && Math.abs(y) < 0.5 ? 'O' : Math.abs(y) < 0.5 ? 'x-axis' : Math.abs(x) < 0.5 ? 'y-axis' : x > 0 ? (y > 0 ? 1 : 4) : (y > 0 ? 2 : 3));
export default function (host) {
  let mode = 'x', pt = [-3, 4], tgt = null, score = 0, tries = 0, g, hit = null;
  const cv = canvas(host, { aspect: 1, max: 440, min: 300, label: 'The four quadrants of the coordinate plane with signs; click to explore or play the quadrant game' });
  const ctl = row(host);
  choice(ctl, 'Mode', [['x', 'Explore'], ['g', 'Game']], mode, (v) => { mode = v; hit = null; if (v === 'g') next(); upd(); });
  const nb = button(ctl, 'Next point', () => { next(); upd(); });
  const out = readout(host);
  function next() {
    const k = Math.random(), r = () => { let v = 0; while (!v) v = Math.floor(Math.random() * 11) - 5; return v; };
    tgt = k < 0.2 ? (Math.random() < 0.5 ? [r(), 0] : [0, r()]) : [r(), r()]; hit = null;
  }
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, mode === 'x' ? 'Signs of (x, y) in each quadrant' : 'Click where ' + (tgt ? '(' + num(tgt[0]) + ', ' + num(tgt[1]) + ')' : '') + ' belongs', col);
    g = plane(ctx, w, h, col, { top: t + 6, x0: -5, x1: 5, y0: -5, y1: 5 });
    const q = [[1, 1, 0], [-1, 1, 1], [-1, -1, 2], [1, -1, 3]];
    for (const [sx, sy, i] of q) {
      ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = col.s[i]; ctx.fillRect(Math.min(g.X(0), g.X(5 * sx)), Math.min(g.Y(0), g.Y(5 * sy)), 5 * g.s, 5 * g.s); ctx.restore();
      text(ctx, 'Q' + ['I', 'II', 'III', 'IV'][i] + '  (' + (sx > 0 ? '+' : '−') + ', ' + (sy > 0 ? '+' : '−') + ')', g.X(2.6 * sx), g.Y(4.4 * sy), { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel });
    }
    if (mode === 'x') { dot(ctx, g.X(pt[0]), g.Y(pt[1]), 7, col.s[5], col.ink); text(ctx, '(' + num(pt[0]) + ', ' + num(pt[1]) + ')', g.X(pt[0]), g.Y(pt[1]) - 14, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel }); }
    else if (hit) { dot(ctx, g.X(tgt[0]), g.Y(tgt[1]), 7, hit.ok ? col.s[2] : col.s[6], col.ink); }
  };
  cv.c.style.cursor = 'pointer';
  cv.c.addEventListener('pointerdown', (e) => {
    const r = cv.c.getBoundingClientRect(), [a, b] = g.inv(e.clientX - r.left, e.clientY - r.top);
    if (Math.abs(a) > 5.3 || Math.abs(b) > 5.3) return;
    if (mode === 'x') { pt = [Math.round(a), Math.round(b)]; }
    else if (!hit) { tries++; const ok = String(which(a, b)) === String(which(tgt[0], tgt[1])); if (ok) score++; hit = { ok, said: which(a, b) }; }
    upd();
  });
  function upd() {
    nb.style.display = mode === 'g' ? '' : 'none';
    if (mode === 'x') { const w = which(pt[0], pt[1]); out.innerHTML = `(${num(pt[0])}, ${num(pt[1])}): x is ${pt[0] > 0 ? 'positive' : pt[0] < 0 ? 'negative' : 'zero'}, y is ${pt[1] > 0 ? 'positive' : pt[1] < 0 ? 'negative' : 'zero'}. ` + (typeof w === 'number' ? `It lies in <b>quadrant ${QN[w]}</b>.` : `A point on an axis is in <b>no quadrant</b>.`); }
    else { const w = which(tgt[0], tgt[1]); out.innerHTML = (hit ? (hit.ok ? '<b>Correct.</b> ' : '<b>Not quite.</b> ') + `(${num(tgt[0])}, ${num(tgt[1])}) is ` + (typeof w === 'number' ? 'in quadrant ' + QN[w] : 'on the ' + w) + '. Press Next point. ' : 'Click the quadrant (or the axis) for the point shown above the grid. ') + `Score: ${score} of ${tries}.`; }
    cv.redraw();
  }
  upd();
}
