// Class 10 Our Environment: a food web. Real food chains are linked into webs, because most animals eat more than one thing and are eaten by
// more than one thing. Remove one species to see the effect: its predators lose a food source (and may starve if it was their only one),
// and its prey may increase because fewer are eaten. A web with many links is more stable than a single chain.
import { canvas, text, title, line, dot, arrow, row, choice, readout } from '../../kit.js';

const N = { grass: [0.5, 0.88], hopper: [0.14, 0.64], rabbit: [0.5, 0.64], mouse: [0.86, 0.64], frog: [0.14, 0.4], fox: [0.5, 0.4], snake: [0.86, 0.4], hawk: [0.5, 0.14] };
const LBL = { grass: 'grass', hopper: 'grasshopper', rabbit: 'rabbit', mouse: 'mouse', frog: 'frog', fox: 'fox', snake: 'snake', hawk: 'hawk' };
const EATS = { hopper: ['grass'], rabbit: ['grass'], mouse: ['grass'], frog: ['hopper'], fox: ['rabbit', 'mouse'], snake: ['frog', 'mouse'], hawk: ['snake', 'rabbit', 'mouse'] };
export default function (host) {
  let gone = 'none';
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 300, label: 'A food web with eight species; remove one to see its effect' });
  const ctl = row(host);
  choice(ctl, 'Remove', [['none', 'none'], ...Object.keys(N).map((k) => [k, LBL[k]])], gone, (v) => { gone = v; say(); });
  const out = readout(host);
  const state = () => { const s = {}; const alive = (k) => k !== gone; Object.keys(N).forEach((k) => (s[k] = alive(k) ? 'ok' : 'gone')); if (gone === 'none') return s;
    // prey of the removed species may increase
    Object.entries(EATS).forEach(([p, prey]) => { if (p === gone) prey.forEach((q) => { if (s[q] === 'ok') s[q] = 'up'; }); });
    // predators lose a source or starve (iterate for chains)
    let changed = true; while (changed) { changed = false; Object.entries(EATS).forEach(([p, prey]) => { if (s[p] === 'gone' || s[p] === 'starve') return; const left = prey.filter((q) => s[q] !== 'gone' && s[q] !== 'starve'); if (left.length === 0) { s[p] = 'starve'; changed = true; } else if (left.length < prey.length && s[p] === 'ok') { s[p] = 'less'; changed = true; } }); }
    return s; };
  function say() { const s = state(), starve = Object.keys(s).filter((k) => s[k] === 'starve').map((k) => LBL[k]), less = Object.keys(s).filter((k) => s[k] === 'less').map((k) => LBL[k]), up = Object.keys(s).filter((k) => s[k] === 'up').map((k) => LBL[k]);
    out.textContent = gone === 'none' ? 'The full web: eight species and 11 feeding links (arrows point from food to eater). Remove one and see what changes.' : `Without the ${LBL[gone]}: ${starve.length ? starve.join(', ') + ' lose all their food and may die out. ' : ''}${less.length ? less.join(', ') + ' have fewer food choices. ' : ''}${up.length ? up.join(', ') + ' may increase, as fewer are eaten. ' : ''}${!starve.length && !less.length && !up.length ? 'No other species is directly affected.' : ''}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'A food web', col) + 6, X = (f) => f * w, Y = (f) => top + 20 + f * (h - top - 50), s = state();
    Object.entries(EATS).forEach(([p, prey]) => prey.forEach((q) => { const [x0, y0] = [X(N[q][0]), Y(N[q][1])], [x1, y1] = [X(N[p][0]), Y(N[p][1])], dead = s[p] === 'gone' || s[q] === 'gone'; ctx.save(); ctx.globalAlpha = dead ? 0.15 : 0.9; const a = Math.atan2(y1 - y0, x1 - x0); arrow(ctx, x0 + Math.cos(a) * 24, y0 + Math.sin(a) * 18, x1 - Math.cos(a) * 28, y1 - Math.sin(a) * 20, col.muted, 1.6, 6); ctx.restore(); }));
    Object.keys(N).forEach((k) => { const x = X(N[k][0]), y = Y(N[k][1]), st = s[k], c = st === 'starve' ? (col.bad || col.ink) : st === 'less' ? col.s[3] : st === 'up' ? (col.good || col.s[2]) : k === 'grass' ? col.s[2] : col.s[0]; ctx.save(); ctx.globalAlpha = st === 'gone' ? 0.2 : 1; ctx.beginPath(); ctx.ellipse(x, y, 30, 15, 0, 0, 7); ctx.fillStyle = c; ctx.globalAlpha *= 0.3; ctx.fill(); ctx.globalAlpha = st === 'gone' ? 0.2 : 1; ctx.strokeStyle = col.ink; ctx.lineWidth = st === 'ok' ? 1.4 : 2.4; ctx.stroke(); text(ctx, LBL[k], x, y, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); if (st === 'gone') { line(ctx, [[x - 30, y - 15], [x + 30, y + 15]], col.bad || col.ink, 2.5); } if (st === 'up') text(ctx, '▲', x + 34, y - 12, { color: col.ink, size: 11 }); if (st === 'starve') text(ctx, '✕ no food', x, y + 24, { color: col.ink, size: 9.5, align: 'center' }); if (st === 'less') text(ctx, 'less food', x, y + 24, { color: col.ink, size: 9.5, align: 'center' }); ctx.restore(); });
    text(ctx, 'green = may increase · amber = fewer food choices · red = no food', w / 2, h - 10, { color: col.muted, size: 9.5, align: 'center' });
  };
  say();
}
