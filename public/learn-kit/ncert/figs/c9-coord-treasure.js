// Class 9 Coordinates: a treasure map. Clues give coordinates; click the grid point to dig. The last clue is built from two
// earlier finds (the x of one place, the y of another), which is exactly how an ordered pair is read.
import { canvas, text, title, row, button, readout, dot, line } from '../../kit.js';
import { plane } from './c9-coord-plane.js';

const num = (v) => String(v).replace('-', '−');
const PLACES = [
  { n: 'Palm tree', p: [-4, 3], clue: 'Walk to the palm tree at (−4, 3).' },
  { n: 'Old well', p: [2, 4], clue: 'Next, the old well at (2, 4).' },
  { n: 'Boat', p: [-3, -3], clue: 'Now the boat at (−3, −3).' },
  { n: 'Cave', p: [4, -2], clue: 'Then the cave at (4, −2).' },
  { n: 'Treasure', p: [2, -3], clue: 'The treasure has the same x as the well and the same y as the boat. Where is it?' },
];
export default function (host) {
  let k = 0, g, msg = 'Read the clue and click the grid point.';
  const cv = canvas(host, { aspect: 1, max: 440, min: 300, label: 'Treasure map grid: click the grid point named by each clue' });
  const ctl = row(host);
  button(ctl, 'Start again', () => { k = 0; msg = 'Read the clue and click the grid point.'; upd(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Treasure map', col);
    g = plane(ctx, w, h, col, { top: t + 6, x0: -6, x1: 6, y0: -5, y1: 5 });
    for (let i = 0; i < k; i++) {
      const P = PLACES[i], x = g.X(P.p[0]), y = g.Y(P.p[1]);
      if (i === 4) { dot(ctx, x, y, 8, col.s[3], col.ink); text(ctx, 'X  Treasure!', x, y - 15, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel }); }
      else { ctx.save(); ctx.fillStyle = col.s[i]; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.fillRect(x - 6, y - 6, 12, 12); ctx.strokeRect(x - 6, y - 6, 12, 12); ctx.restore(); text(ctx, P.n, x, y - 14, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel }); }
    }
    if (k === 5) { for (const [a, b] of [[PLACES[1].p[0], 0], [0, PLACES[2].p[1]]]) { ctx.save(); ctx.setLineDash([4, 4]); line(ctx, [[g.X(a), g.Y(b)], [g.X(2), g.Y(-3)]], col.s[0], 2); ctx.restore(); } }
  };
  cv.c.style.cursor = 'crosshair';
  cv.c.addEventListener('pointerdown', (e) => {
    if (k >= 5) return;
    const r = cv.c.getBoundingClientRect(), [a, b] = g.inv(e.clientX - r.left, e.clientY - r.top), ax = Math.round(a), by = Math.round(b);
    const T = PLACES[k].p;
    if (ax === T[0] && by === T[1]) { k++; msg = k === 5 ? 'You found the treasure. Its x matches the well (2) and its y matches the boat (−3).' : 'Found the ' + PLACES[k - 1].n.toLowerCase() + '. '; }
    else msg = `You clicked (${num(ax)}, ${num(by)}), but the clue wants (${num(T[0])}, ${num(T[1])}): x first (left or right), then y (down or up).`;
    upd();
  });
  function upd() { out.innerHTML = (k < 5 ? `<b>Clue ${k + 1} of 5.</b> ${PLACES[k].clue}<br>` : '') + msg; cv.redraw(); }
  upd();
}
