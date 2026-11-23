// Class 8 Matter: a mixture versus a compound. Iron filings and sulfur powder just mixed are a MIXTURE: each keeps its
// properties, and a magnet pulls the iron out. After strong heating they react to form iron sulfide, a COMPOUND, a
// new black solid that the magnet does not attract. (Classic school demonstration; heating is done by the teacher.)
import { canvas, text, title, dot, row, choice, button, loop, readout, rng, lerp } from '../../kit.js';

export default function (host) {
  let mode = 'mix', mag = false;
  const R = rng(6), gr = Array.from({ length: 56 }, (_, i) => ({ iron: i % 2 === 0, x: 0.12 + R() * 0.76, y: 0.82 + R() * 0.14, px: 0, py: 0, hx: 0.12 + R() * 0.76, hy: 0.82 + R() * 0.14 }));
  gr.forEach((g) => { g.px = g.x; g.py = g.y; });
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Iron and sulfur as a mixture where a magnet lifts the iron, and as a compound where it does not' });
  loop(host, (dt) => {
    gr.forEach((g) => { const attract = mag && mode === 'mix' && g.iron; const ty = attract ? 0.34 + (g.hx - 0.5) * 0.05 + (g.hy - 0.9) * 2 : g.hy, tx = attract ? 0.5 + (g.hx - 0.5) * 0.34 : g.hx; g.px += (tx - g.px) * Math.min(1, dt * 3); g.py += (ty - g.py) * Math.min(1, dt * 3); });
    cv.redraw();
  });
  const ctl = row(host);
  choice(ctl, 'Sample', [['mix', 'Just mixed'], ['heated', 'After heating']], mode, (v) => { mode = v; upd(); });
  button(ctl, 'Magnet down / up', () => { mag = !mag; upd(); });
  const out = readout(host);
  function upd() { out.innerHTML = mode === 'mix' ? (mag ? 'The magnet <b>lifts the iron</b> and leaves the yellow sulfur behind: the two substances are only mixed (a mixture).' : 'Grey iron filings and yellow sulfur lie side by side. Lower the magnet.') : (mag ? 'Nothing is lifted. The black solid is <b>iron sulfide</b>, a new substance (a compound). The iron has lost its magnetic property.' : 'After heating, the grey and yellow grains have gone: one black solid. Try the magnet.'); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, mode === 'mix' ? 'Iron + sulfur mixed' : 'Iron sulfide (heated)', col);
    const my = mag ? 62 : 44; ctx.fillStyle = col.s[3]; ctx.fillRect(w * 0.4, my, w * 0.2, 16); ctx.fillStyle = col.s[1]; ctx.fillRect(w * 0.4, my, w * 0.1, 16); text(ctx, 'magnet', w * 0.7, my + 8, { color: col.muted, size: 10.5 });
    ctx.fillStyle = col.soft; ctx.fillRect(10, h * 0.78, w - 20, h * 0.2 - 4);
    gr.forEach((g) => { const c = mode === 'mix' ? (g.iron ? col.muted : col.s[3]) : col.ink; ctx.fillStyle = c; ctx.globalAlpha = 1; ctx.fillRect(g.px * w - 3, 40 + g.py * (h - 60) * 1 - 3 + (g.py > 0.7 ? 0 : 0), 6, 6); });
    text(ctx, mode === 'mix' ? 'grey = iron, yellow = sulfur' : 'one black solid', 14, h - 8, { color: col.muted, size: 10.5 });
  };
  upd();
}
