// Class 8 Ecosystems: a food web and what happens when one species is taken out. Arrows point from the food to the eater. Tap a species to
// remove it (tap again to bring it back). A qualitative rule shows the ripple: a species whose predators vanish tends to increase; one whose
// food or prey vanishes tends to decrease. s(X) = 0.6 x average effect of its predators + 0.6 x average effect of its food, repeated 3 times.
import { canvas, text, title, line, dot, arrow, row, button, readout } from '../../kit.js';

const SP = [['Grass', 0.5, 0.88], ['Grasshopper', 0.17, 0.62], ['Mouse', 0.5, 0.62], ['Rabbit', 0.83, 0.62], ['Frog', 0.1, 0.36], ['Snake', 0.3, 0.36], ['Fox', 0.7, 0.36], ['Hawk', 0.5, 0.12]];
const EAT = [[0, 1], [0, 2], [0, 3], [1, 4], [4, 5], [2, 5], [2, 6], [3, 6], [2, 7], [5, 7]];
export default function (host) {
  let gone = new Set();
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A food web of eight species where tapping a species removes it' });
  const ctl = row(host); button(ctl, 'Bring everyone back', () => { gone = new Set(); say(); });
  const out = readout(host);
  const status = () => {
    let s = SP.map(() => 0);
    for (let k = 0; k < 4; k++) s = SP.map((_, i) => {
      if (gone.has(i)) return -1;
      const pred = EAT.filter(([a]) => a === i).map(([, b]) => (gone.has(b) ? -1 : s[b])), prey = EAT.filter(([, b]) => b === i).map(([a]) => (gone.has(a) ? -1 : s[a]));
      const avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
      return Math.max(-1, Math.min(1, -0.9 * avg(pred) + 0.7 * avg(prey)));
    });
    return s;
  };
  const pos = (i) => ({ x: SP[i][1] * cv.w, y: 28 + SP[i][2] * (cv.h - 56) });
  function say() {
    if (!gone.size) out.innerHTML = 'Tap any animal or plant to remove it and watch the others change. Green = likely to increase, red = likely to decrease.';
    else { const s = status(), up = SP.filter((_, i) => !gone.has(i) && s[i] > 0.25).map((x) => x[0]), dn = SP.filter((_, i) => !gone.has(i) && s[i] < -0.25).map((x) => x[0]); out.innerHTML = `Removed: <b>${[...gone].map((i) => SP[i][0]).join(', ')}</b>. ${up.length ? 'Likely to <b>increase</b>: ' + up.join(', ') + '. ' : ''}${dn.length ? 'Likely to <b>decrease</b>: ' + dn.join(', ') + '.' : ''} Everything is connected.`; }
    cv.redraw();
  }
  cv.c.addEventListener('click', (e) => { const r = cv.c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; let best = -1, bd = 30; SP.forEach((_, i) => { const p = pos(i), d = Math.hypot(p.x - x, p.y - y); if (d < bd) { bd = d; best = i; } }); if (best >= 0) { gone.has(best) ? gone.delete(best) : gone.add(best); say(); } });
  cv.c.style.cursor = 'pointer';
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'A grassland food web: tap to remove', col);
    const s = status();
    EAT.forEach(([a, b]) => { const p = pos(a), q = pos(b), L = Math.hypot(q.x - p.x, q.y - p.y), ux = (q.x - p.x) / L, uy = (q.y - p.y) / L, dead = gone.has(a) || gone.has(b); ctx.save(); ctx.globalAlpha = dead ? 0.25 : 0.9; arrow(ctx, p.x + ux * 16, p.y + uy * 16, q.x - ux * 18, q.y - uy * 18, col.muted, 1.5, 7); ctx.restore(); });
    SP.forEach(([nm], i) => {
      const p = pos(i), g = gone.has(i), v = s[i], r = g ? 13 : 13 + 5 * v;
      dot(ctx, p.x, p.y, r, g ? col.line : v > 0.25 ? col.good : v < -0.25 ? col.bad : col.s[2], col.ink);
      if (g) { line(ctx, [[p.x - 7, p.y - 7], [p.x + 7, p.y + 7]], col.ink, 2); line(ctx, [[p.x + 7, p.y - 7], [p.x - 7, p.y + 7]], col.ink, 2); }
      text(ctx, nm, p.x, p.y + r + 11, { color: g ? col.muted : col.ink, size: 10.5, weight: 700, align: 'center', halo: col.panel });
    });
  };
  say();
}
